import { EstimateInputs, EstimateResult, InsurancePlan } from '@/types/insurance';

export function calculateInsuranceCost(inputs: EstimateInputs): EstimateResult {
  // Base cost calculation
  let baseCost = 50000; // Base hospitalization cost in INR
  
  // Age factor
  if (inputs.age > 60) baseCost *= 2.5;
  else if (inputs.age > 45) baseCost *= 1.8;
  else if (inputs.age > 30) baseCost *= 1.3;
  
  // BMI factor
  if (inputs.bmi > 30) baseCost *= 1.4;
  else if (inputs.bmi > 25) baseCost *= 1.2;
  
  // Smoker penalty
  if (inputs.smoker) baseCost *= 1.5;
  
  // Medical conditions
  baseCost *= (1 + inputs.medicalConditions.length * 0.15);
  
  // Accident severity
  const accidentMultipliers = {
    none: 0,
    minor: 25000,
    moderate: 100000,
    severe: 350000
  };
  baseCost += accidentMultipliers[inputs.accidentSeverity];
  
  // Hospitalization days
  baseCost += inputs.hospitalizationDays * 5000;
  
  // Treatment type
  const treatmentMultipliers = {
    outpatient: 0.3,
    surgery: 2.5,
    icu: 4.0
  };
  baseCost *= treatmentMultipliers[inputs.treatmentType];
  
  // Location factor
  const locationMultipliers = {
    metro: 1.4,
    urban: 1.0,
    rural: 0.7
  };
  baseCost *= locationMultipliers[inputs.location];
  
  // Children factor (minimal impact)
  baseCost *= (1 + inputs.children * 0.05);
  
  const eventCost = Math.round(baseCost);
  
  // Generate insurance plans
  const plans: InsurancePlan[] = [
    {
      name: 'Basic',
      annualPremium: Math.round(eventCost * 0.08),
      expectedPayout: Math.round(eventCost * 0.6),
      deductible: Math.round(eventCost * 0.15),
      coverageCap: Math.round(eventCost * 2)
    },
    {
      name: 'Standard',
      annualPremium: Math.round(eventCost * 0.15),
      expectedPayout: Math.round(eventCost * 0.85),
      deductible: Math.round(eventCost * 0.10),
      coverageCap: Math.round(eventCost * 5)
    },
    {
      name: 'Premium',
      annualPremium: Math.round(eventCost * 0.25),
      expectedPayout: Math.round(eventCost * 1.0),
      deductible: Math.round(eventCost * 0.05),
      coverageCap: Math.round(eventCost * 10)
    }
  ];
  
  return {
    eventCost,
    plans,
    timestamp: Date.now(),
    inputs
  };
}

export function formatINR(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN');
}
