/**
 * ML Features Examples and Usage Guide
 * This file demonstrates how to use the ML modules in your application
 */

import { getMLModel, InsuranceMLModel } from '@/lib/ml/modelTrainer';
import { RiskAssessmentEngine, HealthRiskProfile } from '@/lib/ml/riskAssessment';
import { RecommendationEngine, PlanRecommendation } from '@/lib/ml/recommendations';
import * as MLUtils from '@/lib/ml/utils';
import { EstimateInputs, EstimateResult } from '@/types/insurance';

// ============================================
// EXAMPLE 1: Neural Network Model Training
// ============================================
export function exampleModelTraining(history: EstimateResult[]) {
  const model = getMLModel();

  // Train the model
  (async () => {
    // Train on historical data
    await model.trainOnHistory(history);

    // Check if trained
    const isTrained = model.isTrained();
    console.log('Model trained:', isTrained);

    // Get metrics
    const metrics = await model.getModelMetrics(history);
    if (metrics) {
      console.log(`Model Accuracy (MAPE): ${metrics.mape.toFixed(2)}%`);
      console.log(`Root Mean Squared Error: ₹${metrics.rmse.toFixed(2)}`);
    }

    // Make a prediction for new inputs
    const newInputs: EstimateInputs = {
      age: 35,
      sex: 'male',
      bmi: 24,
      children: 1,
      smoker: false,
      medicalConditions: [],
      accidentSeverity: 'none',
      hospitalizationDays: 0,
      treatmentType: 'outpatient',
      location: 'urban'
    };

    const prediction = model.predictCost(newInputs);
    console.log(`Predicted cost: ₹${prediction.toFixed(2)}`);
  })();
}

// ============================================
// EXAMPLE 2: Health Risk Assessment
// ============================================
export function exampleRiskAssessment(inputs: EstimateInputs) {
  // Single estimate assessment
  const riskProfile = RiskAssessmentEngine.assessHealthRisk(inputs);

  console.log('Risk Assessment Results:');
  console.log(`- Risk Level: ${riskProfile.riskLevel}`);
  console.log(`- Risk Score: ${riskProfile.riskScore}/100`);
  console.log(`- Cost Multiplier: ${riskProfile.estimatedCostMultiplier}x`);
  console.log(`- Risk Factors: ${riskProfile.riskFactors.join(', ')}`);
  console.log(`- Recommendations:`, riskProfile.recommendations);

  return riskProfile;
}

// ============================================
// EXAMPLE 3: Multiple Risk Trend Analysis
// ============================================
export function exampleRiskTrendAnalysis(history: EstimateResult[]) {
  if (history.length < 2) {
    console.log('Need at least 2 estimates for trend analysis');
    return;
  }

  const trendAnalysis = RiskAssessmentEngine.compareRiskTrends(history);

  console.log('Risk Trend Analysis:');
  console.log(`- Average Risk Score: ${trendAnalysis.averageRisk.toFixed(1)}/100`);
  console.log(`- Risk Trend: ${trendAnalysis.riskTrend}`);
  console.log(`- Most Common Risk Factors: ${trendAnalysis.frequentFactors.join(', ')}`);

  return trendAnalysis;
}

// ============================================
// EXAMPLE 4: Plan Recommendations
// ============================================
export function examplePlanRecommendations(
  currentEstimate: EstimateResult,
  history: EstimateResult[] = []
) {
  const recommendations = RecommendationEngine.recommendPlans(currentEstimate, history);

  console.log('Plan Recommendations (Ranked by ML):');
  recommendations.forEach((rec, idx) => {
    console.log(`\n${idx + 1}. ${rec.plan.name} Plan (Score: ${rec.recommendationScore.toFixed(0)}%)`);
    console.log(`   - Annual Premium: ₹${rec.plan.annualPremium.toLocaleString('en-IN')}`);
    console.log(`   - Expected Payout: ₹${rec.plan.expectedPayout.toLocaleString('en-IN')}`);
    console.log(`   - Deductible: ₹${rec.plan.deductible.toLocaleString('en-IN')}`);
    console.log(`   - Coverage Cap: ₹${rec.plan.coverageCap.toLocaleString('en-IN')}`);
    console.log(`   - Potential Savings: ₹${rec.savingsPotential.toLocaleString('en-IN')}`);
    console.log(`   - Reasoning:`, rec.reasoning);
  });

  return recommendations;
}

