import { db } from '../libs/db.js';
import { 
  createRazorpayOrder, 
  verifyRazorpaySignature,
  createRazorpayCustomer,
  RAZORPAY_PLANS 
} from '../libs/razorpay.lib.js';
import crypto from 'crypto';

// Create payment order for one-time payment
export const createPaymentOrder = async (req, res) => {
  try {
    const { planType, billingCycle = 'monthly' } = req.body;
    const userId = req.user.id;

    console.log('Creating payment order for user:', userId);
    console.log('Request body:', { planType, billingCycle });

    // Validate plan
    if (!RAZORPAY_PLANS[planType] || !RAZORPAY_PLANS[planType][billingCycle]) {
      console.log('Available plans:', Object.keys(RAZORPAY_PLANS));
      console.log('Requested plan:', planType);
      return res.status(400).json({
        success: false,
        message: `Invalid plan or billing cycle. Available plans: ${Object.keys(RAZORPAY_PLANS).join(', ')}`
      });
    }

    const planDetails = RAZORPAY_PLANS[planType][billingCycle];
    console.log("Plan details:", planDetails);
    
    // Create Razorpay order
    const order = await createRazorpayOrder(
      planDetails.amount,
      planDetails.currency,
      userId,
      planType
    );

    console.log('Razorpay order created:', order);

    // Check if subscription already exists before creating payment
    const existingSubscription = await db.subscription.findUnique({
      where: { userId }
    });

    let subscriptionId = '';
    if (existingSubscription) {
      subscriptionId = existingSubscription.id;
    }

    // Save order details to database
    const pendingPayment = await db.payment.create({
      data: {
        userId, // This can be empty for new subscriptions
        paymentProvider: 'RAZORPAY',
        providerPaymentId: order.id,
        amount: planDetails.amount / 100,
        currency: planDetails.currency,
        status: 'pending',
        description: `${planType} ${billingCycle} subscription`
      }
    });

    console.log('Payment record created:', pendingPayment.id);

    res.json({
      success: true,
      order,
      paymentId: pendingPayment.id,
      planDetails: {
        type: planType,
        billing: billingCycle,
        amount: planDetails.amount / 100
      }
    });

  } catch (error) {
    console.error('Create payment order error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};
// ...existing code...
// Verify payment and create subscription
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentId,
      planType,
      billingCycle = 'monthly'
    } = req.body;

    const userId = req.user.id;

    // Verify signature
    const isValidSignature = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValidSignature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }

    // Update payment status
    const payment = await db.payment.update({
      where: { id: paymentId },
      data: {
        providerPaymentId: razorpay_payment_id,
        status: 'succeeded'
      }
    });

    // Create or update subscription
    const subscriptionData = {
      plan: planType,
      status: 'ACTIVE',
      paymentProvider: 'RAZORPAY',
      amount: payment.amount,
      currency: payment.currency,
      billingCycle,
      startDate: new Date(),
      endDate: new Date(Date.now() + (billingCycle === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000),
      canAccessCompanySheets: ['BASIC', 'PREMIUM'].includes(planType),
      canAccessAIAnalysis: ['BASIC', 'PREMIUM'].includes(planType),
      maxProblemsPerMonth: planType === 'FREE' ? 50 : -1,
      maxAIAnalysisPerMonth: planType === 'PREMIUM' ? -1 : (planType === 'BASIC' ? 10 : 0)
    };

    // Check if user already has subscription
    const existingSubscription = await db.subscription.findUnique({
      where: { userId }
    });

    let subscription;
    if (existingSubscription) {
      subscription = await db.subscription.update({
        where: { userId },
        data: subscriptionData
      });
    } else {
      subscription = await db.subscription.create({
        data: {
          userId,
          ...subscriptionData
        }
      });
    }

    // Update payment with subscription ID
    await db.payment.update({
      where: { id: paymentId },
      data: { subscriptionId: subscription.id }
    });

    // Create or update usage tracker
    const existingTracker = await db.usageTracker.findUnique({
      where: { userId }
    });

    if (!existingTracker) {
      await db.usageTracker.create({
        data: {
          userId,
          subscriptionId: subscription.id,
          currentMonth: new Date().getMonth() + 1,
          currentYear: new Date().getFullYear()
        }
      });
    } else {
      await db.usageTracker.update({
        where: { userId },
        data: { subscriptionId: subscription.id }
      });
    }

    res.json({
      success: true,
      message: 'Payment verified and subscription activated',
      subscription
    });

  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment'
    });
  }
};

// Handle Razorpay webhooks
export const handleRazorpayWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'];
    
    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (signature !== expectedSignature) {
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }

    const { event, payload } = req.body;

    switch (event) {
      case 'payment.captured':
        await handlePaymentCaptured(payload.payment.entity);
        break;
      case 'payment.failed':
        await handlePaymentFailed(payload.payment.entity);
        break;
      case 'subscription.cancelled':
        await handleSubscriptionCancelled(payload.subscription.entity);
        break;
      default:
        console.log(`Unhandled webhook event: ${event}`);
    }

    res.json({ success: true });

  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ success: false });
  }
};

// Get payment history
export const getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const payments = await db.payment.findMany({
      where: { userId },
      include: {
        subscription: {
          select: {
            plan: true,
            billingCycle: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: parseInt(limit)
    });

    const total = await db.payment.count({
      where: { userId }
    });

    res.json({
      success: true,
      payments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment history'
    });
  }
};

// Helper functions for webhook events
const handlePaymentCaptured = async (payment) => {
  try {
    await db.payment.updateMany({
      where: { providerPaymentId: payment.id },
      data: { status: 'succeeded' }
    });
  } catch (error) {
    console.error('Handle payment captured error:', error);
  }
};

const handlePaymentFailed = async (payment) => {
  try {
    await db.payment.updateMany({
      where: { providerPaymentId: payment.id },
      data: { status: 'failed' }
    });
  } catch (error) {
    console.error('Handle payment failed error:', error);
  }
};

const handleSubscriptionCancelled = async (subscription) => {
  try {
    await db.subscription.updateMany({
      where: { providerSubscriptionId: subscription.id },
      data: { 
        status: 'CANCELLED',
        endDate: new Date()
      }
    });
  } catch (error) {
    console.error('Handle subscription cancelled error:', error);
  }
};