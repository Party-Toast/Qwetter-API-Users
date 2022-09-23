import { BaseUser, User } from "../models/User";

const users: Array<User> = [
    {
        id: 1,
        roles: ['ADMIN'],
        firstName: 'John',
        lastName: 'Doe',
        username: 'JDoe',
        avatar: 'INSERT_AVATAR',
        bio: "Hi, I'm John!",
        location: "Eindhoven",
        website: "johndoe.com"
    }
]

export const getAllUsers = async(): Promise<Array<User>> => {
    return users;
};

export const createUser = async(user: User): Promise<User> => {
    users.push(user);
    return user;
};