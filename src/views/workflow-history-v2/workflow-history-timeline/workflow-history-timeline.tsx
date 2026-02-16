import { useMemo } from 'react';

import { AxisTop } from '@visx/axis';
import { Group } from '@visx/group';
import { PatternLines } from '@visx/pattern';
import { ParentSize } from '@visx/responsive';
import { scaleLinear } from '@visx/scale';
import { Bar } from '@visx/shape';
import { StatefulPopover } from 'baseui/popover';
import { Virtuoso } from 'react-virtuoso';

import useStyletronClasses from '@/hooks/use-styletron-classes';
import WorkflowHistoryEventStatusBadge from '@/views/workflow-history/workflow-history-event-status-badge/workflow-history-event-status-badge';

import workflowHistoryEventFilteringTypeColorsConfig from '../config/workflow-history-event-filtering-type-colors.config';
import WorkflowHistoryTimelineEventGroup from '../workflow-history-timeline-event-group/workflow-history-timeline-event-group';

import formatTickDuration from './helpers/format-tick-duration';
import getTimelineMaxTimeMs from './helpers/get-timeline-max-time-ms';
import getTimelineRowFromEventGroup from './helpers/get-timeline-row-from-event-group';
import {
  ROW_HEIGHT_PX,
  TIMELINE_LABEL_COLUMN_WIDTH,
  TIMELINE_SIDE_PADDING,
} from './workflow-history-timeline.constants';
import {
  cssStyles,
  styled,
  overrides,
} from './workflow-history-timeline.styles';
import {
  type Props,
  type TimelineRow,
} from './workflow-history-timeline.types';

