import { JSONSchemaType } from 'ajv';
import { Router, Request, Response } from 'express';
import { User, UserCreationRequest, UserUpdateRequest } from '../models/User';
import UserService from '../services/UserService';
import SchemaValidator from '../utils/SchemaValidator';
import UserCreationRequestSchema from '../schemas/UserCreationRequestSchema';

class UserController {
    public path = '/users';
    public router = Router();
    public validator = new SchemaValidator();
    public userCreationRequestSchema: JSONSchemaType<UserCreationRequest> = UserCreationRequestSchema;
    public userService = new UserService();

    constructor() {
        this.intializeRoutes();
    }

    public intializeRoutes() {
        this.router.get(this.path, this.getAllUsers);
        this.router.get(`${this.path}/:uuid`, this.getUserByUuid);
        this.router.post(this.path, this.validator.validateBody(this.userCreationRequestSchema), this.createUser);
        this.router.put(`${this.path}/:uuid`, this.validator.validateBody(this.userCreationRequestSchema), this.updateUser);
        this.router.delete(`${this.path}/:uuid`, this.deleteUser);
    }
    
    // GET
    getAllUsers = async (request: Request, response: Response) => {
        this.userService.getAllUsers().then((users) => {
            response.send(users);
        });
    }

    getUserByUuid = async (request: Request, response: Response) => {
        const uuid: number = parseInt(request.params.uuid);
        this.userService.getUserById(uuid).then((user) => {
            if(user === undefined) {
                response.status(404).send(`No user with uuid ${uuid} was found.`)
            }
            response.send(user)
        })
    }
    
    // POST
    createUser = async (request: Request, response: Response) => {
        const userCreationRequest: UserCreationRequest = request.body;
        this.userService.createUser(userCreationRequest).then((user) => {
            // TODO: catch responses for duplicate username/email registration
            response.status(201).send(user);
        });
    }

    // PUT
    updateUser = async (request: Request, response: Response) => {
        const uuid: number = parseInt(request.params.uuid);
        const userUpdateRequest: UserUpdateRequest = request.body;
        this.userService.updateUser(uuid, userUpdateRequest).then((user) => {
            if(user === undefined) {
                response.status(404).send(`No user with uuid ${uuid} was found.`);
            }
            response.send(user);
        })
    }

    // DELETE
    deleteUser = async (request: Request, response: Response) => {
        const uuid: number = parseInt(request.params.uuid);
        this.userService.deleteUser(uuid).then((user) => {
            if(user === undefined) {
                response.status(204).send();
            }
            response.send(user);
        })
    }
}

export default UserController;