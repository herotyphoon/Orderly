import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Box } from '@mui/material';
import { CheckCircleOutline } from '@mui/icons-material';

export const ResetPasswordSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/login', { replace: true });
        }, 5000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                py: 4,
            }}
        >
            <Box
                sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: 'success.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3,
                    animation: 'scaleIn 0.5s ease-out',
                    '@keyframes scaleIn': {
                        from: {
                            transform: 'scale(0)',
                            opacity: 0,
                        },
                        to: {
                            transform: 'scale(1)',
                            opacity: 1,
                        },
                    },
                }}
            >
                <CheckCircleOutline sx={{ fontSize: 48, color: 'white' }} />
            </Box>

            <Typography variant="h4" gutterBottom fontWeight="600" sx={{ mb: 2 }}>
                Password Reset Successful!
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, lineHeight: 1.6 }}>
                Your password has been successfully reset. You can now log in with your new password.
            </Typography>

            <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/login', { replace: true })}
                sx={{ minWidth: 200, height: 48 }}
            >
                Go to Login
            </Button>

            <Typography variant="caption" color="text.disabled" sx={{ mt: 3 }}>
                Redirecting in 5 seconds...
            </Typography>
        </Box>
    );
};