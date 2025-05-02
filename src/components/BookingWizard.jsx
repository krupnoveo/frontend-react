import {useState} from 'react';
import {Alert, Box, Button, Card, CardContent, Chip, Grid, Step, StepLabel, Stepper, Typography} from '@mui/material';
import {useGetBarbershopsQuery, useGetRecordsQuery, useGetServicesQuery} from '../store/apiSlice';

const steps = ['Выбор филиала', 'Выбор мастера', 'Выбор услуги', 'Выбор времени'];

const BookingWizard = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [selectedBarbershop, setSelectedBarbershop] = useState(null);
    const [selectedBarber, setSelectedBarber] = useState(null);
    const [selectedService, setSelectedService] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [availableBarbers, setAvailableBarbers] = useState([]);
    const [availableTimes, setAvailableTimes] = useState([]);
    const [bookingError, setBookingError] = useState('');
    const [currentDayIndex, setCurrentDayIndex] = useState(0);


    // API Queries
    const { data: barbershops } = useGetBarbershopsQuery();
    const { data: services } = useGetServicesQuery();
    const { refetch: refetchRecords } = useGetRecordsQuery();

    const handleNext = () => {
        setActiveStep((prevStep) => prevStep + 1);
        setBookingError('');
    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
        setBookingError('');
    };

    const handleBarbershopSelect = (barbershop) => {
        setSelectedBarbershop(barbershop);
        // Загрузка мастеров при выборе филиала
        fetch(`http://localhost:9090/me/all?barbershopId=${barbershop.id}&role=BARBER`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => res.json())
            .then(data => setAvailableBarbers(data))
            .catch(console.error);
        //handleNext();
    };

    const handleBarberSelect = (barber) => {
        setSelectedBarber(barber);
        // Загрузка доступного времени
        fetch(`http://localhost:9090/available_time/all?barberId=${barber.id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => res.json())
            .then(data => setAvailableTimes(data))
            .catch(console.error);
        //handleNext();
    };

    const handleServiceSelect = (service) => {
        setSelectedService(service);
        //handleNext();
    };

    const handleTimeSelect = (time) => {
        setSelectedTime(time);
        //handleNext();
    };

    const handleConfirmBooking = async () => {
        try {
            const response = await fetch('http://localhost:9090/record/new', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    barber_id: selectedBarber.id,
                    barbershop_id: selectedBarbershop.id,
                    service_id: selectedService.id,
                    time_id: selectedTime.id
                })
            });

            if (!response.ok) throw new Error('Ошибка записи');

            await refetchRecords();
            handleNext();
        } catch (error) {
            setBookingError(error.message);
        }
    };

    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Grid container spacing={3} sx={{ mt: 2,}}>
                        {barbershops?.barbershops?.map((barbershop) => (
                            <Grid item xs={12} md={6} key={barbershop.id}>
                                <Card
                                    variant="outlined"
                                    onClick={()  => handleBarbershopSelect(barbershop)}
                                    sx={{
                                        cursor: 'pointer',
                                        '&:hover': { boxShadow: 3 },
                                        borderColor: selectedBarbershop?.id === barbershop.id ? 'primary.main' : 'divider',
                                        borderWidth: selectedBarbershop?.id === barbershop.id ? '2px' : '1px',
                                    }}
                                >
                                    <CardContent>
                                        <Typography variant="h6">{barbershop.address}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {barbershop.working_time}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                );
            case 1:
                return (
                    <Grid container spacing={3} sx={{ mt: 2, }}>
                        {availableBarbers?.users?.map((barber) => (
                            <Grid item xs={12} md={6} key={barber.id}>
                                <Card
                                    variant="outlined"
                                    onClick={() => handleBarberSelect(barber)}
                                    sx={{
                                        cursor: 'pointer',
                                        '&:hover': { boxShadow: 3 },
                                        borderColor: selectedBarber?.id === barber.id ? 'primary.main' : 'divider',
                                        borderWidth: selectedBarber?.id === barber.id ? '2px' : '1px',
                                    }}
                                >
                                    <CardContent>
                                        <Typography variant="h6">
                                            {barber.first_name} {barber.last_name}
                                        </Typography>
                                        <Chip
                                            label={barber.grade}
                                            size="small"
                                            color="primary"
                                            sx={{ mt: 1 }}
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                );
            case 2:
                return (
                    <Grid container spacing={3} sx={{ mt: 2,}}>
                        {services?.services?.map((service) => (
                            <Grid item xs={12} md={6} key={service.id}>
                                <Card
                                    variant="outlined"
                                    onClick={() => handleServiceSelect(service)}
                                    sx={{
                                        cursor: 'pointer',
                                        '&:hover': { boxShadow: 3 },
                                        borderColor: selectedService?.id === service.id ? 'primary.main' : 'divider',
                                        borderWidth: selectedService?.id === service.id ? '2px' : '1px',
                                    }}
                                >
                                    <CardContent>
                                        <Typography variant="h6">{service.name}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {service.average_time} минут
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                );
            case 3:
                // return (
                //     <Grid container spacing={3} sx={{ mt: 2 }}>
                //         {availableTimes?.times?.map((time) => (
                //             <Grid item xs={6} md={4} key={time.id}>
                //                 <Card
                //                     variant="outlined"
                //                     onClick={() => handleTimeSelect(time)}
                //                     sx={{ cursor: 'pointer', '&:hover': { boxShadow: 3 } }}
                //                 >
                //                     <CardContent>
                //                         <Typography align="center">
                //                             {new Date(time.time).toLocaleTimeString([], {
                //                                 month: 'numeric',
                //                                 day: 'numeric',
                //                                 hour: '2-digit',
                //                                 minute: '2-digit'
                //                             })}
                //                         </Typography>
                //                     </CardContent>
                //                 </Card>
                //             </Grid>
                //         ))}
                //     </Grid>
                // );

                // Группируем времена по дням
                const groupedDays = availableTimes?.times?.reduce((acc, time) => {
                    const date = new Date(time.time);
                    const dayKey = date.toISOString().split('T')[0]; // Группируем по датам в формате YYYY-MM-DD

                    if (!acc[dayKey]) {
                        acc[dayKey] = {
                            date: date,
                            times: []
                        };
                    }
                    acc[dayKey].times.push(time);
                    return acc;
                }, {});

                // Преобразуем в массив дней и сортируем
                const daysArray = groupedDays
                    ? Object.values(groupedDays).sort((a, b) => a.date - b.date)
                    : [];

                // Получаем текущий день для отображения
                const currentDay = daysArray[currentDayIndex];

                const handleDayChange = (direction) => {
                    setCurrentDayIndex(prev => Math.max(0, Math.min(daysArray.length - 1, prev + direction)));
                };

                return (
                    <Box sx={{ mt: 2}}>
                        {/* Панель навигации по дням */}
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            mb: 3
                        }}>
                            <Button
                                variant="outlined"
                                onClick={() => handleDayChange(-1)}
                                disabled={currentDayIndex === 0}
                            >
                                ←
                            </Button>

                            <Typography variant="h6">
                                {currentDay ? new Date(currentDay.date).toLocaleDateString('ru-RU', {
                                    day: 'numeric',
                                    month: 'long'
                                }) : 'Нет доступных дней'}
                            </Typography>

                            <Button
                                variant="outlined"
                                onClick={() => handleDayChange(1)}
                                disabled={currentDayIndex === daysArray.length - 1}
                            >
                                →
                            </Button>
                        </Box>

                        {/* Сетка времени */}
                        {currentDay ? (
                            <Grid container spacing={3}>
                                {currentDay.times.map((time) => (
                                    <Grid item xs={6} md={4} key={time.id}>
                                        <Card
                                            variant="outlined"
                                            onClick={() => handleTimeSelect(time)}
                                            sx={{
                                                cursor: 'pointer',
                                                '&:hover': { boxShadow: 3 },
                                                borderColor: selectedTime?.id === time.id ? 'primary.main' : 'divider',
                                                borderWidth: selectedTime?.id === time.id ? '2px' : '1px',
                                            }}
                                        >
                                            <CardContent>
                                                <Typography align="center">
                                                    {new Date(time.time).toLocaleTimeString('ru-RU', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            <Typography align="center" color="text.secondary">
                                Нет доступных времен для записи
                            </Typography>
                        )}
                    </Box>
                );
            default:
                return 'Неизвестный шаг';
        }
    };

    return (
        <Box sx={{ width: '100%', p: 3 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            {activeStep === steps.length ? (
                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Typography variant="h5" gutterBottom>
                        Запись успешно создана!
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => window.location.href = '/profile'}
                        sx={{ mt: 2 }}
                    >
                        Перейти в профиль
                    </Button>
                </Box>
            ) : (
                <>
                    <Box sx={{ mt: 4 }}>{getStepContent(activeStep)}</Box>

                    {bookingError && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {bookingError}
                        </Alert>
                    )}

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                        <Button
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            sx={{ mr: 2 }}
                        >
                            Назад
                        </Button>
                        <Button
                            variant="contained"
                            onClick={activeStep === steps.length - 1 ? handleConfirmBooking : handleNext}
                            disabled={
                                (activeStep === 0 && !selectedBarbershop) ||
                                (activeStep === 1 && !selectedBarber) ||
                                (activeStep === 2 && !selectedService) ||
                                (activeStep === 3 && !selectedTime)
                            }
                        >
                            {activeStep === steps.length - 1 ? 'Подтвердить запись' : 'Далее'}
                        </Button>
                    </Box>
                </>
            )}
        </Box>
    );
};

export default BookingWizard;