import type { StyletronCSSObject, StyletronCSSObjectOf } from "@/hooks/useStyletronClasses";

const cssStylesObj = {
    titleIcon: {
        display: "flex",
        height: "1em"
    }
} satisfies StyletronCSSObject;

export const cssStyles: StyletronCSSObjectOf<typeof cssStylesObj> = cssStylesObj;
