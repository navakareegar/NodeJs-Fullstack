"use client";

import { forwardRef, useState, useCallback, ReactNode } from "react";
import {
  TextField,
  TextFieldProps as MuiTextFieldProps,
  InputAdornment,
  IconButton,
  SxProps,
  Theme,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export interface TextFieldProps extends Omit<
  MuiTextFieldProps,
  "variant" | "InputProps"
> {
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  showPasswordToggle?: boolean;
}

const textFieldSx: SxProps<Theme> = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 0,
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.05)",
    },
    "&.Mui-focused": {
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#6366f1",
        borderWidth: 2,
      },
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(255, 255, 255, 0.1)",
    },
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255, 255, 255, 0.5)",
    "&.Mui-focused": {
      color: "#8b5cf6",
    },
  },
  "& .MuiInputBase-input": {
    color: "white",
  },
  "& .MuiFormHelperText-root": {
    marginLeft: 0,
  },
};

export const CustomTextField = forwardRef<HTMLDivElement, TextFieldProps>(
  (
    { startIcon, endIcon, showPasswordToggle = false, type, sx, ...props },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = useCallback(() => {
      setShowPassword((prev) => !prev);
    }, []);

    const isPasswordField = type === "password" || showPasswordToggle;
    const inputType = isPasswordField
      ? showPassword
        ? "text"
        : "password"
      : type;

    const buildInputProps = () => {
      const inputProps: MuiTextFieldProps["InputProps"] = {};

      if (startIcon) {
        inputProps.startAdornment = (
          <InputAdornment position="start">{startIcon}</InputAdornment>
        );
      }

      if (isPasswordField) {
        inputProps.endAdornment = (
          <InputAdornment position="end">
            <IconButton
              onClick={togglePasswordVisibility}
              edge="end"
              size="small"
              sx={{ color: "text.secondary" }}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        );
      } else if (endIcon) {
        inputProps.endAdornment = (
          <InputAdornment position="end">{endIcon}</InputAdornment>
        );
      }

      return inputProps;
    };

    return (
      <TextField
        ref={ref}
        type={inputType}
        variant="outlined"
        fullWidth
        InputProps={buildInputProps()}
        sx={[textFieldSx, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}
        {...props}
      />
    );
  }
);
