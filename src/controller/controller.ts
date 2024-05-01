import { Request as Req, Response, NextFunction } from "express";
import { Service } from "../service/service";

interface Request extends Req {
    [key: string]: any;
}

export class Controller {
    private service: Service;

    // When we use a class method as callback, the value of `this` can change, which can lead to unexpected behavior. 
    // Therefore we use `bind` in the constructor to explicitly set the value of `this` for the method
    // so they are associated to the correct instance of the class.
    constructor() {
        this.service = new Service();
        this.getKey = this.getKey.bind(this);
        this.addOrUpdateKey = this.addOrUpdateKey.bind(this);
        this.getKeyOptInCache = this.getKeyOptInCache.bind(this);
        this.deleteKey = this.deleteKey.bind(this);
    }

    public async getKey(req: Request, res: Response, _next: NextFunction): Promise<any> {
        try {
            let key = req.params.key;
            let data = await this.service.getKey(key);
            return res.status(200).send(data);
        } catch (error) {
            console.log(`Error getting key`);
            return res.status(500).send({ message: `Error getting value` });
        }

    }

    public async getKeyOptInCache(req: Request, res: Response, _next: NextFunction): Promise<any> {
        try {
            let key = req.params.key;
            let data = await this.service.getKeyOptInCache(key);
            return res.status(200).send(data);
        } catch (error) {
            console.log(`Error getting key`);
            return res.status(500).send({ message: `Error getting value` });
        }

    }

    public async addOrUpdateKey(req: Request, res: Response, _next: NextFunction): Promise<any> {
        try {
            let key = req.body.key;
            let value = req.body.value;
            await this.service.addOrUpdateKey(key, value);
            return res.status(201).send(`Successfully added or updated key in cache`);
        } catch (error) {
            console.log(`Error adding key to redis`);
            return res.status(500).send({ message: `Error adding key to redis` });
        }

    }

    public async deleteKey(req: Request, res: Response, _next: NextFunction): Promise<any> {
        try {
            let key = req.params.key;
            let data = await this.service.deleteKey(key);
            return res.status(200).send(data);
        } catch (error) {
            console.log(`Error deleting key`);
            return res.status(500).send({ message: `Error deleting value` });
        }

    }
}