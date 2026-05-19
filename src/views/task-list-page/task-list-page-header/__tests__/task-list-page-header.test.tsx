import React from 'react';

import { render } from '@/test-utils/rtl';

import { mockTaskList } from '../../__fixtures__/mock-task-list';
import TaskListPageHeader from '../task-list-page-header';
import type { Props } from '../task-list-page-header.types';

jest.mock(
  '../../task-list-page-header-cluster-selector/task-list-page-header-cluster-selector',
  () =>
    function TaskListPageHeaderClusterSelector({
      cluster,
    }: {
      cluster: string;
    }) {
      return (
        <span data-testid="task-list-page-cluster-selector">{cluster}</span>
      );
    }
);

jest.mock(
  '@/views/shared/task-list-label/task-list-label',
  () =>
    function TaskListLabel({ taskList }: { taskList: { name: string } }) {
      return <div data-testid="task-list-label">{taskList.name}</div>;
    }
);

describe('TaskListPageHeader', () => {
  it('renders breadcrumbs with correct domain content and link', () => {
    const domain = 'test-domain';
    const cluster = 'test-cluster';
    const { getByText } = setup({ domain, cluster });

    const domainBreadcrumb = getByText(domain);
    expect(domainBreadcrumb).toBeInTheDocument();
    expect(domainBreadcrumb).toHaveAttribute(
      'href',
      `/domains/${encodeURIComponent(domain)}/${encodeURIComponent(cluster)}`
    );
  });

  it('renders cluster selector in breadcrumb', () => {
    const cluster = 'test-cluster';
    const { getByTestId } = setup({ cluster });

    expect(getByTestId('task-list-page-cluster-selector')).toHaveTextContent(
      cluster
    );
  });

  it('renders task list label as the last breadcrumb item', () => {
    const { getByTestId } = setup({});

    const label = getByTestId('task-list-label');
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent(mockTaskList.name);
  });

  it('renders Cadence Icon image with correct alt text', () => {
    const { getByAltText } = setup({});
    expect(getByAltText('Cadence Icon')).toBeInTheDocument();
  });
});

function setup({
  domain = 'example-domain',
  cluster = 'example-cluster',
  taskList = mockTaskList,
}: Partial<Props>) {
  return render(
    <TaskListPageHeader domain={domain} cluster={cluster} taskList={taskList} />
  );
}
