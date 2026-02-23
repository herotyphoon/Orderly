import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Navigate, useNavigate } from 'react-router-dom'

import { lightTheme, darkTheme } from './config/theme.config.js'

import { useThemeStore } from './store/useThemeStore.js'
import { AuthLayout } from './layouts/AuthLayout.jsx'

import { Login } from './pages/Login.jsx'
import { Signup } from './pages/Signup.jsx'
import { ForgotPassword } from './pages/ForgotPassword.jsx'

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/' element={<AuthLayout />}>
            <Route path='login' element={<Login />} />
            <Route path='signup' element={<Signup />} />
            <Route path='forgot-password' element={<ForgotPassword />} />
            <Route path='*' element={<Navigate to='/login' replace />} />
        </Route>
    )
)

function App() {
    const { theme } = useThemeStore()

    return (
        <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
            <CssBaseline />
            <RouterProvider router={router} />
        </ThemeProvider>
    )
}

export default App
