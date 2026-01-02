// Pricing constants for the application
export const PRICING = {
  FREE: {
    id: "free",
    name: "Free",
    price: 0,
    displayPrice: "₹0",
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
  BASIC: {
    id: "BASIC",
    name: "Pro",
    price: 199,
    displayPrice: "₹199",
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
  PREMIUM: {
    id: "PREMIUM",
    name: "Elite",
    price: 399,
    displayPrice: "₹399",
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
};

// Get all plans as an array
export const getAllPlans = () => {
  return Object.values(PRICING);
};

// Get plan display for dropdowns
export const getPlanDisplay = (planType) => {
  const plan = PRICING[planType];
  if (!plan) return `${planType} Plan`;
  return `${plan.name} Plan - ${plan.displayPrice}/${plan.period.split(" ")[1]}`;
};
