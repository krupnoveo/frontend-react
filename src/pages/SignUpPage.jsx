import { useState } from 'react';
import { useSignUpMutation } from '../store/apiSlice';
import AuthForm from '../components/AuthForm';
import { Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SignUpPage = () => {
    const [signUp, { isLoading }] = useSignUpMutation();
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (data) => {
        try {
            await signUp(data).unwrap();
            navigate('/signin');
        } catch (err) {
            setError(err.data?.message || 'Ошибка регистрации');
        }
    };

    return (
        <Container maxWidth="xs" sx={{
            minHeight: '67vh',
        }}>
            <Typography variant="h4" align="center" sx={{ mt: 4 }}>Регистрация</Typography>
            <AuthForm type="signup" onSubmit={handleSubmit} loading={isLoading} error={error} />
        </Container>
    );
};

export default SignUpPage;