import { Router, Request, Response } from 'express';
import UserController from '../controllers/UserController';
import { JSONSchemaType } from 'ajv';
import SchemaValidator from '../utils/SchemaValidator';
import { UserCreationRequest, UserUpdateRequest } from '../models/User';
import UserCreationRequestSchema from '../schemas/UserCreationRequestSchema';
import UserUpdateRequestSchema from '../schemas/UserUpdateRequestSchema';
import { FollowRequest, UnfollowRequest } from '../models/Follow';
import FollowRequestSchema from '../schemas/FollowRequestSchema';
import UnfollowRequestSchema from '../schemas/UnfollowRequestSchema';


const PATH = "/users";
const router = Router();
const userController = new UserController();

const validator = new SchemaValidator();
const userCreationRequestSchema: JSONSchemaType<UserCreationRequest> = UserCreationRequestSchema;
const userUpdateRequestSchema: JSONSchemaType<UserUpdateRequest> = UserUpdateRequestSchema;
const followRequestSchema: JSONSchemaType<FollowRequest> = FollowRequestSchema;
const unfollowRequestSchema: JSONSchemaType<UnfollowRequest> = UnfollowRequestSchema;

router.get(PATH, async(request: Request, response: Response) => {
    userController.getAllUsers().then((users) => {
        response.send(users);
    });
});

router.get(`${PATH}/:uuid`, async(request: Request, response: Response) => {
    const uuid: string = request.params.uuid;
    userController.getUserById(uuid).then((user) => {
        if(user === undefined) {
            response.status(404).send(`No user with uuid ${uuid} was found.`)
        }
        response.send(user);
    })
});

router.post(PATH, validator.validateBody(userCreationRequestSchema), async(request: Request, response: Response) => {
    const userCreationRequest: UserCreationRequest = request.body;
    userController.createUser(userCreationRequest).then((user) => {
        if(user === undefined) {
            response.status(400).send(`User with UUID ${userCreationRequest.uuid} already exists.`);
        }
        else {
            response.status(201).send(user);
        }
    });
});

router.put(`${PATH}/:uuid`, validator.validateBody(userUpdateRequestSchema), async(request: Request, response: Response) => {
    const uuid: string = request.params.uuid;
    const userUpdateRequest: UserUpdateRequest = request.body;
    userController.updateUser(uuid, userUpdateRequest).then((user) => {
        if(user === undefined) {
            response.status(404).send(`No user with uuid ${uuid} was found.`);
        }
        else {
            response.send(user);
        }
    });
});

router.delete(`${PATH}/:uuid`, async(request: Request, response: Response) => {
    const uuid: string = request.params.uuid;
    userController.deleteUser(uuid).then((user) => {
        if(user === undefined) {
            response.status(404).send(`No user with uuid ${uuid} was found.`);
        }
        else {
            response.send(user);
        }
    });
});

router.get(`${PATH}/following/:uuid`, async(request: Request, response: Response) => {
    const uuid: string = request.params.uuid;
    userController.getFollowing(uuid).then((users) => {
        if(users === undefined) {
            response.status(404).send(`No user with uuid ${uuid} was found.`);
        }
        else {
            response.send(users);
        }
    });
});

router.get(`${PATH}/followers/:uuid`, async(request: Request, response: Response) => {
    const uuid: string = request.params.uuid;
    userController.getFollowers(uuid).then((users) => {
        if(users === undefined) {
            response.status(404).send(`No user with uuid ${uuid} was found.`);
        }
        else {
            response.send(users);
        }
    });
});

router.post(`${PATH}/follow`, validator.validateBody(followRequestSchema), async(request: Request, response: Response) => {
    const followRequest: FollowRequest = request.body;
    userController.follow(followRequest).then((user) => {
        if(user === undefined) {
            response.status(404).send(`No user with uuid ${followRequest.follower_uuid} was found.`);
        }
        else {
            response.send(user);
        }
    });
});

router.post(`${PATH}/unfollow`, validator.validateBody(unfollowRequestSchema), async(request: Request, response: Response) => {
    const unfollowRequest: UnfollowRequest = request.body;
    userController.unfollow(unfollowRequest).then((user) => {
        if(user === undefined) {
            response.status(404).send(`No user with uuid ${unfollowRequest.follower_uuid} was found.`);
        }
        else {
            response.send(user);
        }
    });
});

export default router;