import { parse, transform as markdocTransform } from '@markdoc/markdoc';

import {
  workflowInputMarkdocSchema,
  workflowResultMarkdocSchema,
  workflowSearchAttributesMarkdocSchema,
} from '../markdoc-workflow-payload.markdoc';

const config = {
  tags: {
    input: workflowInputMarkdocSchema,
    result: workflowResultMarkdocSchema,
    searchAttributes: workflowSearchAttributesMarkdocSchema,
  },
};

describe('workflow payload Markdoc schemas', () => {
  it('transforms the input tag to a payload component of kind input', () => {
    expect(transform('{% input path="a.b" /%}')).toMatchObject({
      children: [
        {
          name: 'MarkdocWorkflowPayload',
          attributes: { path: 'a.b', kind: 'input' },
        },
      ],
    });
  });

  it('transforms the result tag to a payload component of kind result', () => {
    expect(transform('{% result workflowId="w" runId="r" /%}')).toMatchObject({
      children: [
        {
          name: 'MarkdocWorkflowPayload',
          attributes: { workflowId: 'w', runId: 'r', kind: 'result' },
        },
      ],
    });
  });

  it('transforms the searchAttributes tag to a payload component of kind searchAttributes', () => {
    expect(
      transform('{% searchAttributes name="CustomKeywordField" /%}')
    ).toMatchObject({
      children: [
        {
          name: 'MarkdocWorkflowPayload',
          attributes: { name: 'CustomKeywordField', kind: 'searchAttributes' },
        },
      ],
    });
  });
});

function transform(markdown: string) {
  return markdocTransform(parse(markdown), config);
}
