import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Typography, 
    Container, 
    Paper, 
    Grid, 
    Button, 
    CircularProgress,
    Avatar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useGetProfileQuery } from '../store/apiSlice';

const AdministratorProfilePage = () => {
    const navigate = useNavigate();
    const { data: profile, isLoading, error } = useGetProfileQuery();
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    
    useEffect(() => {
        const handleResize = () => {
            setWindowHeight(window.innerHeight);
        };
        
        window.addEventListener('resize', handleResize);
        
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleBack = () => {
        navigate('/manager');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        navigate('/signin');
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container>
                <Typography variant="h6" color="error" align="center" sx={{ my: 4 }}>
                    Ошибка загрузки профиля. Пожалуйста, попробуйте позже.
                </Typography>
                <Box textAlign="center">
                    <Button variant="outlined" onClick={handleBack}>
                        Вернуться к панели
                    </Button>
                </Box>
            </Container>
        );
    }

    if (!profile || profile.role !== 'ADMINISTRATOR') {
        return (
            <Container>
                <Typography variant="h6" color="error" align="center" sx={{ my: 4 }}>
                    Доступ запрещен. Эта страница только для администраторов.
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
                <Button variant="outlined" onClick={handleBack} sx={{ mr: 2 }}>
                    Назад
                </Button>
                <Typography variant="h4" component="h1">
                    Профиль администратора
                </Typography>
            </Box>
            
            <Paper sx={{ p: 3, mb: 4, flex: 1 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={4} display="flex" justifyContent="center">
                        <Avatar
                            src={`http://localhost:9090/me/photo?token=${localStorage.getItem('token')}`}
                            alt={`${profile.first_name} ${profile.last_name}`}
                            sx={{ width: 150, height: 150 }}
                        />
                    </Grid>
                    
                    <Grid item xs={12} sm={8}>
                        <Typography variant="h5" gutterBottom>
                            {profile.first_name} {profile.last_name}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            <strong>Email:</strong> {profile.email}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            <strong>Телефон:</strong> {profile.phone_number}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            <strong>Роль:</strong> {profile.role}
                        </Typography>
                    </Grid>
                    
                    {profile.barbershop_id && (
                        <Grid item xs={12}>
                            <Typography variant="h6" sx={{ mt: 2 }}>
                                Информация о барбершопе
                            </Typography>
                            <Typography variant="body1">
                                <strong>ID барбершопа:</strong> {profile.barbershop_id}
                            </Typography>
                        </Grid>
                    )}
                    
                    {profile.about_me && (
                        <Grid item xs={12}>
                            <Typography variant="h6" sx={{ mt: 2 }}>
                                Обо мне
                            </Typography>
                            <Typography variant="body1">
                                {profile.about_me}
                            </Typography>
                        </Grid>
                    )}

                    <Grid item xs={12} sx={{ mt: 3 }}>
                        <Box display="flex" justifyContent="flex-end">
                            <Button 
                                variant="contained" 
                                color="error" 
                                onClick={handleLogout}
                            >
                                Выход
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default AdministratorProfilePage; 