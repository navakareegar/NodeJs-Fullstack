import { Box, Container } from "@mui/material";
import React from "react";
import LoginForm from "./LoginForm";

const LoginPageContent = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #0f0f23 100%)",
        p: 2,
      }}
    >
      <Container
        maxWidth="sm"
        sx={{ display: "flex", justifyContent: "center" }}
      >
        <LoginForm />
      </Container>
    </Box>
  );
};

export default LoginPageContent;
