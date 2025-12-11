"use client";

import { memo } from "react";
import { Box, Container, AppBar, Toolbar, Typography } from "@mui/material";
import PermissionsList from "./PermissionsList";
import LogoutButton from "./LogoutButton";

interface PermissionsPageContentProps {
  allPermissions: string[];
  userPermissions: string[];
  username: string;
}

const PermissionsPageContent = memo(function PermissionsPageContent({
  allPermissions,
  userPermissions,
  username,
}: PermissionsPageContentProps) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #0f0f23 100%)",
      }}
    >
      <AppBar
        position="static"
        sx={{
          background: "rgba(26, 26, 46, 0.8)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        }}
        elevation={0}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" fontWeight={700}>
            🔐 Permissions App
          </Typography>
          <LogoutButton />
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <PermissionsList
          allPermissions={allPermissions}
          userPermissions={userPermissions}
          username={username}
        />
      </Container>
    </Box>
  );
});

export default PermissionsPageContent;
