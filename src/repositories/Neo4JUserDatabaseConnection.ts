import { FollowRequest, UnfollowRequest } from "../models/Follow";
import { User, UserCreationRequest, UserUpdateRequest } from "../models/User";
import IDatabaseConnection from "./IUserDatabaseConnection";
const neo4j = require('neo4j-driver');

export default class Neo4JUserDatabaseConnection implements IDatabaseConnection {
    private driver;
    private session;

    constructor() {
        this.driver = neo4j.driver(
            process.env.NEO4J_URI,
            neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
            // "neo4j+s://4378796f.databases.neo4j.io",
            // neo4j.auth.basic("neo4j", "EYCavfA-PKtNfr2jAqIlSgGgPRQARHtcEmytcEj3gLk")
        )
        this.session = this.driver.session();
    }

    private createUserFromRecord = (record: any): User => {
        let properties = record.get('user').properties;
        let user: User = {
            uuid: properties.uuid ?? null,
            username: properties.username ?? null,
            firstName: properties.firstName ?? null,
            lastName: properties.lastName ?? null,
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
        return await this.session.run(`CREATE (user:User {uuid: '${user.uuid}', username: '${user.username}', firstName: '${user.firstName}', lastName: '${user.lastName}', avatar: '${user.avatar}', bio: '${user.bio}', location: '${user.location}', website: '${user.website}'}) RETURN user`).then((response: any) => {
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

    public getFollowing = async (uuid: string): Promise<Array<User> | undefined> => {
        let following: User[] = [];
        await this.session.run(`MATCH (follower:User)-[:FOLLOWS]->(following) WHERE follower.uuid = '${uuid}' RETURN following AS user`).then((response: any) => {
            response.records.forEach((record: any) => {
                let follower = this.createUserFromRecord(record);
                following.push(follower);
            });
        });
        return following;
    }

    public getFollowers = async (uuid: string): Promise<Array<User> | undefined> => {
        let followers: User[] = [];
        await this.session.run(`MATCH (followers)-[:FOLLOWS]->(following:User) WHERE following.uuid = '${uuid}' RETURN followers AS user`).then((response: any) => {
            response.records.forEach((record: any) => {
                let follower = this.createUserFromRecord(record);
                followers.push(follower);
            });
        });
        return followers;
    }

    public follow = async (followRequest: FollowRequest): Promise<User | undefined> => {
        // TODO: do not allow users to follow themselves
        
        // Check if the follower is already following the followee
        let followers = await this.getFollowing(followRequest.follower_uuid).then((users) => {
            return users;
        });

        if(followers === undefined || followers.find((user: User) => user.uuid == followRequest.followee_uuid) != undefined) {
            return undefined;
        }

        return await this.session.run(`MATCH(follower:User) WHERE follower.uuid = '${followRequest.follower_uuid}' MATCH(followee:User) WHERE followee.uuid = '${followRequest.followee_uuid}' CREATE(follower)-[:FOLLOWS {date: '${followRequest.date}'}]->(followee) RETURN followee AS user`).then((response: any) => {
            let record = response.records[0];
            let user = this.createUserFromRecord(record);
            return user;
        });        
    }

    public unfollow = async (unfollowRequest: UnfollowRequest): Promise<User | undefined> => {
        return await this.session.run(`MATCH(follower:User) WHERE follower.uuid = '${unfollowRequest.follower_uuid}' MATCH(followee:User) WHERE followee.uuid = '${unfollowRequest.followee_uuid}' MATCH (follower)-[relation:FOLLOWS]->(followee) DELETE relation RETURN followee AS user`).then((response: any) => {
            let record = response.records[0];
            if (record) {
                let user = this.createUserFromRecord(record);
                return user;
            }
            return undefined;
        });        
    }
}