import type { StyletronCSSObject, StyletronCSSObjectOf } from "@/hooks/useStyletronClasses";

const cssStylesObj = {
    tableContainer: {
        overflowX: "auto"
    },
    clustersLinks: (theme) => ({
        display: 'flex',
        gap: theme.sizing.scale400,
        ...theme.typography.LabelXSmall,
    }),
    domainNameCell: (theme) => ({
        display: 'flex',
        alignItems: 'center',
        gap: theme.sizing.scale400
    }),
    metricLinkContainer: (theme) => ({
        display: 'flex',
        ...theme.typography.LabelXSmall,
    }),
} satisfies StyletronCSSObject;

export const cssStyles: StyletronCSSObjectOf<typeof cssStylesObj> = cssStylesObj;
