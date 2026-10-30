import { render, screen } from '@/test-utils/rtl';

import WorkflowHomeEmpty from '../workflow-home-empty';

jest.mock('@/components/error-panel/error-panel', () =>
  jest.fn(({ message, description, actions }) => (
    <div>
      <h1>{message}</h1>
      <div>{description}</div>
      {actions.map((action: { label: string; link: string }) => (
        <a key={action.label} href={action.link}>
          {action.label}
        </a>
      ))}
    </div>
  ))
);

describe(WorkflowHomeEmpty.name, () => {
  it('renders the message', () => {
    setup();
    expect(
      screen.getByText('This workflow has no home page')
    ).toBeInTheDocument();
  });

  it('links to the Markdoc guide', () => {
    setup();
    expect(screen.getByText('Markdoc guide')).toHaveAttribute('href', '/docs');
  });
});

function setup() {
  render(<WorkflowHomeEmpty />);
}
