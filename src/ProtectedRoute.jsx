import { Navigate, useLocation } from 'react-router-dom';
import { useGetProfileQuery } from './store/apiSlice';
import { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';

const ProtectedRoute = ({ children }) => {
    console.log("ProtectedRoute: Component initialized");
    const token = localStorage.getItem('token');
    const storedRole = localStorage.getItem('userRole');
    const location = useLocation();
    const { data: profile, isLoading, isSuccess, error } = useGetProfileQuery();
    const [shouldRedirect, setShouldRedirect] = useState(false);
    const [redirectPath, setRedirectPath] = useState('/signin');
    const [isChecking, setIsChecking] = useState(true);
    
    console.log("ProtectedRoute: Initial state", {
        path: location.pathname,
        token: !!token,
        tokenValue: token,
        storedRole,
        profile,
        isLoading,
        isSuccess,
        error,
        shouldRedirect,
        redirectPath,
        isChecking
    });

    useEffect(() => {
        // If token doesn't exist, redirect to sign in immediately
        if (!token) {
            console.log("ProtectedRoute: No token, redirecting to signin");
            setShouldRedirect(true);
            setRedirectPath('/signin');
            setIsChecking(false);
            return;
        }

        // Use stored role for immediate checks while profile is loading
        if (isLoading && storedRole) {
            console.log("ProtectedRoute: Profile loading, using stored role:", storedRole);
            // If user is an administrator based on stored role
            if (storedRole === 'ADMINISTRATOR') {
                // If trying to access the regular profile page or admin pages, redirect to manager page
                if (location.pathname === '/profile' || location.pathname.startsWith('/admin')) {
                    console.log("ProtectedRoute: ADMINISTRATOR attempting to access profile or admin pages, redirecting to manager page");
                    setShouldRedirect(true);
                    setRedirectPath('/manager');
                    setIsChecking(false);
                }
                // Do not redirect if already on manager pages
                else if (location.pathname.startsWith('/manager')) {
                    console.log("ProtectedRoute: ADMINISTRATOR already on manager page, no redirection needed");
                    setShouldRedirect(false);
                    setIsChecking(false);
                }
            } 
            // If user is a superadmin based on stored role
            else if (storedRole === 'ADMIN') {
                // If trying to access regular profile or manager pages, redirect to admin page
                if (location.pathname === '/profile' || location.pathname.startsWith('/manager')) {
                    console.log("ProtectedRoute: ADMIN attempting to access profile or manager pages, redirecting to admin page");
                    setShouldRedirect(true);
                    setRedirectPath('/admin');
                    setIsChecking(false);
                }
                // Do not redirect if already on admin pages
                else if (location.pathname.startsWith('/admin')) {
                    console.log("ProtectedRoute: ADMIN already on admin page, no redirection needed");
                    setShouldRedirect(false);
                    setIsChecking(false);
                }
            }
            else {
                // If user is NOT an administrator or admin based on stored role
                // If trying to access manager or admin routes, redirect to profile
                if (location.pathname.startsWith('/manager') || location.pathname.startsWith('/admin')) {
                    console.log("ProtectedRoute: Regular user attempting to access admin areas, redirecting to profile");
                    setShouldRedirect(true);
                    setRedirectPath('/profile');
                    setIsChecking(false);
                } else {
                    // No redirection needed if on allowed routes
                    console.log("ProtectedRoute: Regular user on allowed route, no redirection needed");
                    setShouldRedirect(false);
                    setIsChecking(false);
                }
            }
            
            return;
        }
        
        // When profile is loaded, do the full check
        if (!isLoading) {
            console.log("ProtectedRoute: Profile loaded:", profile, "Error:", error);
            // Start with assumption that we don't need to redirect
            setShouldRedirect(false);
            
            // If there's an error loading the profile, redirect to signin
            if (error) {
                console.log("ProtectedRoute: Error loading profile:", error);
                localStorage.removeItem('token');
                localStorage.removeItem('userRole');
                setShouldRedirect(true);
                setRedirectPath('/signin');
                setIsChecking(false);
                return;
            }
            
            // Only process role-based redirects if we successfully loaded the profile
            if (isSuccess && profile) {
                console.log("ProtectedRoute: Successfully loaded profile with role:", profile.role);
                // If profile data is loaded and user is an administrator
                if (profile.role === 'ADMINISTRATOR') {
                    // Update stored role
                    if (storedRole !== 'ADMINISTRATOR') {
                        localStorage.setItem('userRole', 'ADMINISTRATOR');
                        console.log("ProtectedRoute: Updated stored role to ADMINISTRATOR");
                    }
                    
                    // If trying to access the regular profile page or admin pages, redirect to manager page
                    if (location.pathname === '/profile' || location.pathname.startsWith('/admin')) {
                        console.log("ProtectedRoute: ADMINISTRATOR redirecting from", location.pathname, "to /manager");
                        setShouldRedirect(true);
                        setRedirectPath('/manager');
                        setIsChecking(false);
                        return;
                    }
                    
                    // No redirection needed if already on manager pages
                    if (location.pathname.startsWith('/manager')) {
                        console.log("ProtectedRoute: ADMINISTRATOR already on manager page, no redirection needed");
                        setShouldRedirect(false);
                        setIsChecking(false);
                        return;
                    }
                } 
                // If profile data is loaded and user is a superadmin
                else if (profile.role === 'ADMIN') {
                    // Update stored role
                    if (storedRole !== 'ADMIN') {
                        localStorage.setItem('userRole', 'ADMIN');
                        console.log("ProtectedRoute: Updated stored role to ADMIN");
                    }
                    
                    // If trying to access regular profile or manager pages, redirect to admin page
                    if (location.pathname === '/profile' || location.pathname.startsWith('/manager')) {
                        console.log("ProtectedRoute: ADMIN redirecting from", location.pathname, "to /admin");
                        setShouldRedirect(true);
                        setRedirectPath('/admin');
                        setIsChecking(false);
                        return;
                    }
                    
                    // No redirection needed if already on admin pages
                    if (location.pathname.startsWith('/admin')) {
                        console.log("ProtectedRoute: ADMIN already on admin page, no redirection needed");
                        setShouldRedirect(false);
                        setIsChecking(false);
                        return;
                    }
                }
                else {
                    // Update stored role
                    if (storedRole !== profile.role) {
                        localStorage.setItem('userRole', profile.role);
                        console.log("ProtectedRoute: Updated stored role to", profile.role);
                    }
                    
                    // If user is NOT an administrator or admin
                    // If trying to access manager or admin routes, redirect to profile
                    if (location.pathname.startsWith('/manager') || location.pathname.startsWith('/admin')) {
                        console.log("ProtectedRoute: Regular user redirecting from", location.pathname, "to /profile");
                        setShouldRedirect(true);
                        setRedirectPath('/profile');
                        setIsChecking(false);
                        return;
                    }
                }
            }
            
            // No redirection needed
            console.log("ProtectedRoute: No redirection needed for", location.pathname);
            setIsChecking(false);
        }
    }, [token, profile, location.pathname, isLoading, isSuccess, storedRole, error]);

    // Show loading state while we're checking what to do or if
    // no stored role while profile is loading
    if ((isLoading && !storedRole) || isChecking) {
        console.log("ProtectedRoute: Showing loading state", { isLoading, storedRole, isChecking });
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    // Perform redirect if needed
    if (shouldRedirect) {
        console.log("ProtectedRoute: Redirecting to", redirectPath);
        return <Navigate to={redirectPath} replace />;
    }

    // No token means redirect to login
    if (!token) {
        console.log("ProtectedRoute: No token, redirecting to signin");
        return <Navigate to="/signin" replace />;
    }

    // All checks passed, render the protected content
    console.log("ProtectedRoute: Rendering protected content for", location.pathname);
    return children;
};

export default ProtectedRoute;