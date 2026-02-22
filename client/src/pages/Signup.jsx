import { Grid, Box, Paper } from '@mui/material';

import { SignupForm } from '../features/auth/components/SignupForm.jsx';
import { SignupBanner } from '../features/auth/components/SignupBanner.jsx';

import { usePalette } from '../hooks/usePalette.js';
import { useThemeStore } from '../store/useThemeStore.js';

export const Signup = () => {

    const { theme } = useThemeStore();
    const palette = usePalette();

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
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                }}
            >
                <Grid container>
                    <Grid
                        size={{ xs: 12, md: 6 }}
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            p: 4,
                            backgroundColor: `${theme === "light" ? null : palette.primary.contrastText}`
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
                            <SignupForm />
                        </Box>
                    </Grid>
                    <Grid
                        size={{ md: 6 }}
                        sx={{
                            display: { xs: "none", md: "flex" },
                            justifyContent: "center",
                            backgroundColor: `${palette.background.default}`,
                            color: palette.text.primary,
                            p: 4,
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