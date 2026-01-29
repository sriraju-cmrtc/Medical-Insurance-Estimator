import { EstimateInputs, EstimateResult } from '@/types/insurance';

/**
 * ML-based Health Risk Assessment
 * Classifies users into risk categories using decision tree logic and ML patterns
 */

export interface HealthRiskProfile {
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  riskScore: number; // 0-100
  riskFactors: string[];
  recommendations: string[];
  estimatedCostMultiplier: number; // Multiplier for base cost
}

export class RiskAssessmentEngine {
  /**
   * Calculate comprehensive health risk profile
   */
  static assessHealthRisk(inputs: EstimateInputs): HealthRiskProfile {
    let riskScore = 0;
    const riskFactors: string[] = [];
    const recommendations: string[] = [];
    let estimatedCostMultiplier = 1;

    // Age-based risk assessment
    if (inputs.age > 70) {
      riskScore += 35;
      riskFactors.push('Advanced age (70+)');
      estimatedCostMultiplier *= 2.8;
      recommendations.push('Consider annual health checkups');
      recommendations.push('Comprehensive medical coverage recommended');
    } else if (inputs.age > 60) {
      riskScore += 25;
      riskFactors.push('Senior age group (60-70)');
      estimatedCostMultiplier *= 2.2;
      recommendations.push('Regular preventive screening');
    } else if (inputs.age > 45) {
      riskScore += 15;
      riskFactors.push('Middle age with potential health risks');
      estimatedCostMultiplier *= 1.5;
      recommendations.push('Monitor blood pressure and cholesterol');
    }

    // BMI-based risk assessment
    if (inputs.bmi > 35) {
      riskScore += 30;
      riskFactors.push('Obesity (BMI > 35)');
      estimatedCostMultiplier *= 1.8;
      recommendations.push('Weight management program');
      recommendations.push('Regular fitness and diet counseling');
    } else if (inputs.bmi > 30) {
      riskScore += 20;
      riskFactors.push('Overweight (BMI 30-35)');
      estimatedCostMultiplier *= 1.4;
      recommendations.push('Lifestyle modification suggested');
    } else if (inputs.bmi < 18.5) {
      riskScore += 8;
      riskFactors.push('Underweight - nutritional concerns');
      recommendations.push('Nutritional assessment recommended');
    }

    // Smoking status
    if (inputs.smoker) {
      riskScore += 25;
      riskFactors.push('Smoking habit');
      estimatedCostMultiplier *= 1.6;
      recommendations.push('Smoking cessation program recommended');
      recommendations.push('Increased respiratory disease risk');
    }

    // Medical conditions assessment
    const conditionRiskMap: Record<string, { score: number; multiplier: number; rec: string }> = {
      'Diabetes': { score: 20, multiplier: 1.5, rec: 'Regular glucose monitoring and endocrinology consultation' },
      'Heart Disease': { score: 25, multiplier: 2.0, rec: 'Cardiology consultation and stress testing' },
      'Hypertension': { score: 15, multiplier: 1.3, rec: 'Blood pressure management and medication' },
      'Asthma': { score: 12, multiplier: 1.2, rec: 'Pulmonary function tests and inhaler therapy' },
      'Arthritis': { score: 10, multiplier: 1.1, rec: 'Rheumatology follow-up and physical therapy' }
    };

    inputs.medicalConditions.forEach(condition => {
      const risk = conditionRiskMap[condition];
      if (risk) {
        riskScore += risk.score;
        riskFactors.push(`Medical condition: ${condition}`);
        estimatedCostMultiplier *= risk.multiplier;
        recommendations.push(risk.rec);
      }
    });

    // Accident severity assessment
    if (inputs.accidentSeverity === 'severe') {
      riskScore += 40;
      riskFactors.push('Severe recent accident');
      estimatedCostMultiplier *= 3.5;
      recommendations.push('Intensive post-accident rehabilitation');
      recommendations.push('Trauma specialist consultation');
    } else if (inputs.accidentSeverity === 'moderate') {
      riskScore += 25;
      riskFactors.push('Moderate accident history');
      estimatedCostMultiplier *= 2.0;
      recommendations.push('Follow-up medical evaluation');
    } else if (inputs.accidentSeverity === 'minor') {
      riskScore += 10;
      riskFactors.push('Minor accident history');
      estimatedCostMultiplier *= 1.2;
    }

    // Hospitalization days assessment
    if (inputs.hospitalizationDays > 30) {
      riskScore += 20;
      riskFactors.push('Extended hospitalization period');
      recommendations.push('Post-discharge recovery support needed');
    } else if (inputs.hospitalizationDays > 0) {
      riskScore += Math.min(inputs.hospitalizationDays, 15);
      riskFactors.push(`Recent hospitalization: ${inputs.hospitalizationDays} days`);
    }

    // Normalize risk score (0-100)
    riskScore = Math.min(100, riskScore);

    // Add general recommendations
    recommendations.push('Maintain health records and insurance documentation');
    recommendations.push('Keep emergency contact information updated');

    // Determine risk level
    let riskLevel: 'low' | 'moderate' | 'high' | 'critical';
    if (riskScore >= 75) {
      riskLevel = 'critical';
    } else if (riskScore >= 50) {
      riskLevel = 'high';
    } else if (riskScore >= 25) {
      riskLevel = 'moderate';
    } else {
      riskLevel = 'low';
    }

    return {
      riskLevel,
      riskScore,
      riskFactors,
      recommendations,
      estimatedCostMultiplier: parseFloat(estimatedCostMultiplier.toFixed(2))
    };
  }

  /**
   * Compare risk profiles across estimates for trend analysis
   */
  static compareRiskTrends(estimates: EstimateResult[]): {
    averageRisk: number;
    riskTrend: 'improving' | 'stable' | 'worsening';
    frequentFactors: string[];
  } {
    if (estimates.length < 2) {
      return {
        averageRisk: 0,
        riskTrend: 'stable',
        frequentFactors: []
      };
    }

    const risks = estimates.map(e => this.assessHealthRisk(e.inputs));
    const riskScores = risks.map(r => r.riskScore);
    const averageRisk = riskScores.reduce((a, b) => a + b) / riskScores.length;

    // Determine trend (comparing latest vs earliest)
    let riskTrend: 'improving' | 'stable' | 'worsening';
    const latestRisk = riskScores[riskScores.length - 1];
    const earliestRisk = riskScores[0];
    const difference = latestRisk - earliestRisk;

    if (difference < -5) {
      riskTrend = 'improving';
    } else if (difference > 5) {
      riskTrend = 'worsening';
    } else {
      riskTrend = 'stable';
    }

    // Find most common risk factors
    const factorFrequency: Record<string, number> = {};
    risks.forEach(risk => {
      risk.riskFactors.forEach(factor => {
        factorFrequency[factor] = (factorFrequency[factor] || 0) + 1;
      });
    });

    const frequentFactors = Object.entries(factorFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([factor]) => factor);

    return {
      averageRisk,
      riskTrend,
      frequentFactors
    };
  }
}
