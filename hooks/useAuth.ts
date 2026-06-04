import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

export const useAuth = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const token = useSelector((state: RootState) => state.auth.accessToken);
    const isAuthenticated = !!user && !!token;

    return { user, token, isAuthenticated };
};