import { useState, useEffect } from 'react';
import { Grid, Box, Paper } from '@mui/material';

import { SignupForm } from '../features/auth/components/SignupForm.jsx';
import { SignupBanner } from '../features/auth/components/SignupBanner.jsx';
import { EmailVerificationPrompt } from '../features/auth/components/EmailVerificationPrompt.jsx';
import { useResendVerificationEmail } from '../features/auth/hooks/useResendVerificationEmail.js';

import { usePalette } from '../hooks/usePalette.js';
import { useThemeStore } from '../store/useThemeStore.js';

export const Signup = () => {

    const { theme } = useThemeStore();
    const palette = usePalette();

    const [showVerification, setShowVerification] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState('');
    const [cooldown, setCooldown] = useState(0);

    const mutation = useResendVerificationEmail();

    useEffect(() => {
        if (cooldown <= 0) return;

        const interval = setInterval(() => {
            setCooldown(prev => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [cooldown]);

    useEffect(() => {
        if (!mutation.isSuccess) return;

        const timer = setTimeout(() => {
            mutation.reset();
        }, 6000);

        return () => clearTimeout(timer);
    }, [mutation.isSuccess]);


    const handleSignupSuccess = (email) => {
        setRegisteredEmail(email);
        setShowVerification(true);
    };

    const handleBackToSignup = () => {
        setShowVerification(false);
        setRegisteredEmail('');
    };

    const handleResendVerification = () => {
        if (!registeredEmail || cooldown > 0) return;
        setCooldown(60);

        mutation.mutate(registeredEmail, {
            onError: () => {
                setCooldown(0);
            }
        });
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                py: 6,
            }}
        >
            <Paper
                elevation={6}
                sx={{
                    width: "100%",
                    maxWidth: 1100,
                    borderRadius: 3,
                    overflow: "hidden",
                    border: "1px solid rgba(0,0,0,0.06)",
                }}
            >
                <Grid container>
                    <Grid
                        size={{ xs: 12, md: 6 }}
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: `${theme === "light" ? undefined : palette.primary.contrastText}`
                        }}
                    >
                        <Box
                            sx={{
                                width: "100%",
                                maxWidth: 420,
                                p: 4,
                                display: "flex",
                                flexDirection: "column",
                                gap: 2.5
                            }}>
                            {showVerification ? (
                                <EmailVerificationPrompt
                                    onResendCode={handleResendVerification}
                                    onBackToSignup={handleBackToSignup}
                                    isResending={mutation.isPending}
                                    cooldown={cooldown}
                                    showSuccess={mutation.isSuccess}
                                    showError={mutation.isError}
                                />
                            ) : (
                                <SignupForm onSuccess={handleSignupSuccess} />
                            )}
                        </Box>
                    </Grid>
                    <Grid
                        size={{ md: 6 }}
                        sx={{
                            display: { xs: "none", md: "flex" },
                            justifyContent: "center",
                            backgroundColor: palette.background.default,
                            color: palette.text.primary,
                        }}
                    >
                        <Box
                            sx={{
                                width: "100%",
                                height: "100%",
                                maxWidth: 520,
                                p: 4
                            }}
                        >
                            <SignupBanner />
                        </Box>
                    </Grid>
                </Grid>
            </Paper >
        </Box>
    )
}