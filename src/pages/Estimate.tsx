import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calculator, Download, Trash2, RotateCcw } from 'lucide-react';
import { EstimateInputs, EstimateResult } from '@/types/insurance';
import { calculateInsuranceCost, formatINR } from '@/lib/estimator';
import { saveEstimate, getHistory, clearHistory, exportToCSV } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

const MEDICAL_CONDITIONS = ['Diabetes', 'Hypertension', 'Heart Disease', 'Asthma', 'Arthritis'];

const Estimate = () => {
  const { toast } = useToast();
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
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Insurance Cost Estimator</CardTitle>
          <CardDescription>Enter your details to get an instant estimate</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Personal Info */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={inputs.age}
                onChange={(e) => setInputs({ ...inputs, age: parseInt(e.target.value) || 0 })}
                min="0"
                max="120"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sex">Sex</Label>
              <Select value={inputs.sex} onValueChange={(value: any) => setInputs({ ...inputs, sex: value })}>
                <SelectTrigger id="sex">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bmi">BMI</Label>
              <Input
                id="bmi"
                type="number"
                step="0.1"
                value={inputs.bmi}
                onChange={(e) => setInputs({ ...inputs, bmi: parseFloat(e.target.value) || 0 })}
                min="10"
                max="50"
              />
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="children">Number of Children</Label>
              <Input
                id="children"
                type="number"
                value={inputs.children}
                onChange={(e) => setInputs({ ...inputs, children: parseInt(e.target.value) || 0 })}
                min="0"
                max="10"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Select value={inputs.location} onValueChange={(value: any) => setInputs({ ...inputs, location: value })}>
                <SelectTrigger id="location">
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

          {/* Smoker */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="smoker"
              checked={inputs.smoker}
              onCheckedChange={(checked) => setInputs({ ...inputs, smoker: checked as boolean })}
            />
            <Label htmlFor="smoker" className="cursor-pointer">I am a smoker</Label>
          </div>

          {/* Medical Conditions */}
          <div className="space-y-2">
            <Label>Medical Conditions</Label>
            <div className="grid md:grid-cols-3 gap-3">
              {MEDICAL_CONDITIONS.map((condition) => (
                <div key={condition} className="flex items-center space-x-2">
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
                  />
                  <Label htmlFor={condition} className="cursor-pointer text-sm">{condition}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Treatment Details */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="accident">Accident Severity</Label>
              <Select value={inputs.accidentSeverity} onValueChange={(value: any) => setInputs({ ...inputs, accidentSeverity: value })}>
                <SelectTrigger id="accident">
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
              <Label htmlFor="hospitalization">Hospitalization Days</Label>
              <Input
                id="hospitalization"
                type="number"
                value={inputs.hospitalizationDays}
                onChange={(e) => setInputs({ ...inputs, hospitalizationDays: parseInt(e.target.value) || 0 })}
                min="0"
                max="365"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="treatment">Treatment Type</Label>
              <Select value={inputs.treatmentType} onValueChange={(value: any) => setInputs({ ...inputs, treatmentType: value })}>
                <SelectTrigger id="treatment">
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

          <div className="flex gap-3">
            <Button onClick={handleCalculate} className="flex-1" size="lg">
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
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Estimate Results</CardTitle>
            <CardDescription>Based on your inputs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center p-6 bg-primary/10 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Estimated Event Cost</p>
              <p className="text-4xl font-bold text-primary">{formatINR(result.eventCost)}</p>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plan</TableHead>
                  <TableHead>Annual Premium</TableHead>
                  <TableHead>Expected Payout</TableHead>
                  <TableHead>Deductible</TableHead>
                  <TableHead>Coverage Cap</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.plans.map((plan) => (
                  <TableRow key={plan.name}>
                    <TableCell className="font-medium">{plan.name}</TableCell>
                    <TableCell>{formatINR(plan.annualPremium)}</TableCell>
                    <TableCell>{formatINR(plan.expectedPayout)}</TableCell>
                    <TableCell>{formatINR(plan.deductible)}</TableCell>
                    <TableCell>{formatINR(plan.coverageCap)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* History */}
      {history.length > 0 && (
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Saved Estimates</CardTitle>
                <CardDescription>{history.length} estimate(s) in history</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleExport}>
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
                <Button variant="outline" size="sm" onClick={handleClearHistory}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {history.slice(0, 5).map((item, index) => (
                <div key={item.timestamp} className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{formatINR(item.eventCost)}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(item.timestamp).toLocaleString('en-IN')} • 
                      Age {item.inputs.age} • {item.inputs.treatmentType}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleRestore(item)}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Estimate;
