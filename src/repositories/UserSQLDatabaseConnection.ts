import { User, UserCreationRequest, UserUpdateRequest } from "../models/User";
import IDatabaseConnection from "./IDatabaseConnection";

const users: Array<User> = [
    {
        uuid: 0,
        roles: ['ADMIN'],
        firstName: 'db connection test',
        lastName: 'Doe',
        username: 'JDoe',
        avatar: 'INSERT_AVATAR',
        bio: "Hi, I'm John!",
        location: "Eindhoven",
        website: "johndoe.com"
    },
    {
        uuid: 1,
        roles: ['ADMIN'],
        firstName: 'Sytse',
        lastName: 'Walraven',
        username: 'SytseWalraven',
        avatar: 'INSERT_AVATAR',
        bio: "Hi, I'm Sytse!",
        location: "Eindhoven",
        website: "sytsewalraven.nl"
    },
]

export default class UserSQLDatabaseConnection implements IDatabaseConnection {
    // TODO: Add MySQL database connection

    public getAllUsers = async(): Promise<User[]> => {
        return users;
    }

    public getUserById = async (uuid: number): Promise<User | undefined> => {
        return users.find(user => user.uuid === uuid);
    };

    public createUser = async (user: UserCreationRequest): Promise<User> => {
        // TODO: improve UUID generation
        // TODO: unique email/username check
        const nextUuid = users.length;
        const newUser: User = {
            uuid: nextUuid,
            avatar: user.avatar,
            bio: user.bio,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            roles: user.roles,
            username: user.username,
            website: user.website
        }
        users.push(newUser);
        return newUser;
    };  

    public updateUser = async (uuid: number, user: UserUpdateRequest): Promise<User | undefined> => { 
        const index = users.findIndex(user => user.uuid === uuid);
        if(index == -1) {
            return undefined;
        }
        users[index].avatar = user.avatar;
        users[index].bio = user.bio;
        users[index].firstName = user.firstName;
        users[index].lastName = user.lastName;
        users[index].location = user.location;
        users[index].roles = user.roles;
        users[index].username = user.username;
        users[index].website = user.website;
    
        return users[index];
    };

    public deleteUser = async (uuid: number): Promise<User | undefined> => {
        const index = users.findIndex(user => user.uuid === uuid);
        if(index == -1) {
            return undefined;
        }
        const user = users[index];
        users.splice(index, 1);
        return user;    
    };
}