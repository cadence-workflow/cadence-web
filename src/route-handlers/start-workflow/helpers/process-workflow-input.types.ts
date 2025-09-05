import {
  type JsonValue,
  type WorkerSDKLanguage,
} from '../start-workflow.types';

export type ProcessWorkflowInputParams = {
  input?: JsonValue[];
  workerSDKLanguage: WorkerSDKLanguage;
};
