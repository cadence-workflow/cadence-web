import { type Metadata } from 'next';

import TaskListPage from '@/views/task-list-page/task-list-page';

type Props = {
  params: Promise<{ domain: string; cluster: string; taskListName: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { domain, taskListName } = await params;
  return { title: `${domain} - ${taskListName}` };
}

export default TaskListPage;
