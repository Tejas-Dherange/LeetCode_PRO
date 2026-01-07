import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);
const EMAIL_FROM = process.env.EMAIL_FROM || 'CODELOOM <noreply@codeloom.software>';

export const sendPaymentSuccessEmail = async (email, planDetails) => {
  try {
    const { type, amount, currency, billingCycle, startDate, endDate } = planDetails;
    
    // Format dates
    const formattedStartDate = new Date(startDate).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
    
    const formattedEndDate = new Date(endDate).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });

    const currencySymbol = currency === 'INR' ? '₹' : '$';

    await resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      subject: `Welcome to CodeLoom ${type} - Payment Successful`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
           <div style="text-align: center; margin-bottom: 30px;">
               <h1 style="color: #10b981; margin: 0;">CodeLoom</h1>
               <p style="color: #6b7280; margin-top: 5px;">Level up your coding journey</p>
           </div>
           
           <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; padding: 15px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
               <h2 style="margin: 0; font-size: 18px;">Payment Successful!</h2>
               <p style="margin: 5px 0 0;">Your ${type} subscription is now active.</p>
           </div>

           <p>Hi there,</p>
           <p>Thank you for subscribing to CodeLoom <strong>${type}</strong>! Your payment has been successfully processed, and your premium features are now unlocked.</p>

           <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
               <h3 style="margin-top: 0; color: #374151;">Subscription Details</h3>
               <table style="width: 100%; border-collapse: collapse;">
                   <tr>
                       <td style="padding: 8px 0; color: #6b7280;">Plan</td>
                       <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #111827;">${type} (${billingCycle})</td>
                   </tr>
                   <tr>
                       <td style="padding: 8px 0; color: #6b7280;">Amount Paid</td>
                       <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #111827;">${currencySymbol}${amount}</td>
                   </tr>
                   <tr>
                       <td style="padding: 8px 0; color: #6b7280;">Start Date</td>
                       <td style="padding: 8px 0; text-align: right; color: #111827;">${formattedStartDate}</td>
                   </tr>
                   <tr>
                       <td style="padding: 8px 0; color: #6b7280;">Renewal Date</td>
                       <td style="padding: 8px 0; text-align: right; color: #111827;">${formattedEndDate}</td>
                   </tr>
               </table>
           </div>

           <p style="margin-bottom: 30px;">You can now access exclusive problems, editorials, and premium support. Visit your dashboard to get started!</p>

           <div style="text-align: center;">
               <a href="${process.env.FRONTEND_URL || '#'}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Go to Dashboard</a>
           </div>

           <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
           
           <p style="font-size: 12px; color: #9ca3af; text-align: center;">
               If you have any questions, please contact our support team.<br />
               &copy; ${new Date().getFullYear()} CodeLoom. All rights reserved.
           </p>
        </div>
      `
    });
    console.log(`Payment success email sent to ${email}`);
  } catch (error) {
    console.error('Error sending payment success email:', error);
  }
};

export const sendPaymentFailedEmail = async (email, paymentDetails) => {
  try {
    const { amount, currency, date, reason } = paymentDetails;
    const currencySymbol = currency === 'INR' ? '₹' : '$';
    const formattedDate = new Date(date).toLocaleDateString();

    await resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      subject: `Action Required: Payment Failed - CodeLoom`,
      html: `
         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
           <div style="text-align: center; margin-bottom: 30px;">
               <h1 style="color: #ef4444; margin: 0;">CodeLoom</h1>
               <p style="color: #6b7280; margin-top: 5px;">Payment Alert</p>
           </div>
           
           <div style="background-color: #fef2f2; border: 1px solid #fecaca; color: #991b1b; padding: 15px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
               <h2 style="margin: 0; font-size: 18px;">Payment Failed</h2>
               <p style="margin: 5px 0 0;">We couldn't process your payment.</p>
           </div>

           <p>Hi there,</p>
           <p>We attempted to process a payment of <strong>${currencySymbol}${amount}</strong> on <strong>${formattedDate}</strong>, but unfortunately, it failed.</p>
           
           ${reason ? `<p style="color: #dc2626; background: #fff1f2; padding: 10px; border-radius: 4px;">Reason: ${reason}</p>` : ''}

           <p>Don't worry, no charges were made. You can try again using a different payment method or check your card details.</p>

           <div style="text-align: center; margin-top: 30px;">
               <a href="${process.env.FRONTEND_URL || '#'}/pricing" style="background-color: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Retry Payment</a>
           </div>

           <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
           
           <p style="font-size: 12px; color: #9ca3af; text-align: center;">
               If you believe this is an error, please contact your bank or our support.<br />
               &copy; ${new Date().getFullYear()} CodeLoom. All rights reserved.
           </p>
        </div>
      `
    });
    console.log(`Payment failed email sent to ${email}`);
  } catch (error) {
    console.error('Error sending payment failed email:', error);
  }
};
