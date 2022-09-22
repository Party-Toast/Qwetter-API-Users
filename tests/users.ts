import UserController from '../src/controllers/UserController'; // this will be your custom import
import { expect } from 'chai';

describe('User Model', () => { 
    it('', () => {
            
    });
})
describe('User Controller', () => { 
    it('Path matches', () => {
        const userController = new UserController(); 
        expect(userController.path).to.equal('/users'); 
    });
})
describe('User Service', () => { 
    it('', () => {

    });
})
