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
    IconButton,
    Avatar
} from '@mui/material';
import { PhotoCamera as PhotoCameraIcon, ArrowBack as ArrowBackIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetProfileQuery, useGetBarbershopsQuery, useUpdateBarbershopMutation, useUpdateBarbershopPhotoMutation, useDeleteBarbershopPhotoMutation } from '../store/apiSlice';

const AdminEditBarbershopPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { data: profile, isLoading: profileLoading, error: profileError } = useGetProfileQuery();
    const { data: barbershopsData, isLoading: barbershopsLoading } = useGetBarbershopsQuery();
    const [updateBarbershop, { isLoading: isSubmitting }] = useUpdateBarbershopMutation();
    const [updateBarbershopPhoto, { isLoading: isUploadingPhoto }] = useUpdateBarbershopPhotoMutation();
    const [deleteBarbershopPhoto, { isLoading: isDeletingPhoto }] = useDeleteBarbershopPhotoMutation();
    
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
    const [photoSuccess, setPhotoSuccess] = useState(false);
    useEffect(() => {
        const handleResize = () => {
            setWindowHeight(window.innerHeight);
        };
        
        window.addEventListener('resize', handleResize);
        
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    

    useEffect(() => {
        if (barbershopsData && id) {
            const barbershop = barbershopsData.barbershops.find(b => b.id.toString() === id);
            if (barbershop) {
                setFormData({
                    name: barbershop.name || '',
                    description: barbershop.description || '',
                    address: barbershop.address || '',
                    phone_number: barbershop.phone_number || '',
                    working_time: barbershop.working_time || '',
                    latitude: barbershop.latitude ? barbershop.latitude.toString() : '',
                    longitude: barbershop.longitude ? barbershop.longitude.toString() : ''
                });
                
                if (barbershop.has_photo) {
                    setPhotoPreview(`http://localhost:9090/barbershop/${id}/photo?token=${localStorage.getItem('token')}`);
                }
            } else {
                setError('Барбершоп не найден');
            }
        }
    }, [barbershopsData, id]);
    
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
    
    const handlePhotoUpload = async () => {
        if (!photoFile) {
            return;
        }
        
        try {
            await updateBarbershopPhoto({
                barbershopId: id,
                photoFile
            }).unwrap();
            
            setPhotoSuccess(true);
            setTimeout(() => {
                setPhotoSuccess(false);
            }, 3000);
        } catch (err) {
            console.error('Не удалось загрузить фото:', err);
            setError('Ошибка при загрузке фото. Пожалуйста, попробуйте позже.');
        }
    };
    
    const handlePhotoDelete = async () => {
        try {
            await deleteBarbershopPhoto(id).unwrap();
            setPhotoPreview(null);
            setPhotoFile(null);
        } catch (err) {
            console.error('Не удалось удалить фото:', err);
            setError('Ошибка при удалении фото. Пожалуйста, попробуйте позже.');
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
            
            await updateBarbershop({
                barbershopId: id,
                barbershopData
            }).unwrap();
            
            setSuccess(true);
            setTimeout(() => {
                navigate('/admin');
            }, 2000);
            
        } catch (err) {
            console.error('Не удалось обновить барбершоп:', err);
            setError('Ошибка при обновлении барбершопа. Пожалуйста, попробуйте позже.');
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
                    Редактирование барбершопа
                </Typography>
            </Box>
            
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            
            {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    Барбершоп успешно обновлен! Вы будете перенаправлены на главную страницу.
                </Alert>
            )}
            
            {photoSuccess && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    Фото барбершопа успешно обновлено!
                </Alert>
            )}

            <Paper sx={{ p: 3, mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                            Фото барбершопа
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4} md={3}>
                        {photoPreview ? (
                            <Box sx={{ position: 'relative', width: 'fit-content' }}>
                                <Avatar
                                    src={photoPreview}
                                    variant="rounded"
                                    sx={{ width: 150, height: 150 }}
                                />
                                <IconButton
                                    color="error"
                                    size="small"
                                    onClick={handlePhotoDelete}
                                    disabled={isDeletingPhoto}
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        right: 0,
                                        backgroundColor: 'white'
                                    }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        ) : (
                            <Box 
                                sx={{ 
                                    width: 150, 
                                    height: 150, 
                                    bgcolor: 'grey.200',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 1
                                }}
                            >
                                <Typography variant="body2" color="text.secondary">
                                    Нет фото
                                </Typography>
                            </Box>
                        )}
                    </Grid>
                    <Grid item xs={12} sm={8} md={9}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Button
                                variant="contained"
                                component="label"
                                startIcon={<PhotoCameraIcon />}
                                sx={{ mb: 1 }}
                            >
                                Выбрать фото
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={handlePhotoChange}
                                />
                            </Button>
                            
                            {photoFile && (
                                <Button
                                    variant="outlined"
                                    onClick={handlePhotoUpload}
                                    disabled={isUploadingPhoto}
                                >
                                    {isUploadingPhoto ? 'Загрузка...' : 'Загрузить фото'}
                                </Button>
                            )}
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

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
                                {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default AdminEditBarbershopPage; 