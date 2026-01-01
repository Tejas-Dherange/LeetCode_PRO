import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import usePaymentStore from "../store/usePaymentStore";
import useAuthStore from "../store/useAuthStore";
import useSubscriptionStore from "../store/useSubscriptionStore";
import { Loader2, Check, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Pricing = () => {
  const { authUser } = useAuthStore();
  const { getSubscriptionStatus, subscription } = useSubscriptionStore();

  useEffect(() => {
    getSubscriptionStatus(authUser.id);
  }, [getSubscriptionStatus, authUser.id]);

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "₹0",
      period: "forever",
      features: [
        "Access to 250 basic problems",
        "Daily coding challenge",
        "Basic discussion board",
        "Email support",
      ],
      cta: "Get Started",
      highlighted: false,
    },
    {
      id: "BASIC",
      name: "Pro",
      price: "₹199",
      period: "per month",
      features: [
        "Access to 1000+ problems",
        "Unlock all contest problems",
        "Detailed editorial access",
        "Premium Discord support",
        "Company-wise problem filters",
        "Advanced analytics dashboard",
      ],
      cta: "Go Pro",
      highlighted: true,
    },
    {
      id: "PREMIUM",
      name: "Elite",
      price: "₹399",
      period: "per month",
      features: [
        "Everything in Pro",
        "1:1 mentor session monthly",
        "Mock interview access",
        "Resume and profile reviews",
        "Career guidance sessions",
        "Priority support",
      ],
      cta: "Go Elite",
      highlighted: false,
    },
  ];

  return (
    <div className="min-h-screen w-[99vw] mt-[-150px] pt-15 flex flex-col items-center justify-center relative overflow-x-hidden bg-base-100">
      {/* Background effects matching HomePage */}
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div
          className="absolute top-20 left-16 w-96 h-96 bg-emerald-600/10 blur-[120px] rounded-full animate-pulse"
          style={{ animationDuration: "8s" }}
        />
        <div
          className="absolute bottom-32 right-20 w-80 h-80 bg-lime-500/10 blur-[100px] rounded-full animate-pulse"
          style={{ animationDuration: "10s", animationDelay: "2s" }}
        />
      </div>

      {/* Floating particles matching HomePage */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div
          className="absolute top-16 left-12 w-2 h-2 bg-emerald-400/60 rounded-full animate-pulse"
          style={{ animationDuration: "3s" }}
        />
        <div
          className="absolute top-32 right-20 w-1.5 h-1.5 bg-lime-400/50 rounded-full animate-pulse"
          style={{ animationDuration: "4s", animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-24 left-28 w-2 h-2 bg-emerald-300/40 rounded-full animate-pulse"
          style={{ animationDuration: "5s", animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 right-12 w-1 h-1 bg-lime-300/50 rounded-full animate-pulse"
          style={{ animationDuration: "3.5s", animationDelay: "0.5s" }}
        />
      </div>

      <div className="relative z-10 w-full px-6 md:px-10 lg:px-16 xl:px-20 py-16 md:py-20">
        {/* Header Section */}
        <header className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-5 md:mb-6 tracking-tight leading-tight font-extrabold text-base-content">
            Choose Your{" "}
            <span className="text-emerald-400 inline-block transition-all duration-300 hover:text-emerald-300 hover:scale-105">
              Plan
            </span>
          </h1>
          <p className="text-base md:text-lg text-base-content/80 font-medium leading-relaxed max-w-3xl mx-auto">
            Start free, upgrade anytime. All plans include core features to help you succeed.
          </p>
        </header>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto w-full mb-12 md:mb-16">
          {plans.map((plan, index) => (
            <div
              key={plan.id}
              className={`bg-base-200/60 backdrop-blur-sm w-full p-7 md:p-8 rounded-xl shadow-lg text-left border transition-all duration-300 hover:-translate-y-1 group relative ${
                plan.highlighted
                  ? "border-emerald-500/60 hover:border-emerald-400/80 hover:shadow-emerald-500/10 scale-105"
                  : "border-base-300 hover:border-emerald-500/60 hover:shadow-emerald-500/10"
              }`}
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              {/* Popular Badge */}
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-emerald-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                    <Zap className="w-3 h-3" />
                    MOST POPULAR
                  </div>
                </div>
              )}

              {/* Plan Name */}
              <h3 className="text-xl md:text-2xl font-semibold text-emerald-400 group-hover:text-emerald-300 transition-colors duration-300 mb-2">
                {plan.name}
              </h3>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl md:text-5xl font-extrabold text-base-content">
                    {plan.price}
                  </span>
                  <span className="text-base-content/60 text-sm md:text-base">
                    /{plan.period}
                  </span>
                </div>
              </div>

              {/* Features List */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-base-content/80 text-sm md:text-base leading-relaxed"
                  >
                    <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <div className="mt-auto ">
                {plan.id === "free" ? (
                  <Link to="/dashboard">
                    <button className="bg-emerald-600 hover:bg-emerald-500 cursor-pointer text-white w-full font-semibold px-6 py-3 rounded-lg text-sm md:text-base shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400">
                      {plan.cta}
                    </button>
                  </Link>
                ) : (
                  <PaymentButton plan={plan} />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Info Section */}
        <div className="text-center w-full max-w-3xl mx-auto bg-base-200/70 backdrop-blur-sm rounded-xl shadow-xl p-7 md:p-8 border border-emerald-500/40 hover:border-emerald-400/70 transition-all duration-300 hover:-translate-y-1">
          <h4 className="text-xl md:text-2xl font-bold text-emerald-400 mb-3">
            Questions about pricing?
          </h4>
          <p className="text-base-content/80 text-sm md:text-base leading-relaxed mb-4">
            All plans include a 7-day free trial. Upgrade or downgrade anytime. Cancel with no questions asked.
          </p>
          <p className="text-base-content/60 text-sm">
            Need help choosing?{" "}
            <a
              href="mailto:support@codeloom.com"
              className="text-emerald-400 hover:text-emerald-300 underline transition-colors"
            >
              Contact us
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;

const PaymentButton = ({ plan }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { processPayment } = usePaymentStore();
  const { authUser } = useAuthStore();
  const { subscription } = useSubscriptionStore();

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

  const isActive = subscription?.status === "ACTIVE";

  return (
    <button
      onClick={handlePayment}
      disabled={isProcessing || isActive}
      className={`w-full font-semibold px-6 py-3  rounded-lg text-sm md:text-base shadow-md transition-all duration-200 ${
        isProcessing || isActive
          ? "bg-slate-700 text-slate-500 cursor-not-allowed"
          : "bg-emerald-600 hover:bg-emerald-500 text-white  hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-emerald-400"
      }`}
    >
      {isProcessing ? (
        <span className="flex items-center justify-center gap-2">
          <Loader2 className="animate-spin w-5 h-5" />
          Processing...
        </span>
      ) : isActive ? (
        "Active Subscription"
      ) : (
        plan.cta
      )}
    </button>
  );
};
