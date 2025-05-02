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
    Alert
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useGetProfileQuery, useCreateServiceMutation } from '../store/apiSlice';

const AdminNewServicePage = () => {
    const navigate = useNavigate();
    const { data: profile, isLoading: profileLoading, error: profileError } = useGetProfileQuery();
    const [createService, { isLoading: isSubmitting }] = useCreateServiceMutation();
    
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        first_grade_price: '',
        second_grade_price: '',
        third_grade_price: '',
        average_time: ''
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
    
    const handleNumberChange = (e) => {
        const { name, value } = e.target;
        if (!isNaN(value) || value === '') {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        
        try {
            if (!formData.name || !formData.first_grade_price || !formData.second_grade_price || 
                !formData.third_grade_price || !formData.average_time) {
                setError('Пожалуйста, заполните все обязательные поля');
                return;
            }
            
            const serviceData = {
                ...formData,
                first_grade_price: parseInt(formData.first_grade_price, 10),
                second_grade_price: parseInt(formData.second_grade_price, 10),
                third_grade_price: parseInt(formData.third_grade_price, 10),
                average_time: parseInt(formData.average_time, 10)
            };
            
            await createService(serviceData).unwrap();
            
            setSuccess(true);
            setTimeout(() => {
                navigate('/admin');
            }, 2000);
            
        } catch (err) {
            console.error('Не удалось создать услугу:', err);
            setError('Ошибка при создании услуги. Пожалуйста, попробуйте позже.');
        }
    };
    
    const handleBackClick = () => {
        navigate('/admin');
    };

    if (profileLoading) {
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
                    Добавление новой услуги
                </Typography>
            </Box>
            
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            
            {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    Услуга успешно создана! Вы будете перенаправлены на главную страницу.
                </Alert>
            )}

            <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3, flex: 1 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                            Основная информация
                        </Typography>
                    </Grid>
                    
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            label="Название услуги"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </Grid>
                    
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Описание"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            multiline
                            rows={3}
                        />
                    </Grid>
                    
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                            Стоимость и время выполнения
                        </Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                        <TextField
                            required
                            fullWidth
                            label="Цена для барбера 1 разряда (₽)"
                            name="first_grade_price"
                            value={formData.first_grade_price}
                            onChange={handleNumberChange}
                            type="number"
                            InputProps={{ inputProps: { min: 0 } }}
                        />
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                        <TextField
                            required
                            fullWidth
                            label="Цена для барбера 2 разряда (₽)"
                            name="second_grade_price"
                            value={formData.second_grade_price}
                            onChange={handleNumberChange}
                            type="number"
                            InputProps={{ inputProps: { min: 0 } }}
                        />
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                        <TextField
                            required
                            fullWidth
                            label="Цена для барбера 3 разряда (₽)"
                            name="third_grade_price"
                            value={formData.third_grade_price}
                            onChange={handleNumberChange}
                            type="number"
                            InputProps={{ inputProps: { min: 0 } }}
                        />
                    </Grid>
                    
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            label="Среднее время выполнения (минуты)"
                            name="average_time"
                            value={formData.average_time}
                            onChange={handleNumberChange}
                            type="number"
                            InputProps={{ inputProps: { min: 0 } }}
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
                                {isSubmitting ? 'Создание...' : 'Создать услугу'}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default AdminNewServicePage; 