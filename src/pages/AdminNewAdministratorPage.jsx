import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Typography, 
    Container, 
    Paper, 
    Grid,
    TextField,
    Button, 
    CircularProgress,
    Alert,
    MenuItem,
    FormControl,
    InputLabel,
    Select
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useGetProfileQuery, useCreateAdministratorMutation, useGetBarbershopsQuery } from '../store/apiSlice';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

const AdminNewAdministratorPage = () => {
    const navigate = useNavigate();
    const { data: profile, isLoading: profileLoading, error: profileError } = useGetProfileQuery();
    const { data: barbershopsData, isLoading: barbershopsLoading } = useGetBarbershopsQuery();
    const [createAdministrator, { isLoading: isSubmitting }] = useCreateAdministratorMutation();
    
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        about_me: '',
        password: '',
        date_of_birth: null,
        barbershop_id: '',
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    
    useEffect(() => {
        const handleResize = () => {
            setWindowHeight(window.innerHeight);
        };
        
        window.addEventListener('resize', handleResize);
        
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    const handleDateChange = (date) => {
        if (date) {
            setFormData(prev => ({
                ...prev,
                date_of_birth: date.toISOString()
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                date_of_birth: null
            }));
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        
        try {
            // Проверяем, что все обязательные поля заполнены
            if (!formData.first_name || !formData.last_name || !formData.email || 
                !formData.phone_number || !formData.password || !formData.barbershop_id) {
                setError('Пожалуйста, заполните все обязательные поля');
                return;
            }
            
            // Отправляем данные администратора
            await createAdministrator(formData).unwrap();
            
            // При успешном создании
            setSuccess(true);
            setTimeout(() => {
                navigate('/admin');
            }, 2000);
            
        } catch (err) {
            console.error('Не удалось создать администратора:', err);
            setError('Ошибка при создании администратора. Пожалуйста, попробуйте позже или измените данные (email и телефон должны быть уникальными).');
        }
    };
    
    const handleBackClick = () => {
        navigate('/admin');
    };

    if (profileLoading || barbershopsLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    if (profileError) {
        return (
            <Container>
                <Typography variant="h6" color="error" align="center" sx={{ my: 4 }}>
                    Ошибка загрузки данных. Пожалуйста, попробуйте позже.
                </Typography>
            </Container>
        );
    }

    if (!profile) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    if (profile.role !== 'ADMIN') {
        return (
            <Container>
                <Typography variant="h6" color="error" align="center" sx={{ my: 4 }}>
                    Доступ запрещен. Эта страница только для администраторов системы.
                </Typography>
            </Container>
        );
    }
    
    const barbershops = barbershopsData?.barbershops || [];
    
    const minPageHeight = windowHeight - 140;

    return (
        <Container 
            maxWidth="md" 
            sx={{ 
                mt: 4, 
                mb: 4, 
                minHeight: `${minPageHeight}px`,
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Button
                    variant="text"
                    color="primary"
                    startIcon={<ArrowBackIcon />}
                    onClick={handleBackClick}
                    sx={{ mr: 2 }}
                >
                    Назад
                </Button>
                <Typography variant="h4" component="h1">
                    Добавление нового администратора
                </Typography>
            </Box>
            
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            
            {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    Администратор успешно создан! Вы будете перенаправлены на главную страницу.
                </Alert>
            )}

            <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3, flex: 1 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                            Персональная информация
                        </Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            fullWidth
                            label="Имя"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                        />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            fullWidth
                            label="Фамилия"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                        />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            fullWidth
                            label="Номер телефона"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleChange}
                        />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            fullWidth
                            label="Пароль"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Дата рождения"
                                value={formData.date_of_birth ? dayjs(formData.date_of_birth) : null}
                                onChange={handleDateChange}
                                slotProps={{ textField: { fullWidth: true } }}
                            />
                        </LocalizationProvider>
                    </Grid>
                    
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                            Информация о месте работы
                        </Typography>
                    </Grid>
                    
                    <Grid item xs={12}>
                        <FormControl fullWidth required>
                            <InputLabel id="barbershop-select-label">Барбершоп</InputLabel>
                            <Select
                                labelId="barbershop-select-label"
                                name="barbershop_id"
                                value={formData.barbershop_id}
                                label="Барбершоп *"
                                onChange={handleChange}
                            >
                                {barbershops.map((barbershop) => (
                                    <MenuItem key={barbershop.id} value={barbershop.id}>
                                        {barbershop.name} ({barbershop.address})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="О себе"
                            name="about_me"
                            value={formData.about_me || ''}
                            onChange={handleChange}
                            multiline
                            rows={3}
                        />
                    </Grid>
                    
                    <Grid item xs={12}>
                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                size="large"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Создание...' : 'Создать администратора'}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default AdminNewAdministratorPage; 