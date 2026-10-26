import { render, screen } from '@/test-utils/rtl';

import CadenceMarkdown from '../cadence-markdown';
import {
  CADENCE_MARKDOC_COMPONENTS,
  CADENCE_MARKDOC_TAGS,
} from '../cadence-markdown.constants';

jest.mock('@/components/markdown/markdown', () =>
  jest.fn(({ markdown, domain, cluster, workflowId, runId }) => (
    <div>
      Markdown Mock: {markdown} {domain} {cluster} {workflowId} {runId}
    </div>
  ))
);

describe(CadenceMarkdown.name, () => {
  it('registers the workflows tag', () => {
    expect(CADENCE_MARKDOC_TAGS).toHaveProperty('workflows');
    expect(CADENCE_MARKDOC_COMPONENTS).toHaveProperty('MarkdocWorkflowsList');
  });

  it('passes markdown and context props through', () => {
    setup();
    expect(screen.getByText('Markdown Mock: # hi d c w r')).toBeInTheDocument();
  });

  it('supplies the Cadence tags and components', () => {
    setup();
    const Markdown = jest.requireMock('@/components/markdown/markdown');
    expect(Markdown).toHaveBeenCalledWith(
      expect.objectContaining({
        extraTags: CADENCE_MARKDOC_TAGS,
        extraComponents: CADENCE_MARKDOC_COMPONENTS,
      }),
      expect.anything()
    );
  });
});

function setup() {
  render(
    <CadenceMarkdown
      markdown="# hi"
      domain="d"
      cluster="c"
      workflowId="w"
      runId="r"
    />
  );
}
