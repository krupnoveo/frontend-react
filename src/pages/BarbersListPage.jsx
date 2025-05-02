import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Typography, 
    Container, 
    Paper, 
    Grid,
    Card,
    CardContent,
    Chip,
    Avatar,
    Button,
    CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useGetProfileQuery, useGetBarbersQuery } from '../store/apiSlice';

const BarbersListPage = () => {
    const navigate = useNavigate();
    const { data: profile, isLoading: profileLoading, error: profileError } = useGetProfileQuery();
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
    
    const { 
        data: barbersData, 
        isLoading: barbersLoading, 
        error: barbersError 
    } = useGetBarbersQuery(profile?.barbershop_id, { 
        skip: !profile?.barbershop_id
    });

    const handleBack = () => {
        navigate('/manager');
    };

    if (profileLoading || barbersLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    if (profileError || barbersError) {
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

    if (profile.role !== 'ADMINISTRATOR') {
        return (
            <Container>
                <Typography variant="h6" color="error" align="center" sx={{ my: 4 }}>
                    Доступ запрещен. Эта страница только для администраторов.
                </Typography>
            </Container>
        );
    }

    const barbers = barbersData?.users || [];
    
    const minPageHeight = windowHeight - 140;

    return (
        <Container 
            maxWidth="lg" 
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
                    Барберы филиала
                </Typography>
            </Box>

            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                    Информация о барбершопе
                </Typography>
                <Paper sx={{ p: 2 }}>
                    <Typography>
                        <strong>Администратор:</strong> {profile.first_name} {profile.last_name}
                    </Typography>
                    <Typography><strong>ID барбершопа:</strong> {profile.barbershop_id}</Typography>
                </Paper>
            </Box>

            <Typography variant="h6" component="h2" gutterBottom>
                Список барберов
            </Typography>
            <Box sx={{ flex: 1 }}>
                {barbers.length === 0 ? (
                    <Paper sx={{ p: 2 }}>
                        <Typography align="center">Барберов не найдено.</Typography>
                    </Paper>
                ) : (
                    <Grid container spacing={3}>
                        {barbers.map((barber) => (
                            <Grid item xs={12} sm={6} md={4} key={barber.id}>
                                <Card variant="outlined" sx={{ height: '100%' }}>
                                    <CardContent>
                                        <Box display="flex" alignItems="center" mb={2}>
                                            <Avatar
                                                src={`http://localhost:9090/me/${barber.id}/photo?token=${localStorage.getItem('token')}`}
                                                alt={`${barber.first_name} ${barber.last_name}`}
                                                sx={{ width: 64, height: 64, mr: 2 }}
                                            />
                                            <Box>
                                                <Typography variant="h6">
                                                    {barber.first_name} {barber.last_name}
                                                </Typography>
                                                <Chip
                                                    label={barber.grade}
                                                    size="small"
                                                    color="primary"
                                                    sx={{ mt: 0.5 }}
                                                />
                                            </Box>
                                        </Box>
                                        
                                        {barber.email && (
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                <strong>Email:</strong> {barber.email}
                                            </Typography>
                                        )}
                                        
                                        {barber.phone_number && (
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                <strong>Телефон:</strong> {barber.phone_number}
                                            </Typography>
                                        )}
                                        
                                        {barber.about_me && (
                                            <Typography variant="body2" mt={1}>
                                                {barber.about_me}
                                            </Typography>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>
        </Container>
    );
};

export default BarbersListPage; 