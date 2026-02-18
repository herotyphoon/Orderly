import { useEffect } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Navigate, useNavigate } from 'react-router-dom'

import { lightTheme, darkTheme } from './config/theme.config.js'

import { useThemeStore } from './store/useThemeStore.js'
import { AuthLayout } from './layouts/AuthLayout.jsx'
import { useAuthUser } from './hooks/useAuthUser.js'
import { useAuthStore } from './store/useAuthStore.js'

import { Login } from './pages/Login.jsx'
import { Signup } from './pages/Signup.jsx'

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/' element={<AuthLayout />}>
            <Route index element={<Navigate to='login' replace />} />
            <Route path='login' element={<Login />} />
            <Route path='signup' element={<Signup />} />
        </Route>
    )
)

function App() {
    const { theme } = useThemeStore()

    const navigate = useNavigate();

    const { data: user, isLoading, isError } = useAuthUser();

    const { setUser, isAuthenticated } = useAuthStore();

    useEffect(() => {
        if (!isLoading && isError) {
            navigate('/login');
        } else {
            setUser(user);
            isAuthenticated(true);
        }
    }, [isLoading, isError, user, navigate]);

    if (isLoading) {
        return <div>Checking auth…</div>;
    }

    return (
        <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
            <CssBaseline />
            <RouterProvider router={router} />
        </ThemeProvider>
    )
}

export default App
