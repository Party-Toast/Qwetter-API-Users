import { Router, Request, Response } from 'express';
import { User } from '../models/User';
import { createUser, getAllUsers } from '../services/UserService'

class UserController {
    public path = '/users';
    public router = Router();

    constructor() {
        this.intializeRoutes();
    }

    public intializeRoutes() {
        this.router.get(this.path, this.getAllUsers);
        this.router.post(this.path, this.createUser);
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