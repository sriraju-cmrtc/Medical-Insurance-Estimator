import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingUp, TrendingDown, AlertCircle, Zap, Brain } from 'lucide-react';
import { HealthRiskProfile } from '@/lib/ml/riskAssessment';
import { PlanRecommendation } from '@/lib/ml/recommendations';

interface RiskAssessmentCardProps {
  riskProfile: HealthRiskProfile;
}

export function RiskAssessmentCard({ riskProfile }: RiskAssessmentCardProps) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="w-5 h-5" />;
      case 'moderate':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Zap className="w-5 h-5" />;
    }
  };

  return (
    <Card className="border-2">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-500" />
            <div>
              <CardTitle>Health Risk Assessment</CardTitle>
              <CardDescription>ML-powered health analysis</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Risk Level Badge */}
        <div className="flex items-center gap-3">
          <div className={`rounded-lg p-3 ${getRiskColor(riskProfile.riskLevel)}`}>
            <div className="flex items-center gap-2">
              {getRiskIcon(riskProfile.riskLevel)}
              <div>
                <p className="font-semibold capitalize">{riskProfile.riskLevel} Risk</p>
                <p className="text-sm">Score: {riskProfile.riskScore}/100</p>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Score Progress */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Risk Score</span>
            <span className="text-sm font-bold">{riskProfile.riskScore}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all ${
                riskProfile.riskScore > 75
                  ? 'bg-red-500'
                  : riskProfile.riskScore > 50
                  ? 'bg-orange-500'
                  : riskProfile.riskScore > 25
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
              style={{ width: `${riskProfile.riskScore}%` }}
            />
          </div>
        </div>

        {/* Cost Multiplier */}
        <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
          <p className="text-sm text-muted-foreground">Estimated Cost Multiplier</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {riskProfile.estimatedCostMultiplier}x
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Based on health profile
          </p>
        </div>

        {/* Risk Factors */}
        {riskProfile.riskFactors.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Risk Factors</h4>
            <div className="flex flex-wrap gap-2">
              {riskProfile.riskFactors.map((factor, idx) => (
                <Badge key={idx} variant="secondary">
                  {factor}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {riskProfile.recommendations.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Recommendations</h4>
            <ul className="space-y-2">
              {riskProfile.recommendations.slice(0, 3).map((rec, idx) => (
                <li key={idx} className="text-sm flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span className="text-muted-foreground">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface PlanRecommendationsProps {
  recommendations: PlanRecommendation[];
}

export function PlanRecommendationsCard({ recommendations }: PlanRecommendationsProps) {
  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-500" />
          <div>
            <CardTitle>AI-Powered Plan Recommendations</CardTitle>
            <CardDescription>Personalized based on your profile</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((rec, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-lg border-2 transition-all ${
              idx === 0
                ? 'border-green-500 bg-green-50 dark:bg-green-950'
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold">{rec.plan.name} Plan</h4>
              <div className="text-right">
                <div className="text-xs text-muted-foreground mb-1">ML Score</div>
                <Badge variant={idx === 0 ? 'default' : 'secondary'}>
                  {rec.recommendationScore.toFixed(0)}%
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-3 text-sm">
              <div className="bg-white dark:bg-slate-950 p-2 rounded">
                <p className="text-xs text-muted-foreground">Premium</p>
                <p className="font-semibold">₹{rec.plan.annualPremium.toLocaleString('en-IN')}</p>
              </div>
              <div className="bg-white dark:bg-slate-950 p-2 rounded">
                <p className="text-xs text-muted-foreground">Coverage</p>
                <p className="font-semibold">₹{(rec.plan.expectedPayout / 100000).toFixed(1)}L</p>
              </div>
              <div className="bg-white dark:bg-slate-950 p-2 rounded">
                <p className="text-xs text-muted-foreground">Deductible</p>
                <p className="font-semibold">₹{(rec.plan.deductible / 1000).toFixed(0)}K</p>
              </div>
            </div>

            {rec.reasoning.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground">Why this plan?</p>
                <ul className="text-xs space-y-1">
                  {rec.reasoning.slice(0, 2).map((reason, rIdx) => (
                    <li key={rIdx} className="flex items-start gap-2">
                      <span className="text-green-600 flex-shrink-0">✓</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

interface AnomalyDetectionProps {
  anomaly: { isAnomaly: boolean; anomalyScore: number; reasons: string[] };
}

export function AnomalyDetectionCard({ anomaly }: AnomalyDetectionProps) {
  if (!anomaly.isAnomaly) return null;

  return (
    <Alert className="border-orange-300 bg-orange-50 dark:bg-orange-950">
      <AlertTriangle className="h-4 w-4 text-orange-600" />
      <AlertTitle>Unusual Pattern Detected</AlertTitle>
      <AlertDescription className="space-y-2">
        <p>Our ML model detected an anomaly in your estimate. Review the following:</p>
        <ul className="list-disc list-inside space-y-1 text-sm">
          {anomaly.reasons.map((reason, idx) => (
            <li key={idx}>{reason}</li>
          ))}
        </ul>
        <p className="text-xs text-muted-foreground mt-2">
          Anomaly Score: {anomaly.anomalyScore.toFixed(1)}/100
        </p>
      </AlertDescription>
    </Alert>
  );
}

interface TrendAnalysisProps {
  trend: 'increasing' | 'decreasing' | 'stable';
  frequentFactors: string[];
}

export function TrendAnalysisCard({ trend, frequentFactors }: TrendAnalysisProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="w-5 h-5 text-orange-500" />;
      case 'decreasing':
        return <TrendingDown className="w-5 h-5 text-green-500" />;
      default:
        return <Zap className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          {getTrendIcon()}
          <div>
            <CardTitle>Risk Trend Analysis</CardTitle>
            <CardDescription>Based on your estimate history</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={`p-3 rounded-lg ${
          trend === 'increasing'
            ? 'bg-orange-100 dark:bg-orange-950'
            : trend === 'decreasing'
            ? 'bg-green-100 dark:bg-green-950'
            : 'bg-blue-100 dark:bg-blue-950'
        }`}>
          <p className="text-sm font-semibold capitalize">{trend} Trend</p>
          <p className="text-xs text-muted-foreground mt-1">
            {trend === 'increasing' && 'Health costs are trending upward'}
            {trend === 'decreasing' && 'Health costs are improving'}
            {trend === 'stable' && 'Health costs remain stable'}
          </p>
        </div>

        {frequentFactors.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Common Risk Factors</h4>
            <div className="space-y-1">
              {frequentFactors.map((factor, idx) => (
                <p key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  {factor}
                </p>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
