export type BlocksData = {
  cadenceResponseType: 'formattedData';
  format: 'blocks';
  blocks: Block[];
};

export type Block = SectionBlock | DividerBlock | ActionsBlock;

export type SectionBlock = {
  type: 'section';
  format: string;
  text: {
    type: string;
    text: string;
  };
};

export type DividerBlock = {
  type: 'divider';
};

export type ActionsBlock = {
  type: 'actions';
  elements: ButtonElement[];
};

export type ButtonElement = {
  type: 'button';
  text: {
    type: string;
    text: string;
  };
  signal: string;
  signal_value?: Record<string, any>;
  workflow_id?: string;
  run_id?: string;
};

export type Props = {
  blocks: BlocksData;
  domain: string;
  cluster: string;
  workflowId: string;
  runId: string;
};
