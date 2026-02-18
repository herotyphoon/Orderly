import { Grid, Box, Paper } from '@mui/material';

import { LoginForm } from '../features/auth/components/LoginForm.jsx';
import { LoginBanner } from '../features/auth/components/LoginBanner.jsx';

import { usePalette } from '../hooks/usePalette.js';
import { useThemeStore } from '../store/useThemeStore.js';

export const Login = () => {

    const { theme } = useThemeStore();
    const palette = usePalette();

    return (

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
                        }}
                    >
                        <LoginForm />
                    </Box>
                </Grid>
                <Grid
                    size={{ md: 6 }}
                    sx={{
                        display: { xs: "none", md: "flex" },
                        justifyContent: "center",
                        backgroundColor: palette.background.default,
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
                        <LoginBanner />
                    </Box>
                </Grid>
            </Grid>
        </Paper>

    )
}