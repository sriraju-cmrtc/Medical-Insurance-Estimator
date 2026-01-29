import { EstimateResult, InsurancePlan } from '@/types/insurance';

/**
 * ML-based Personalized Recommendation Engine
 * Uses clustering and pattern analysis to recommend best insurance plans
 */

export interface PlanRecommendation {
  plan: InsurancePlan;
  recommendationScore: number; // 0-100
  reasoning: string[];
  savingsPotential: number;
}

export class RecommendationEngine {
  /**
   * Generate personalized plan recommendations based on user profile and history
   */
  static recommendPlans(
    estimateResult: EstimateResult,
    history: EstimateResult[] = []
  ): PlanRecommendation[] {
    const { inputs, eventCost, plans } = estimateResult;
    const recommendations: PlanRecommendation[] = [];

    // Calculate user profile characteristics
    const userProfile = {
      avgCost: history.length > 0 
        ? history.reduce((sum, e) => sum + e.eventCost, 0) / history.length 
        : eventCost,
      highRiskConditions: inputs.medicalConditions.length > 2,
      isSmoker: inputs.smoker,
      isOldAge: inputs.age > 60,
      hasAccidentHistory: inputs.accidentSeverity !== 'none',
      needsFrequentCare: inputs.hospitalizationDays > 10
    };

    // Evaluate each plan
    plans.forEach((plan, index) => {
      const reasoning: string[] = [];
      let recommendationScore = 50; // Base score

      // Cost-benefit analysis
      const annualPremiumPercentage = (plan.annualPremium / eventCost) * 100;
      const coverageRatio = plan.expectedPayout / plan.annualPremium;

      if (annualPremiumPercentage < 12) {
        recommendationScore += 10;
        reasoning.push('Very affordable premium');
      } else if (annualPremiumPercentage > 30) {
        recommendationScore -= 10;
        reasoning.push('Premium is on the higher side');
      }

      // Coverage adequacy
      if (plan.expectedPayout >= eventCost * 0.8) {
        recommendationScore += 15;
        reasoning.push('Strong coverage for estimated costs');
      }

      if (plan.deductible < eventCost * 0.1) {
        recommendationScore += 10;
        reasoning.push('Low deductible reduces out-of-pocket costs');
      }

      if (plan.coverageCap >= userProfile.avgCost * 3) {
        recommendationScore += 10;
        reasoning.push('High coverage cap for major incidents');
      }

      // Risk-based recommendations
      if (userProfile.highRiskConditions) {
        if (plan.expectedPayout >= eventCost * 0.85) {
          recommendationScore += 20;
          reasoning.push('Suitable for multiple medical conditions');
        }
        if (plan.deductible < eventCost * 0.15) {
          recommendationScore += 10;
          reasoning.push('Lower deductible benefits chronic conditions');
        }
      }

      if (userProfile.isSmoker) {
        recommendationScore += 5;
        reasoning.push('Accounts for higher health risks from smoking');
      }

      if (userProfile.isOldAge) {
        if (plan.expectedPayout > eventCost * 0.8 || index === 2) { // Premium plan
          recommendationScore += 15;
          reasoning.push('Comprehensive coverage recommended for senior citizens');
        }
      }

      if (userProfile.needsFrequentCare) {
        if (plan.coverageCap > eventCost * 5) {
          recommendationScore += 15;
          reasoning.push('High cap ideal for frequent medical interventions');
        }
      }

      // Historical comparison
      if (history.length > 0) {
        const historicalCosts = history.map(e => e.eventCost);
        const maxCost = Math.max(...historicalCosts);
        if (plan.coverageCap >= maxCost * 1.5) {
          recommendationScore += 10;
          reasoning.push('Based on historical cost patterns');
        }
      }

      // Value for money score
      const valueScore = (coverageRatio * 10);
      recommendationScore += Math.min(valueScore, 10);

      // Calculate potential savings
      const savingsPotential = plan.expectedPayout - plan.annualPremium;

      // Normalize score
      recommendationScore = Math.min(100, Math.max(0, recommendationScore));

      recommendations.push({
        plan,
        recommendationScore,
        reasoning,
        savingsPotential
      });
    });

    // Sort by recommendation score
    return recommendations.sort((a, b) => b.recommendationScore - a.recommendationScore);
  }

