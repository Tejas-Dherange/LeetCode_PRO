import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Pricing plans mapping - Updated to match your schema
export const RAZORPAY_PLANS = {
  BASIC: {
    monthly: {
      amount: 999, // ₹9.99 in paise
      currency: 'INR',
      interval: 1,
      period: 'monthly'
    }
  },
  PREMIUM: { // Changed from PRO to PREMIUM to match your schema
    monthly: {
      amount: 1999, // ₹19.99 in paise
      currency: 'INR',
      interval: 1,
      period: 'monthly'
    }
  }
};

export const createRazorpayOrder = async (amount, currency = 'INR', userId, planType) => {
  try {
    console.log('Creating Razorpay order with params:', { amount, currency, userId, planType });
    
    // Create a shorter receipt ID (max 40 characters)
    const timestamp = Date.now().toString();
    const shortUserId = userId.substring(0, 8); // Take first 8 characters of UUID
    const receipt = `rcpt_${shortUserId}_${timestamp}`.substring(0, 40);
    
    const options = {
      amount: amount * 100, // Convert to paise
      currency,
      receipt,
      notes: {
        userId,
        planType,
        timestamp: new Date().toISOString()
      }
    };

    console.log('Razorpay order options:', options);
    console.log('Receipt length:', receipt.length); // Debug receipt length
    
    const order = await razorpay.orders.create(options);
    console.log('Razorpay order created successfully:', order);
    
    return order;
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    throw new Error(`Razorpay order creation failed: ${error.error?.description || error.message}`);
  }
};

export const verifyRazorpaySignature = (orderId, paymentId, signature) => {
  try {
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(orderId + '|' + paymentId)
      .digest('hex');

    return generated_signature === signature;
  } catch (error) {
    return false;
  }
};

export const createRazorpaySubscription = async (planId, customerId, totalCount = 12) => {
  try {
    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_id: customerId,
      total_count: totalCount,
      quantity: 1,
      notes: {
        timestamp: new Date().toISOString()
      }
    });

    return subscription;
  } catch (error) {
    throw new Error(`Razorpay subscription creation failed: ${error.message}`);
  }
};

export const createRazorpayCustomer = async (email, name, contact) => {
  try {
    const customer = await razorpay.customers.create({
      name,
      email,
      contact,
      notes: {
        timestamp: new Date().toISOString()
      }
    });

    return customer;
  } catch (error) {
    throw new Error(`Razorpay customer creation failed: ${error.message}`);
  }
};

export default razorpay;