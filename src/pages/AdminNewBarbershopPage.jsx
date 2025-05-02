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
    IconButton
} from '@mui/material';
import { PhotoCamera as PhotoCameraIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useGetProfileQuery, useCreateBarbershopMutation } from '../store/apiSlice';

const AdminNewBarbershopPage = () => {
    const navigate = useNavigate();
    const { data: profile, isLoading: profileLoading, error: profileError } = useGetProfileQuery();
    const [createBarbershop, { isLoading: isSubmitting }] = useCreateBarbershopMutation();
    
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        address: '',
        phone_number: '',
        working_time: '',
        latitude: '',
        longitude: ''
    });
    const [photoFile, setPhotoFile] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
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
        if (!isNaN(value) || value === '' || value === '-' || value === '.') {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };
    
    const handlePhotoChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setPhotoFile(file);
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        
        try {
            if (!formData.name || !formData.address || !formData.phone_number || !formData.working_time) {
                setError('Пожалуйста, заполните все обязательные поля');
                return;
            }
            
            const barbershopData = {
                ...formData,
                latitude: formData.latitude ? parseFloat(formData.latitude) : null,
                longitude: formData.longitude ? parseFloat(formData.longitude) : null
            };
            
            const result = await createBarbershop(barbershopData).unwrap();
            
            setSuccess(true);
            setTimeout(() => {
                navigate('/admin');
            }, 2000);
            
        } catch (err) {
            console.error('Не удалось создать барбершоп:', err);
            setError('Ошибка при создании барбершопа. Пожалуйста, попробуйте позже.');
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
                    Добавление нового барбершопа
                </Typography>
            </Box>
            
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            
            {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    Барбершоп успешно создан! Вы будете перенаправлены на главную страницу.
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
                            label="Название"
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
                        <TextField
                            required
                            fullWidth
                            label="Адрес"
                            name="address"
                            value={formData.address}
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
                            label="Режим работы"
                            name="working_time"
                            value={formData.working_time}
                            onChange={handleChange}
                            placeholder="Пн-Пт: 10:00-20:00, Сб-Вс: 10:00-18:00"
                        />
                    </Grid>
                    
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                            Координаты (опционально)
                        </Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Широта"
                            name="latitude"
                            value={formData.latitude}
                            onChange={handleNumberChange}
                            placeholder="55.7558"
                        />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Долгота"
                            name="longitude"
                            value={formData.longitude}
                            onChange={handleNumberChange}
                            placeholder="37.6173"
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
                                {isSubmitting ? 'Создание...' : 'Создать барбершоп'}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default AdminNewBarbershopPage; 