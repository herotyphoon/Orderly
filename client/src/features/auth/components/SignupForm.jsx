import { useEffect } from 'react';
import { Button, Divider, IconButton, InputAdornment, TextField, Typography, Box, Link, Alert, CircularProgress } from '@mui/material';
import { Apple, Email, Google, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

import { useToggleShowPassword } from '../hooks/useToggleShowPassword.js';
import { useAuth } from '../hooks/useAuth.js';
import { signupSchema } from "../schemas/authSchema";
import { useThemeStore } from '../../../store/useThemeStore.js';

export const SignupForm = () => {

    const [showPassword, toggleShowPassword] = useToggleShowPassword();

    const {
        register,
        onSubmit,
        errors,
        mutation,
    } = useAuth("/auth/signup", signupSchema);

    useEffect(() => {
        if (mutation.isSuccess) {

        }
    }, [mutation.isSuccess]);

    const isPending = mutation.isPending;

    const { theme } = useThemeStore();

    return (
        <>
            <Typography variant="h4" gutterBottom>
                Welcome to Orderly!
            </Typography>
            <Typography variant="body2" color="text.secondary">
                Start managing your tasks with advanced precision.
            </Typography>

            <Box
                component="form"
                onSubmit={onSubmit}
                noValidate
                sx={{
                    mt: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                }}
            >
                {mutation.isError && (
                    <Alert severity="error">
                        {mutation.error?.response?.data?.message || mutation.error?.message || "Something went wrong"}
                    </Alert>
                )}

                <TextField
                    {...register("email")}
                    label="Email"
                    type="email"
                    fullWidth
                    required
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    disabled={isPending}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Email color="action" />
                                </InputAdornment>
                            )
                        }
                    }}
                />

                <TextField
                    {...register("password")}
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    required
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    disabled={isPending}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Lock color="action" />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={toggleShowPassword}
                                        edge="end"
                                        size="small"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        onMouseDown={(e) => e.preventDefault()}
                                        disabled={isPending}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }
                    }}
                />

                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={isPending}
                    sx={{ mt: 1, height: 48 }}
                >
                    {isPending ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
                </Button>
            </Box>

            <Divider sx={{ my: 3 }}>OR</Divider>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Google sx={{ color: "#DB4437" }} />}
                    disabled={isPending}
                    sx={{ textTransform: "none", justifyContent: "center" }}
                >
                    Signup with Google
                </Button>
                <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Apple sx={{ color: theme === "light" ? "#000000" : "#ffffff" }} />}
                    disabled={isPending}
                    sx={{ textTransform: "none", justifyContent: "center" }}
                >
                    Signup with Apple
                </Button>
            </Box>

            <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                    Already have an account?{' '}
                    <Link
                        component={RouterLink}
                        to="/login"
                        underline="hover"
                        sx={{ fontWeight: 600, color: 'primary.main', cursor: 'pointer' }}
                    >
                        Log In
                    </Link>
                </Typography>
            </Box>
        </>
    )
}