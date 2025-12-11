import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Box, Container } from "@mui/material";
import LoginForm from "../../components/LoginForm";
import {
  getServerGraphQLClient,
  WHOAMI_QUERY,
  type WhoAmIResponse,
} from "../../lib/api";

export const metadata = {
  title: "Login | Permissions App",
  description: "Sign in to access your permissions",
};

export default async function LoginPage() {
  // Check if user is already logged in
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  try {
    const client = getServerGraphQLClient(cookieHeader);
    await client.request<WhoAmIResponse>(WHOAMI_QUERY);
    // User is already logged in, redirect to permissions
    redirect("/permissions");
  } catch {
    // User is not logged in, show login form
  }

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
}
