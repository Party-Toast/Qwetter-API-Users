export interface User {
    uuid: number;
    roles: string[];
    username: string;
    firstName: string;
    lastName: string;
    avatar: string;
    bio: string;
    location: string;
    website: string;
}

export interface UserCreationRequest {
    username: string;
    roles: string[];
    firstName: string;
    lastName: string;
    avatar: string;
    bio: string;
    location: string;
    website: string;
}

export interface UserUpdateRequest {
    username: string;
    roles: string[];
    firstName: string;
    lastName: string;
    avatar: string;
    bio: string;
    location: string;
    website: string;
}