import { Box, Typography, Stack } from '@mui/material';

import { usePalette } from '../../../hooks/usePalette.js';

const philosophySteps = [
    { label: 'Capture', sub: 'Clear your mind instantly.' },
    { label: 'Clarify', sub: 'Distill what truly matters.' },
    { label: 'Execute', sub: 'The interface that disappears.' }
];

export const LoginBanner = () => {

    const palette = usePalette();

    return (
        <>
            <Typography
                variant="h2"
                fontWeight="800"
                sx={{
                    mb: 8,
                    letterSpacing: '-0.04em',
                    color: palette.primary.main,
                }}
            >
                Orderly.
            </Typography>

            <Stack spacing={6}>
                {philosophySteps.map((step, index) => (
                    <Stack key={step.label} direction="row" spacing={4} alignItems="flex-start">
                        <Typography
                            variant="h3"
                            sx={{
                                opacity: 0.3,
                                fontWeight: 800,
                                lineHeight: 1,
                                color: palette.text.hint,
                            }}
                        >
                            0{index + 1}
                        </Typography>

                        <Box>
                            <Typography variant="h4" fontWeight="600" sx={{ lineHeight: 1 }}>
                                {step.label}
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    mt: 1,
                                    color: palette.text.secondary,
                                    maxWidth: '280px'
                                }}
                            >
                                {step.sub}
                            </Typography>
                        </Box>
                    </Stack>
                ))}
            </Stack>

            <Box sx={{ mt: 'auto', pt: 6 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                        sx={{
                            width: 40,
                            height: 2,
                            bgcolor: palette.secondary.main,
                        }}
                    />
                    <Typography
                        variant="body2"
                        sx={{
                            color: palette.text.secondary,
                            letterSpacing: 2,
                            textTransform: 'uppercase',
                            fontSize: '0.7rem',
                            fontWeight: 700
                        }}
                    >
                        Designed for focus. Built for you.
                    </Typography>
                </Stack>
            </Box>
        </>
    )
}