import { Button, TextField, Typography, Box, Alert, CircularProgress, InputAdornment } from '@mui/material';
import { Person, AutoAwesome } from '@mui/icons-material';
import { useSetupProfile } from "../hooks/useSetupProfile";

export const ProfileSetupForm = ({ token }) => {
    const {
        register,
        onSubmit,
        errors,
        mutation,
    } = useSetupProfile({ token });

    const isLoading = mutation.isPending;

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
            }}
        >
            <Box
                sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #52c73d 0%, #89dcb3 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3,
                    boxShadow: '0 8px 32px rgba(82, 199, 61, 0.3)',
                    animation: 'pulse 2s ease-in-out infinite',
                    '@keyframes pulse': {
                        '0%, 100%': {
                            transform: 'scale(1)',
                            boxShadow: '0 8px 32px rgba(82, 199, 61, 0.3)',
                        },
                        '50%': {
                            transform: 'scale(1.05)',
                            boxShadow: '0 12px 40px rgba(82, 199, 61, 0.4)',
                        },
                    },
                }}
            >
                <AutoAwesome sx={{ fontSize: 40, color: 'primary.contrastText' }} />
            </Box>

            <Typography
                variant="h3"
                fontWeight="700"
                gutterBottom
                sx={{
                    mb: 1,
                    letterSpacing: '-0.02em',
                    background: 'linear-gradient(135deg, #52c73d 0%, #89dcb3 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                }}
            >
                Welcome to Orderly!
            </Typography>

            <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                    mb: 4,
                    maxWidth: 400,
                    lineHeight: 1.7,
                }}
            >
                Let's personalize your experience. We just need your name to get started.
            </Typography>

            <Box
                component="form"
                onSubmit={onSubmit}
                noValidate
                sx={{
                    width: '100%',
                    maxWidth: 400,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                }}
            >
                {mutation.isError && (
                    <Alert severity="error">
                        {mutation.error?.response?.data?.message || "Something went wrong. Please try again."}
                    </Alert>
                )}

                <TextField
                    {...register("fullName")}
                    label="Full Name"
                    placeholder="John Doe"
                    fullWidth
                    required
                    autoFocus
                    error={!!errors.fullName}
                    helperText={errors.fullName?.message}
                    disabled={isLoading}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Person color="action" />
                                </InputAdornment>
                            )
                        }
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '&.Mui-focused fieldset': {
                                borderColor: 'primary.main',
                                borderWidth: 2,
                            },
                        },
                    }}
                />

                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={isLoading}
                    sx={{
                        mt: 1,
                        height: 56,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        background: 'linear-gradient(135deg, #52c73d 0%, #89dcb3 100%)',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #45a832 0%, #7bc9a5 100%)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 24px rgba(82, 199, 61, 0.4)',
                        },
                        transition: 'all 0.2s ease',
                    }}
                >
                    {isLoading ? <CircularProgress size={28} color="inherit" /> : "Complete Profile"}
                </Button>
            </Box>

            <Box
                sx={{
                    mt: 4,
                    p: 2.5,
                    borderRadius: 2,
                    bgcolor: 'action.hover',
                    border: '1px solid',
                    borderColor: 'divider',
                    maxWidth: 400,
                }}
            >
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.6 }}>
                    💡 <strong>Did you know?</strong> Users who complete their profile are 3x more productive with Orderly!
                </Typography>
            </Box>
        </Box>
    );
};