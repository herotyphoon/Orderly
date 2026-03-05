import {
    Box,
    Typography,
    Button,
    Alert,
    Stack,
    Link
} from "@mui/material";
import {
    MailOutline,
    CheckCircleOutline,
    RefreshOutlined
} from "@mui/icons-material";

export const EmailVerificationPrompt = ({
    email,
    onResendCode,
    onBackToSignup,
    isResending = false,
    cooldown = 0,
    showSuccess = false,
    showError = false,
    errorMessage = ""
}) => {

    const canResend = !isResending && cooldown === 0;
    const countdown = cooldown;

    return (
        <Box
            sx={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                py: 6,
                px: 4,
            }}
        >
            <Box
                sx={{
                    position: 'relative',
                    mb: 4,
                    animation: 'float 3s ease-in-out infinite',
                    '@keyframes float': {
                        '0%, 100%': { transform: 'translateY(0px)' },
                        '50%': { transform: 'translateY(-10px)' },
                    },
                }}
            >
                <Box
                    sx={{
                        width: 120,
                        height: 120,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        boxShadow: (theme) =>
                            theme.palette.mode === 'dark'
                                ? '0 8px 32px rgba(82, 199, 61, 0.3)'
                                : '0 8px 32px rgba(77, 194, 56, 0.2)',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            inset: -8,
                            borderRadius: '50%',
                            background: (theme) =>
                                `linear-gradient(135deg, ${theme.palette.primary.main}30, transparent)`,
                            animation: 'pulse 2s ease-in-out infinite',
                        },
                        '@keyframes pulse': {
                            '0%, 100%': { opacity: 0.5, transform: 'scale(1)' },
                            '50%': { opacity: 0.8, transform: 'scale(1.05)' },
                        },
                    }}
                >
                    <MailOutline sx={{ fontSize: 56, color: 'primary.contrastText' }} />
                </Box>

                <Box
                    sx={{
                        position: 'absolute',
                        top: -5,
                        right: -5,
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        bgcolor: 'success.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 3,
                        animation: 'scaleIn 0.5s ease-out 0.3s both',
                        '@keyframes scaleIn': {
                            from: { transform: 'scale(0)', opacity: 0 },
                            to: { transform: 'scale(1)', opacity: 1 },
                        },
                    }}
                >
                    <CheckCircleOutline sx={{ fontSize: 24, color: 'white' }} />
                </Box>
            </Box>

            <Typography
                variant="h4"
                fontWeight="700"
                gutterBottom
                sx={{
                    mb: 2,
                    background: (theme) =>
                        theme.palette.mode === 'dark'
                            ? 'linear-gradient(135deg, #52c73d 0%, #89dcb3 100%)'
                            : 'linear-gradient(135deg, #4dc238 0%, #23764d 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                }}
            >
                Check Your Email!
            </Typography>

            {/* show which email */}
            {email && (
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                >
                    We sent a verification link to{" "}
                    <strong>{email}</strong>
                </Typography>
            )}

            {showSuccess && (
                <Alert
                    severity="success"
                    sx={{
                        mb: 3,
                        width: '100%',
                        maxWidth: 450,
                        animation: 'slideIn 0.3s ease-out',
                        '@keyframes slideIn': {
                            from: { transform: 'translateY(-10px)', opacity: 0 },
                            to: { transform: 'translateY(0)', opacity: 1 },
                        },
                    }}
                >
                    Verification email sent successfully!
                </Alert>
            )}

            {showError && (
                <Alert
                    severity="error"
                    sx={{ mb: 3, width: '100%', maxWidth: 450 }}
                >
                    {errorMessage || "Something went wrong. Please try again."}
                </Alert>
            )}

            <Box
                sx={{
                    mb: 4,
                    p: 3,
                    borderRadius: 2,
                    bgcolor: 'action.hover',
                    border: '1px solid',
                    borderColor: 'divider',
                    maxWidth: 450,
                    width: '100%',
                }}
            >
                <Stack spacing={2}>
                    {[
                        "Open your email inbox and look for our verification email",
                        "Click the verification link to complete your profile",
                        "Start organizing your tasks with Orderly!"
                    ].map((text, index) => (
                        <Stack key={index} direction="row" spacing={2} alignItems="flex-start">
                            <Box
                                sx={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: '50%',
                                    bgcolor: 'primary.main',
                                    color: 'primary.contrastText',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    flexShrink: 0,
                                }}
                            >
                                {index + 1}
                            </Box>
                            <Typography variant="body2" color="text.secondary" textAlign="left">
                                {text}
                            </Typography>
                        </Stack>
                    ))}
                </Stack>
            </Box>

            <Stack spacing={2} sx={{ width: '100%', maxWidth: 450 }}>
                <Button
                    variant="outlined"
                    size="large"
                    startIcon={<RefreshOutlined />}
                    onClick={onResendCode}
                    disabled={!canResend}
                    sx={{
                        height: 48,
                        textTransform: 'none',
                        fontSize: '1rem',
                    }}
                >
                    {canResend
                        ? 'Resend Verification Email'
                        : `Resend in ${countdown}s`}
                </Button>
            </Stack>

            <Box sx={{ mt: 4 }}>
                <Typography variant="caption" color="text.disabled" display="block" sx={{ mb: 1 }}>
                    Didn't receive the email? Check your spam folder.
                </Typography>

                {onBackToSignup && (
                    <Typography variant="body2" color="text.secondary">
                        Wrong email?{" "}
                        <Link
                            component="button"
                            onClick={onBackToSignup}
                            underline="hover"
                            sx={{
                                fontWeight: 600,
                                color: 'primary.main',
                                cursor: 'pointer',
                            }}
                        >
                            Go back to signup
                        </Link>
                    </Typography>
                )}
            </Box>
        </Box>
    );
};