import React, { createElement } from 'react';

import { render, screen } from '@/test-utils/rtl';

import ListTable from '../list-table';
import { type ListTableItem } from '../list-table.types';

type TestObject = {
  valueA: string;
  valueB: number;
  valueC: Array<string>;
};

const mockTestObject: TestObject = {
  valueA: 'mock-value',
  valueB: 1234,
  valueC: ['mock-value-c1', 'mock-value-c2'],
};

const MockKey3Component = (obj: TestObject) => {
  return (
    <div>
      {obj.valueC.map((val) => (
        <div key={val} data-testid={val} />
      ))}
    </div>
  );
};

const mockListTableConfig: Array<ListTableItem<TestObject>> = [
  {
    key: 'key1',
    label: 'Key 1',
    renderValue: (obj: TestObject) => obj.valueA + '-with-suffix',
  },
  {
    key: 'key2',
    label: 'Key 2',
    renderValue: (obj: TestObject) => obj.valueB + 5,
  },
  {
    key: 'key3',
    label: 'Key 3',
    renderValue: (obj: TestObject) => createElement(MockKey3Component, obj),
  },
];

describe(ListTable.name, () => {
  it('renders correctly', () => {
    render(
      <ListTable data={mockTestObject} listTableConfig={mockListTableConfig} />
    );

    expect(screen.getByText('Key 1:')).toBeInTheDocument();
    expect(screen.getByText('Key 2:')).toBeInTheDocument();
    expect(screen.getByText('Key 3:')).toBeInTheDocument();

    expect(screen.getByText('mock-value-with-suffix')).toBeInTheDocument();
    expect(screen.getByText('1239')).toBeInTheDocument();
    expect(screen.getByTestId('mock-value-c1')).toBeInTheDocument();
    expect(screen.getByTestId('mock-value-c2')).toBeInTheDocument();
  });
});
