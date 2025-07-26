import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import usePaymentStore from "../store/usePaymentStore";

import useAuthStore from "../store/useAuthStore";
import useSubscriptionStore from "../store/useSubscriptionStore";
import { Loader2 } from "lucide-react";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "₹0",
    period: "per month",
    features: [
      "Access to 250 basic problems",
      "Daily coding challenge",
      "Basic discussion board",
      "Email support",
    ],
    buttonLabel: "Subscribe Now",
    color: "primary",
    gradient: "from-blue-400 to-blue-600",
  },
  {
    id: "BASIC",
    name: "Basic",
    price: "₹199",
    period: "per month",
    features: [
      "Access to 1000+ problems",
      "Unlock all contest problems",
      "Detailed editorial access",
      "Premium Discord support",
      "Company-wise problem filters",
      "Advanced analytics",
    ],
    buttonLabel: "Go Pro",
    color: "secondary",
    popular: true,
    gradient: "from-purple-400 to-purple-600",
  },
  {
    id: "PREMIUM",
    name: "Premium",
    price: "₹399",
    period: "per month",
    features: [
      "All Pro features",
      "1:1 mentor session monthly",
      "Mock interview access",
      "Resume and profile reviews",
      "Career guidance sessions",
      "Priority support",
    ],
    buttonLabel: "Become Elite",
    color: "success",
    gradient: "from-orange-400 to-orange-600",
  },
];

const Pricing = () => {
  const { authUser } = useAuthStore();
  const { getSubscriptionStatus, subscription } = useSubscriptionStore();
  useEffect(() => {
    getSubscriptionStatus(authUser.id);
  }, [getSubscriptionStatus, authUser.id]);
  console.log("Subscription status fetched successfully:", subscription);

  return (
    <div className="min-h-screen w-[100vw]  ">
      {/* Header Section */}
      <div className="text-center mb-16 px-6">
        <h1 className="text-6xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6">
          Codeloom Subscriptions
        </h1>
        <p className="text-2xl text-base-content/80 max-w-3xl mx-auto leading-relaxed">
          Level up your coding journey with the right plan. Choose the perfect
          subscription to unlock your potential.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid gap-8 lg:grid-cols-3 max-w-7xl mx-auto px-6">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className={`card bg-base-100 border-2 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300 ${
              plan.popular
                ? "ring-2 border-none ring-secondary ring-opacity-50 scale-105 lg:scale-110"
                : "border-base-300 hover:border-success/50"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="badge badge-secondary badge-lg text-white font-bold px-6 py-3 text-sm">
                  ⭐ MOST POPULAR
                </div>
              </div>
            )}

            <div className="card-body p-8 items-center text-center">
              {/* Plan Header */}
              <div
                className={`w-20 h-20 rounded-full bg-gradient-to-r ${plan.gradient} flex items-center justify-center mb-6`}
              >
                <span className="text-2xl font-bold text-white">
                  {plan.name[0]}
                </span>
              </div>

              <h2 className="card-title text-3xl font-bold mb-2">
                {plan.name}
              </h2>

              {/* Pricing */}
              <div className="mb-6">
                <p className="text-5xl font-extrabold text-success">
                  {plan.price}
                </p>
                <p className="text-lg text-base-content/60 mt-1">
                  {plan.period}
                </p>
              </div>

              {/* Features */}
              <ul className="w-full text-left space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-success text-xl flex-shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span className="text-base leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <div className="card-actions w-full">
                {plan.name === "Free" ? (
                  <a
                    href="/dashboard"
                    className={`btn rounded-2xl btn-${plan.color} btn-lg w-full text-lg font-semibold hover:scale-105 transition-transform duration-200`}
                    >

                    {plan.buttonLabel}
                  </a>
                ) :(
                    
                 

                <PaymentButton
                  plan={plan}
                  className={`btn rounded-2xl btn-${
                    plan.color
                  } btn-lg w-full text-lg font-semibold hover:scale-105 transition-transform duration-200 ${
                    plan.popular ? "btn-secondary" : ""
                  }`}
                />
                ) }
              </div>

              {plan.popular && (
                <p className="text-sm text-base-content/60 mt-3">
                  Most chosen by Coders
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="text-center mt-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold mb-6">Why Choose Codeloom?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-3">🚀</div>
              <h4 className="font-semibold mb-2">Fast Learning</h4>
              <p className="text-base-content/70">
                Accelerate your coding skills with our structured approach
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">💼</div>
              <h4 className="font-semibold mb-2">Career Ready</h4>
              <p className="text-base-content/70">
                Get interview-ready with real company problems
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🏆</div>
              <h4 className="font-semibold mb-2">Proven Results</h4>
              <p className="text-base-content/70">
                Join thousands of successful developers
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;

const PaymentButton = ({ plan, className = "" }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { processPayment } = usePaymentStore();
  const { authUser } = useAuthStore();

  const { getSubscriptionStatus, subscription } = useSubscriptionStore();
  const handlePayment = async () => {
    if (!authUser) {
      toast.error("Please login to continue");
      return;
    }

    setIsProcessing(true);
    try {
      const userDetails = {
        name: authUser.name,
        email: authUser.email,
        phone: authUser.phone || "",
      };

      await processPayment(plan.id?.toUpperCase(), "monthly", userDetails);

      toast.success("Payment successful! Your subscription is now active.");
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error.message || "Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={isProcessing || subscription?.status === "ACTIVE"}
      className={`w-full py-2 px-4 rounded-3xl font-medium transition-colors ${
        isProcessing
          ? "bg-gray-400 cursor-not-allowed"
          : "  text-white"
      } ${className}`}
    >
      {isProcessing ? <Loader2 className="animate-spin" /> :  `Subscribe to ${plan.name}`}
    </button>
  );
};
