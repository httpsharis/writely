import { apiSlice } from '../../api/apiSlice';
import { User } from './authSlice';

interface GoogleLoginRequest {
    idToken: string;
}

interface LoginResponse {
    message: string;
    accessToken: string;
    refreshToken: string;
    user: User;
}

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        
        // POST: /api/auth/google-login
        googleLogin: builder.mutation<LoginResponse, GoogleLoginRequest>({
            query: (credentials) => ({
                url: '/auth/google-login', // Adjust the prefix if your backend uses a different route
                method: 'POST',
                body: credentials,
            }),
        }),

        // POST: TEMPORARY BYPASS (Matches your postmanTestLogin)
        testLogin: builder.mutation<LoginResponse, void>({
            query: () => ({
                url: '/auth/test-login', 
                method: 'POST',
            }),
        }),

        // GET: /api/auth/me (Matches your getCurrentUser)
        getCurrentUser: builder.query<{ user: User }, void>({
            query: () => '/auth/me',
            providesTags: ['User'],
        }),
        
    }),
});

export const { 
    useGoogleLoginMutation, 
    useTestLoginMutation, 
    useGetCurrentUserQuery 
} = authApi;