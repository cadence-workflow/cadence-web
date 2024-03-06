'use client';
import React from "react";
import { Provider as StyletronProvider } from "styletron-react";
import { styletron } from "../styletron";
import { BaseProvider, createTheme } from "baseui";

const cadenceLightTheme = createTheme({ grid: { maxWidth: 1580 } })

export default function StyletronProviderWrapper({ children }: { children: React.ReactNode }) {
    return (
        <StyletronProvider value={styletron}>
            <BaseProvider theme={cadenceLightTheme}>
                {children}
            </BaseProvider>
        </StyletronProvider>
    );
}