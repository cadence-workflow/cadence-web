"use client";
import useStyletronClasses from "@/hooks/useStyletronClasses";
import { Spinner, SIZE, type SpinnerProps } from "baseui/spinner";
import { cssStyles } from "./section-loading-indicator.styles";

export default function SectionLoadingIndicator(props: SpinnerProps) {
    const { cls } = useStyletronClasses(cssStyles);

    return (
        <div className={cls.spinnerContainer}>
            <Spinner $size={props.$size || SIZE.medium} />
        </div>
    )
}