import { useState } from 'react';
import { useSignInMutation } from '../store/apiSlice';
import AuthForm from '../components/AuthForm';
import { Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SignInPage = () => {
    const [signIn, { isLoading }] = useSignInMutation();
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (data) => {
        try {
            const response = await signIn(data).unwrap();
            
            localStorage.setItem('token', response.jwt_token);
            localStorage.setItem('userRole', response.role);
            
            let redirectUrl = '/profile';
            
            if (response.role === 'ADMINISTRATOR') {
                redirectUrl = '/manager';
            } else if (response.role === 'ADMIN') {
                redirectUrl = '/admin';
            }
            
            localStorage.setItem('redirectAfterReload', redirectUrl);
            
            window.location.href = redirectUrl;
            
        } catch (err) {
            setError(err.data?.message || 'Ошибка авторизации');
        }
    };

    return (
        <Container maxWidth="xs" sx={{
            minHeight: '67vh',
        }}>
            <Typography variant="h4" align="center" sx={{ mt: 4 }}>Вход</Typography>
            <AuthForm type="signin" onSubmit={handleSubmit} loading={isLoading} error={error} />
        </Container>
    );
};

export default SignInPage;