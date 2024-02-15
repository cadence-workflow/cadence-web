'use client';
import { Provider as StyletronProvider } from "styletron-react";
import { ThemeProvider } from "baseui/styles";
import { DarkTheme } from "baseui/themes";
import { styletron } from "../styletron";

export default function StyletronProviderWrapper({ children }) {
    return (
        <StyletronProvider value={styletron}>
            <ThemeProvider theme={DarkTheme}>
                {children}
            </ThemeProvider>
        </StyletronProvider>
    );
}