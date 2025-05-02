import {AppBar, Toolbar, IconButton, Typography, Box, Container, Menu, MenuItem, Button, Avatar} from '@mui/material';
import { AccountCircle, Logout } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useGetProfileQuery } from '../store/apiSlice';
import { useEffect, useState } from 'react';
import logo from '../images/logo.png'

const Header = () => {
    const { data: profile } = useGetProfileQuery();
    const [profileLink, setProfileLink] = useState('/profile');
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const open = Boolean(anchorEl);
    
    useEffect(() => {
        if (profile && profile.role === 'ADMINISTRATOR') {
            setProfileLink('/manager');
        } else if (profile && profile.role === 'ADMIN') {
            setProfileLink('/admin');
        } else {
            setProfileLink('/profile');
        }
    }, [profile]);
    
    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('redirectAfterReload');
        navigate('/');
        window.location.reload();
    };

    return (
        <AppBar position="static" color="default" sx={{
            bgcolor: 'whitesmoke',
            py: 1,
            marginBottom: '1rem',
        }}>
            <Container fixed={true}>
                <Toolbar >
                    <Box className={"navbar-container"}>
                        <Link to={"/"}>
                            <img src={logo} alt="Логотип" className={"logo"} />
                        </Link>
                        <Box className={"nav-menu"}>
                            <Link to="/about" className={"nav-menu-link"}>
                                <Typography variant="h6">О нас</Typography>
                            </Link>
                            <Link to="/services" className={"nav-menu-link"}>
                                <Typography variant="h6">Услуги</Typography>
                            </Link>
                            <Link to="/branches" className={"nav-menu-link"}>
                                <Typography variant="h6">Филиалы</Typography>
                            </Link>
                        </Box>
                        {profile ? (
                            <>
                                <IconButton onClick={handleProfileMenuOpen}>
                                    {profile.has_photo ? (
                                        <Avatar
                                            src={`http://localhost:9090/me/${profile.id}/photo?token=${localStorage.getItem('token')}`}
                                            alt={`${profile.first_name} ${profile.last_name}`}
                                        />
                                    ) : (
                                        <AccountCircle fontSize="large" />
                                    )}
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleMenuClose}
                                >
                                    <MenuItem component={Link} to={profileLink} onClick={handleMenuClose}>
                                        Профиль
                                    </MenuItem>
                                    <MenuItem onClick={handleLogout}>
                                        <Logout fontSize="small" sx={{ mr: 1 }} />
                                        Выйти
                                    </MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <Button 
                                variant="contained" 
                                color="primary"
                                component={Link}
                                to="/signin"
                            >
                                Войти
                            </Button>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Header;