# Frontend Authentication Example

This document shows how to use the authentication API from a frontend application using the Fetch API.

## Login

```typescript
async function login(username: string, password: string): Promise<void> {
  const response = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // IMPORTANT: Include cookies in the request
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }

  const data = await response.json();
  console.log('Login successful:', data);
  // The session cookie is automatically set by the browser
}
```

## Logout

```typescript
async function logout(): Promise<void> {
  const response = await fetch('http://localhost:3000/auth/logout', {
    method: 'POST',
    credentials: 'include', // IMPORTANT: Include cookies in the request
  });

  if (!response.ok) {
    throw new Error('Logout failed');
  }

  console.log('Logout successful');
  // The session cookie is automatically cleared by the browser
}
```

## Accessing Protected Routes

```typescript
async function getCurrentUser(): Promise<User> {
  const response = await fetch('http://localhost:3000/auth/me', {
    method: 'GET',
    credentials: 'include', // IMPORTANT: Include cookies in the request
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Not authenticated');
    }
    throw new Error('Failed to get user');
  }

  return response.json();
}

interface User {
  id: number;
  username: string;
  permissions: string[];
}
```

## Complete React Example

```tsx
import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3000';

interface User {
  id: number;
  username: string;
  permissions: string[];
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        credentials: 'include',
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (err) {
      // User is not authenticated
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Login failed');
      }

      await checkAuth(); // Refresh user data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  }

  async function handleLogout() {
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    setUser(null);
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return (
      <div>
        <h1>Welcome, {user.username}!</h1>
        <p>Permissions: {user.permissions.join(', ') || 'None'}</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleLogin}>
      <h1>Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <label>
          Username:
          <input type="text" name="username" required />
        </label>
      </div>
      <div>
        <label>
          Password:
          <input type="password" name="password" required />
        </label>
      </div>
      <button type="submit">Login</button>
    </form>
  );
}

export default App;
```

## Important Notes

1. **Always use `credentials: 'include'`** - This tells the browser to include cookies in cross-origin requests.

2. **CORS Configuration** - The backend is configured to accept requests from `http://localhost:5173` (Vite default). Update the `FRONTEND_URL` environment variable if your frontend runs on a different origin.

3. **HTTPS in Production** - The session cookie has `secure: true`, which means it will only be sent over HTTPS. For local development, you may need to set up HTTPS or temporarily modify the cookie settings.

4. **Cookie Security** - The session ID is stored in an HTTP-only cookie, meaning:
   - JavaScript cannot access it (prevents XSS attacks)
   - It's automatically sent with every request to the same origin
   - No need to manage tokens in localStorage/sessionStorage

