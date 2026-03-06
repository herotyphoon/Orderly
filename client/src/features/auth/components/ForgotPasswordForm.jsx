import { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button, TextField, Typography, Box, Link, Alert, CircularProgress, InputAdornment } from '@mui/material';
import { Email } from '@mui/icons-material';

import { useForgotPassword } from '../hooks/useForgotPassword.js';

export const ForgotPasswordForm = ({ onSuccess }) => {

    const {
        register,
        reset,
        onSubmit,
        errors,
        mutation,
        getValues
    } = useForgotPassword();

    const isLoading = mutation.isPending;

    useEffect(() => {
        if (mutation.isSuccess && mutation.data?.email) {
            if (onSuccess) {
                onSuccess(mutation.data.email);
            }
            reset();
        }
    }, [mutation.isSuccess, mutation.data, getValues, onSuccess]);

    return (
        <>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" gutterBottom fontWeight="600">
                    Forgot your password?
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    No worries! Enter your email address and we'll send you a verification code to reset your password.
                </Typography>
            </Box>

            <Box
                component="form"
                onSubmit={onSubmit}
                noValidate
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2.5,
                }}
            >
                {mutation.isError && (
                    <Alert severity="error">
                        {mutation.error?.response?.data?.message || "Something went wrong. Please try again."}
                    </Alert>
                )}

                {mutation.isSuccess && (
                    <Alert severity="success">
                        Verification code sent! Check your email.
                    </Alert>
                )}

                <TextField
                    {...register("email")}
                    label="Email Address"
                    type="email"
                    fullWidth
                    required
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    disabled={isLoading}
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

                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={isLoading}
                    sx={{ mt: 1, height: 48 }}
                >
                    {isLoading ? <CircularProgress size={24} color="inherit" /> : "Send Verification Code"}
                </Button>
            </Box>

            <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                    Remember your password?{' '}
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
    );
};