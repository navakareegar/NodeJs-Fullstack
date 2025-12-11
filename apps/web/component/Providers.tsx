"use client";

import { memo } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "../lib/theme";

interface IProvidersProps {
  children: React.ReactNode;
}

const Providers = (props: IProvidersProps) => {
  const { children } = props;
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default memo(Providers);
