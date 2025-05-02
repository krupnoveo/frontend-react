import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Box, 
    Typography, 
    Container, 
    Paper, 
    Grid, 
    Button, 
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import { 
    useGetRecordByIdQuery, 
    useGetClientByIdQuery,
    useGetAvailableTimesQuery,
    useUpdateRecordTimeMutation,
    useCancelRecordMutation
} from '../store/apiSlice';

const RecordDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [selectedTimeId, setSelectedTimeId] = useState('');
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
        data: record, 
        isLoading: recordLoading, 
        error: recordError 
    } = useGetRecordByIdQuery(id);
    
    const { 
        data: client, 
        isLoading: clientLoading, 
        error: clientError 
    } = useGetClientByIdQuery(record?.client_id, {
        skip: !record?.client_id
    });
    
    const { 
        data: availableTimes, 
        isLoading: timesLoading, 
        error: timesError 
    } = useGetAvailableTimesQuery(record?.barber_id, {
        skip: !record?.barber_id
    });
    
    const [updateTime, { isLoading: isUpdating }] = useUpdateRecordTimeMutation();
    const [deleteRecord, { isLoading: isDeleting }] = useCancelRecordMutation();

    const handleBack = () => {
        navigate('/manager');
    };

    const handleTimeChange = (event) => {
        setSelectedTimeId(event.target.value);
    };

    const handleUpdateTime = async () => {
        if (!selectedTimeId) return;
        
        try {
            await updateTime({
                id: record.id,
                time: selectedTimeId
            }).unwrap();
            alert('Время записи успешно изменено');
        } catch (error) {
            console.error('Ошибка при изменении времени:', error);
            alert('Не удалось изменить время записи');
        }
    };

    const handleDeleteRecord = async () => {
        if (window.confirm('Вы уверены, что хотите удалить эту запись?')) {
            try {
                await deleteRecord(record.id).unwrap();
                alert('Запись удалена');
                navigate('/manager');
            } catch (error) {
                console.error('Ошибка при удалении записи:', error);
                alert('Не удалось удалить запись');
            }
        }
    };

    const isLoading = recordLoading || clientLoading || timesLoading || isUpdating || isDeleting;
    const hasError = recordError || clientError || timesError;

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    if (hasError) {
        return (
            <Container>
                <Typography variant="h6" color="error" align="center" sx={{ my: 4 }}>
                    Ошибка загрузки данных. Пожалуйста, попробуйте позже.
                </Typography>
                <Box textAlign="center">
                    <Button variant="outlined" onClick={handleBack}>
                        Вернуться к панели
                    </Button>
                </Box>
            </Container>
        );
    }

    if (!record) {
        return (
            <Container>
                <Typography variant="h6" color="error" align="center" sx={{ my: 4 }}>
                    Запись не найдена
                </Typography>
                <Box textAlign="center">
                    <Button variant="outlined" onClick={handleBack}>
                        Вернуться к панели
                    </Button>
                </Box>
            </Container>
        );
    }

    const timeOptions = availableTimes?.times || [];
    
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
                    Детали записи
                </Typography>
            </Box>
            
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Paper sx={{ p: 3, mb: 4, flex: 1 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6" gutterBottom>
                                Информация о записи
                            </Typography>
                            <Typography><strong>ID:</strong> {record.id}</Typography>
                            <Typography><strong>Дата и время:</strong> {new Date(record.time).toLocaleString()}</Typography>
                            <Typography><strong>Услуга:</strong> {record.service_name}</Typography>
                            <Typography><strong>Стоимость:</strong> {record.price} ₽</Typography>
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6" gutterBottom>
                                Информация о барбершопе
                            </Typography>
                            <Typography><strong>Адрес:</strong> {record.barbershop_address}</Typography>
                            <Typography><strong>Телефон:</strong> {record.barbershop_phone_number}</Typography>
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6" gutterBottom>
                                Информация о клиенте
                            </Typography>
                            <Typography><strong>Имя:</strong> {record.client_first_name}</Typography>
                            {client && (
                                <>
                                    <Typography><strong>Email:</strong> {client.email}</Typography>
                                    <Typography><strong>Телефон:</strong> {client.phone_number}</Typography>
                                </>
                            )}
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6" gutterBottom>
                                Информация о барбере
                            </Typography>
                            <Typography><strong>Имя:</strong> {record.barber_first_name}</Typography>
                            <Typography><strong>Класс:</strong> {record.grade}</Typography>
                        </Grid>
                    </Grid>
                </Paper>
                
                <Paper sx={{ p: 3, mb: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        Изменить время записи
                    </Typography>
                    
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={8}>
                            <FormControl fullWidth>
                                <InputLabel id="time-select-label">Новое время</InputLabel>
                                <Select
                                    labelId="time-select-label"
                                    value={selectedTimeId}
                                    label="Новое время"
                                    onChange={handleTimeChange}
                                >
                                    {timeOptions.map((time) => (
                                        <MenuItem key={time.id} value={time.id}>
                                            {new Date(time.time).toLocaleString()}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                fullWidth 
                                sx={{ height: '100%' }}
                                disabled={!selectedTimeId}
                                onClick={handleUpdateTime}
                            >
                                Обновить время
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
                
                <Box textAlign="right">
                    <Button 
                        variant="contained" 
                        color="error" 
                        onClick={handleDeleteRecord}
                    >
                        Удалить запись
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default RecordDetailsPage; 