  /**
   * Detect anomalies in insurance claims/estimates
   */
  static detectAnomalies(estimates: EstimateResult[]): {
    isAnomaly: boolean;
    anomalyScore: number;
    reasons: string[];
  } {
    if (estimates.length < 3) {
      return { isAnomaly: false, anomalyScore: 0, reasons: [] };
    }

    const costs = estimates.map(e => e.eventCost);
    const mean = costs.reduce((a, b) => a + b) / costs.length;
    const variance = costs.reduce((a, c) => a + Math.pow(c - mean, 2), 0) / costs.length;
    const stdDev = Math.sqrt(variance);

    const latestCost = costs[costs.length - 1];
    const zScore = Math.abs((latestCost - mean) / stdDev);

    const anomalyScore = Math.min(zScore * 20, 100);
    const isAnomaly = zScore > 2; // Standard deviation threshold

    const reasons: string[] = [];
    if (isAnomaly) {
      const percentageChange = ((latestCost - mean) / mean) * 100;
      reasons.push(`Cost deviation: ${percentageChange.toFixed(1)}% from average`);
      
      if (percentageChange > 100) {
        reasons.push('Significantly higher estimated cost - review medical conditions');
      } else if (percentageChange < -50) {
        reasons.push('Unusually low estimate - verify input parameters');
      }
    }

    return { isAnomaly, anomalyScore, reasons };
  }

  /**
   * Cluster similar estimates and find patterns
   */
  static analyzePatterns(estimates: EstimateResult[]): {
    commonPatterns: Array<{
      pattern: string;
      frequency: number;
      avgCost: number;
    }>;
  } {
    const patterns: Record<string, { costs: number[]; count: number }> = {};

    estimates.forEach(estimate => {
      const { inputs } = estimate;

      // Create pattern keys
      const ageGroup = inputs.age > 60 ? '60+' : inputs.age > 40 ? '40-60' : '<40';
      const bmiCategory = inputs.bmi > 30 ? 'Overweight' : inputs.bmi < 18.5 ? 'Underweight' : 'Normal';
      const conditionCount = inputs.medicalConditions.length > 2 ? 'Multiple' : inputs.medicalConditions.length > 0 ? 'One' : 'None';

      const patternKey = `${ageGroup}-${bmiCategory}-${conditionCount}`;

      if (!patterns[patternKey]) {
        patterns[patternKey] = { costs: [], count: 0 };
      }

      patterns[patternKey].costs.push(estimate.eventCost);
      patterns[patternKey].count++;
    });

    const commonPatterns = Object.entries(patterns)
      .map(([pattern, data]) => ({
        pattern,
        frequency: data.count,
        avgCost: Math.round(data.costs.reduce((a, b) => a + b) / data.costs.length)
      }))
      .sort((a, b) => b.frequency - a.frequency);

    return { commonPatterns };
  }

  /**
   * Get seasonal/temporal patterns in estimates
   */
  static analyzeTemporalPatterns(estimates: EstimateResult[]): {
    avgCostByMonth: Record<string, number>;
    trend: 'increasing' | 'decreasing' | 'stable';
  } {
    const costsByMonth: Record<string, number[]> = {};

    estimates.forEach(estimate => {
      const date = new Date(estimate.timestamp);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!costsByMonth[monthKey]) {
        costsByMonth[monthKey] = [];
      }
      costsByMonth[monthKey].push(estimate.eventCost);
    });

    const avgCostByMonth: Record<string, number> = {};
    Object.entries(costsByMonth).forEach(([month, costs]) => {
      avgCostByMonth[month] = Math.round(costs.reduce((a, b) => a + b) / costs.length);
    });

    // Determine trend
    const months = Object.keys(avgCostByMonth).sort();
    let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';

    if (months.length > 1) {
      const firstAvg = avgCostByMonth[months[0]];
      const lastAvg = avgCostByMonth[months[months.length - 1]];
      const percentageChange = ((lastAvg - firstAvg) / firstAvg) * 100;

      if (percentageChange > 5) {
        trend = 'increasing';
      } else if (percentageChange < -5) {
        trend = 'decreasing';
      }
    }

    return { avgCostByMonth, trend };
  }
}
