import MySQLUserDatabaseConnection from "../repositories/MySQLUserDatabaseConnection";
import Neo4JUserDatabaseConnection from "../repositories/Neo4JUserDatabaseConnection";
import { User, UserCreationRequest, UserUpdateRequest } from "../models/User";
import { FollowRequest, UnfollowRequest } from "../models/Follow";
import CloudAMQPEventBroker from "../broker/CloudAMQPEventBroker";

export default class UserService {
    private databaseConnection;
    private eventBroker;

    constructor() {
        this.databaseConnection = new Neo4JUserDatabaseConnection();
        this.eventBroker = new CloudAMQPEventBroker(this.databaseConnection);
        this.eventBroker.connect();
    }

    public getAllUsers = async (): Promise<Array<User>> => {
        return this.databaseConnection.getAllUsers();

    };
    
    public getUserById = async (uuid: string): Promise<User | undefined> => {
        return this.databaseConnection.getUserById(uuid);
    };

    public createUser = async (user: UserCreationRequest): Promise<User | undefined> => {
        const createdUserPromise = this.databaseConnection.createUser(user);
        this.eventBroker.createdUserEvent(createdUserPromise);
        return createdUserPromise;
    };  

    public updateUser = async (uuid: string, user: UserUpdateRequest): Promise<User | undefined> => { 
        return this.databaseConnection.updateUser(uuid, user);
    };

    public deleteUser = async (uuid: string): Promise<User | undefined> => {
        return this.databaseConnection.deleteUser(uuid);  
    };

    public getFollowing = async (uuid: string): Promise<Array<User> | undefined> => {
        return this.databaseConnection.getFollowing(uuid);
    };

    public getFollowers = async (uuid: string): Promise<Array<User> | undefined> => {
        return this.databaseConnection.getFollowers(uuid);
    };

    public follow = async (followRequest: FollowRequest): Promise<User | undefined> => {
        return this.databaseConnection.follow(followRequest);
    };

    public unfollow = async (unfollowRequest: UnfollowRequest): Promise<User | undefined> => {
        const unfollowedUserPromise = this.databaseConnection.unfollow(unfollowRequest);
        this.eventBroker.unfollowEvent(unfollowedUserPromise, unfollowRequest);
        return unfollowedUserPromise;
    }
}