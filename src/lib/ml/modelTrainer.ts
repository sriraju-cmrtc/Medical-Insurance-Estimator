import * as tf from '@tensorflow/tfjs';
import { EstimateInputs, EstimateResult } from '@/types/insurance';

/**
 * ML Model Trainer - Creates and trains a neural network for insurance cost prediction
 * Uses historical data to improve predictions over time
 */

export class InsuranceMLModel {
  private model: tf.Sequential | null = null;
  private inputScaler = { min: 0, max: 1 };
  private outputScaler = { min: 0, max: 1 };
  private isModelTrained = false;

  constructor() {
    this.initializeModel();
  }

  /**
   * Initialize the neural network architecture
   */
  private initializeModel() {
    this.model = tf.sequential({
      layers: [
        // Input layer
        tf.layers.dense({
          inputShape: [12], // 12 input features
          units: 64,
          activation: 'relu',
          name: 'input_layer'
        }),
        // Batch normalization for stable training
        tf.layers.batchNormalization(),
        // Dropout to prevent overfitting
        tf.layers.dropout({ rate: 0.3 }),
        // Hidden layers
        tf.layers.dense({
          units: 128,
          activation: 'relu',
          name: 'hidden_1',
          kernelRegularizer: tf.regularizers.l2({ l2: 0.01 })
        }),
        tf.layers.batchNormalization(),
        tf.layers.dropout({ rate: 0.3 }),
        tf.layers.dense({
          units: 64,
          activation: 'relu',
          name: 'hidden_2'
        }),
        tf.layers.batchNormalization(),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({
          units: 32,
          activation: 'relu',
          name: 'hidden_3'
        }),
        // Output layer
        tf.layers.dense({
          units: 1,
          activation: 'linear',
          name: 'output'
        })
      ]
    });

    // Compile with Adam optimizer
    this.model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError',
      metrics: ['mae', 'mse']
    });
  }

  /**
   * Encode inputs to feature vectors
   */
  private encodeInputs(inputs: EstimateInputs): number[] {
    const sexEncoding = inputs.sex === 'male' ? 1 : 0;
    const smokerEncoding = inputs.smoker ? 1 : 0;
    const treatmentEncoding = {
      outpatient: 0.3,
      surgery: 0.7,
      icu: 1.0
    }[inputs.treatmentType];
    const locationEncoding = {
      rural: 0.3,
      urban: 0.6,
      metro: 1.0
    }[inputs.location];
    const accidentEncoding = {
      none: 0,
      minor: 0.3,
      moderate: 0.6,
      severe: 1.0
    }[inputs.accidentSeverity];

    return [
      inputs.age / 100, // Normalize age
      sexEncoding,
      inputs.bmi / 40, // Normalize BMI
      inputs.children / 5, // Normalize children count
      smokerEncoding,
      inputs.medicalConditions.length / 5, // Normalize conditions count
      accidentEncoding,
      inputs.hospitalizationDays / 365, // Normalize days
      treatmentEncoding,
      locationEncoding,
      inputs.medicalConditions.includes('Diabetes') ? 1 : 0,
      inputs.medicalConditions.includes('Heart Disease') ? 1 : 0
    ];
  }

  /**
   * Train the model with historical data
   */
  async trainOnHistory(estimates: EstimateResult[]): Promise<void> {
    if (estimates.length < 5) {
      console.log('Not enough data to train model (minimum 5 samples required)');
      return;
    }

    try {
      const inputs = estimates.map(e => this.encodeInputs(e.inputs));
      const outputs = estimates.map(e => [e.eventCost]);

      // Create tensors
      const xs = tf.tensor2d(inputs);
      const ys = tf.tensor2d(outputs);

      // Calculate scaling factors
      const xMin = xs.min().dataSync()[0];
      const xMax = xs.max().dataSync()[0];
      const yMin = ys.min().dataSync()[0];
      const yMax = ys.max().dataSync()[0];

      this.inputScaler = { min: xMin, max: xMax };
      this.outputScaler = { min: yMin, max: yMax };

      // Normalize data
      const xsNorm = xs.sub(xMin).div(xMax - xMin || 1);
      const ysNorm = ys.sub(yMin).div(yMax - yMin || 1);

      // Train the model
      await this.model?.fit(xsNorm, ysNorm, {
        epochs: 50,
        batchSize: 4,
        validationSplit: 0.2,
        verbose: 0,
        shuffle: true
      });

      this.isModelTrained = true;

      // Cleanup
      xs.dispose();
      ys.dispose();
      xsNorm.dispose();
      ysNorm.dispose();

      console.log('Model trained successfully with', estimates.length, 'samples');
    } catch (error) {
      console.error('Error training model:', error);
    }
  }

  /**
   * Predict insurance cost using the trained model
   */
  predictCost(inputs: EstimateInputs): number {
    if (!this.model || !this.isModelTrained) {
      return 0; // Return 0 if model not trained
    }

    try {
      const encodedInputs = this.encodeInputs(inputs);
      const xs = tf.tensor2d([encodedInputs]);

      // Normalize inputs
      const xsNorm = xs.sub(this.inputScaler.min).div(
        this.inputScaler.max - this.inputScaler.min || 1
      );

      // Make prediction
      const prediction = this.model.predict(xsNorm) as tf.Tensor;
      const denormalizedPrediction =
        prediction
          .mul(this.outputScaler.max - this.outputScaler.min)
          .add(this.outputScaler.min);

      const result = denormalizedPrediction.dataSync()[0];

      // Cleanup
      xs.dispose();
      xsNorm.dispose();
      prediction.dispose();
      denormalizedPrediction.dispose();

      return Math.max(0, result); // Ensure non-negative result
    } catch (error) {
      console.error('Prediction error:', error);
      return 0;
    }
  }

  /**
   * Get model accuracy metrics on validation data
   */
  async getModelMetrics(estimates: EstimateResult[]): Promise<{ mape: number; rmse: number } | null> {
    if (estimates.length < 5) return null;

    try {
      const predictions = estimates.map(e => this.predictCost(e.inputs));
      const actual = estimates.map(e => e.eventCost);

      // Calculate MAPE (Mean Absolute Percentage Error)
      let mapeSum = 0;
      let rmseSum = 0;

      for (let i = 0; i < actual.length; i++) {
        const error = Math.abs(actual[i] - predictions[i]);
        mapeSum += error / actual[i];
        rmseSum += error * error;
      }

      const mape = (mapeSum / actual.length) * 100;
      const rmse = Math.sqrt(rmseSum / actual.length);

      return { mape, rmse };
    } catch (error) {
      console.error('Error calculating metrics:', error);
      return null;
    }
  }

  /**
   * Dispose the model to free memory
   */
  dispose() {
    if (this.model) {
      this.model.dispose();
      this.model = null;
      this.isModelTrained = false;
    }
  }

  /**
   * Check if model is trained
   */
  isTrained(): boolean {
    return this.isModelTrained;
  }
}

// Singleton instance
let modelInstance: InsuranceMLModel | null = null;

export function getMLModel(): InsuranceMLModel {
  if (!modelInstance) {
    modelInstance = new InsuranceMLModel();
  }
  return modelInstance;
}