// ============================================
// EXAMPLE 5: Anomaly Detection
// ============================================
export function exampleAnomalyDetection(history: EstimateResult[]) {
  if (history.length < 3) {
    console.log('Need at least 3 estimates for anomaly detection');
    return;
  }

  const anomaly = RecommendationEngine.detectAnomalies(history);

  if (anomaly.isAnomaly) {
    console.log('⚠️ ANOMALY DETECTED!');
    console.log(`- Anomaly Score: ${anomaly.anomalyScore.toFixed(1)}/100`);
    console.log(`- Reasons:`);
    anomaly.reasons.forEach((reason) => console.log(`  • ${reason}`));
  } else {
    console.log('✅ No anomalies detected in estimate history');
  }

  return anomaly;
}

// ============================================
// EXAMPLE 6: Pattern Analysis
// ============================================
export function examplePatternAnalysis(history: EstimateResult[]) {
  if (history.length < 5) {
    console.log('Need at least 5 estimates for pattern analysis');
    return;
  }

  const patterns = RecommendationEngine.analyzePatterns(history);

  console.log('Pattern Analysis - Common Characteristics:');
  patterns.commonPatterns.forEach((pattern, idx) => {
    console.log(
      `${idx + 1}. ${pattern.pattern} (Frequency: ${pattern.frequency}x, Avg Cost: ₹${pattern.avgCost.toLocaleString('en-IN')})`
    );
  });

  return patterns;
}

// ============================================
// EXAMPLE 7: Temporal/Trend Analysis
// ============================================
export function exampleTemporalAnalysis(history: EstimateResult[]) {
  if (history.length < 2) {
    console.log('Need at least 2 estimates for temporal analysis');
    return;
  }

  const temporal = RecommendationEngine.analyzeTemporalPatterns(history);

  console.log('Temporal Pattern Analysis:');
  console.log(`- Overall Trend: ${temporal.trend}`);
  console.log('- Monthly Average Costs:');
  Object.entries(temporal.avgCostByMonth).forEach(([month, avgCost]) => {
    console.log(`  ${month}: ₹${avgCost.toLocaleString('en-IN')}`);
  });

  return temporal;
}

// ============================================
// EXAMPLE 8: Statistical Utilities
// ============================================
export function exampleStatisticalUtils() {
  const data = [10000, 15000, 12000, 18000, 14000, 20000, 11000];

  console.log('Statistical Analysis Examples:');

  // Mean and percentiles
  const mean = data.reduce((a, b) => a + b) / data.length;
  const p25 = MLUtils.percentile(data, 25);
  const p50 = MLUtils.percentile(data, 50);
  const p75 = MLUtils.percentile(data, 75);

  console.log(`- Mean: ₹${mean.toFixed(2)}`);
  console.log(`- 25th Percentile: ₹${p25.toFixed(2)}`);
  console.log(`- Median (50th): ₹${p50.toFixed(2)}`);
  console.log(`- 75th Percentile: ₹${p75.toFixed(2)}`);

  // Outlier detection
  const outliers = MLUtils.detectOutliers(data);
  console.log(`- Outliers: ${outliers.outliers.length > 0 ? outliers.outliers.map((v) => `₹${v}`) : 'None'}`);

  // Moving average (trend smoothing)
  const smoothed = MLUtils.movingAverage(data, 3);
  console.log(`- 3-period Moving Average: ${smoothed.map((v) => `₹${v.toFixed(0)}`).join(', ')}`);

  // Error metrics
  const predicted = [10500, 14800, 12200, 18200, 13800, 19800, 11200];
  const mae = MLUtils.meanAbsoluteError(data, predicted);
  const rmse = MLUtils.rootMeanSquaredError(data, predicted);
  const mape = MLUtils.meanAbsolutePercentageError(data, predicted);

  console.log(`- Mean Absolute Error: ₹${mae.toFixed(2)}`);
  console.log(`- Root Mean Squared Error: ₹${rmse.toFixed(2)}`);
  console.log(`- Mean Absolute Percentage Error: ${mape.toFixed(2)}%`);

  return { mean, percentiles: { p25, p50, p75 }, outliers, mae, rmse, mape };
}

// ============================================
// EXAMPLE 9: K-Means Clustering
// ============================================
export function exampleKMeansClustering() {
  // Sample data points (simplified for example)
  const costData = [
    [25000, 30],     // Low cost, young age
    [28000, 32],     // Low cost, young age
    [52000, 45],     // Medium cost, middle age
    [55000, 48],     // Medium cost, middle age
    [95000, 62],     // High cost, senior
    [98000, 65]      // High cost, senior
  ];

  const clusters = MLUtils.kMeansClustering(costData, 3);

  console.log('K-Means Clustering Results (k=3):');
  clusters.labels.forEach((label, idx) => {
    console.log(`Data point ${idx}: Cluster ${label}`);
  });

  return clusters;
}

