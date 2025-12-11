'use client';

import { useState, useCallback, memo, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button, CircularProgress } from '@mui/material';
import { Logout } from '@mui/icons-material';
import { getGraphQLClient, LOGOUT_MUTATION } from '../lib/api';

const LogoutButton = memo(function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = useCallback(async () => {
    setLoading(true);
    try {
      const client = getGraphQLClient();
      await client.request(LOGOUT_MUTATION);
    } catch (err) {
      // Ignore errors on logout
      console.error('Logout error:', err);
    } finally {
      // Always redirect to login
      router.push('/login');
      router.refresh();
    }
  }, [router]);

  const buttonSx = useMemo(() => ({
    borderColor: 'error.main',
    '&:hover': {
      borderColor: 'error.light',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
    },
  }), []);

  return (
    <Button
      variant="outlined"
      color="error"
      startIcon={loading ? <CircularProgress size={18} /> : <Logout />}
      onClick={handleLogout}
      disabled={loading}
      sx={buttonSx}
    >
      {loading ? 'Logging out...' : 'Logout'}
    </Button>
  );
});

export default LogoutButton;

