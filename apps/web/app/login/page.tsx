import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  getServerGraphQLClient,
  WHOAMI_QUERY,
  type WhoAmIResponse,
} from "../../lib/api";
import LoginPageContent from "../../component/login/LoginPageContent";

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

  return <LoginPageContent />;
}
