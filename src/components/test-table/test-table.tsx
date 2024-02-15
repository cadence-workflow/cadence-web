'use client';
import { Table } from "baseui/table-semantic";
import { Tag, VARIANT } from "baseui/tag";

const TestTable = () => {
  const columns = ["Name", "Address", "Status"];
  const data = [
    ["Alice", <a href="http://example.com/alice">Link</a>, <Tag closeable={false} variant={VARIANT.solid}>Active</Tag>],
    ["Bob", <a href="http://example.com/bob">Link</a>, <Tag closeable={false} variant={VARIANT.solid} kind="negative">Inactive</Tag>]
  ];

  return (
    <Table columns={columns} data={data} />
  );
};

export default TestTable;