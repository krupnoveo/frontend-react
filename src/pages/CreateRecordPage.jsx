import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    MenuItem,
    TextField,
    Divider,
    FormControlLabel,
    Switch
} from '@mui/material';
import {
    useGetProfileQuery,
    useGetBarbersQuery,
    useGetServicesQuery,
    useGetAvailableTimesQuery,
    useGetClientsQuery,
    useCreateRecordMutation
} from '../store/apiSlice';

const CreateRecordPage = () => {
    const navigate = useNavigate();
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
    
    const [formData, setFormData] = useState({
        barberId: '',
        serviceId: '',
        timeId: '',
        clientId: '',
        useExistingClient: true,
        newClientName: '',
        newClientEmail: '',
        newClientPhone: ''
    });

    const { data: profile, isLoading: profileLoading } = useGetProfileQuery();
    
    const { data: barbers, isLoading: barbersLoading } = useGetBarbersQuery(
        profile?.barbershop_id, 
        { skip: !profile?.barbershop_id }
    );
    
    const { data: services, isLoading: servicesLoading } = useGetServicesQuery();
    
    const { data: availableTimes, isLoading: timesLoading } = useGetAvailableTimesQuery(
        formData.barberId, 
        { skip: !formData.barberId }
    );

    const { data: clients, isLoading: clientsLoading } = useGetClientsQuery();
    
    const [createRecord, { isLoading: isCreating }] = useCreateRecordMutation();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        if (name === 'barberId') {
            setFormData(prev => ({
                ...prev,
                timeId: ''
            }));
        }
    };

    const handleClientTypeToggle = (e) => {
        setFormData(prev => ({
            ...prev,
            useExistingClient: e.target.checked,
            clientId: '',
            newClientName: '',
            newClientEmail: '',
            newClientPhone: ''
        }));
    };

    const handleBack = () => {
        navigate('/manager');
    };

    const handleCancel = () => {
        navigate('/manager');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.barberId || !formData.serviceId || !formData.timeId) {
            alert('Пожалуйста, заполните все обязательные поля');
            return;
        }

        if (formData.useExistingClient && !formData.clientId) {
            alert('Пожалуйста, выберите клиента');
            return;
        }
        
        try {
            const recordData = {
                barber_id: formData.barberId,
                barbershop_id: profile.barbershop_id,
                service_id: formData.serviceId,
                time_id: formData.timeId,
                client_id: formData.useExistingClient ? formData.clientId : undefined
            };
            
            await createRecord(recordData).unwrap();
            alert('Запись успешно создана');
            setTimeout(() => {
                navigate('/manager');
            }, 2000);
        } catch (error) {
            console.error('Ошибка при создании записи:', error);
            alert('Не удалось создать запись. Пожалуйста, попробуйте снова.');
        }
    };

    const isLoading = profileLoading || barbersLoading || servicesLoading || timesLoading || clientsLoading || isCreating;

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
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

    const barberOptions = barbers?.users || [];
    const serviceOptions = services?.services || [];
    const timeOptions = availableTimes?.times || [];
    const clientOptions = clients?.users || [];
    
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
                    Создание новой записи
                </Typography>
            </Box>

            <Paper 
                component="form" 
                onSubmit={handleSubmit} 
                sx={{ p: 3, flex: 1 }}
            >
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                            Детали записи
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth required>
                            <InputLabel id="barber-select-label">Барбер</InputLabel>
                            <Select
                                labelId="barber-select-label"
                                name="barberId"
                                value={formData.barberId}
                                label="Барбер *"
                                onChange={handleChange}
                            >
                                {barberOptions.map((barber) => (
                                    <MenuItem key={barber.id} value={barber.id}>
                                        {barber.first_name} {barber.last_name} ({barber.grade})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth required>
                            <InputLabel id="service-select-label">Услуга</InputLabel>
                            <Select
                                labelId="service-select-label"
                                name="serviceId"
                                value={formData.serviceId}
                                label="Услуга *"
                                onChange={handleChange}
                            >
                                {serviceOptions.map((service) => (
                                    <MenuItem key={service.id} value={service.id}>
                                        {service.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        <FormControl fullWidth required disabled={!formData.barberId}>
                            <InputLabel id="time-select-label">Время записи</InputLabel>
                            <Select
                                labelId="time-select-label"
                                name="timeId"
                                value={formData.timeId}
                                label="Время записи *"
                                onChange={handleChange}
                            >
                                {timeOptions.map((time) => (
                                    <MenuItem key={time.id} value={time.id}>
                                        {new Date(time.time).toLocaleString()}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sx={{ mt: 2 }}>
                        <Divider />
                        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                            Информация о клиенте
                        </Typography>
                        <FormControlLabel
                            control={
                                <Switch 
                                    checked={formData.useExistingClient}
                                    onChange={handleClientTypeToggle}
                                    name="useExistingClient" 
                                />
                            }
                            label="Выбрать из существующих клиентов"
                        />
                    </Grid>

                    {formData.useExistingClient ? (
                        <Grid item xs={12}>
                            <FormControl fullWidth required>
                                <InputLabel id="client-select-label">Клиент</InputLabel>
                                <Select
                                    labelId="client-select-label"
                                    name="clientId"
                                    value={formData.clientId}
                                    label="Клиент *"
                                    onChange={handleChange}
                                >
                                    {clientOptions.map((client) => (
                                        <MenuItem key={client.id} value={client.id}>
                                            {client.first_name} {client.last_name} - {client.email}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    ) : (
                        <>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="newClientName"
                                    label="Имя клиента"
                                    fullWidth
                                    value={formData.newClientName}
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="newClientPhone"
                                    label="Телефон клиента"
                                    fullWidth
                                    value={formData.newClientPhone}
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    name="newClientEmail"
                                    label="Email клиента"
                                    fullWidth
                                    type="email"
                                    value={formData.newClientEmail}
                                    onChange={handleChange}
                                />
                            </Grid>
                        </>
                    )}

                    <Grid item xs={12} sx={{ mt: 3 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            size="large"
                            fullWidth
                            disabled={
                                !formData.barberId || 
                                !formData.serviceId || 
                                !formData.timeId || 
                                (formData.useExistingClient && !formData.clientId)
                            }
                        >
                            Создать запись
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default CreateRecordPage; 