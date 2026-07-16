export type RetryPolicyBody = {
  initialIntervalSeconds?: number;
  backoffCoefficient?: number;
  maximumIntervalSeconds?: number;
  maximumAttempts?: number;
  expirationIntervalSeconds?: number;
};
