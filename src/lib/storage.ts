import { EstimateResult } from '@/types/insurance';

const STORAGE_KEY = 'insurance_estimates_history';

export function saveEstimate(result: EstimateResult): void {
  const history = getHistory();
  history.unshift(result);
  // Keep only last 20 estimates
  if (history.length > 20) history.pop();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function getHistory(): EstimateResult[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function exportToCSV(history: EstimateResult[]): void {
  const headers = [
    'Date',
    'Age',
    'Sex',
    'BMI',
    'Children',
    'Smoker',
    'Accident',
    'Hospitalization Days',
    'Treatment',
    'Location',
    'Event Cost (INR)',
    'Basic Premium',
    'Standard Premium',
    'Premium Premium'
  ];
  
  const rows = history.map(result => [
    new Date(result.timestamp).toLocaleDateString('en-IN'),
    result.inputs.age,
    result.inputs.sex,
    result.inputs.bmi,
    result.inputs.children,
    result.inputs.smoker ? 'Yes' : 'No',
    result.inputs.accidentSeverity,
    result.inputs.hospitalizationDays,
    result.inputs.treatmentType,
    result.inputs.location,
    result.eventCost,
    result.plans[0].annualPremium,
    result.plans[1].annualPremium,
    result.plans[2].annualPremium
  ]);
  
  const csv = [headers, ...rows]
    .map(row => row.join(','))
    .join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `insurance_estimates_${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
