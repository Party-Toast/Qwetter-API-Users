import express, { Express } from 'express';

class App {
    public app: Express;
    public port: Number;

    // TODO: Create controller interface class to replace any
    constructor(controllers: Array<any>, port: Number) {
        this.app = express();
        this.port = port;

        this.initializeControllers(controllers)
    }

    // TODO: Create controller interface class to replace any
    private initializeControllers(controllers: Array<any>) {
        controllers.forEach((controller: any) => {
            this.app.use('/', controller.router);
        });
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`[server]: Listening on http://localhost:${this.port}`);
        });
    }
}

export default App;