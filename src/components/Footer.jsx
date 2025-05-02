import { Box, Container, Typography } from '@mui/material';
import logo from '../images/logo.png'
const Footer = () => {
    return (
        <Box component="footer" sx={{
            bgcolor: '#2d3436',
            color: 'white',
            py: 6,
            mt: 8
        }}>
            <Container>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 3
                }}>
                    <img src={logo} alt="Логотип" style={{ height: 40 }} />
                    <Box>
                        <Typography variant="body2">Контакты:</Typography>
                        <Typography variant="body2">Телефон: +7 999 123-45-67</Typography>
                        <Typography variant="body2">Email: info@britva.ru</Typography>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;