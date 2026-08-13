// `as const` keeps the values as literal types so `z.nativeEnum(BATCH_ACTION_TYPE)`
// (in get-batch-action-input-from-history) infers the precise BatchActionType
// union instead of widening to `string`.
export const BATCH_ACTION_TYPE = {
  cancel: 'cancel',
  terminate: 'terminate',
  signal: 'signal',
} as const;
