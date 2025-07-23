import { create } from 'zustand';
import { initiateRazorpayPayment } from '../libs/razorpay';
import { axiosInstance } from '../libs/axios';

const usePaymentStore = create((set, get) => ({
  isLoading: false,
  paymentHistory: [],
  currentOrder: null,

  createPaymentOrder: async (planType, billingCycle = 'monthly') => {
    console.log('Creating payment order:', { planType, billingCycle });
    
    set({ isLoading: true });
    try {
      const response = await axiosInstance.post('/payment/create-order', {
        planType,
        billingCycle
      });

      console.log('Payment order response:', response.data);
            
      if (response.data.success) {
        set({ currentOrder: response.data.order });
        return response.data;
      }
      throw new Error(response.data.message);
    } catch (error) {
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  processPayment: async (planType, billingCycle, userDetails) => {
    try {
      // Create order
      const orderData = await get().createPaymentOrder(planType, billingCycle);

      return new Promise((resolve, reject) => {
        initiateRazorpayPayment(
          orderData.order,
          userDetails,
          {
            onSuccess: async (response) => {
              try {
                console.log('Payment successful:', response);
                const verifyResponse = await axiosInstance.post('/payment/verify', {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  paymentId: orderData.paymentId,
                  planType,
                  billingCycle
                });

                if (verifyResponse.data.success) {
                  resolve(verifyResponse.data);
                } else {
                  reject(new Error(verifyResponse.data.message));
                }
              } catch (error) {
                reject(error);
              }
            },
            onError: (error) => {
              reject(new Error(`Payment failed: ${error.description}`));
            },
            onDismiss: () => {
              reject(new Error('Payment cancelled by user'));
            }
          }
        );
      });
    } catch (error) {
      throw error;
    }
  },

  fetchPaymentHistory: async (page = 1, limit = 10) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get(`/payment/history?page=${page}&limit=${limit}`);
      
      if (response.data.success) {
        set({ paymentHistory: response.data.payments });
        return response.data;
      }
      throw new Error(response.data.message);
    } catch (error) {
      throw error;
    } finally {
      set({ isLoading: false });
    }
  }
}));

export default usePaymentStore;