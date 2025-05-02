import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Typography, 
    Container, 
    Paper, 
    Tabs, 
    Tab,
    Button, 
    CircularProgress,
    AppBar,
    Divider,
    Card,
    CardContent,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Avatar,
    Chip
} from '@mui/material';
import { 
    Add as AddIcon, 
    Edit as EditIcon, 
    Delete as DeleteIcon,
    PhotoCamera as PhotoCameraIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { 
    useGetProfileQuery, 
    useGetBarbershopsQuery,
    useGetAllUsersQuery,
    useGetServicesQuery,
    useDeleteUserMutation,
    useDeleteBarbershopMutation,
    useDeleteServiceMutation
} from '../store/apiSlice';

const BarbershopsTab = ({ barbershops, onAddNew, onEdit, onDelete }) => {
    return (
        <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Список барбершопов</Typography>
                <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<AddIcon />}
                    onClick={onAddNew}
                >
                    Добавить барбершоп
                </Button>
            </Box>
            
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Название</TableCell>
                            <TableCell>Адрес</TableCell>
                            <TableCell>Телефон</TableCell>
                            <TableCell>Режим работы</TableCell>
                            <TableCell align="right">Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {barbershops.map((barbershop) => (
                            <TableRow key={barbershop.id}>
                                <TableCell>{barbershop.name}</TableCell>
                                <TableCell>{barbershop.address}</TableCell>
                                <TableCell>{barbershop.phone_number}</TableCell>
                                <TableCell>{barbershop.working_time}</TableCell>
                                <TableCell align="right">
                                    <IconButton 
                                        color="primary" 
                                        onClick={() => onEdit(barbershop)}
                                        size="small"
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton 
                                        color="error" 
                                        onClick={() => onDelete(barbershop.id)}
                                        size="small"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

const UsersTab = ({ users, onAddBarber, onAddAdmin, onEdit, onDelete }) => {
    const administrators = users.filter(user => user.role === 'ADMINISTRATOR');
    const barbers = users.filter(user => user.role === 'BARBER');
    
    return (
        <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Персонал</Typography>
                <Box>
                    <Button 
                        variant="outlined" 
                        color="primary" 
                        startIcon={<AddIcon />}
                        onClick={onAddAdmin}
                        sx={{ mr: 1 }}
                    >
                        Добавить администратора
                    </Button>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        startIcon={<AddIcon />}
                        onClick={onAddBarber}
                    >
                        Добавить барбера
                    </Button>
                </Box>
            </Box>
            
            <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>Администраторы</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Имя</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Телефон</TableCell>
                            <TableCell>Барбершоп</TableCell>
                            <TableCell align="right">Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {administrators.map((admin) => (
                            <TableRow key={admin.id}>
                                <TableCell>{admin.first_name} {admin.last_name}</TableCell>
                                <TableCell>{admin.email}</TableCell>
                                <TableCell>{admin.phone_number}</TableCell>
                                <TableCell>{admin.barbershop_id}</TableCell>
                                <TableCell align="right">
                                    <IconButton 
                                        color="primary" 
                                        onClick={() => onEdit(admin)}
                                        size="small"
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton 
                                        color="error" 
                                        onClick={() => onDelete(admin.id)}
                                        size="small"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            
            <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>Барберы</Typography>
            <Grid container spacing={3}>
                {barbers.map((barber) => (
                    <Grid item xs={12} sm={6} md={4} key={barber.id}>
                        <Card variant="outlined">
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
                                            label={barber.grade || 'Без категории'}
                                            size="small"
                                            color="primary"
                                            sx={{ mt: 0.5 }}
                                        />
                                    </Box>
                                </Box>
                                
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    <strong>Email:</strong> {barber.email}
                                </Typography>
                                
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    <strong>Телефон:</strong> {barber.phone_number}
                                </Typography>
                                
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    <strong>Барбершоп:</strong> {barber.barbershop_id}
                                </Typography>
                                
                                <Box mt={2} display="flex" justifyContent="flex-end">
                                    <IconButton 
                                        color="primary" 
                                        onClick={() => onEdit(barber)}
                                        size="small"
                                        sx={{ mr: 1 }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton 
                                        color="error" 
                                        onClick={() => onDelete(barber.id)}
                                        size="small"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

const ServicesTab = ({ services, onAddNew, onEdit, onDelete }) => {
    return (
        <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Список услуг</Typography>
                <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<AddIcon />}
                    onClick={onAddNew}
                >
                    Добавить услугу
                </Button>
            </Box>
            
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Название</TableCell>
                            <TableCell>Описание</TableCell>
                            <TableCell>Цена (Младший барбер)</TableCell>
                            <TableCell>Цена (Топ-барбер)</TableCell>
                            <TableCell>Цена (Бренд-барбер)</TableCell>
                            <TableCell>Длительность (мин)</TableCell>
                            <TableCell align="right">Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {services.map((service) => (
                            <TableRow key={service.id}>
                                <TableCell>{service.name}</TableCell>
                                <TableCell>{service.description}</TableCell>
                                <TableCell>{service.first_grade_price} ₽</TableCell>
                                <TableCell>{service.second_grade_price} ₽</TableCell>
                                <TableCell>{service.third_grade_price} ₽</TableCell>
                                <TableCell>{service.average_time}</TableCell>
                                <TableCell align="right">
                                    <IconButton 
                                        color="primary" 
                                        onClick={() => onEdit(service)}
                                        size="small"
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton 
                                        color="error" 
                                        onClick={() => onDelete(service.id)}
                                        size="small"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

const AdminPage = () => {
    const navigate = useNavigate();
    const { data: profile, isLoading: profileLoading, error: profileError } = useGetProfileQuery();
    const { data: barbershopsData, isLoading: barbershopsLoading } = useGetBarbershopsQuery();
    const { data: usersData, isLoading: usersLoading } = useGetAllUsersQuery();
    const { data: servicesData, isLoading: servicesLoading } = useGetServicesQuery();
    
    const [deleteUser] = useDeleteUserMutation();
    const [deleteBarbershop] = useDeleteBarbershopMutation();
    const [deleteService] = useDeleteServiceMutation();
    
    const [activeTab, setActiveTab] = useState(0);
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
    
    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };
    
    const handleAddBarbershop = () => {
        navigate('/admin/barbershop/new');
    };
    
    const handleEditBarbershop = (barbershop) => {
        navigate(`/admin/barbershop/${barbershop.id}`);
    };
    
    const handleDeleteBarbershop = async (barbershopId) => {
        if (window.confirm('Вы уверены, что хотите удалить этот барбершоп?')) {
            try {
                await deleteBarbershop(barbershopId).unwrap();
            } catch (error) {
                console.error('Ошибка при удалении барбершопа:', error);
                alert('Ошибка при удалении барбершопа');
            }
        }
    };
    
    const handleAddBarber = () => {
        navigate('/admin/barber/new');
    };
    
    const handleAddAdmin = () => {
        navigate('/admin/administrator/new');
    };
    
    const handleEditUser = (user) => {
        navigate(`/admin/user/${user.id}`);
    };
    
    const handleDeleteUser = async (userId) => {
        if (window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
            try {
                await deleteUser(userId).unwrap();
            } catch (error) {
                console.error('Ошибка при удалении пользователя:', error);
                alert('Ошибка при удалении пользователя');
            }
        }
    };
    
    const handleAddService = () => {
        navigate('/admin/service/new');
    };
    
    const handleEditService = (service) => {
        navigate(`/admin/service/${service.id}`);
    };
    
    const handleDeleteService = async (serviceId) => {
        if (window.confirm('Вы уверены, что хотите удалить эту услугу?')) {
            try {
                await deleteService(serviceId).unwrap();
            } catch (error) {
                console.error('Ошибка при удалении услуги:', error);
                alert('Ошибка при удалении услуги');
            }
        }
    };

    if (profileLoading || barbershopsLoading || usersLoading || servicesLoading) {
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

    const barbershops = barbershopsData?.barbershops || [];
    const users = usersData?.users || [];
    const services = servicesData?.services || [];
    
    const minPageHeight = windowHeight - 180;

    return (
        <Box sx={{ mb: 4 }}>
            <AppBar position="static" color="default" elevation={0}>
                <Container maxWidth="lg">
                    <Box sx={{ py: 1 }}>
                        <Typography variant="h5" component="h1">
                            Панель управления системой
                        </Typography>
                        <Typography variant="subtitle2" color="text.secondary">
                            Администратор: {profile.first_name} {profile.last_name}
                        </Typography>
                    </Box>
                    
                    <Tabs 
                        value={activeTab} 
                        onChange={handleTabChange} 
                        indicatorColor="primary"
                        textColor="primary"
                        sx={{ mt: 1 }}
                    >
                        <Tab label="Барбершопы" />
                        <Tab label="Персонал" />
                        <Tab label="Услуги" />
                    </Tabs>
                </Container>
            </AppBar>
            
            <Container 
                maxWidth="lg" 
                sx={{ 
                    minHeight: `${minPageHeight}px`,
                    py: 3
                }}
            >
                {activeTab === 0 && (
                    <BarbershopsTab 
                        barbershops={barbershops} 
                        onAddNew={handleAddBarbershop}
                        onEdit={handleEditBarbershop}
                        onDelete={handleDeleteBarbershop}
                    />
                )}
                
                {activeTab === 1 && (
                    <UsersTab 
                        users={users} 
                        onAddBarber={handleAddBarber}
                        onAddAdmin={handleAddAdmin}
                        onEdit={handleEditUser}
                        onDelete={handleDeleteUser}
                    />
                )}
                
                {activeTab === 2 && (
                    <ServicesTab 
                        services={services} 
                        onAddNew={handleAddService}
                        onEdit={handleEditService}
                        onDelete={handleDeleteService}
                    />
                )}
            </Container>
        </Box>
    );
};

export default AdminPage; 