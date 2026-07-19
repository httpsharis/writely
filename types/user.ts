export interface User {
    id: string;
    _id?: string;
    name: string;
    email: string;
    username?: string;
    bio?: string;
    picture?: string | null;
    avatar?: string | null;
    avatarUrl?: string | null;
}