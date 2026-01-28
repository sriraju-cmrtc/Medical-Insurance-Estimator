import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { calculateInsuranceCost, formatINR } from '@/lib/estimator';
import { Info } from 'lucide-react';

const Educate = () => {
  const [age, setAge] = useState(30);
  const [bmi, setBmi] = useState(22);
  const [location, setLocation] = useState<'metro' | 'urban' | 'rural'>('urban');
  const [accident, setAccident] = useState<'none' | 'minor' | 'moderate' | 'severe'>('none');

  // Generate data for age impact
  const ageData = Array.from({ length: 9 }, (_, i) => {
    const ageValue = 20 + i * 10;
    const result = calculateInsuranceCost({
      age: ageValue,
      sex: 'male',
      bmi: 22,
      children: 0,
      smoker: false,
      medicalConditions: [],
      accidentSeverity: 'none',
      hospitalizationDays: 3,
      treatmentType: 'surgery',
      location: 'urban'
    });
    return {
      age: ageValue,
      cost: result.eventCost
    };
  });

  // Generate data for BMI impact
  const bmiData = Array.from({ length: 10 }, (_, i) => {
    const bmiValue = 18 + i * 2;
    const result = calculateInsuranceCost({
      age: 40,
      sex: 'male',
      bmi: bmiValue,
      children: 0,
      smoker: false,
      medicalConditions: [],
      accidentSeverity: 'none',
      hospitalizationDays: 3,
      treatmentType: 'surgery',
      location: 'urban'
    });
    return {
      bmi: bmiValue,
      cost: result.eventCost
    };
  });

  // Calculate current scenario
  const currentResult = calculateInsuranceCost({
    age,
    sex: 'male',
    bmi,
    children: 0,
    smoker: false,
    medicalConditions: [],
    accidentSeverity: accident,
    hospitalizationDays: 5,
    treatmentType: 'surgery',
    location
  });

  return (
    <div className="space-y-6">
      {/* Introduction */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Understanding Insurance Costs</CardTitle>
          <CardDescription>Learn how different factors impact your medical insurance pricing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <InfoSection
              title="Age Factor"
              description="Insurance costs increase significantly with age. Older individuals typically require more medical care and face higher health risks, leading to higher premiums."
            />
            <InfoSection
              title="BMI (Body Mass Index)"
              description="Your BMI affects insurance costs as it's an indicator of potential health risks. Higher BMI values can indicate increased risk for conditions like diabetes and heart disease."
            />
            <InfoSection
              title="Location Impact"
              description="Medical costs vary significantly based on location. Metro cities have higher treatment costs compared to urban and rural areas due to infrastructure and specialist availability."
            />
            <InfoSection
              title="Accident Severity"
              description="Accidents requiring medical attention can significantly impact costs. Severe accidents requiring extensive treatment and long hospitalization periods result in much higher expenses."
            />
          </div>
        </CardContent>
      </Card>

      {/* Interactive Demo */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Interactive Cost Explorer</CardTitle>
          <CardDescription>Adjust parameters to see how they affect insurance costs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Age: {age} years</Label>
                <Slider
                  value={[age]}
                  onValueChange={([value]) => setAge(value)}
                  min={18}
                  max={80}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <Label>BMI: {bmi}</Label>
                <Slider
                  value={[bmi]}
                  onValueChange={([value]) => setBmi(value)}
                  min={15}
                  max={40}
                  step={0.5}
                />
              </div>

              <div className="space-y-2">
                <Label>Location</Label>
                <Select value={location} onValueChange={(value: any) => setLocation(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="metro">Metro City</SelectItem>
                    <SelectItem value="urban">Urban</SelectItem>
                    <SelectItem value="rural">Rural</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Accident Severity</Label>
                <Select value={accident} onValueChange={(value: any) => setAccident(value)}>
                  <SelectTrigger>
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
            </div>

            <div className="space-y-4">
              <div className="p-6 bg-primary/10 rounded-lg text-center">
                <p className="text-sm text-muted-foreground mb-2">Estimated Cost</p>
                <p className="text-3xl font-bold text-primary">{formatINR(currentResult.eventCost)}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Premium Breakdown:</p>
                {currentResult.plans.map((plan) => (
                  <div key={plan.name} className="flex justify-between p-2 bg-secondary/20 rounded">
                    <span className="text-sm">{plan.name}</span>
                    <span className="text-sm font-medium">{formatINR(plan.annualPremium)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Cost vs Age</CardTitle>
            <CardDescription>How age affects insurance costs</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={ageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="age" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                  formatter={(value: number) => formatINR(value)}
                />
                <Legend />
                <Line type="monotone" dataKey="cost" stroke="hsl(var(--primary))" strokeWidth={2} name="Event Cost" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Cost vs BMI</CardTitle>
            <CardDescription>How BMI impacts insurance pricing</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={bmiData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="bmi" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                  formatter={(value: number) => formatINR(value)}
                />
                <Legend />
                <Line type="monotone" dataKey="cost" stroke="hsl(var(--chart-2))" strokeWidth={2} name="Event Cost" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface InfoSectionProps {
  title: string;
  description: string;
}

const InfoSection = ({ title, description }: InfoSectionProps) => {
  return (
    <div className="flex gap-3 p-3 bg-secondary/20 rounded-lg">
      <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
      <div>
        <h4 className="font-medium mb-1">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export default Educate;
