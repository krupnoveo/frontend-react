import { useState } from 'react';
import {useNavigate} from "react-router-dom";
import {
    Container,
    Typography,
    Box,
    CircularProgress,
    Alert,
    TextField,
    Button,
    Tabs,
    Tab,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import {
    useGetProfileQuery,
    useUpdateProfileMutation,
    useChangePasswordMutation,
    useGetRecordsQuery,
    apiSlice, useCancelRecordMutation
} from '../store/apiSlice';
import LogoutIcon from '@mui/icons-material/Logout';
import {useDispatch} from "react-redux";

const ProfilePage = () => {
    const { data: user, isLoading, error, refetch: refetchProfile } = useGetProfileQuery();
    const [updateProfile] = useUpdateProfileMutation();
    const [changePassword] = useChangePasswordMutation();
    const { data: records , refetch: refetchRecords } = useGetRecordsQuery();
    const [cancelRecord] = useCancelRecordMutation();
    const [tab, setTab] = useState(0);
    const [editData, setEditData] = useState({});
    const [password, setPassword] = useState('');
    const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleUpdateProfile = async () => {
        try {
            await updateProfile(editData).unwrap();
            refetchProfile();
        } catch (err) {
            console.error('Update error:', err);
        }
    };

    const handleChangePassword = async () => {
        try {
            await changePassword({ password }).unwrap();
            setOpenPasswordDialog(false);
        } catch (err) {
            console.error('Password change error:', err);
        }
    };

    const handleCancelRecord = async (recordId) => {
        try {
            await cancelRecord(recordId).unwrap();
            refetchRecords(); // Обновляем список записей
        } catch (err) {
            console.error('Ошибка отмены записи:', err);
        }
    };

    const handleLogout = () => {
        dispatch(apiSlice.util.resetApiState());
        // Удаляем токен и данные пользователя
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Перенаправляем на страницу входа
        navigate('/signin');
        window.location.reload();
    };

    return (
        <Container maxWidth="md" sx={{ py: 4, minHeight: '69vh' }}>
            {isLoading && (
                <CircularProgress />
            )}
            {error && (
                <Alert severity="error">Ошибка загрузки профиля</Alert>
            )}
            <Typography variant="h2" gutterBottom>Личный кабинет</Typography>
            <Button
                variant="contained"
                color="error"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{ height: 'fit-content' }}
            >
                Выйти
            </Button>
            <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)}>
                <Tab label="Профиль" />
                <Tab label="Мои записи" />
            </Tabs>

            {tab === 0 && user && (
                <Box sx={{ mt: 3 }}>
                    <TextField
                        fullWidth
                        label="Имя"
                        margin="normal"
                        defaultValue={user.first_name}
                        onChange={(e) => setEditData({ ...editData, first_name: e.target.value })}
                    />
                    <TextField
                        fullWidth
                        label="Фамилия"
                        margin="normal"
                        defaultValue={user.last_name}
                        onChange={(e) => setEditData({ ...editData, last_name: e.target.value })}
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        margin="normal"
                        defaultValue={user.email}
                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    />
                    <TextField
                        fullWidth
                        label="Телефон"
                        margin="normal"
                        defaultValue={user.phone_number}
                        onChange={(e) => setEditData({ ...editData, phone_number: e.target.value })}
                    />

                    <Button
                        variant="contained"
                        sx={{ mt: 2 }}
                        onClick={handleUpdateProfile}
                    >
                        Сохранить изменения
                    </Button>

                    <Button
                        variant="outlined"
                        sx={{ mt: 2, ml: 2 }}
                        onClick={() => setOpenPasswordDialog(true)}
                    >
                        Сменить пароль
                    </Button>
                </Box>
            )}

            {tab === 1 && (
                <>
                    <Button
                        variant="contained"
                        sx={{ mt: 2, mb: 4 }}
                        onClick={() => navigate('/new-booking')}
                    >
                        Новая запись
                    </Button>
                    <Box sx={{ mt: 3 }}>
                        {records?.records?.map(record => (
                            <Box key={record.id} sx={{ p: 2, border: '1px solid #ddd', borderRadius: 2, mb: 2 }}>
                                <Typography variant="h6">{record.service_name}</Typography>
                                <Typography>Дата: {new Date(record.time).toLocaleString([], {
                                    month: 'numeric',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}</Typography>
                                <Typography>Мастер: {record.barber_first_name}</Typography>
                                <Typography>Филиал: {record.barbershop_address}</Typography>
                                <Typography>Стоимость: {record.price}р.</Typography>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    sx={{ mt: 2 }}
                                    onClick={() => handleCancelRecord(record.id)}
                                >
                                    Отменить запись
                                </Button>
                            </Box>
                        ))}
                    </Box>
                </>
            )}

            <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)}>
                <DialogTitle>Смена пароля</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Новый пароль"
                        type="password"
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenPasswordDialog(false)}>Отмена</Button>
                    <Button onClick={handleChangePassword} variant="contained">Сменить</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ProfilePage;