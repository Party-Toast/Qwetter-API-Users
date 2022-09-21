export interface User {
    id: Number;
    roles: Array<String>;
    firstName: String;
    lastName: String;
    username: String;
    avatar: String;
    bio: String;
    location: String;
    website: String;
}

export default User;