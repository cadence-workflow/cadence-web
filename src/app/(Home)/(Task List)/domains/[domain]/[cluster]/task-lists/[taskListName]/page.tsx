import TaskListPage from '@/views/task-list-page/task-list-page';
import { generateTaskListPageMetadata } from '@/views/task-list-page/task-list-page.metadata';
import { type Props } from '@/views/task-list-page/task-list-page.types';

export { generateTaskListPageMetadata as generateMetadata };

export default async function TaskListPageWrapper(props: {
  params: Promise<Props['params']>;
}) {
  return <TaskListPage params={await props.params} />;
}
