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
    Select,
    Avatar,
    IconButton
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, PhotoCamera as PhotoCameraIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { 
    useGetProfileQuery, 
    useGetUserByIdQuery, 
    useUpdateUserMutation, 
    useGetBarbershopsQuery,
    useUpdateUserPhotoMutation,
    useDeleteUserPhotoMutation
} from '../store/apiSlice';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

const GRADES = ['Младший барбер', 'Топ-барбер', 'Бренд-барбер'];

const AdminEditUserPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { data: profile, isLoading: profileLoading, error: profileError } = useGetProfileQuery();
    const { data: userData, isLoading: userLoading, error: userError } = useGetUserByIdQuery(id);
    const { data: barbershopsData, isLoading: barbershopsLoading } = useGetBarbershopsQuery();
    const [updateUser, { isLoading: isSubmitting }] = useUpdateUserMutation();
    const [updateUserPhoto, { isLoading: isUploadingPhoto }] = useUpdateUserPhotoMutation();
    const [deleteUserPhoto, { isLoading: isDeletingPhoto }] = useDeleteUserPhotoMutation();
    
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        about_me: '',
        date_of_birth: null,
        barbershop_id: '',
        grade: ''
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
        if (userData) {
            setFormData({
                first_name: userData.first_name || '',
                last_name: userData.last_name || '',
                email: userData.email || '',
                phone_number: userData.phone_number || '',
                about_me: userData.about_me || '',
                date_of_birth: userData.date_of_birth || null,
                barbershop_id: userData.barbershop_id || '',
                grade: userData.grade || ''
            });
            
            if (userData.has_photo) {
                setPhotoPreview(`http://localhost:9090/me/${id}/photo?token=${localStorage.getItem('token')}`);
            }
        }
    }, [userData, id]);
    
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
            await updateUserPhoto({
                userId: id,
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
            await deleteUserPhoto(id).unwrap();
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
            if (!formData.first_name || !formData.last_name || !formData.email || !formData.phone_number) {
                setError('Пожалуйста, заполните все обязательные поля');
                return;
            }
            
            await updateUser({
                userId: id,
                userData: formData
            }).unwrap();
            
            setSuccess(true);
            setTimeout(() => {
                navigate('/admin');
            }, 2000);
            
        } catch (err) {
            console.error('Не удалось обновить пользователя:', err);
            setError('Ошибка при обновлении пользователя. Пожалуйста, попробуйте позже.');
        }
    };
    
    const handleBackClick = () => {
        navigate('/admin');
    };

    if (profileLoading || userLoading || barbershopsLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    if (profileError || userError) {
        return (
            <Container>
                <Typography variant="h6" color="error" align="center" sx={{ my: 4 }}>
                    Ошибка загрузки данных. Пожалуйста, попробуйте позже.
                </Typography>
            </Container>
        );
    }

    if (!profile || !userData) {
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
    
    const isBarber = userData.role === 'BARBER';
    const isAdministrator = userData.role === 'ADMINISTRATOR';
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
                    Редактирование {isBarber ? 'барбера' : isAdministrator ? 'администратора' : 'пользователя'}
                </Typography>
            </Box>
            
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            
            {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    Пользователь успешно обновлен! Вы будете перенаправлены на главную страницу.
                </Alert>
            )}
            
            {photoSuccess && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    Фото пользователя успешно обновлено!
                </Alert>
            )}
            
            <Paper sx={{ p: 3, mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                            Фото пользователя
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4} md={3}>
                        {photoPreview ? (
                            <Box sx={{ position: 'relative', width: 'fit-content' }}>
                                <Avatar
                                    src={photoPreview}
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
                                    borderRadius: '50%'
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
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Дата рождения"
                                value={formData.date_of_birth ? dayjs(formData.date_of_birth) : null}
                                onChange={handleDateChange}
                                slotProps={{ textField: { fullWidth: true } }}
                            />
                        </LocalizationProvider>
                    </Grid>
                    
                    {(isBarber || isAdministrator) && (
                        <>
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                                    Профессиональная информация
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
                            
                            {isBarber && (
                                <Grid item xs={12}>
                                    <FormControl fullWidth required>
                                        <InputLabel id="grade-select-label">Разряд</InputLabel>
                                        <Select
                                            labelId="grade-select-label"
                                            name="grade"
                                            value={formData.grade || 'JUNIOR'}
                                            label="Разряд *"
                                            onChange={handleChange}
                                        >
                                            {GRADES.map((grade) => (
                                                <MenuItem key={grade} value={grade}>
                                                    {grade}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            )}
                        </>
                    )}
                    
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
                                {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default AdminEditUserPage; 