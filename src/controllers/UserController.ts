import { JSONSchemaType } from 'ajv';
import { Router, Request, Response } from 'express';
import { BaseUser, User } from '../models/User';
import { createUser, getAllUsers } from '../services/UserService'
import SchemaValidator from '../utils/SchemaValidator';

class UserController {
    public path = '/users';
    public router = Router();
    public validator = new SchemaValidator();
    public schema: JSONSchemaType<BaseUser> = {
        type: "object",
        properties: {
            username: {type: 'string'},
            // roles: {type: 'array'},
            firstName: {type: 'string'},
            lastName: {type: 'string'},
            avatar: {type: 'string'},
            bio: {type: 'string'},
            location: {type: 'string'},
            website: {type: 'string'}
        },
        required: [
            "username",
            // "roles",
            "firstName",
            "lastName",
            "avatar",
            "bio",
            "location",
            "website"
        ],
        additionalProperties: false
    }

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
    
    // TODO: type validation    
    createUser = async (request: Request, response: Response) => {
        const user: User = request.body;
        createUser(user).then((user) => {
            // TODO: statuscode not working
            response.statusCode = 201;
            response.send(user);
        });
    }
}

export default UserController;