import getOptionsFromLabelMap from '../get-options-from-label-map';

const MOCK_LABEL_MAP = {
  opt1: 'Option 1',
  opt2: 'Option 2',
  opt3: 'Option 3',
};

describe(getOptionsFromLabelMap.name, () => {
  it('returns array of id-label pairs for a label map', () => {
    expect(getOptionsFromLabelMap(MOCK_LABEL_MAP)).toEqual([
      {
        id: 'opt1',
        label: 'Option 1',
      },
      {
        id: 'opt2',
        label: 'Option 2',
      },
      {
        id: 'opt3',
        label: 'Option 3',
      },
    ]);
  });
});
