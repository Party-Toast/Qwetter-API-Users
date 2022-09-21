import { Router, Request, Response } from 'express';
import User from '../models/User';

class UserController {
    public path = '/users';
    public router = Router();
    public users: Array<User> = [
        {
            id: 1,
            roles: ['ADMIN'],
            firstName: 'John',
            lastName: 'Doe',
            username: 'JDoe',
            avatar: 'INSERT_AVATAR',
            bio: "Hi, I'm John!",
            location: "Eindhoven",
            website: "johndoe.com"
        }
    ]

    constructor() {
        this.intializeRoutes();
    }

    public intializeRoutes() {
        this.router.get(this.path, this.getAllUsers);
        // this.router.post(this.path, this.createUser);
    }

    getAllUsers = (request: Request, response: Response) => {
        response.send(this.users);
    }
}

export default UserController;