export type TaskListHandlerKind = 'workers' | 'decision' | 'activity';

export type Props = {
  cluster: string;
  domain: string;
  taskList: {
    name: string | null;
    kind: 'NORMAL' | 'STICKY' | 'EPHEMERAL' | null;
  } | null;
  handlerKind?: TaskListHandlerKind;
};
