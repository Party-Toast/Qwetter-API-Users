export interface User {
    uuid: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar: string;
    bio: string;
    location: string;
    website: string;
}

export interface UserCreationRequest {
    uuid: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar: string;
    bio: string;
    location: string;
    website: string;
}

export interface UserUpdateRequest {
    firstName: string;
    lastName: string;
    avatar: string;
    bio: string;
    location: string;
    website: string;
}