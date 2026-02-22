import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Box, Link, Alert, CircularProgress, InputAdornment } from '@mui/material';
import { Email, ArrowBack } from '@mui/icons-material';

import { useForgotPassword } from '../hooks/useForgotPassword.js';

export const ForgotPasswordForm = ({ onSuccess }) => {
    const navigate = useNavigate();

    const {
        register,
        reset,
        isSubmitSuccessful,
        onSubmit,
        errors,
        mutation,
    } = useForgotPassword();

    const isLoading = mutation.isPending;

    useEffect(() => {
        if (mutation.isSuccess && mutation.data?.email) {
            // Call the onSuccess callback with the email
            if (onSuccess) {
                onSuccess(mutation.data.email);
            }
        }
    }, [mutation.isSuccess, mutation.data, onSuccess]);

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset();
        }
    }, [isSubmitSuccessful, reset]);

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

                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate('/login')}
                    disabled={isLoading}
                    sx={{
                        textTransform: 'none',
                        color: 'text.secondary',
                        '&:hover': {
                            bgcolor: 'action.hover'
                        }
                    }}
                >
                    Back to Login
                </Button>
            </Box>

            <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                    Remember your password?{' '}
                    <Link
                        href="/login"
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