// ============================================
// EXAMPLE 10: Correlation Analysis
// ============================================
export function exampleCorrelationAnalysis(history: EstimateResult[]) {
  if (history.length < 3) {
    console.log('Need at least 3 estimates for correlation analysis');
    return;
  }

  const ages = history.map((e) => e.inputs.age);
  const costs = history.map((e) => e.eventCost);
  const bmis = history.map((e) => e.inputs.bmi);

  const ageVsCostCorr = MLUtils.correlation(ages, costs);
  const bmiVsCostCorr = MLUtils.correlation(bmis, costs);

  console.log('Correlation Analysis:');
  console.log(`- Age vs Cost Correlation: ${ageVsCostCorr.toFixed(3)}`);
  console.log(`- BMI vs Cost Correlation: ${bmiVsCostCorr.toFixed(3)}`);
  console.log('  (1.0 = perfect positive, -1.0 = perfect negative, 0 = no correlation)');

  return { ageVsCostCorr, bmiVsCostCorr };
}

// ============================================
// EXAMPLE 11: Complete ML Pipeline
// ============================================
export async function exampleCompleteMLPipeline(history: EstimateResult[], newEstimate: EstimateResult) {
  console.log('╔════════════════════════════════════════════════════╗');
  console.log('║      COMPLETE ML ANALYSIS PIPELINE                 ║');
  console.log('╚════════════════════════════════════════════════════╝\n');

  // 1. Risk Assessment
  console.log('1️⃣  Health Risk Assessment');
  const riskProfile = exampleRiskAssessment(newEstimate.inputs);

  // 2. Train Model
  console.log('\n2️⃣  Training Neural Network Model');
  const model = getMLModel();
  if (history.length >= 5) {
    await model.trainOnHistory(history);
    const metrics = await model.getModelMetrics(history);
    if (metrics) {
      console.log(`   Model Accuracy: ${metrics.mape.toFixed(2)}%`);
    }
  }

  // 3. Get Predictions
  console.log('\n3️⃣  ML Cost Prediction');
  const prediction = model.predictCost(newEstimate.inputs);
  console.log(`   Predicted Cost: ₹${prediction.toFixed(2)}`);
  console.log(`   Actual Cost: ₹${newEstimate.eventCost.toFixed(2)}`);

  // 4. Plan Recommendations
  console.log('\n4️⃣  AI-Powered Plan Recommendations');
  const recommendations = examplePlanRecommendations(newEstimate, history);
  if (recommendations.length > 0) {
    console.log(`   Top Recommendation: ${recommendations[0].plan.name} (Score: ${recommendations[0].recommendationScore.toFixed(0)}%)`);
  }

  // 5. Trend Analysis
  if (history.length >= 2) {
    console.log('\n5️⃣  Risk Trend Analysis');
    exampleRiskTrendAnalysis(history);
  }

  // 6. Anomaly Detection
  if (history.length >= 3) {
    console.log('\n6️⃣  Anomaly Detection');
    exampleAnomalyDetection(history);
  }

  console.log('\n✅ ML Pipeline Complete!\n');
}

// ============================================
// EXAMPLE 12: Integration with React Hook
// ============================================
export function exampleReactIntegration() {
  // This is how you use the ML features in a React component
  const code = `
import { useMLInsights } from '@/hooks/use-ml-insights';
import { RiskAssessmentCard, PlanRecommendationsCard } from '@/components/MLInsightCards';

function MyComponent() {
  const { insights, generateInsights, predictCost, retrainModel } = useMLInsights();

  const handleEstimate = async (estimate) => {
    // Generate all ML insights
    await generateInsights(estimate);
    
    // Retrain model with new data
    await retrainModel();
    
    // Make a prediction
    const predictedCost = predictCost(estimate.inputs);
  };

  return (
    <div>
      {insights.riskProfile && (
        <RiskAssessmentCard riskProfile={insights.riskProfile} />
      )}
      {insights.recommendations.length > 0 && (
        <PlanRecommendationsCard recommendations={insights.recommendations} />
      )}
    </div>
  );
}
`;

  console.log('React Integration Example:');
  console.log(code);

  return code;
}
