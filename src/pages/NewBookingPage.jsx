import { Container } from '@mui/material';
import BookingWizard from '../components/BookingWizard.jsx';

const NewBookingPage = () => {
    return (
        <Container maxWidth="lg" sx={{ py: 4, minHeight: "69vh"  }}>
            <BookingWizard />
        </Container>
    );
};

export default NewBookingPage;