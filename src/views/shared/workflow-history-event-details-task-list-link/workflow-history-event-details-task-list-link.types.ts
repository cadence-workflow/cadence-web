export type Props = {
  cluster: string;
  domain: string;
  taskList: { name: string | null; kind: 'NORMAL' | 'STICKY' | null } | null;
};
