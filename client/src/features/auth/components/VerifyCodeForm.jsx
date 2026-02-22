import { useEffect, useState, useRef } from 'react';
import { Button, Typography, Box, Link, Alert, CircularProgress, TextField, Stack } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

import { useVerifyResetCode } from '../hooks/useVerifyResetCode.js';

export const VerifyCodeForm = ({ email, onSuccess, onBack }) => {
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef([]);

    const { mutation } = useVerifyResetCode();

    const isLoading = mutation.isPending;

    useEffect(() => {
        if (mutation.isSuccess && mutation.data?.resetToken) {
            if (onSuccess) {
                onSuccess(code.join(''), mutation.data.resetToken);
            }
        }
    }, [mutation.isSuccess, mutation.data, code, onSuccess]);

    const handleChange = (index, value) => {
        if (value && !/^\d$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6);

        if (!/^\d+$/.test(pastedData)) return;

        const newCode = pastedData.split('').concat(Array(6).fill('')).slice(0, 6);
        setCode(newCode);

        const lastIndex = Math.min(pastedData.length, 5);
        inputRefs.current[lastIndex]?.focus();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const verificationCode = code.join('');

        if (verificationCode.length === 6) {
            mutation.mutate({ email, code: verificationCode });
        }
    };

    const handleResendCode = () => {
        // TODO: Implement resend code logic
        console.log('Resend code to:', email);
    };

    if (!email) return null;

    return (
        <>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" gutterBottom fontWeight="600">
                    Verify your email
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    We've sent a 6-digit verification code to <strong>{email}</strong>.
                    Please enter it below.
                </Typography>
            </Box>

            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2.5,
                }}
            >
                {mutation.isError && (
                    <Alert severity="error">
                        {mutation.error?.response?.data?.message || "Invalid code. Please try again."}
                    </Alert>
                )}

                <Stack direction="row" spacing={1.5} justifyContent="center" sx={{ my: 2 }}>
                    {code.map((digit, index) => (
                        <TextField
                            key={index}
                            inputRef={(el) => (inputRefs.current[index] = el)}
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={index === 0 ? handlePaste : undefined}
                            disabled={isLoading}
                            inputProps={{
                                maxLength: 1,
                                style: {
                                    textAlign: 'center',
                                    fontSize: '1.5rem',
                                    fontWeight: 600,
                                },
                                'aria-label': `Digit ${index + 1}`,
                            }}
                            sx={{
                                width: 56,
                                '& input': {
                                    padding: '16px 8px',
                                }
                            }}
                        />
                    ))}
                </Stack>

                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={isLoading || code.join('').length !== 6}
                    sx={{ mt: 1, height: 48 }}
                >
                    {isLoading ? <CircularProgress size={24} color="inherit" /> : "Verify Code"}
                </Button>

                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                        Didn't receive the code?{' '}
                        <Link
                            component="button"
                            type="button"
                            onClick={handleResendCode}
                            underline="hover"
                            disabled={isLoading}
                            sx={{ fontWeight: 600, color: 'primary.main', cursor: 'pointer' }}
                        >
                            Resend
                        </Link>
                    </Typography>
                </Box>

                {onBack && (
                    <Button
                        startIcon={<ArrowBack />}
                        onClick={onBack}
                        disabled={isLoading}
                        sx={{
                            textTransform: 'none',
                            color: 'text.secondary',
                            '&:hover': {
                                bgcolor: 'action.hover'
                            }
                        }}
                    >
                        Back
                    </Button>
                )}
            </Box>
        </>
    );
};