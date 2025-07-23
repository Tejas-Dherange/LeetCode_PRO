import express from 'express';
import {
  createPaymentOrder,
  verifyPayment,
  handleRazorpayWebhook,
  getPaymentHistory
} from '../controllers/payment.controllers.js';
import { isLoggedIn } from '../middleware/isLoggedIn.js';

const router = express.Router();

// Create payment order
router.post('/create-order', isLoggedIn, createPaymentOrder);

// Verify payment
router.post('/verify', isLoggedIn, verifyPayment);

// Webhook endpoint (no auth needed)
router.post('/webhook/razorpay', handleRazorpayWebhook);

// Get payment history
router.get('/history', isLoggedIn, getPaymentHistory);

export default router;