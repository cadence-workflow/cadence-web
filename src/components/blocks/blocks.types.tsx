export type Block = SectionBlock | DividerBlock | ActionsBlock;

export type SectionBlock = {
  type: 'section';
  format: string;
  componentOptions: {
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
  componentOptions: {
    type: string;
    text: string;
  };
  action: {
    type: 'signal';
    signal_name: string;
    signal_value?: Record<string, any>;
    workflow_id?: string;
    run_id?: string;
  };
};

export type Props = {
  blocks: Block[];
  domain: string;
  cluster: string;
  workflowId: string;
  runId: string;
};
