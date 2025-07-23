export const checkSubscriptionAccess = (requiredPlan) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;
      
      const subscription = await db.subscription.findUnique({
        where: { userId },
        include: { usageTracker: true }
      });
      
      if (!subscription || subscription.status !== 'ACTIVE') {
        return res.status(403).json({
          success: false,
          message: "Premium subscription required"
        });
      }
      
      // Check plan level
      const planHierarchy = {
        'FREE': 0,
        'BASIC': 1,
        'PREMIUM': 2
      };
      
      if (planHierarchy[subscription.plan] < planHierarchy[requiredPlan]) {
        return res.status(403).json({
          success: false,
          message: `${requiredPlan} plan required`
        });
      }
      
      req.subscription = subscription;
      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error checking subscription"
      });
    }
  };
};


export const checkUsageLimit = (featureType) => {
  return async (req, res, next) => {
    try {
      const { usageTracker } = req.subscription;
      
      let hasReachedLimit = false;
      
      switch (featureType) {
        case 'AI_ANALYSIS':
          hasReachedLimit = usageTracker.aiAnalysisUsedThisMonth >= req.subscription.maxAIAnalysisPerMonth;
          break;
        case 'COMPANY_SHEETS':
          hasReachedLimit = !req.subscription.canAccessCompanySheets;
          break;
        default:
          break;
      }
      
      if (hasReachedLimit) {
        return res.status(429).json({
          success: false,
          message: "Usage limit reached for this month"
        });
      }
      
      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error checking usage limits"
      });
    }
  };
};

