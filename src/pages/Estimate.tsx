import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calculator, Download, Trash2, RotateCcw, Zap } from 'lucide-react';
import { EstimateInputs, EstimateResult } from '@/types/insurance';
import { calculateInsuranceCost, formatINR } from '@/lib/estimator';
import { saveEstimate, getHistory, clearHistory, exportToCSV } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { useMLInsights } from '@/hooks/use-ml-insights';
import { RiskAssessmentCard, PlanRecommendationsCard, AnomalyDetectionCard, TrendAnalysisCard } from '@/components/MLInsightCards';

const MEDICAL_CONDITIONS = ['Diabetes', 'Hypertension', 'Heart Disease', 'Asthma', 'Arthritis'];

const Estimate = () => {
  const { toast } = useToast();
  const { insights, generateInsights, retrainModel } = useMLInsights();
  const [inputs, setInputs] = useState<EstimateInputs>({
    age: 30,
    sex: 'male',
    bmi: 22,
    children: 0,
    smoker: false,
    medicalConditions: [],
    accidentSeverity: 'none',
    hospitalizationDays: 0,
    treatmentType: 'outpatient',
    location: 'urban'
  });
  
  const [result, setResult] = useState<EstimateResult | null>(null);
  const [history, setHistory] = useState<EstimateResult[]>([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleCalculate = () => {
    const calculatedResult = calculateInsuranceCost(inputs);
    setResult(calculatedResult);
    saveEstimate(calculatedResult);
    setHistory(getHistory());
    
    // Generate ML insights
    generateInsights(calculatedResult);
    
    // Retrain model with new data
    retrainModel();
    
    toast({
      title: "Estimate Calculated",
      description: `Event cost: ${formatINR(calculatedResult.eventCost)}`
    });
  };

  const handleRestore = (savedResult: EstimateResult) => {
    setInputs(savedResult.inputs);
    setResult(savedResult);
    toast({
      title: "Estimate Restored",
      description: "Previous calculation loaded"
    });
  };

  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
    toast({
      title: "History Cleared",
      description: "All saved estimates removed"
    });
  };

  const handleExport = () => {
    exportToCSV(history);
    toast({
      title: "Export Complete",
      description: "CSV file downloaded"
    });
  };

  const handleClearParameters = () => {
    setInputs({
      age: 30,
      sex: 'male',
      bmi: 22,
      children: 0,
      smoker: false,
      medicalConditions: [],
      accidentSeverity: 'none',
      hospitalizationDays: 0,
      treatmentType: 'outpatient',
      location: 'urban'
    });
    setResult(null);
    toast({
      title: "Parameters Cleared",
      description: "All input fields reset to default values"
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Insurance Cost Estimator</h1>
        <p className="text-muted-foreground text-lg">Enter your details below to get an instant personalized estimate</p>
      </div>

      <Card className="card-elevated border-2 border-blue-100 dark:border-blue-900/30">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 rounded-t-lg">
          <CardTitle className="text-2xl">Personal & Health Information</CardTitle>
          <CardDescription>All information is processed locally on your device</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-8">
          {/* Personal Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">1</div>
              Basic Information
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age" className="font-semibold">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={inputs.age}
                  onChange={(e) => setInputs({ ...inputs, age: parseInt(e.target.value) || 0 })}
                  min="0"
                  max="120"
                  className="input-focus"
                  placeholder="Enter your age"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sex" className="font-semibold">Sex</Label>
                <Select value={inputs.sex} onValueChange={(value: any) => setInputs({ ...inputs, sex: value })}>
                  <SelectTrigger id="sex" className="input-focus">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bmi" className="font-semibold">BMI</Label>
                <Input
                  id="bmi"
                  type="number"
                  step="0.1"
                  value={inputs.bmi}
                  onChange={(e) => setInputs({ ...inputs, bmi: parseFloat(e.target.value) || 0 })}
                  min="10"
                  max="50"
                  className="input-focus"
                  placeholder="Enter your BMI"
                />
              </div>
            </div>
          </div>

          {/* Lifestyle & Family */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">2</div>
              Lifestyle & Family
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="children" className="font-semibold">Number of Children</Label>
                <Input
                  id="children"
                  type="number"
                  value={inputs.children}
                  onChange={(e) => setInputs({ ...inputs, children: parseInt(e.target.value) || 0 })}
                  min="0"
                  max="10"
                  className="input-focus"
                  placeholder="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location" className="font-semibold">Location</Label>
                <Select value={inputs.location} onValueChange={(value: any) => setInputs({ ...inputs, location: value })}>
                  <SelectTrigger id="location" className="input-focus">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="metro">Metro City</SelectItem>
                    <SelectItem value="urban">Urban</SelectItem>
                    <SelectItem value="rural">Rural</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-3 mt-4 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-900/30">
              <Checkbox
                id="smoker"
                checked={inputs.smoker}
                onCheckedChange={(checked) => setInputs({ ...inputs, smoker: checked as boolean })}
                className="w-5 h-5"
              />
              <Label htmlFor="smoker" className="cursor-pointer font-semibold text-base">I am a smoker</Label>
            </div>
          </div>

          {/* Medical Conditions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">3</div>
              Medical Conditions
            </h3>
            <div className="grid md:grid-cols-3 gap-3">
              {MEDICAL_CONDITIONS.map((condition) => (
                <div key={condition} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <Checkbox
                    id={condition}
                    checked={inputs.medicalConditions.includes(condition)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setInputs({ ...inputs, medicalConditions: [...inputs.medicalConditions, condition] });
                      } else {
                        setInputs({ ...inputs, medicalConditions: inputs.medicalConditions.filter(c => c !== condition) });
                      }
                    }}
                    className="w-5 h-5"
                  />
                  <Label htmlFor={condition} className="cursor-pointer font-medium">{condition}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Treatment Details */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">4</div>
              Treatment Details
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="accident" className="font-semibold">Accident Severity</Label>
                <Select value={inputs.accidentSeverity} onValueChange={(value: any) => setInputs({ ...inputs, accidentSeverity: value })}>
                  <SelectTrigger id="accident" className="input-focus">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="minor">Minor</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="severe">Severe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hospitalization" className="font-semibold">Hospitalization Days</Label>
                <Input
                  id="hospitalization"
                  type="number"
                  value={inputs.hospitalizationDays}
                  onChange={(e) => setInputs({ ...inputs, hospitalizationDays: parseInt(e.target.value) || 0 })}
                  min="0"
                  max="365"
                  className="input-focus"
                  placeholder="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="treatment" className="font-semibold">Treatment Type</Label>
                <Select value={inputs.treatmentType} onValueChange={(value: any) => setInputs({ ...inputs, treatmentType: value })}>
                  <SelectTrigger id="treatment" className="input-focus">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="outpatient">Outpatient</SelectItem>
                    <SelectItem value="surgery">Surgery</SelectItem>
                    <SelectItem value="icu">ICU</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t border-slate-200 dark:border-slate-700">
            <Button onClick={handleCalculate} className="btn-gradient flex-1" size="lg">
              <Calculator className="mr-2 h-5 w-5" />
              Calculate Estimate
            </Button>
            <Button onClick={handleClearParameters} variant="outline" size="lg">
              <RotateCcw className="mr-2 h-5 w-5" />
              Clear Parameters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <>
          <Card className="card-elevated border-2 border-emerald-100 dark:border-emerald-900/30">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-900 rounded-t-lg">
              <CardTitle className="text-2xl">Your Estimate Results</CardTitle>
              <CardDescription>Personalized insurance cost breakdown</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 pt-8">
              <div className="text-center p-8 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-xl border-2 border-emerald-200 dark:border-emerald-900/50">
                <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 mb-3">ESTIMATED EVENT COST</p>
                <p className="text-5xl font-bold text-emerald-700 dark:text-emerald-400">{formatINR(result.eventCost)}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Insurance Plans Comparison</h3>
                <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                  <Table>
                    <TableHeader className="bg-slate-50 dark:bg-slate-800">
                      <TableRow className="border-b border-slate-200 dark:border-slate-700">
                        <TableHead className="font-semibold">Plan</TableHead>
                        <TableHead className="font-semibold">Annual Premium</TableHead>
                        <TableHead className="font-semibold">Expected Payout</TableHead>
                        <TableHead className="font-semibold">Deductible</TableHead>
                        <TableHead className="font-semibold">Coverage Cap</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.plans.map((plan, idx) => (
                        <TableRow key={plan.name} className={idx % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50 dark:bg-slate-800/50'}>
                          <TableCell className="font-semibold text-primary">{plan.name}</TableCell>
                          <TableCell className="font-medium">{formatINR(plan.annualPremium)}</TableCell>
                          <TableCell className="text-emerald-600 dark:text-emerald-400 font-medium">{formatINR(plan.expectedPayout)}</TableCell>
                          <TableCell className="text-orange-600 dark:text-orange-400 font-medium">{formatINR(plan.deductible)}</TableCell>
                          <TableCell className="font-medium">{formatINR(plan.coverageCap)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ML Insights Section */}
          {insights.riskProfile && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-blue-500" />
                <h2 className="text-3xl font-bold">ML-Powered Insights</h2>
              </div>

              {/* Risk Assessment */}
              <RiskAssessmentCard riskProfile={insights.riskProfile} />

              {/* Plan Recommendations */}
              {insights.recommendations.length > 0 && (
                <PlanRecommendationsCard recommendations={insights.recommendations} />
              )}

              {/* Anomaly Detection */}
              <AnomalyDetectionCard anomaly={insights.anomalyDetection} />

              {/* Trend Analysis */}
              {insights.temporalAnalysis && (
                <TrendAnalysisCard
                  trend={insights.temporalAnalysis.trend}
                  frequentFactors={insights.patterns?.commonPatterns.slice(0, 3).map((p: any) => p.pattern) || []}
                />
              )}

              {/* Model Status */}
              {insights.modelTrained && insights.modelMetrics && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-yellow-500" />
                      Machine Learning Model Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                        <p className="text-sm text-muted-foreground">Model Accuracy (MAPE)</p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {insights.modelMetrics.mape.toFixed(1)}%
                        </p>
                      </div>
                      <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                        <p className="text-sm text-muted-foreground">Root Mean Squared Error (RMSE)</p>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          ₹{(insights.modelMetrics.rmse / 1000).toFixed(1)}K
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      ✓ Model trained on {history.length} historical estimates. Predictions improve with more data.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </>
      )}

      {/* History */}
      {history.length > 0 && (
        <Card className="card-elevated border-2 border-blue-100 dark:border-blue-900/30">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Saved Estimates History</CardTitle>
                <CardDescription>{history.length} estimate(s) saved</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleExport} className="font-semibold">
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
                <Button variant="outline" size="sm" onClick={handleClearHistory} className="font-semibold">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {history.slice(0, 5).map((item, index) => (
                <div key={item.timestamp} className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800/50 dark:to-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
                  <div className="space-y-1 flex-1">
                    <p className="text-lg font-bold text-primary">{formatINR(item.eventCost)}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(item.timestamp).toLocaleString('en-IN')} • Age {item.inputs.age} • {item.inputs.treatmentType}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleRestore(item)} className="ml-auto">
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Restore
                  </Button>
                </div>
              ))}
            </div>
            {history.length > 5 && (
              <p className="text-sm text-muted-foreground mt-4 text-center">
                Showing 5 of {history.length} estimates. Export to CSV to see all.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Estimate;
