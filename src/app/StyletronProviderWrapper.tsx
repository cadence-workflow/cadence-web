'use client';
import React from "react";
import { Provider as StyletronProvider } from "styletron-react";
import { styletron } from "../styletron";
import { BaseProvider, createTheme } from "baseui";

const cadenceLightTheme = createTheme({ grid: { maxWidth: 1580 } })

export default function StyletronProviderWrapper({ children }: { children: React.ReactNode }) {
    return (
        <StyletronProvider value={styletron}>
            <BaseProvider overrides={{
                AppContainer: {
                    style: {
                        display: "flex",
                        flexDirection: "column",
                        flex: 1
                    }
                }
            }} theme={cadenceLightTheme}>
                {children}
            </BaseProvider>
        </StyletronProvider>
    );
}