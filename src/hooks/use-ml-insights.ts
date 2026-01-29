import { useEffect, useState, useCallback } from 'react';
import { EstimateResult } from '@/types/insurance';
import { getMLModel } from '@/lib/ml/modelTrainer';
import { RiskAssessmentEngine, HealthRiskProfile } from '@/lib/ml/riskAssessment';
import { RecommendationEngine, PlanRecommendation } from '@/lib/ml/recommendations';
import { getHistory } from '@/lib/storage';

/**
 * Custom hook for ML operations
 * Provides risk assessment, recommendations, and model training
 */

export interface MLInsights {
  riskProfile: HealthRiskProfile | null;
  recommendations: PlanRecommendation[];
  anomalyDetection: { isAnomaly: boolean; anomalyScore: number; reasons: string[] };
  patterns: any;
  temporalAnalysis: any;
  modelTrained: boolean;
  modelMetrics: { mape: number; rmse: number } | null;
  loading: boolean;
  error: string | null;
}

export function useMLInsights() {
  const [insights, setInsights] = useState<MLInsights>({
    riskProfile: null,
    recommendations: [],
    anomalyDetection: { isAnomaly: false, anomalyScore: 0, reasons: [] },
    patterns: null,
    temporalAnalysis: null,
    modelTrained: false,
    modelMetrics: null,
    loading: false,
    error: null
  });

  /**
   * Generate insights for a specific estimate
   */
  const generateInsights = useCallback(async (estimate: EstimateResult | null) => {
    if (!estimate) return;

    setInsights(prev => ({ ...prev, loading: true, error: null }));

    try {
      const history = getHistory();
      const mlModel = getMLModel();

      // Generate risk profile
      const riskProfile = RiskAssessmentEngine.assessHealthRisk(estimate.inputs);

      // Generate recommendations
      const recommendations = RecommendationEngine.recommendPlans(estimate, history);

      // Detect anomalies
      const anomalyDetection = RecommendationEngine.detectAnomalies(history);

      // Analyze patterns
      const patterns = RecommendationEngine.analyzePatterns(history);

      // Temporal analysis
      const temporalAnalysis = RecommendationEngine.analyzeTemporalPatterns(history);

      // Train and get model metrics
      const modelTrained = mlModel.isTrained();
      let modelMetrics = null;

      if (history.length >= 5) {
        // Train model if enough data
        if (!modelTrained) {
          await mlModel.trainOnHistory(history);
        }
        // Get metrics
        modelMetrics = await mlModel.getModelMetrics(history);
      }

      setInsights({
        riskProfile,
        recommendations,
        anomalyDetection,
        patterns,
        temporalAnalysis,
        modelTrained: mlModel.isTrained(),
        modelMetrics,
        loading: false,
        error: null
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate insights';
      setInsights(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      console.error('Error generating insights:', error);
    }
  }, []);

  /**
   * Get ML prediction for a new estimate
   */
  const predictCost = useCallback((inputs: any): number => {
    try {
      const mlModel = getMLModel();
      if (!mlModel.isTrained()) {
        return 0;
      }
      return mlModel.predictCost(inputs);
    } catch (error) {
      console.error('Error predicting cost:', error);
      return 0;
    }
  }, []);

  /**
   * Retrain the model with latest data
   */
  const retrainModel = useCallback(async () => {
    setInsights(prev => ({ ...prev, loading: true }));

    try {
      const history = getHistory();
      const mlModel = getMLModel();

      if (history.length >= 5) {
        await mlModel.trainOnHistory(history);
        const metrics = await mlModel.getModelMetrics(history);

        setInsights(prev => ({
          ...prev,
          modelTrained: true,
          modelMetrics: metrics,
          loading: false
        }));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to train model';
      setInsights(prev => ({
        ...prev,
        error: errorMessage,
        loading: false
      }));
    }
  }, []);

  /**
   * Initialize insights on component mount
   */
  useEffect(() => {
    const history = getHistory();
    if (history.length > 0) {
      const latestEstimate = history[history.length - 1];
      generateInsights(latestEstimate);
    }
  }, [generateInsights]);

  return {
    insights,
    generateInsights,
    predictCost,
    retrainModel
  };
}
