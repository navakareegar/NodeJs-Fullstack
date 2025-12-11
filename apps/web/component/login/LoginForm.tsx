"use client";

import { useState, useCallback, useMemo, memo } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  LockOutlined,
  PersonOutline,
} from "@mui/icons-material";
import {
  getGraphQLClient,
  LOGIN_MUTATION,
  type LoginResponse,
} from "../../lib/api";
import { ILoginFormData } from "../../type/common";

const LoginForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ILoginFormData>({
    mode: "onChange",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = useCallback(
    async (data: ILoginFormData) => {
      setError(null);

      try {
        const client = getGraphQLClient();
        console.log("client", client);

        await client.request<LoginResponse>(LOGIN_MUTATION, {
          input: { username: data.username, password: data.password },
        });

        // Redirect to permissions page on success
        router.push("/permissions");
        router.refresh();
      } catch (err: any) {
        const message =
          err?.response?.errors?.[0]?.message ||
          err?.message ||
          "Login failed. Please try again.";
        setError(message);
      }
    },
    [router]
  );

  const toggleShowPassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const cardSx = useMemo(
    () => ({
      width: "100%",
      maxWidth: 420,
      background: "linear-gradient(145deg, #1a1a2e 0%, #16162a 100%)",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
    }),
    []
  );

  const buttonSx = useMemo(
    () => ({
      mt: 3,
      py: 1.5,
      background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
      "&:hover": {
        background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
      },
    }),
    []
  );

  return (
    <Card sx={cardSx}>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 2,
            }}
          >
            <LockOutlined sx={{ fontSize: 28, color: "white" }} />
          </Box>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Welcome Back
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sign in to access your permissions
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            label="Username"
            {...register("username", { required: "Username is required" })}
            error={!!errors.username}
            helperText={errors.username?.message}
            margin="normal"
            autoComplete="username"
            autoFocus
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutline sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            {...register("password", { required: "Password is required" })}
            error={!!errors.password}
            helperText={errors.password?.message}
            margin="normal"
            autoComplete="current-password"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={toggleShowPassword}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isSubmitting || !isValid}
            sx={buttonSx}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default memo(LoginForm);
