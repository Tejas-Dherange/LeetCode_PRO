import db from "../libs/db.js";

export const createSubscription = async (req, res) => {
  const { userId, planId, paymentId } = req.body;

  try {
    // Check if the user already has a subscription
    const existingSubscription = await db.subscription.findUnique({
      where: { userId },
    });

    // Prepare subscription data
    const subscriptionData = {
      planId,
      status: "active",
      startDate: new Date(),
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // 1 year from now
    };

    // Create or update subscription
    let subscription;
    if (existingSubscription) {
      subscription = await db.subscription.update({
        where: { userId },
        data: subscriptionData,
      });
    } else {
      subscription = await db.subscription.create({
        data: {
          userId,
          ...subscriptionData,
        },
      });
    }

    res.status(201).json({ subscription });
  } catch (error) {
    console.error("Error creating subscription:", error);
    res.status(500).json({ error: "Failed to create subscription" });
  }
};

export const updateSubscription = async (req, res) => {
  // Handle subscription updates
};

export const cancelSubscription = async (req, res) => {
  // Cancel subscription
};

export const getSubscriptionStatus = async (req, res) => {
  const { userId } = req.params;

  try {
    const subscription = await db.subscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      return res.status(404).json({ message: "Subscribe to get access to all features" });
    }

    res.json({ subscription });
  } catch (error) {
    console.error("Error fetching subscription status:", error);
    res.status(500).json({ error: "Failed to fetch subscription status" });
  }
};
