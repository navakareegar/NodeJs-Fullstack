"use client";

import { memo } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "../lib/theme";
import EmotionRegistry from "./EmotionRegistry";

interface IProviderProps {
  children: React.ReactNode;
}

const Provider = (props: IProviderProps) => {
  const { children } = props;
  return (
    <EmotionRegistry>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </EmotionRegistry>
  );
};

export default memo(Provider);
