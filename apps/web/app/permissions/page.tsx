import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import PermissionsPageContent from "../../components/PermissionsPageContent";
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
    <PermissionsPageContent
      allPermissions={allPermissions}
      userPermissions={user.permissions}
      username={user.username}
    />
  );
}
