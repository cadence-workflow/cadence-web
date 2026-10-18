import TaskListPage from '@/views/task-list-page/task-list-page';
import { type Props } from '@/views/task-list-page/task-list-page.types';

export default async function TaskListPageWrapper(props: {
  params: Promise<Props['params']>;
}) {
  return <TaskListPage params={await props.params} />;
}
