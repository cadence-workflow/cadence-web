import { type Level } from 'pino';

// To add custom levels, change this to a union type with your custom levels
export type CustomLevels = never;

export type LogLevel = Level | CustomLevels;
