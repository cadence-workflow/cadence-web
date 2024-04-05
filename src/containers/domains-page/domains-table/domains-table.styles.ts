import type { StyletronCSSObject, StyletronCSSObjectOf } from "@/hooks/useStyletronClasses";

const cssStylesObj = {
    tableContainer: {
        overflowX: "auto"
    },
} satisfies StyletronCSSObject;

export const cssStyles: StyletronCSSObjectOf<typeof cssStylesObj> = cssStylesObj;
