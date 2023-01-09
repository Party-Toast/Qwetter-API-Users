import MySQLUserDatabaseConnection from "../repositories/MySQLUserDatabaseConnection";
import Neo4JUserDatabaseConnection from "../repositories/Neo4JUserDatabaseConnection";
import { User, UserCreationRequest, UserUpdateRequest } from "../models/User";
import { FollowRequest, UnfollowRequest } from "../models/Follow";

export default class UserService {
    public databaseConnection;

    constructor() {
        this.databaseConnection = new Neo4JUserDatabaseConnection();
    }

    public getAllUsers = async (): Promise<Array<User>> => {
        return this.databaseConnection.getAllUsers();
    };
    
    public getUserById = async (uuid: string): Promise<User | undefined> => {
        return this.databaseConnection.getUserById(uuid);
    };

    public createUser = async (user: UserCreationRequest): Promise<User | undefined> => {
        return this.databaseConnection.createUser(user);
    };  

    public updateUser = async (uuid: string, user: UserUpdateRequest): Promise<User | undefined> => { 
        return this.databaseConnection.updateUser(uuid, user);
    };

    public deleteUser = async (uuid: string): Promise<User | undefined> => {
        return this.databaseConnection.deleteUser(uuid);  
    };

    public getFollowing = async (uuid: string): Promise<Array<User>> => {
        return this.databaseConnection.getFollowing(uuid);
    };

    public follow = async (followRequest: FollowRequest): Promise<User | undefined> => {
        return this.databaseConnection.follow(followRequest);
    };

    public unfollow = async (unfollowRequest: UnfollowRequest): Promise<User | undefined> => {
        return this.databaseConnection.unfollow(unfollowRequest);
    }
}
