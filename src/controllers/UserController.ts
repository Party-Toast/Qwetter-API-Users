import { JSONSchemaType } from 'ajv';
import { Router, Request, Response } from 'express';
import { UserCreationRequest, UserUpdateRequest } from '../models/User';
import UserService from '../services/UserService';
import SchemaValidator from '../utils/SchemaValidator';
import UserCreationRequestSchema from '../schemas/UserCreationRequestSchema';
import UserUpdateRequestSchema from '../schemas/UserUpdateRequestSchema';
import FollowRequestSchema from '../schemas/FollowRequestSchema';
import UnfollowRequestSchema from '../schemas/UnfollowRequestSchema';
import { FollowRequest, UnfollowRequest } from '../models/Follow';

export default class UserController {
    public path = '/users';
    public router = Router();
    public userService: UserService;
    public validator = new SchemaValidator();
    public userCreationRequestSchema: JSONSchemaType<UserCreationRequest> = UserCreationRequestSchema;
    public userUpdateRequestSchema: JSONSchemaType<UserUpdateRequest> = UserUpdateRequestSchema;
    public followRequestSchema: JSONSchemaType<FollowRequest> = FollowRequestSchema;
    public unfollowRequestSchema: JSONSchemaType<UnfollowRequest> = UnfollowRequestSchema;

    constructor() {
        this.intializeRoutes();
        this.userService = new UserService();
    }

    public intializeRoutes() {
        this.router.get(this.path, this.getAllUsers);
        this.router.get(`${this.path}/:uuid`, this.getUserById);
        this.router.post(this.path, this.validator.validateBody(this.userCreationRequestSchema), this.createUser);
        this.router.put(`${this.path}/:uuid`, this.validator.validateBody(this.userUpdateRequestSchema), this.updateUser);
        this.router.delete(`${this.path}/:uuid`, this.deleteUser);
        this.router.get(`${this.path}/following/:uuid`, this.getFollowing);
        this.router.post(`${this.path}/follow`, this.validator.validateBody(this.followRequestSchema), this.follow);
        this.router.post(`${this.path}/unfollow`, this.validator.validateBody(this.unfollowRequestSchema), this.unfollow);
    }
    
    // GET
    public getAllUsers = async (request: Request, response: Response) => {
        this.userService.getAllUsers().then((users) => {
            response.send(users);
        });
    }

    public getUserById = async (request: Request, response: Response) => {
        const uuid: string = request.params.uuid;
        this.userService.getUserById(uuid).then((user) => {
            if(user === undefined) {
                response.status(404).send(`No user with uuid ${uuid} was found.`)
            }
            response.send(user);
        })
    }
    
    // POST
    public createUser = async (request: Request, response: Response) => {
        const userCreationRequest: UserCreationRequest = request.body;
        this.userService.createUser(userCreationRequest).then((user) => {
            if(user === undefined) {
                response.status(400).send(`User with UUID ${userCreationRequest.uuid} already exists.`);
            }
            else {
                response.status(201).send(user);
            }
        });
    }

    // PUT
    public updateUser = async (request: Request, response: Response) => {
        const uuid: string = request.params.uuid;
        const userUpdateRequest: UserUpdateRequest = request.body;
        this.userService.updateUser(uuid, userUpdateRequest).then((user) => {
            if(user === undefined) {
                response.status(404).send(`No user with uuid ${uuid} was found.`);
            }
            response.send(user);
        })
    }

    // DELETE
    public deleteUser = async (request: Request, response: Response) => {
        const uuid: string = request.params.uuid;
        this.userService.deleteUser(uuid).then((user) => {
            if(user === undefined) {
                response.status(204);
            }
            response.send(user);
        })
    }

    // Get following
    public getFollowing = async (request: Request, response: Response) => {
        const uuid: string = request.params.uuid;
        this.userService.getFollowing(uuid).then((users) => {
            response.send(users);
        })
    }


    // Follow
    public follow = async (request: Request, response: Response) => {
        const followRequest: FollowRequest = request.body;
        this.userService.follow(followRequest).then((user) => {
            if(user === undefined) {
                response.status(404).send(`User with UUID ${followRequest.followerUuid} is already following ${followRequest.followeeUuid}.`);
            }
            response.send(user);
        });
    }

    // Unfollow
    public unfollow = async (request: Request, response: Response) => {
        const unfollowRequest: UnfollowRequest = request.body;
        this.userService.unfollow(unfollowRequest).then((user) => {
            if(user === undefined) {
                response.status(404).send(`User with UUID ${unfollowRequest.followerUuid} is not following ${unfollowRequest.followeeUuid} yet.`);
            }
            response.send(user);
        })
    }

}