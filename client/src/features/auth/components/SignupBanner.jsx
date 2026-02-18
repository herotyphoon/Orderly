import { Box, Typography, Stack } from '@mui/material';
import { CheckCircleOutline, Speed, FilterAltOutlined } from '@mui/icons-material';

import { usePalette } from '../../../hooks/usePalette.js';

export const SignupBanner = () => {

    const palette = usePalette();

    return (
        <>
            <Box sx={{ mb: 8 }}>
                <Typography
                    variant="h2"
                    fontWeight="700"
                    sx={{ mb: 2, letterSpacing: '-0.02em', lineHeight: 1.1, color: palette.text.primary }}
                >
                    Chaos, organized.
                </Typography>
                <Typography
                    variant="h6"
                    sx={{ opacity: 0.8, fontWeight: 400, maxWidth: '450px', lineHeight: 1.5, color: palette.text.secondary }}
                >
                    Stop managing your tools and start managing your time.
                    The interface that moves as fast as you think.
                </Typography>
            </Box>

            <Stack spacing={4} sx={{ mb: 8 }}>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                    <CheckCircleOutline sx={{ color: palette.secondary.main, mt: 0.5 }} />
                    <Box>
                        <Typography variant="subtitle1" fontWeight="600">Intentional Design</Typography>
                        <Typography variant="body2" sx={{ opacity: 0.7, color: palette.text.secondary }}>
                            Every pixel is placed to minimize cognitive load and maximize focus.
                        </Typography>
                    </Box>
                </Stack>

                <Stack direction="row" spacing={2} alignItems="flex-start">
                    <Speed sx={{ color: palette.secondary.main, mt: 0.5 }} />
                    <Box>
                        <Typography variant="subtitle1" fontWeight="600">Command-Line Speed</Typography>
                        <Typography variant="body2" sx={{ opacity: 0.7, color: palette.text.secondary }}>
                            Natural language processing that turns thoughts into tasks in seconds.
                        </Typography>
                    </Box>
                </Stack>

                <Stack direction="row" spacing={2} alignItems="flex-start">
                    <FilterAltOutlined sx={{ color: palette.secondary.main, mt: 0.5 }} />
                    <Box>
                        <Typography variant="subtitle1" fontWeight="600">Deep Organization</Typography>
                        <Typography variant="body2" sx={{ opacity: 0.7, color: palette.text.secondary }}>
                            Infinite nesting and advanced filtering for power users who demand more.
                        </Typography>
                    </Box>
                </Stack>
            </Stack>

            <Box sx={{ mt: "auto", pt: 4, borderTop: `1px solid ${palette.divider}` }}>
                <Stack direction="row" spacing={4}>
                    <Box>
                        <Typography variant="h6" fontWeight="700" sx={{ color: palette.text.secondary }}>99.9%</Typography>
                        <Typography variant="caption" sx={{ color: palette.text.disabled, opacity: 0.5, textTransform: 'uppercase' }}>Focus Rate</Typography>
                    </Box>
                    <Box>
                        <Typography variant="h6" fontWeight="700" sx={{ color: palette.text.secondary }}>2x</Typography>
                        <Typography variant="caption" sx={{ color: palette.text.disabled, opacity: 0.5, textTransform: 'uppercase' }}>Faster Workflow</Typography>
                    </Box>
                    <Box>
                        <Typography variant="h6" fontWeight="700" sx={{ color: palette.text.secondary }}>0</Typography>
                        <Typography variant="caption" sx={{ color: palette.text.disabled, opacity: 0.5, textTransform: 'uppercase' }}>Missed Deadlines</Typography>
                    </Box>
                </Stack >
            </Box >
        </>
    )
};