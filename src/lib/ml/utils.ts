/**
 * ML Utilities
 * Helper functions for ML operations and data preprocessing
 */

export interface MLMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
}

/**
 * Normalize numerical values to 0-1 range
 */
export function normalizeValue(value: number, min: number, max: number): number {
  if (max === min) return 0;
  return (value - min) / (max - min);
}

/**
 * Denormalize values from 0-1 range back to original
 */
export function denormalizeValue(normalizedValue: number, min: number, max: number): number {
  return normalizedValue * (max - min) + min;
}

/**
 * Calculate euclidean distance between two points (for clustering)
 */
export function euclideanDistance(point1: number[], point2: number[]): number {
  return Math.sqrt(
    point1.reduce((sum, val, i) => sum + Math.pow(val - point2[i], 2), 0)
  );
}

/**
 * Simple K-Means clustering implementation
 */
export function kMeansClustering(
  data: number[][],
  k: number,
  maxIterations: number = 100
): { clusters: number[][]; labels: number[] } {
  // Randomly initialize centroids
  const centroids: number[][] = [];
  const indices = new Set<number>();

  while (centroids.length < k) {
    const idx = Math.floor(Math.random() * data.length);
    if (!indices.has(idx)) {
      centroids.push([...data[idx]]);
      indices.add(idx);
    }
  }

  let labels = new Array(data.length).fill(0);
  let hasConverged = false;
  let iteration = 0;

  while (!hasConverged && iteration < maxIterations) {
    // Assign points to nearest centroid
    const newLabels = data.map(point => {
      let minDist = Infinity;
      let nearestCentroid = 0;

      centroids.forEach((centroid, i) => {
        const dist = euclideanDistance(point, centroid);
        if (dist < minDist) {
          minDist = dist;
          nearestCentroid = i;
        }
      });

      return nearestCentroid;
    });

    // Check for convergence
    hasConverged = JSON.stringify(newLabels) === JSON.stringify(labels);
    labels = newLabels;

    // Update centroids
    for (let i = 0; i < k; i++) {
      const clusterPoints = data.filter((_, idx) => labels[idx] === i);
      if (clusterPoints.length > 0) {
        const dim = data[0].length;
        for (let d = 0; d < dim; d++) {
          centroids[i][d] = clusterPoints.reduce((sum, p) => sum + p[d], 0) / clusterPoints.length;
        }
      }
    }

    iteration++;
  }

  return { clusters: centroids, labels };
}

/**
 * Calculate correlation coefficient between two arrays
 */
export function correlation(arr1: number[], arr2: number[]): number {
  if (arr1.length !== arr2.length) return 0;

  const n = arr1.length;
  const mean1 = arr1.reduce((a, b) => a + b) / n;
  const mean2 = arr2.reduce((a, b) => a + b) / n;

  let numerator = 0;
  let denom1 = 0;
  let denom2 = 0;

  for (let i = 0; i < n; i++) {
    const diff1 = arr1[i] - mean1;
    const diff2 = arr2[i] - mean2;
    numerator += diff1 * diff2;
    denom1 += diff1 * diff1;
    denom2 += diff2 * diff2;
  }

  const denominator = Math.sqrt(denom1 * denom2);
  return denominator === 0 ? 0 : numerator / denominator;
}

/**
 * Calculate mean absolute error
 */
export function meanAbsoluteError(actual: number[], predicted: number[]): number {
  if (actual.length !== predicted.length) return 0;
  return actual.reduce((sum, val, i) => sum + Math.abs(val - predicted[i]), 0) / actual.length;
}

/**
 * Calculate root mean squared error
 */
export function rootMeanSquaredError(actual: number[], predicted: number[]): number {
  if (actual.length !== predicted.length) return 0;
  const sumSquaredError = actual.reduce((sum, val, i) => sum + Math.pow(val - predicted[i], 2), 0);
  return Math.sqrt(sumSquaredError / actual.length);
}

/**
 * Calculate mean absolute percentage error
 */
export function meanAbsolutePercentageError(actual: number[], predicted: number[]): number {
  if (actual.length !== predicted.length) return 0;
  const mapeSum = actual.reduce((sum, val, i) => {
    if (val === 0) return sum; // Skip zero values
    return sum + Math.abs((val - predicted[i]) / val);
  }, 0);
  return (mapeSum / actual.length) * 100;
}

/**
 * Standardize an array (z-score normalization)
 */
export function standardize(arr: number[]): number[] {
  const mean = arr.reduce((a, b) => a + b) / arr.length;
  const variance = arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / arr.length;
  const stdDev = Math.sqrt(variance);

  return arr.map(val => (val - mean) / stdDev);
}

/**
 * Calculate percentile
 */
export function percentile(arr: number[], p: number): number {
  const sorted = [...arr].sort((a, b) => a - b);
  const index = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index % 1;

  if (lower === upper) {
    return sorted[lower];
  }

  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

/**
 * Detect outliers using IQR method
 */
export function detectOutliers(arr: number[]): { outliers: number[]; indices: number[] } {
  const sorted = [...arr].sort((a, b) => a - b);
  const q1 = percentile(sorted, 25);
  const q3 = percentile(sorted, 75);
  const iqr = q3 - q1;
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;

  const outliers: number[] = [];
  const indices: number[] = [];

  arr.forEach((val, idx) => {
    if (val < lowerBound || val > upperBound) {
      outliers.push(val);
      indices.push(idx);
    }
  });

  return { outliers, indices };
}

/**
 * Moving average calculation
 */
export function movingAverage(arr: number[], windowSize: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < arr.length; i++) {
    const window = arr.slice(Math.max(0, i - windowSize + 1), i + 1);
    result.push(window.reduce((a, b) => a + b) / window.length);
  }
  return result;
}

/**
 * Simple exponential smoothing
 */
export function exponentialSmoothing(arr: number[], alpha: number = 0.3): number[] {
  const result: number[] = [arr[0]];

  for (let i = 1; i < arr.length; i++) {
    result.push(alpha * arr[i] + (1 - alpha) * result[i - 1]);
  }

  return result;
}

/**
 * Sigmoid activation function
 */
export function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

/**
 * ReLU activation function
 */
export function relu(x: number): number {
  return Math.max(0, x);
}

/**
 * Calculate feature importance scores (variance-based)
 */
export function calculateFeatureImportance(features: number[][], target: number[]): number[] {
  const n = features.length;
  const m = features[0].length;
  const correlations: number[] = [];

  for (let i = 0; i < m; i++) {
    const featureColumn = features.map(row => row[i]);
    const corr = Math.abs(correlation(featureColumn, target));
    correlations.push(corr);
  }

  // Normalize to sum to 1
  const sum = correlations.reduce((a, b) => a + b, 1);
  return correlations.map(c => c / sum);
}
