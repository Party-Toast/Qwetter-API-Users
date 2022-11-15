import MySQLUserDatabaseConnection from "../repositories/MySQLUserDatabaseConnection";
import { User, UserCreationRequest, UserUpdateRequest } from "../models/User";

export default class UserService {
    public databaseConnection: MySQLUserDatabaseConnection;

    constructor() {
        this.databaseConnection = new MySQLUserDatabaseConnection();
    }

    public getAllUsers = async (): Promise<Array<User>> => {
        return this.databaseConnection.getAllUsers();
    };
    
    public getUserById = async (uuid: string): Promise<User | undefined> => {
        return this.databaseConnection.getUserById(uuid);
    };

    public createUser = async (user: UserCreationRequest): Promise<User> => {
        return this.databaseConnection.createUser(user);
    };  

    public updateUser = async (uuid: string, user: UserUpdateRequest): Promise<User | undefined> => { 
        return this.databaseConnection.updateUser(uuid, user);
    };

    public deleteUser = async (uuid: string): Promise<User | undefined> => {
        return this.databaseConnection.deleteUser(uuid);  
    };
}
