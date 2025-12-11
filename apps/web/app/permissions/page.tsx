import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Box, Container, AppBar, Toolbar, Typography } from "@mui/material";
import PermissionsList from "../../components/PermissionsList";
import LogoutButton from "../../components/LogoutButton";
import {
  getServerGraphQLClient,
  WHOAMI_QUERY,
  PERMISSIONS_QUERY,
  type WhoAmIResponse,
  type PermissionsResponse,
} from "../../lib/api";

export const metadata = {
  title: "Permissions | Permissions App",
  description: "View your access permissions",
};

export default async function PermissionsPage() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  let user;
  let allPermissions: string[] = [];

  try {
    const client = getServerGraphQLClient(cookieHeader);

    // Fetch user data and all permissions in parallel
    const [whoAmIResult, permissionsResult] = await Promise.all([
      client.request<WhoAmIResponse>(WHOAMI_QUERY),
      client.request<PermissionsResponse>(PERMISSIONS_QUERY),
    ]);

    user = whoAmIResult.whoAmI;
    allPermissions = permissionsResult.permissions;
  } catch (error) {
    // User is not authenticated, redirect to login
    redirect("/login");
  }

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
          userPermissions={user.permissions}
          username={user.username}
        />
      </Container>
    </Box>
  );
}
