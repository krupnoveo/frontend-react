import { useForm } from 'react-hook-form';
import {
    TextField,
    Button,
    Typography,
    Box,
    CircularProgress,
    Alert,
    Link
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const AuthForm = ({ type, onSubmit, loading, error }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
            {type === 'signup' && (
                <>
                    <TextField
                        fullWidth
                        label="Имя"
                        margin="normal"
                        error={!!errors.first_name}
                        helperText={errors.first_name?.message}
                        {...register('first_name', { required: 'Обязательное поле' })}
                    />
                    <TextField
                        fullWidth
                        label="Фамилия"
                        margin="normal"
                        error={!!errors.last_name}
                        helperText={errors.last_name?.message}
                        {...register('last_name', { required: 'Обязательное поле' })}
                    />
                </>
            )}

            <TextField
                fullWidth
                label="Email"
                type="email"
                margin="normal"
                error={!!errors.email}
                helperText={errors.email?.message}
                {...register('email', { required: 'Обязательное поле' })}
            />

            {type === 'signup' && (
                <TextField
                    fullWidth
                    label="Телефон"
                    margin="normal"
                    error={!!errors.phone_number}
                    helperText={errors.phone_number?.message}
                    {...register('phone_number', { required: 'Обязательное поле' })}
                />
            )}

            <TextField
                fullWidth
                label="Пароль"
                type="password"
                margin="normal"
                error={!!errors.password}
                helperText={errors.password?.message}
                {...register('password', {
                    required: 'Обязательное поле',
                    minLength: { value: 4, message: 'Минимум 4 символа' }
                })}
            />

            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

            <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={loading}
                sx={{ mt: 3, mb: 2 }}
            >
                {loading ? <CircularProgress size={24} /> : type === 'signin' ? 'Войти' : 'Зарегистрироваться'}
            </Button>

            <Typography align="center">
                {type === 'signin' ? (
                    <>Нет аккаунта? <Link component={RouterLink} to="/signup">Зарегистрироваться</Link></>
                ) : (
                    <>Уже есть аккаунт? <Link component={RouterLink} to="/signin">Войти</Link></>
                )}
            </Typography>
        </Box>
    );
};

export default AuthForm;