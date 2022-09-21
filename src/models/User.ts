export interface BaseUser {
    roles: Array<String>;
    firstName: String;
    lastName: String;
    username: String;
    avatar: String;
    bio: String;
    location: String;
    website: String;
}

export interface User extends BaseUser {
    id: Number;
}