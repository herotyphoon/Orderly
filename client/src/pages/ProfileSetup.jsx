import { Box, Paper, Container } from "@mui/material";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { ProfileSetupForm } from "../features/profile-setup/components/ProfileSetupForm.jsx";

export const ProfileSetup = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get("token");
    console.log("Token from URL:", token);

    useEffect(() => {
        if (!token) {
            navigate("/signup");
        }
    }, [token, navigate]);

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
                        }}
                    >
                        <ProfileSetupForm token={token} />
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};