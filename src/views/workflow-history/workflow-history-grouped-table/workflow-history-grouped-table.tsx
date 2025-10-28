import { styled } from './workflow-history-grouped-table.styles';

/**
 * TO be used in History v2
 */
export default function WorkflowHistoryGroupedTable() {
  return (
    <>
      <styled.TableHeader>
        <div>Id</div>
        <div>Event group</div>
        <div>Status</div>
        <div>Time</div>
        <div>Duration</div>
        <div>Details</div>
      </styled.TableHeader>
      {/* TODO @adhityamamallan: Add table body with Virtuoso  with new design*/}
    </>
  );
}
