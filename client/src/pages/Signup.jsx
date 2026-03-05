import { useState, useEffect } from "react";
import { Grid, Box, Paper } from "@mui/material";

import { SignupForm } from "../features/auth/components/SignupForm.jsx";
import { SignupBanner } from "../features/auth/components/SignupBanner.jsx";
import { EmailVerificationPrompt } from "../features/auth/components/EmailVerificationPrompt.jsx";
import { useResendVerificationEmail } from "../features/auth/hooks/useResendVerificationEmail.js";

import { usePalette } from "../hooks/usePalette.js";
import { useThemeStore } from "../store/useThemeStore.js";

const COOLDOWN_KEY = "resendCooldownExpiry";

export const Signup = () => {
    const { theme } = useThemeStore();
    const palette = usePalette();

    const [showVerification, setShowVerification] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState("");
    const [cooldown, setCooldown] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");

    const mutation = useResendVerificationEmail();

    useEffect(() => {
        const expiry = localStorage.getItem(COOLDOWN_KEY);
        if (!expiry) return;

        const remaining = Math.floor((Number(expiry) - Date.now()) / 1000);
        if (remaining > 0) setCooldown(remaining);
    }, []);

    useEffect(() => {
        if (cooldown <= 0) return;

        const interval = setInterval(() => {
            setCooldown((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
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
        setRegisteredEmail("");
        setCooldown(0);
        localStorage.removeItem(COOLDOWN_KEY);
    };

    const handleResendVerification = () => {
        if (!registeredEmail || cooldown > 0 || mutation.isPending) return;

        setErrorMessage("");

        setCooldown(60);

        const expiry = Date.now() + 60000;
        localStorage.setItem(COOLDOWN_KEY, expiry);

        mutation.mutate(registeredEmail, {
            onError: (err) => {
                const message =
                    err?.response?.data?.message || "Failed to resend verification email";

                const ttl = err?.response?.data?.ttl;

                if (ttl) {
                    setCooldown(ttl);
                } else {
                    setCooldown(0);
                }

                setErrorMessage(message);
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
                            backgroundColor:
                                theme === "light" ? undefined : palette.primary.contrastText,
                        }}
                    >
                        <Box
                            sx={{
                                width: "100%",
                                maxWidth: 420,
                                p: 4,
                                display: "flex",
                                flexDirection: "column",
                                gap: 2.5,
                            }}
                        >
                            {showVerification ? (
                                <EmailVerificationPrompt
                                    email={registeredEmail}
                                    onResendCode={handleResendVerification}
                                    isResending={mutation.isPending}
                                    cooldown={cooldown}
                                    showSuccess={mutation.isSuccess}
                                    showError={!!errorMessage}
                                    errorMessage={errorMessage}
                                    onBackToSignup={handleBackToSignup}
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
                                p: 4,
                            }}
                        >
                            <SignupBanner />
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};