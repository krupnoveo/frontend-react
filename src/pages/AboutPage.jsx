import {Container, Typography, Grid2} from '@mui/material';

const AboutPage = () => {
    return (
        <Container  sx={{ py: 4, minHeight: "90vh" }}>
            <Typography variant="h2" gutterBottom align="center">
                О нас
            </Typography>

            <Grid2 container spacing={4}>
                <Grid2 item xs={12}>
                    <Typography variant="h5" paragraph>
                        BRITVA - ФЕДЕРАЛЬНАЯ СЕТЬ БАРБЕРШОПОВ
                    </Typography>
                    <Typography variant="body1" paragraph>
                        В каждом из наших барбершопов вы почувствуете себя как дома. Мы создали пространство,
                        где сочетаются традиции барберинга и современный комфорт.
                    </Typography>
                </Grid2>

                <Grid2 item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                        Наша философия
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Мы развиваем не только искусство барберинга и профессиональный рост мастеров,
                        но и клиентский сервис, который стал основой нашей коммуникации с гостями и партнерами.
                    </Typography>
                </Grid2>

                <Grid2 item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                        Наши проекты
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Вместе с BRITVA развивается студия маникюра и красоты SODA. Мы ежедневно работаем над тем,
                        чтобы вы могли чувствовать себя уверенно и получать от жизни самое лучшее.
                    </Typography>
                </Grid2>
            </Grid2>
        </Container>
    );
};

export default AboutPage;