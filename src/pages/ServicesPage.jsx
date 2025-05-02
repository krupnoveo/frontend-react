import {useState} from 'react';
import {useGetServicesQuery} from '../store/apiSlice';
import {
    Alert,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Chip,
    CircularProgress,
    Container,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Typography
} from '@mui/material';

const ServiceItem = ({ service }) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6">{service.name}</Typography>
                        <Chip label={`${service.average_time} мин`} color="primary" />
                    </Box>
                </CardContent>
                <CardActions>
                    <Button size="small" onClick={() => setOpen(true)}>Подробнее</Button>
                </CardActions>
            </Card>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{service.name}</DialogTitle>
                <DialogContent>
                    <DialogContentText paragraph>
                        {service.description}
                    </DialogContentText>

                    <Typography variant="subtitle1">Стоимость:</Typography>
                    <Table size="small">
                        <TableBody>
                            <TableRow>
                                <TableCell>Младший барбер</TableCell>
                                <TableCell align="right">{service.first_grade_price} ₽</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Топ-барбер</TableCell>
                                <TableCell align="right">{service.second_grade_price} ₽</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Бренд-барбер</TableCell>
                                <TableCell align="right">{service.third_grade_price} ₽</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </DialogContent>
            </Dialog>
        </>
    );
};

const ServicesPage = () => {
    const { data: services, isLoading, isError } = useGetServicesQuery();

    return (
        <Container maxWidth="md" sx={{
            py: 4,
            minHeight: '90vh'
        }}>
            <Typography variant="h2" gutterBottom align="center">
                Услуги
            </Typography>

            {isLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            )}

            {isError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    Не удалось загрузить список услуг
                </Alert>
            )}

            {services?.services?.map((service) => (
                <ServiceItem key={service.id} service={service} />
            ))}
        </Container>
    );
};

export default ServicesPage;