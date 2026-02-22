import { useState } from 'react';
import { Box, Paper, Container } from '@mui/material';

import { ForgotPasswordForm } from '../features/auth/components/ForgotPasswordForm.jsx';
import { VerifyCodeForm } from '../features/auth/components/VerifyCodeForm.jsx';
import { ResetPasswordForm } from '../features/auth/components/ResetPasswordForm.jsx';
import { ResetPasswordSuccess } from '../features/auth/components/ResetPasswordSuccess.jsx';

export const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [resetToken, setResetToken] = useState('');

    const handleEmailSubmitted = (submittedEmail) => {
        setEmail(submittedEmail);
        setStep(2);
    };

    const handleCodeVerified = (verifiedCode, token) => {
        setCode(verifiedCode);
        setResetToken(token);
        setStep(3);
    };

    const handlePasswordReset = () => {
        setStep(4);
    };

    const handleBackToEmail = () => {
        setStep(1);
    };

    const handleBackToCode = () => {
        setStep(2);
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                py: 6,
                bgcolor: "background.default",
            }}
        >
            <Container maxWidth="sm">
                <Paper
                    elevation={6}
                    sx={{
                        borderRadius: 3,
                        overflow: "hidden",
                        border: "1px solid",
                        borderColor: "divider",
                    }}
                >
                    <Box
                        sx={{
                            p: 6,
                            display: "flex",
                            flexDirection: "column",
                            gap: 2.5,
                        }}
                    >
                        {step === 1 && (
                            <ForgotPasswordForm
                                onSuccess={handleEmailSubmitted}
                            />
                        )}

                        {step === 2 && (
                            <VerifyCodeForm
                                email={email}
                                onSuccess={handleCodeVerified}
                                onBack={handleBackToEmail}
                            />
                        )}

                        {step === 3 && (
                            <ResetPasswordForm
                                email={email}
                                code={code}
                                resetToken={resetToken}
                                onSuccess={handlePasswordReset}
                                onBack={handleBackToCode}
                            />
                        )}

                        {step === 4 && (
                            <ResetPasswordSuccess />
                        )}
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};