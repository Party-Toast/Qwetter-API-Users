import { User, UserCreationRequest, UserUpdateRequest } from "../models/User";
import IDatabaseConnection from "./IUserDatabaseConnection";
var neo4j = require('neo4j-driver');

export default class Neo4JUserDatabaseConnection implements IDatabaseConnection {
    private driver;
    private session;

    constructor() {
        this.driver = neo4j.driver(
            process.env.NEO4J_URI,
            neo4j.auth.basic('neo4j', process.env.NEO4J_PASSWORD)
        )
        this.session = this.driver.session();
    }

    private createUserFromRecord = (record: any): User => {
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
        return user;
    }

    public getAllUsers = async (): Promise<User[]> => {
        let users: User[] = [];
        await this.session.run("MATCH (user:User) RETURN user LIMIT 1000").then((response: any) => {
            response.records.forEach((record: any) => {
                let user = this.createUserFromRecord(record);
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
                user = this.createUserFromRecord(record);
            }
        });
        return user;
    }

    public createUser = async (user: UserCreationRequest): Promise<User | undefined> => {
        if(await this.getUserById(user.uuid) != undefined) {
            return undefined;
        }
        return await this.session.run(`CREATE (user:User {uuid: '${user.uuid}', username: '${user.username}', firstName: '${user.firstName}', lastName: '${user.lastName}', avatar: '${user.avatar}', bio: '${user.bio}', location: '${user.lastName}', website: '${user.website}'}) RETURN user`).then((response: any) => {
            let record = response.records[0];
            let newUser = this.createUserFromRecord(record);
            return newUser;
        });
    } 

    public updateUser = async (uuid: string, user: UserUpdateRequest): Promise<User | undefined> => { 
        return await this.session.run(`MATCH (user:User) WHERE user.uuid = '${uuid}' SET user.firstName = '${user.firstName}', user.lastName = '${user.lastName}', user.avatar = '${user.avatar}', user.bio = '${user.bio}', user.location = '${user.location}', user.website = '${user.website}' RETURN user`).then((response: any) => {
            let record = response.records[0];
            if (record) {
                let updatedUser = this.createUserFromRecord(record);
                return updatedUser;
            }
            return undefined;
        });
    }

    public deleteUser = async (uuid: string): Promise<User | undefined> => {
        return await this.session.run(`MATCH (deleteUser:User) WHERE deleteUser.uuid = '${uuid}' WITH deleteUser, properties(deleteUser) AS user DETACH DELETE deleteUser RETURN user`).then((response: any) => {
            let record = response.records[0];
            if (record) {
                let properties = record.get('user');
                let deletedUser: User = {
                    uuid: properties.uuid ?? null,
                    username: properties.username ?? null,
                    firstName: properties.firstname ?? null,
                    lastName: properties.lastname ?? null,
                    avatar: properties.avatar ?? null,
                    bio: properties.bio ?? null,
                    location: properties.location ?? null,
                    website: properties.website ?? null
                }
                return deletedUser;
            }
            return undefined;
        });
    }
}