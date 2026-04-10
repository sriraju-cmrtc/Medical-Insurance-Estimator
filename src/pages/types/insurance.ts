export interface EstimateInputs {
  age: number;
  sex: 'male' | 'female';
  bmi: number;
  children: number;
  smoker: boolean;
  medicalConditions: string[];
  accidentSeverity: 'none' | 'minor' | 'moderate' | 'severe';
  hospitalizationDays: number;
  treatmentType: 'outpatient' | 'surgery' | 'icu';
  location: 'metro' | 'urban' | 'rural';
}

export interface EstimateResult {
  eventCost: number;
  plans: InsurancePlan[];
  timestamp: number;
  inputs: EstimateInputs;
}

export interface InsurancePlan {
  name: string;
  annualPremium: number;
  expectedPayout: number;
  deductible: number;
  coverageCap: number;
}
