import { GraphQLClient } from "graphql-request";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const GRAPHQL_URL = `${API_URL}/graphql`;

/**
 * GraphQL client for client-side requests
 */
export function getGraphQLClient() {
  return new GraphQLClient(GRAPHQL_URL, {
    credentials: "include", // Include cookies
  });
}

/**
 * GraphQL client for server-side requests with cookie forwarding
 */
export function getServerGraphQLClient(cookie?: string) {
  return new GraphQLClient(GRAPHQL_URL, {
    credentials: "include",
    headers: cookie ? { cookie } : undefined,
  });
}

// GraphQL Queries
export const WHOAMI_QUERY = `
  query WhoAmI {
    whoAmI {
      id
      username
      permissions
    }
  }
`;

export const PERMISSIONS_QUERY = `
  query Permissions {
    permissions
  }
`;

// GraphQL Mutations
export const LOGIN_MUTATION = `
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      message
      user {
        id
        username
        permissions
      }
      allPermissions
      expiresAt
    }
  }
`;

export const LOGOUT_MUTATION = `
  mutation Logout {
    logout {
      message
    }
  }
`;

// Types
export interface User {
  id: number;
  username: string;
  permissions: string[];
}

export interface LoginResponse {
  login: {
    message: string;
    user: User;
    allPermissions: string[];
    expiresAt: string;
  };
}

export interface WhoAmIResponse {
  whoAmI: User;
}

export interface PermissionsResponse {
  permissions: string[];
}

export interface LogoutResponse {
  logout: {
    message: string;
  };
}
