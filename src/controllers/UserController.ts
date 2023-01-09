import { User, UserCreationRequest, UserUpdateRequest } from '../models/User';
import UserService from '../services/UserService';
import { FollowRequest, UnfollowRequest } from '../models/Follow';
import { Route, Get, Path, Post, Body, Put, Delete } from 'tsoa';

@Route("/users")
export default class UserController {
    public userService: UserService;

    constructor() {
        this.userService = new UserService();
    }
    
    @Get("")
    public async getAllUsers(): Promise<Array<User>> {
        return await this.userService.getAllUsers();
    }

    @Get("/:uuid")
    public async getUserById(
        @Path() uuid: string
    ): Promise<User | undefined> {  {
        return await this.userService.getUserById(uuid);
    }}
    
    @Post("")
    public async createUser(
        @Body() userCreationRequest: UserCreationRequest
    ): Promise<User | undefined> {
        return await this.userService.createUser(userCreationRequest);
    }

    @Put("/:uuid")
    public async updateUser(
        @Path() uuid: string,
        @Body() userUpdateRequest: UserUpdateRequest
    ): Promise<User | undefined> {
        return await this.userService.updateUser(uuid, userUpdateRequest);
    }

    @Delete("/:uuid")
    public async deleteUser(
        @Path() uuid: string
    ): Promise<User | undefined> {
        return await this.userService.deleteUser(uuid);
    }

    @Get("/:uuid/following")
    public async getFollowing(
        @Path() uuid: string
    ): Promise<Array<User>> {
        return await this.userService.getFollowing(uuid);
    }

    @Post("/follow")
    public async follow(
        @Body() followRequest: FollowRequest
    ): Promise<User | undefined> {
        return await this.userService.follow(followRequest);
    }

    @Post("/unfollow")
    public async unfollow(
        @Body() unfollowRequest: UnfollowRequest
    ): Promise<User | undefined> {
        return await this.userService.unfollow(unfollowRequest);
    }
}