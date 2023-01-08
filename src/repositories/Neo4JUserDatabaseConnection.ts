import { User, UserCreationRequest, UserUpdateRequest } from "../models/User";
import IDatabaseConnection from "./IUserDatabaseConnection";
var neo4j = require('neo4j-driver');

export default class Neo4JUserDatabaseConnection implements IDatabaseConnection {
    private driver;
    private session;

    constructor() {
        this.driver = neo4j.driver(
            'bolt://localhost:7687',
            neo4j.auth.basic('neo4j', 'password')
        )
        this.session = this.driver.session();
    }

    public getAllUsers = async (): Promise<User[]> => {
        let users: User[] = [];
        await this.session.run("MATCH (user:User) RETURN user LIMIT 1000").then((response: any) => {
            response.records.forEach((record: any) => {
                let properties = record.get('user').properties;
                let user: User = {
                    uuid: properties.uuid ?? null,
                    username: properties.username ?? null,
                    firstName: properties.firstname ?? null,
                    lastName: properties.lastname ?? null,
                    avatar: properties.avatar ?? null,
                    bio: properties.bio ?? null,
                    location: properties.location ?? null,
                    website: properties.website ?? null
                }
                users.push(user);
            });
        });
        return users;
    }

    public getUserById = async (uuid: string): Promise<User | undefined> => {
        let user: User | undefined = undefined;
        await this.session.run(`MATCH (user:User) WHERE user.uuid = '${uuid}' RETURN user`).then((response: any) => {
            let record = response.records[0];
            if (record) {
                let properties = record.get('user').properties;
                user = {
                    uuid: properties.uuid ?? null,
                    username: properties.username ?? null,
                    firstName: properties.firstName ?? null,
                    lastName: properties.lastName ?? null,
                    avatar: properties.avatar ?? null,
                    bio: properties.bio ?? null,
                    location: properties.location ?? null,
                    website: properties.website ?? null
                }
            }
        });
        return user;
    }

    public createUser = async (user: UserCreationRequest): Promise<User> => {
        let newUser: User = {
            uuid: "",
            avatar: user.avatar,
            bio: user.bio,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            username: user.username,
            website: user.website
        }
        return newUser;
    } 

    public updateUser = async (uuid: string, user: UserUpdateRequest): Promise<User | undefined> => { 
        return undefined;
    }

    public deleteUser = async (uuid: string): Promise<User | undefined> => {
        return undefined;
    }
}