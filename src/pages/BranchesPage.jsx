import {useEffect, useState} from 'react';
import {useGetBarbershopsQuery} from '../store/apiSlice';
import {
    Alert,
    Box,
    Chip,
    CircularProgress,
    Container,
    Dialog,
    DialogContent,
    DialogTitle,
    Grid2,
    List,
    ListItem,
    ListItemText,
    Typography
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import ScheduleIcon from '@mui/icons-material/Schedule';
import {Map, Placemark, YMaps, ZoomControl} from '@pbe/react-yandex-maps';


const BranchDialog = ({ branch, open, onClose }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>{branch.address}</DialogTitle>
            <DialogContent dividers>
                <Grid2 container spacing={3}>
                    <Grid2 item xs={12} md={6}>
                        <img
                            src={`http://localhost:9090/barbershop/${branch.id}/photo`}
                            alt="Филиал"
                            style={{ width: '100%', borderRadius: 8 }}
                        />
                    </Grid2>

                    <Grid2 item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <PhoneIcon color="primary" sx={{ mr: 1 }} />
                            <Typography variant="body1">{branch.phone_number}</Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <ScheduleIcon color="primary" sx={{ mr: 1 }} />
                            <Typography variant="body1">{branch.working_time}</Typography>
                        </Box>
                        <Box>
                            <Typography variant="body1">
                                {branch.description}
                            </Typography>
                        </Box>
                    </Grid2>
                </Grid2>
            </DialogContent>
        </Dialog>
    );
};

const YandexMap = ({ branches, selectedBranch, onBranchSelect }) => {
    const [mapState, setMapState] = useState({
        center: [55.751574, 37.573856], // Координаты Москвы по умолчанию
        zoom: 10,
    });

    useEffect(() => {
        if (selectedBranch) {
            setMapState({
                center: [selectedBranch.latitude, selectedBranch.longitude],
                zoom: 14
            });
        }
    }, [selectedBranch]);

    return (
        <YMaps query={{ apikey: 'f0c0284a-167f-465f-9f22-de1fb609485d' }}>
            <Map
                state={mapState}
                style={{ width: '600px', height: '600px', position: 'relative' }}
                modules={['control.ZoomControl', 'geoObject.addon.balloon']}
            >
                <ZoomControl options={{ float: 'right' }} />
                {branches?.barbershops?.map((branch) => (
                    <Placemark
                        key={branch.id}
                        geometry={[branch.latitude, branch.longitude]}
                        properties={{
                            balloonContent: `
                                <h3>${branch.address}</h3>
                                <p>Телефон: ${branch.phone_number}</p>
                                ${branch.working_time ? `<p>Часы работы: ${branch.working_time}</p>` : ''}
                            `,
                            hintContent: branch.address
                        }}
                        options={{
                            preset: 'islands#redDotIcon',
                            hideIconOnBalloonOpen: false
                        }}
                        onClick={() => onBranchSelect(branch)}
                    />
                ))}
            </Map>
        </YMaps>
    );
};

const BranchesPage = () => {
    const { data: branches, isLoading, isError } = useGetBarbershopsQuery();
    const [selectedBranch, setSelectedBranch] = useState(null);

    return (
        <Container maxWidth="lg" sx={{ py: 4, minHeight: "90vh" }}>
            <Typography variant="h2" gutterBottom align="center">
                Наши филиалы
            </Typography>

            <Grid2 container spacing={4}>
                <Grid2 item xs={12} md={5}>
                    {isLoading && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <CircularProgress />
                        </Box>
                    )}

                    {isError && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            Не удалось загрузить список филиалов
                        </Alert>
                    )}

                    {(
                        <List sx={{bgcolor: 'background.paper'}}>
                            {branches?.barbershops?.map((branch) => (
                                <ListItem
                                    key={branch.id}
                                    button
                                    onClick={() => setSelectedBranch(branch)}
                                    sx={{
                                        mb: 1,
                                        borderRadius: 2,
                                        '&:hover': {bgcolor: 'action.hover'}
                                    }}
                                >
                                    <ListItemText
                                        primary={branch.address}
                                        secondary={branch.phone_number}
                                    />
                                    <Chip
                                        label="На карте"
                                        color="primary"
                                        size="small"
                                        sx={{ml: 2}}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Grid2>

                <Grid2 item xs={12} md={7}>
                    <YandexMap
                        branches={branches || []}
                        selectedBranch={selectedBranch}
                        onBranchSelect={setSelectedBranch}
                    />
                </Grid2>
            </Grid2>

            {selectedBranch && (
                <BranchDialog
                    branch={selectedBranch}
                    open={!!selectedBranch}
                    onClose={() => setSelectedBranch(null)}
                />
            )}
        </Container>
    );
};

export default BranchesPage;