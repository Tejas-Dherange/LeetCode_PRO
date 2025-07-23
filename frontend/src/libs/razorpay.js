export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const initiateRazorpayPayment = async (orderData, userDetails, callbacks) => {
  const scriptLoaded = await loadRazorpayScript();
  
  if (!scriptLoaded) {
    throw new Error('Razorpay SDK failed to load');
  }

  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: orderData.amount * 100, // Convert to paise
    currency: orderData.currency,
    name: 'CodeLoom Pro',
    description: orderData.description,
    order_id: orderData.id,
    handler: callbacks.onSuccess,
    prefill: {
      name: userDetails.name,
      email: userDetails.email,
      contact: userDetails.phone || ''
    },
    theme: {
      color: '#3B82F6'
    },
    modal: {
      ondismiss: callbacks.onDismiss
    }
  };

  const rzp = new window.Razorpay(options);
  rzp.on('payment.failed', callbacks.onError);
  rzp.open();
};