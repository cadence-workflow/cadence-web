export type EventExpansionState = Record<string, boolean> | true;

export type ToggleIsExpandAllEvents = () => void;

export type GetIsEventExpanded = (eventId: string) => boolean;

export type OnEventExpandToggle = (eventId: string) => void;

export type ToggleIsEventExpanded = (eventId: string) => void;
