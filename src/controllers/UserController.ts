import { JSONSchemaType } from 'ajv';
import { Router, Request, Response } from 'express';
import { BaseUser, User } from '../models/User';
import { createUser, getAllUsers } from '../services/UserService'
import SchemaValidator from '../utils/SchemaValidator';
import BaseUserSchema from '../schemas/BaseUserSchema';

class UserController {
    public path = '/users';
    public router = Router();
    public validator = new SchemaValidator();
    public schema: JSONSchemaType<BaseUser> = BaseUserSchema;

    constructor() {
        this.intializeRoutes();
    }

    public intializeRoutes() {
        this.router.get(this.path, this.getAllUsers);
        this.router.post(this.path, this.validator.validateBody(this.schema), this.createUser);
    }

    getAllUsers = async (request: Request, response: Response) => {
        getAllUsers().then((users) => {
            response.send(users);
        });
    }
    
    createUser = async (request: Request, response: Response) => {
        const user: User = request.body;
        createUser(user).then((user) => {
            response.statusCode = 201;
            response.send(user);
        });
    }
}

export default UserController;