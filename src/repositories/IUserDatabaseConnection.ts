import { User, UserCreationRequest, UserUpdateRequest } from "../models/User";

export default interface IDatabaseConnection {
    getAllUsers (): Promise<Array<User>>;
    getUserById (uuid: string): Promise<User | undefined>;
    createUser (user: UserCreationRequest): Promise<User>;
    updateUser (uuid: string, user: UserUpdateRequest): Promise<User | undefined>;
    deleteUser (uuid: string): Promise<User | undefined>;
}
