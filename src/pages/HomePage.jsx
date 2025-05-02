import {Box, Container, Typography,} from '@mui/material';
import intro from '../images/intro.jpeg'
import {useEffect} from "react";

const HomePage = () => {
    useEffect(() => {
        localStorage.removeItem('token');
    }, []);
    return (
        <>
            <Container maxWidth={"xl"} sx={{ position: 'relative', height: '80vh', mb: 4,
            marginTop: 7 }}>
                <Box sx={{
                    borderRadius: '10px',
                    overflow: 'hidden',
                    height: '80vh',
                }}>
                    <img
                        src={intro}
                        alt="Интерьер"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(5px)'}}
                    />
                </Box>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center',
                        color: 'white',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                    }}
                >
                    <Typography variant="h2" gutterBottom>
                        Сеть барбершопов
                    </Typography>
                    <Typography variant="h1" gutterBottom sx={{fontWeight: '500'}}>
                        Бритва
                    </Typography>
                    <Typography variant="h3">стрижем & бреем</Typography>
                </Box>
            </Container>

            <Container maxWidth="md" sx={{ py: 4 }}>
                <Typography variant="h4" gutterBottom align="center">
                    Почему выбирают нас?
                </Typography>
                <Typography variant="h5" align="center">
                    В наших барбершопах работают исключительно профессионалы, прошедшие строгий отбор и
                    многолетнее обучение. Мы используем только профессиональные инструменты и средства,
                    чтобы обеспечить наилучший результат для наших клиентов.
                </Typography>
            </Container>
        </>
    );
};

export default HomePage;