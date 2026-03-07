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
import { useResendResetCode } from "../hooks/useResendResetCode.js";

export const VerifyCodeForm = ({ email, onSuccess, onBack }) => {
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [cooldown, setCooldown] = useState(0);
    const inputRefs = useRef([]);

    const {
        onSubmit,
        setValue,
        reset,
        mutation,
        errors,
    } = useVerifyResetCode(email);

    const resendMutation = useResendResetCode();

    const isLoading = mutation.isPending;

    useEffect(() => {
        if (cooldown <= 0) return;

        const interval = setInterval(() => {
            setCooldown(prev => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [cooldown]);

    useEffect(() => {
        if (!resendMutation.isSuccess) return;

        const timer = setTimeout(() => {
            resendMutation.reset();
        }, 6000);

        return () => clearTimeout(timer);
    }, [resendMutation.isSuccess]);

    const handleResend = () => {
        if (!email || cooldown > 0) return;
        setCooldown(60);

        resendMutation.mutate(email, {
            onError: () => {
                setCooldown(0);
            },
        });
    };

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
        if (mutation.isSuccess && onSuccess) {
            onSuccess(code.join(""));
            reset();
        }
    }, [mutation.isSuccess, onSuccess, code, reset]);

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

                {resendMutation.isSuccess && (
                    <Alert severity="success">
                        A new code has been sent to your email.
                    </Alert>
                )}

                {resendMutation.isError && (
                    <Alert severity="error">
                        {resendMutation.error?.response?.data?.message ||
                            "Failed to resend code. Please try again."}
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
                        <Link
                            component="button"
                            type="button"
                            underline="hover"
                            sx={{ fontWeight: 600 }}
                            onClick={handleResend}
                            disabled={resendMutation.isPending || cooldown > 0}
                        >
                            {resendMutation.isPending
                                ? "Sending…"
                                : cooldown > 0
                                    ? `Resend in ${cooldown}s`
                                    : "Resend"}
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