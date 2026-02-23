import { useEffect, useState, useRef } from "react";
import {
    Button,
    Typography,
    Box,
    Link,
    Alert,
    CircularProgress,
    TextField,
    Stack,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

import { useVerifyResetCode } from "../hooks/useVerifyResetCode.js";

export const VerifyCodeForm = ({ email, onSuccess, onBack }) => {
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef([]);

    const {
        onSubmit,
        setValue,
        reset,
        mutation,
        errors,
    } = useVerifyResetCode(email);

    const isLoading = mutation.isPending;

    const updateCode = (newCode) => {
        setCode(newCode);
        setValue("code", newCode.join(""), { shouldValidate: true });
    };

    const handleChange = (index, value) => {
        if (value && !/^\d$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value;
        updateCode(newCode);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").slice(0, 6);
        if (!/^\d+$/.test(pasted)) return;

        const newCode = pasted.split("").concat(Array(6).fill("")).slice(0, 6);
        updateCode(newCode);

        inputRefs.current[Math.min(pasted.length, 5)]?.focus();
    };

    useEffect(() => {
        if (mutation.isSuccess && mutation.data?.resetToken && onSuccess) {
            onSuccess(code.join(""), mutation.data.resetToken);
            reset();
        }
    }, [mutation.isSuccess]);

    if (!email) return null;

    return (
        <>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" gutterBottom fontWeight={600}>
                    Verify your email
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    We've sent a 6-digit verification code to <strong>{email}</strong>.
                </Typography>
            </Box>

            <Box
                component="form"
                onSubmit={onSubmit}
                noValidate
                sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
            >
                {(mutation.isError || errors.code) && (
                    <Alert severity="error">
                        {mutation.error?.response?.data?.message ||
                            errors.code?.message ||
                            "Invalid code"}
                    </Alert>
                )}

                <Stack direction="row" spacing={1.5} justifyContent="center" sx={{ my: 2 }}>
                    {code.map((digit, index) => (
                        <TextField
                            key={index}
                            inputRef={(el) => (inputRefs.current[index] = el)}
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={handlePaste}
                            disabled={isLoading}
                            slotProps={{
                                htmlInput: {
                                    maxLength: 1,
                                    style: {
                                        textAlign: "center",
                                        fontSize: "1.5rem",
                                        fontWeight: 600,
                                    },
                                },
                            }}
                            sx={{ width: 56 }}
                        />
                    ))}
                </Stack>

                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={isLoading || code.join("").length !== 6}
                    sx={{ height: 48 }}
                >
                    {isLoading ? <CircularProgress size={24} color="inherit" /> : "Verify Code"}
                </Button>

                <Box sx={{ textAlign: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                        Didn't receive the code?{" "}
                        <Link component="button" underline="hover" sx={{ fontWeight: 600 }}>
                            Resend
                        </Link>
                    </Typography>
                </Box>

                {onBack && (
                    <Button
                        startIcon={<ArrowBack />}
                        onClick={onBack}
                        disabled={isLoading}
                        sx={{ textTransform: "none", color: "text.secondary" }}
                    >
                        Back
                    </Button>
                )}
            </Box>
        </>
    );
};