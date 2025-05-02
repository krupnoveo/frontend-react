import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, CircularProgress, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useGetProfileQuery, useGetBarbershopRecordsQuery, useCancelRecordMutation } from '../store/apiSlice';

const AdministratorPage = () => {
    console.log("AdministratorPage: Component initialized");
    const navigate = useNavigate();
    const { data: profile, isLoading: profileLoading, error: profileError } = useGetProfileQuery();
    const [deleteRecord] = useCancelRecordMutation();
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    
    console.log("AdministratorPage: Profile data", { profile, isLoading: profileLoading, error: profileError });
    
    useEffect(() => {
        const handleResize = () => {
            setWindowHeight(window.innerHeight);
        };
        
        window.addEventListener('resize', handleResize);
        console.log("AdministratorPage: Window resize listener added");
        
        return () => {
            window.removeEventListener('resize', handleResize);
            console.log("AdministratorPage: Window resize listener removed");
        };
    }, []);
    
    const { 
        data: recordsData, 
        isLoading: recordsLoading, 
        error: recordsError 
    } = useGetBarbershopRecordsQuery(profile?.barbershop_id, { 
        skip: !profile?.barbershop_id
    });
    
    console.log("AdministratorPage: Records data", { 
        recordsData, 
        isLoading: recordsLoading, 
        error: recordsError,
        barbershopId: profile?.barbershop_id
    });

    const handleRecordClick = (recordId) => {
        navigate(`/manager/record/${recordId}`);
    };

    const handleCreateRecordClick = () => {
        navigate('/manager/record/new');
    };

    const handleProfileClick = () => {
        navigate('/manager/profile');
    };

    const handleBarbersClick = () => {
        navigate('/manager/barbers');
    };

    const handleDeleteRecord = async (recordId) => {
        if (window.confirm('Вы уверены, что хотите удалить эту запись?')) {
            try {
                await deleteRecord(recordId).unwrap();
            } catch (error) {
                console.error('Ошибка при удалении записи:', error);
            }
        }
    };

    if (profileLoading || recordsLoading) {
        console.log("AdministratorPage: Rendering loading state");
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    if (profileError || recordsError) {
        console.log("AdministratorPage: Rendering error state");
        return (
            <Container>
                <Typography variant="h6" color="error" align="center" sx={{ my: 4 }}>
                    Ошибка загрузки данных. Пожалуйста, попробуйте позже.
                </Typography>
            </Container>
        );
    }

    if (!profile) {
        console.log("AdministratorPage: Rendering no profile state");
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    if (profile.role !== 'ADMINISTRATOR') {
        console.log("AdministratorPage: Rendering access denied state. User role:", profile.role);
        return (
            <Container>
                <Typography variant="h6" color="error" align="center" sx={{ my: 4 }}>
                    Доступ запрещен. Эта страница только для администраторов.
                </Typography>
            </Container>
        );
    }

    const records = recordsData?.records || [];
    console.log("AdministratorPage: Rendering main content with records:", records.length);
    
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Панель администратора
                </Typography>
                <Box>
                    <Button 
                        variant="outlined" 
                        color="primary" 
                        onClick={handleBarbersClick}
                        sx={{ mr: 2 }}
                    >
                        Список барберов
                    </Button>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={handleCreateRecordClick}
                    >
                        Добавить запись
                    </Button>
                </Box>
            </Box>

            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                    Информация о барбершопе
                </Typography>
                <Paper sx={{ p: 2 }}>
                    <Typography>
                        <strong>Администратор:</strong> {profile.first_name} {profile.last_name}
                        {' '}
                        <Link 
                            component="button" 
                            variant="body2" 
                            onClick={handleProfileClick}
                            sx={{ ml: 1 }}
                        >
                            (Просмотр профиля)
                        </Link>
                    </Typography>
                    <Typography><strong>ID барбершопа:</strong> {profile.barbershop_id}</Typography>
                </Paper>
            </Box>

            <Typography variant="h6" component="h2" gutterBottom>
                Все записи
            </Typography>
            <Box sx={{ flex: 1 }}>
                {records.length === 0 ? (
                    <Paper sx={{ p: 2 }}>
                        <Typography align="center">Записей не найдено.</Typography>
                    </Paper>
                ) : (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Клиент</TableCell>
                                    <TableCell>Барбер</TableCell>
                                    <TableCell>Услуга</TableCell>
                                    <TableCell>Время</TableCell>
                                    <TableCell>Стоимость</TableCell>
                                    <TableCell>Действия</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {records.map((record) => (
                                    <TableRow key={record.id}>
                                        <TableCell>{record.client_first_name}</TableCell>
                                        <TableCell>{record.barber_first_name} ({record.grade})</TableCell>
                                        <TableCell>{record.service_name}</TableCell>
                                        <TableCell>{new Date(record.time).toLocaleString()}</TableCell>
                                        <TableCell>{record.price} ₽</TableCell>
                                        <TableCell>
                                            <Button 
                                                size="small" 
                                                onClick={() => handleRecordClick(record.id)}
                                                sx={{ mr: 1 }}
                                            >
                                                Просмотр
                                            </Button>
                                            <Button 
                                                size="small" 
                                                color="error" 
                                                onClick={() => handleDeleteRecord(record.id)}
                                            >
                                                Удалить
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Box>
        </Container>
    );
};

export default AdministratorPage; 