import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

export const AuthLayout = () => {
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
            <Outlet />
        </Box>
    );
}
