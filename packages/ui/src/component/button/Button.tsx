"use client";

import { Button, SxProps, Theme } from "@mui/material";
import { ReactNode } from "react";

interface ButtonProps {
  type?: "button" | "submit" | "reset";
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
  variant?: "text" | "outlined" | "contained";
  size?: "small" | "medium" | "large";
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  sx?: SxProps<Theme>;
}

export const CustomButton = (props: ButtonProps) => {
  const {
    type,
    children,
    className,
    fullWidth,
    variant,
    size,
    onClick,
    disabled,
    sx,
  } = props;
  return (
    <Button
      type={type}
      className={className}
      onClick={onClick}
      fullWidth={fullWidth}
      variant={variant}
      size={size}
      disabled={disabled}
      sx={sx}
    >
      {children}
    </Button>
  );
};
