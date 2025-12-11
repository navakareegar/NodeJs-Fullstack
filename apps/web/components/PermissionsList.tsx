"use client";

import { memo, useMemo } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Grid,
  Divider,
} from "@mui/material";
import {
  CheckCircle,
  Cancel,
  Security,
  PersonAdd,
  Visibility,
  Edit,
  Delete,
} from "@mui/icons-material";
import { ReactElement } from "react";

interface PermissionsListProps {
  allPermissions: string[];
  userPermissions: string[];
  username: string;
}

const permissionIcons: Record<string, React.ReactNode> = {
  CREATE_USER: <PersonAdd />,
  READ_USER: <Visibility />,
  UPDATE_USER: <Edit />,
  DELETE_USER: <Delete />,
};

const PermissionsList = memo(function PermissionsList({
  allPermissions,
  userPermissions,
  username,
}: PermissionsListProps) {
  const userPermissionSet = useMemo(
    () => new Set(userPermissions),
    [userPermissions]
  );

  const missingPermissions = useMemo(
    () => allPermissions.filter((p) => !userPermissionSet.has(p)),
    [allPermissions, userPermissionSet]
  );

  return (
    <Box>
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 2,
          }}
        >
          <Security sx={{ fontSize: 32, color: "white" }} />
        </Box>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Permissions Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome, <strong>{username}</strong>! Here are your access
          permissions.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* User's Permissions */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              height: "100%",
              background: "linear-gradient(145deg, #1a1a2e 0%, #16162a 100%)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <CheckCircle sx={{ color: "success.main", mr: 1 }} />
                <Typography variant="h6" fontWeight={600}>
                  Your Permissions
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Permissions you have access to
              </Typography>
              <Divider sx={{ mb: 2, borderColor: "rgba(255,255,255,0.1)" }} />
              {userPermissions.length > 0 ? (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {userPermissions.map((permission) => (
                    <Chip
                      key={permission}
                      icon={
                        (permissionIcons[permission] as ReactElement) || (
                          <CheckCircle />
                        )
                      }
                      label={permission.replace(/_/g, " ")}
                      color="success"
                      variant="outlined"
                      sx={{
                        borderColor: "success.main",
                        "& .MuiChip-icon": { color: "success.main" },
                      }}
                    />
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No permissions assigned
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Missing Permissions */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              height: "100%",
              background: "linear-gradient(145deg, #1a1a2e 0%, #16162a 100%)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Cancel sx={{ color: "error.main", mr: 1 }} />
                <Typography variant="h6" fontWeight={600}>
                  Missing Permissions
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Permissions you do not have
              </Typography>
              <Divider sx={{ mb: 2, borderColor: "rgba(255,255,255,0.1)" }} />
              {missingPermissions.length > 0 ? (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {missingPermissions.map((permission) => (
                      <Chip
                        key={permission}
                        icon={
                          (permissionIcons[permission] as ReactElement) || (
                            <Cancel />
                          )
                        }
                        label={permission.replace(/_/g, " ")}
                        color="error"
                        variant="outlined"
                        sx={{
                          borderColor: "error.main",
                          "& .MuiChip-icon": { color: "error.main" },
                        }}
                      />
                    ))}
                </Box>
              ) : (
                <Typography variant="body2" color="success.main">
                  You have all permissions! 🎉
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* All Permissions Overview */}
      <Card
        sx={{
          mt: 3,
          background: "linear-gradient(145deg, #1a1a2e 0%, #16162a 100%)",
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            All System Permissions
          </Typography>
          <Divider sx={{ mb: 2, borderColor: "rgba(255,255,255,0.1)" }} />
          <Grid container spacing={2}>
            {allPermissions.map((permission) => {
              const hasPermission = userPermissionSet.has(permission);
              return (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={permission}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: hasPermission
                        ? "success.main"
                        : "rgba(255,255,255,0.1)",
                      background: hasPermission
                        ? "rgba(16, 185, 129, 0.1)"
                        : "transparent",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    {hasPermission ? (
                      <CheckCircle sx={{ color: "success.main" }} />
                    ) : (
                      <Cancel sx={{ color: "text.disabled" }} />
                    )}
                    <Typography
                      variant="body2"
                      sx={{
                        color: hasPermission
                          ? "success.main"
                          : "text.secondary",
                        fontWeight: hasPermission ? 600 : 400,
                      }}
                    >
                      {permission.replace(/_/g, " ")}
                    </Typography>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
});

export default PermissionsList;
