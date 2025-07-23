import { create } from "zustand";
import { axiosInstance } from "../libs/axios";

const useSubscriptionStore = create((set) => ({
  subscription: null,
  isLoading: false,
 
  createPaymentOrder: async (userId, planType, billingCycle) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.post('/payment/create-order', {
        userId,
        planType,
        billingCycle
      });

      if (response.data.order) {
        return response.data.order;
      } else {
        throw new Error(response.data.message || 'Payment order creation failed');
      }
    } catch (error) {
      console.error('Error creating payment order:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  createSubscription: async (userId, planId, paymentId, orderId) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.post('/subscription/create', {
        userId,
        planId,
        paymentId,
        orderId
      });

      if (response.data.subscription) {
        set({ subscription: response.data.subscription });
        return response.data.subscription;
      } else {
        throw new Error(response.data.message || 'Subscription creation failed');
      }
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  getSubscriptionStatus: async (userId) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get(`/subscription/status/${userId}`);
      if (response.data.subscription) {
        set({ subscription: response.data.subscription });
        return response.data.subscription;
      } else {
        throw new Error(response.data.message || 'Subscription not found');
      }
    } catch (error) {
      console.error('Error fetching subscription status:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  cancelSubscription: async (userId) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.post(`/subscription/cancel`, { userId });
      if (response.data.success) {
        set({ subscription: null });
        return true;
      } else {
        throw new Error(response.data.message || 'Subscription cancellation failed');
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },  

  updateSubscription: async (userId, planId, paymentId) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.post('/subscription/update', {
        userId,
        planId,
        paymentId
      });

      if (response.data.subscription) {
        set({ subscription: response.data.subscription });
        return response.data.subscription;
      } else {
        throw new Error(response.data.message || 'Subscription update failed');
      }
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

   
}));

export default useSubscriptionStore;
