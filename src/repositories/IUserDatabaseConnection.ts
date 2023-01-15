import { FollowRequest, UnfollowRequest } from "../models/Follow";
import { User, UserCreationRequest, UserUpdateRequest } from "../models/User";

export default interface IDatabaseConnection {
    getAllUsers (): Promise<Array<User>>;
    getUserById (uuid: string): Promise<User | undefined>;
    createUser (user: UserCreationRequest): Promise<User | undefined>;
    updateUser (uuid: string, user: UserUpdateRequest): Promise<User | undefined>;
    deleteUser (uuid: string): Promise<User | undefined>;
    getFollowing (uuid: string): Promise<Array<User> | undefined>;
    getFollowers (uuid: string): Promise<Array<User> | undefined>;
    follow (followRequest: FollowRequest): Promise<User | undefined>;
    unfollow (unfollowRequest: UnfollowRequest): Promise<User | undefined>;
}
