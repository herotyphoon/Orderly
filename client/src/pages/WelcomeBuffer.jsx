import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Container, LinearProgress } from '@mui/material';
import {
    CheckCircle,
    Dashboard,
    AutoAwesome,
    TrendingUp
} from '@mui/icons-material';

export const WelcomeBuffer = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [progress, setProgress] = useState(0);

    const steps = [
        {
            icon: CheckCircle,
            label: 'Setting up your workspace',
            delay: 0
        },
        {
            icon: Dashboard,
            label: 'Preparing your dashboard',
            delay: 1500
        },
        {
            icon: AutoAwesome,
            label: 'Personalizing your experience',
            delay: 3000
        },
        {
            icon: TrendingUp,
            label: 'Almost ready...',
            delay: 4500
        },
    ];

    // Progress bar animation
    useEffect(() => {
        const duration = 5000; // 5 seconds total
        const interval = 50; // Update every 50ms
        const increment = (interval / duration) * 100;

        const timer = setInterval(() => {
            setProgress((prev) => {
                const next = prev + increment;
                if (next >= 100) {
                    clearInterval(timer);
                    return 100;
                }
                return next;
            });
        }, interval);

        return () => clearInterval(timer);
    }, []);

    // Step progression
    useEffect(() => {
        const timers = steps.map((s, index) =>
            setTimeout(() => setStep(index), s.delay)
        );

        // Redirect after all steps complete
        const redirectTimer = setTimeout(() => {
            navigate('/dashboard', { replace: true });
        }, 6000);

        return () => {
            timers.forEach(clearTimeout);
            clearTimeout(redirectTimer);
        };
    }, [navigate]);

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at 50% 50%, rgba(82, 199, 61, 0.05) 0%, transparent 70%)',
                    pointerEvents: 'none',
                },
            }}
        >
            <Container maxWidth="sm">
                <Box
                    sx={{
                        textAlign: 'center',
                        position: 'relative',
                        zIndex: 1,
                    }}
                >
                    {/* Animated Logo/Icon */}
                    <Box
                        sx={{
                            width: 120,
                            height: 120,
                            margin: '0 auto',
                            mb: 4,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #52c73d 0%, #89dcb3 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 12px 40px rgba(82, 199, 61, 0.3)',
                            animation: 'rotate 3s linear infinite',
                            '@keyframes rotate': {
                                '0%': {
                                    transform: 'rotate(0deg)',
                                },
                                '100%': {
                                    transform: 'rotate(360deg)',
                                },
                            },
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                inset: -8,
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #52c73d 30%, #89dcb3 70%)',
                                opacity: 0.3,
                                animation: 'pulse 2s ease-in-out infinite',
                            },
                            '@keyframes pulse': {
                                '0%, 100%': {
                                    transform: 'scale(1)',
                                    opacity: 0.3,
                                },
                                '50%': {
                                    transform: 'scale(1.1)',
                                    opacity: 0.5,
                                },
                            },
                        }}
                    >
                        <Typography
                            variant="h2"
                            sx={{
                                color: 'primary.contrastText',
                                fontWeight: 800,
                                letterSpacing: '-0.02em',
                            }}
                        >
                            O
                        </Typography>
                    </Box>

                    {/* Welcome Message */}
                    <Typography
                        variant="h3"
                        fontWeight="700"
                        gutterBottom
                        sx={{
                            mb: 2,
                            letterSpacing: '-0.02em',
                            background: 'linear-gradient(135deg, #52c73d 0%, #89dcb3 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            animation: 'fadeIn 0.6s ease-out',
                            '@keyframes fadeIn': {
                                from: { opacity: 0, transform: 'translateY(-20px)' },
                                to: { opacity: 1, transform: 'translateY(0)' },
                            },
                        }}
                    >
                        Welcome aboard!
                    </Typography>

                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{
                            mb: 6,
                            maxWidth: 450,
                            margin: '0 auto',
                            lineHeight: 1.7,
                            animation: 'fadeIn 0.6s ease-out 0.2s both',
                        }}
                    >
                        We're preparing everything you need to start organizing like a pro.
                    </Typography>

                    {/* Progress Bar */}
                    <Box sx={{ mb: 6 }}>
                        <LinearProgress
                            variant="determinate"
                            value={progress}
                            sx={{
                                height: 8,
                                borderRadius: 4,
                                bgcolor: 'action.hover',
                                '& .MuiLinearProgress-bar': {
                                    background: 'linear-gradient(90deg, #52c73d 0%, #89dcb3 100%)',
                                    borderRadius: 4,
                                    transition: 'transform 0.2s ease',
                                },
                            }}
                        />
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: 'block', mt: 1, fontWeight: 600 }}
                        >
                            {Math.round(progress)}%
                        </Typography>
                    </Box>

                    {/* Animated Steps */}
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            alignItems: 'center',
                        }}
                    >
                        {steps.map((s, index) => {
                            const Icon = s.icon;
                            const isActive = index === step;
                            const isComplete = index < step;

                            return (
                                <Box
                                    key={index}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2,
                                        opacity: isActive ? 1 : isComplete ? 0.5 : 0.3,
                                        transform: isActive ? 'scale(1)' : 'scale(0.95)',
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: '50%',
                                            background: isComplete || isActive
                                                ? 'linear-gradient(135deg, #52c73d 0%, #89dcb3 100%)'
                                                : 'transparent',
                                            border: isComplete || isActive ? 'none' : '2px solid',
                                            borderColor: 'divider',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'all 0.3s ease',
                                            boxShadow: isActive ? '0 4px 16px rgba(82, 199, 61, 0.3)' : 'none',
                                        }}
                                    >
                                        <Icon
                                            sx={{
                                                fontSize: 20,
                                                color: isComplete || isActive ? 'primary.contrastText' : 'text.disabled',
                                            }}
                                        />
                                    </Box>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontWeight: isActive ? 600 : 400,
                                            color: isActive ? 'text.primary' : 'text.secondary',
                                        }}
                                    >
                                        {s.label}
                                    </Typography>
                                </Box>
                            );
                        })}
                    </Box>

                    {/* Footer message */}
                    <Typography
                        variant="caption"
                        color="text.disabled"
                        sx={{
                            display: 'block',
                            mt: 6,
                            animation: 'fadeIn 0.6s ease-out 0.4s both',
                        }}
                    >
                        This will only take a moment...
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};