export interface BaseUser {
    username: String;
    roles: Array<String>;
    firstName: String;
    lastName: String;
    avatar: String;
    bio: String;
    location: String;
    website: String;
}

export interface User extends BaseUser {
    id: Number;
}