export default function WorkflowHistoryTimeline({
  eventGroupsEntries,
  workflowStartTimeMs,
  workflowCloseTimeMs,
  onClickShowInTable,
  decodedPageUrlParams,
  virtuosoRef,
  itemToHighlightId,
}: Props) {
  const { cls, theme } = useStyletronClasses(cssStyles);

  const timelineRows = useMemo(
    () =>
      eventGroupsEntries
        .map(([groupId, group]) =>
          getTimelineRowFromEventGroup(groupId, group, workflowStartTimeMs)
        )
        .filter((row): row is TimelineRow => row !== undefined),
    [eventGroupsEntries, workflowStartTimeMs]
  );

  const maybeHighlightedRowIndex = useMemo(() => {
    const foundIndex = timelineRows.findIndex(
      ({ id }) => id === itemToHighlightId
    );

    if (foundIndex === -1) return undefined;
    return foundIndex;
  }, [timelineRows, itemToHighlightId]);

  return (
    <ParentSize>
      {({ width: viewportWidth = 800 }) => {
        const contentWidth = Math.max(
          0,
          viewportWidth - TIMELINE_LABEL_COLUMN_WIDTH
        );

        const domain = {
          min: 0,
          max:
            getTimelineMaxTimeMs(workflowCloseTimeMs, timelineRows) -
            workflowStartTimeMs,
        };

        const dataPointsPadding =
          (domain.max - domain.min) * TIMELINE_SIDE_PADDING;

        const xScale = scaleLinear({
          domain: [
            domain.min - dataPointsPadding,
            domain.max + dataPointsPadding,
          ],
          range: [0, contentWidth],
        });

        const baseTickCount = Math.min(10, Math.floor(contentWidth / 60));

        return (
          <styled.Container>
            <styled.HeaderRow>
              <styled.HeaderLabelCell>Event group</styled.HeaderLabelCell>
              <styled.HeaderTimelineCell>
                <styled.HeaderTimelineViewport>
                  <styled.HeaderTimelineContent $widthPx={contentWidth}>
                    <styled.AxisSvg
                      width={contentWidth}
                      height={20}
                      key={contentWidth}
                    >
                      <Group left={0} top={30}>
                        <AxisTop
                          top={0}
                          scale={xScale}
                          hideTicks
                          hideAxisLine
                          numTicks={baseTickCount}
                          tickFormat={(value) =>
                            formatTickDuration(Number(value))
                          }
                          tickLabelProps={() => ({
                            fill: theme.colors.contentSecondary,
                            fontSize: 10,
                            fontWeight: 500,
                            fontFamily: theme.typography.LabelXSmall.fontFamily,
                            textAnchor: 'middle',
                            dy: '-1em',
                            width: 200,
                            overflow: 'visible',
                          })}
                        />
                      </Group>
                    </styled.AxisSvg>
                  </styled.HeaderTimelineContent>
                </styled.HeaderTimelineViewport>
              </styled.HeaderTimelineCell>
            </styled.HeaderRow>
            <Virtuoso
              ref={virtuosoRef}
              style={{ flex: 1 }}
              data={timelineRows}
              initialTopMostItemIndex={maybeHighlightedRowIndex}
              itemContent={(index, row) => {
                const isEven = index % 2 === 0;
                const isRunning = row.group.hasMissingEvents ?? false;
                const color =
                  workflowHistoryEventFilteringTypeColorsConfig[row.groupType]
                    .content;

                const rowStart = xScale(row.startTimeMs - workflowStartTimeMs);
                const rowEnd = xScale(row.endTimeMs - workflowStartTimeMs);

                const popoverOffset = (rowStart + rowEnd - contentWidth) / 2;
                const animateOnEnter = row.id === itemToHighlightId;

                return (
                  <styled.RowContainer
                    $isEven={isEven}
                    $animateOnEnter={animateOnEnter}
                  >
                    <styled.LabelCell>
                      <styled.LabelText>{row.label}</styled.LabelText>
                      <WorkflowHistoryEventStatusBadge
                        status={row.status}
                        statusReady={true}
                        size="small"
                      />
                    </styled.LabelCell>
                    <styled.TimelineCell>
                      <StatefulPopover
                        triggerType="hover"
                        accessibilityType="tooltip"
                        content={({ close }) => (
                          <WorkflowHistoryTimelineEventGroup
                            eventGroup={row.group}
                            decodedPageUrlParams={decodedPageUrlParams}
                            onClose={() => close()}
                          />
                        )}
                        placement="bottom"
                        overrides={overrides.popover}
                        popoverMargin={0}
                        onMouseEnterDelay={400}
                        popperOptions={{
                          modifiers: {
                            offset: {
                              offset: `${popoverOffset}, 4`,
                              enabled: true,
                            },
                            preventOverflow: {
                              enabled: true,
                              priority: ['left', 'right', 'top'],
                            },
                          },
                        }}
                      >
                        <styled.TimelineViewport>
                          <styled.TimelineContent $widthPx={contentWidth}>
                            <styled.TimelineSvg
                              width={contentWidth}
                              height={ROW_HEIGHT_PX - 12}
                            >
                              {isRunning && (
                                <PatternLines
                                  id={`striped-pattern-${row.id}`}
                                  width={8}
                                  height={8}
                                  stroke={color}
                                  strokeWidth={2}
                                  orientation={['diagonal']}
                                />
                              )}
                              <Group left={0} top={0}>
                                <Bar
                                  x={rowStart}
                                  y={0}
                                  width={Math.max(5, rowEnd - rowStart)}
                                  height={ROW_HEIGHT_PX - 12}
                                  rx={2}
                                  onClick={() => {
                                    onClickShowInTable(row.id);
                                  }}
                                  {...(isRunning
                                    ? {
                                        fill: `url(#striped-pattern-${row.id})`,
                                        className: cls.barAnimated,
                                      }
                                    : {
                                        fill: color,
                                        className: cls.bar,
                                      })}
                                />
                              </Group>
                            </styled.TimelineSvg>
                          </styled.TimelineContent>
                        </styled.TimelineViewport>
                      </StatefulPopover>
                    </styled.TimelineCell>
                  </styled.RowContainer>
                );
              }}
              fixedItemHeight={ROW_HEIGHT_PX}
            />
          </styled.Container>
        );
      }}
    </ParentSize>
  );
}
