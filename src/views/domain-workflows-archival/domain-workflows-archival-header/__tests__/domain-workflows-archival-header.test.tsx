import { render, screen } from '@/test-utils/rtl';

import * as useListWorkflowsModule from '@/views/shared/hooks/use-list-workflows';
import { type WorkflowsHeaderInputType } from '@/views/shared/workflows-header/workflows-header.types';

import { mockDomainPageQueryParamsValues } from '../../../domain-page/__fixtures__/domain-page-query-params';
import * as useArchivalInputTypeModule from '../../hooks/use-archival-input-type';
import DomainWorkflowsArchivalHeader from '../domain-workflows-archival-header';

jest.useFakeTimers().setSystemTime(new Date('2023-05-25'));

const mockSetQueryParams = jest.fn();
jest.mock('@/hooks/use-page-query-params/use-page-query-params', () =>
  jest.fn(() => [mockDomainPageQueryParamsValues, mockSetQueryParams])
);

jest.mock('@/views/shared/workflows-header/workflows-header', () =>
  jest.fn(({ forceQueryInputOnly }) => (
    <div>
      <div>Workflows Header</div>
      <div>
        Force query input only: {forceQueryInputOnly ? 'true' : 'false'}
      </div>
    </div>
  ))
);

jest.mock('@/views/shared/hooks/use-list-workflows', () =>
  jest.fn(() => ({
    refetch: jest.fn(),
    isFetching: false,
  }))
);
jest.mock('../../hooks/use-archival-input-type');

describe(DomainWorkflowsArchivalHeader.name, () => {
  it('renders workflows header with query input only', async () => {
    setup({});
    expect(screen.getByText('Workflows Header')).toBeInTheDocument();
  });

  it('should pass correct props to workflows header', async () => {
    setup({
      forceQueryInputOnly: false,
    });
    expect(
      screen.getByText('Force query input only: false')
    ).toBeInTheDocument();
  });

  it('should pass inputType to useListWorkflows', async () => {
    setup({
      inputType: 'query',
    });
    const useListWorkflowsSpy = jest.spyOn(useListWorkflowsModule, 'default');
    expect(useListWorkflowsSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        inputType: 'query',
      })
    );
  });
});

const setup = ({
  forceQueryInputOnly = true,
  inputType = 'query',
}: {
  forceQueryInputOnly?: boolean;
  inputType?: WorkflowsHeaderInputType;
}) => {
  const useArchivalInputTypeSpy = jest.spyOn(
    useArchivalInputTypeModule,
    'default'
  );

  useArchivalInputTypeSpy.mockReturnValue({
    forceQueryInputOnly,
    inputType,
  });

  return render(
    <DomainWorkflowsArchivalHeader
      domain="mock_domain"
      cluster="mock_cluster"
      timeRangeStart="mock-time-range-start"
      timeRangeEnd="mock-time-range-end"
    />
  );
};
