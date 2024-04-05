import type { StyletronCSSObject, StyletronCSSObjectOf } from "@/hooks/useStyletronClasses";

const cssStylesObj = {
    domainNameCell: (theme) => ({
        display: 'flex',
        alignItems: 'center',
        gap: theme.sizing.scale400
    }),
} satisfies StyletronCSSObject;

export const cssStyles: StyletronCSSObjectOf<typeof cssStylesObj> = cssStylesObj;
