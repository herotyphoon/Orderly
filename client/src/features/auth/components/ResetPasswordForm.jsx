import { useEffect } from 'react';
import { Button, IconButton, InputAdornment, TextField, Typography, Box, Alert, CircularProgress } from '@mui/material';
import { Lock, Visibility, VisibilityOff, CheckCircle } from '@mui/icons-material';

import { useToggleShowPassword } from '../hooks/useToggleShowPassword.js';
import { useResetPassword } from '../hooks/useResetPassword.js';

export const ResetPasswordForm = ({ email, code, resetToken, onSuccess, onBack }) => {
    const [showPassword, toggleShowPassword] = useToggleShowPassword();
    const [showConfirmPassword, toggleShowConfirmPassword] = useToggleShowPassword();

    const {
        register,
        reset,
        isSubmitSuccessful,
        onSubmit,
        errors,
        mutation,
        watch,
    } = useResetPassword();

    const isLoading = mutation.isPending;
    const password = watch('password');

    useEffect(() => {
        if (mutation.isSuccess) {
            if (onSuccess) {
                onSuccess();
            }
        }
    }, [mutation.isSuccess, onSuccess]);

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset();
        }
    }, [isSubmitSuccessful, reset]);

    if (!email || !code) return null;

    return (
        <>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" gutterBottom fontWeight="600">
                    Create new password
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    Your new password must be different from previously used passwords.
                </Typography>
            </Box>

            <Box
                component="form"
                onSubmit={onSubmit(email, code)}
                noValidate
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2.5,
                }}
            >
                {mutation.isError && (
                    <Alert severity="error">
                        {mutation.error?.response?.data?.message || "Failed to reset password. Please try again."}
                    </Alert>
                )}

                <Box>
                    <TextField
                        {...register("password")}
                        label="New Password"
                        type={showPassword ? "text" : "password"}
                        fullWidth
                        required
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        disabled={isLoading}
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
                                            disabled={isLoading}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }
                        }}
                    />
                </Box>

                <TextField
                    {...register("confirmPassword")}
                    label="Confirm New Password"
                    type={showConfirmPassword ? "text" : "password"}
                    fullWidth
                    required
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    disabled={isLoading}
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
                                        onClick={toggleShowConfirmPassword}
                                        edge="end"
                                        size="small"
                                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                        onMouseDown={(e) => e.preventDefault()}
                                        disabled={isLoading}
                                    >
                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }
                    }}
                />

                <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                        Password must contain:
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography
                            variant="caption"
                            color={password?.length >= 8 ? 'success.main' : 'text.disabled'}
                            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                        >
                            <CheckCircle sx={{ fontSize: 14 }} />
                            At least 8 characters
                        </Typography>
                        <Typography
                            variant="caption"
                            color={/[A-Z]/.test(password) ? 'success.main' : 'text.disabled'}
                            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                        >
                            <CheckCircle sx={{ fontSize: 14 }} />
                            One uppercase letter
                        </Typography>
                        <Typography
                            variant="caption"
                            color={/[a-z]/.test(password) ? 'success.main' : 'text.disabled'}
                            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                        >
                            <CheckCircle sx={{ fontSize: 14 }} />
                            One lowercase letter
                        </Typography>
                        <Typography
                            variant="caption"
                            color={/\d/.test(password) ? 'success.main' : 'text.disabled'}
                            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                        >
                            <CheckCircle sx={{ fontSize: 14 }} />
                            One number
                        </Typography>
                    </Box>
                </Box>

                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={isLoading}
                    sx={{ mt: 1, height: 48 }}
                >
                    {isLoading ? <CircularProgress size={24} color="inherit" /> : "Reset Password"}
                </Button>
            </Box>
        </>
    );
};