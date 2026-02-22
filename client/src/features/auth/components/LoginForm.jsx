import { useEffect } from 'react';
import { Button, Divider, IconButton, InputAdornment, TextField, Typography, Box, Link, Alert, CircularProgress } from '@mui/material';
import { Apple, Email, Google, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import { useToggleShowPassword } from '../hooks/useToggleShowPassword.js';
import { useAuth } from '../hooks/useAuth.js';
import { loginSchema } from "../schemas/authSchema";
import { useThemeStore } from '../../../store/useThemeStore.js';

export const LoginForm = () => {

    const [showPassword, toggleShowPassword] = useToggleShowPassword();

    const {
        register,
        onSubmit,
        errors,
        mutation,
    } = useAuth("/auth/login", loginSchema);

    const { theme } = useThemeStore();

    useEffect(() => {
        if (mutation.isSuccess) {
        }
    }, [mutation.isSuccess]);

    const isPending = mutation.isPending;

    return (
        <>
            <Typography variant="h4" gutterBottom>
                Welcome back.
            </Typography>
            <Typography variant="body2" color="text.secondary">
                Your focus session is ready when you are.
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
                    <Alert severity="error" variant="filled" sx={{ mb: 1 }}>
                        {mutation.error?.response?.data?.message || "Login failed. Please check your credentials."}
                    </Alert>
                )}

                <TextField
                    {...register("email")}
                    label="Email"
                    type="email"
                    fullWidth
                    required
                    disabled={isPending}
                    error={!!errors.email}
                    helperText={errors.email?.message}
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

                <Box>
                    <TextField
                        {...register("password")}
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        fullWidth
                        required
                        disabled={isPending}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock color="action" fontSize="small" />
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
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                        <Link
                            href="/forgot-password"
                            variant="caption"
                            underline="hover"
                            sx={{ fontWeight: 600, color: 'primary.main' }}
                        >
                            Forgot password?
                        </Link>
                    </Box>
                </Box>

                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={isPending}
                    sx={{ mt: 1, height: 48 }}
                >
                    {isPending ? <CircularProgress size={24} color="inherit" /> : "Login"}
                </Button>
            </Box>

            <Divider sx={{ my: 3 }}>OR</Divider>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Google sx={{ color: "#DB4437" }} />}
                    disabled={isPending}
                    sx={{
                        textTransform: "none",
                        justifyContent: "center",
                    }}
                >
                    Continue with Google
                </Button>
                <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Apple sx={{ color: theme === "light" ? "#000000" : "#ffffff" }} />}
                    disabled={isPending}
                    sx={{ textTransform: "none", justifyContent: "center" }}
                >
                    Continue with Apple
                </Button>
            </Box >

            <Typography
                variant="body2"
                align="center"
                sx={{ mt: 2, color: 'text.secondary' }}
            >
                Don't have an account?{' '}
                <Link
                    component={RouterLink}
                    to="/signup"
                    underline="hover"
                    sx={{ fontWeight: 700, color: 'primary.main' }}
                >
                    Sign up
                </Link>
            </Typography>
        </>
    )
}