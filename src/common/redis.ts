import { RedisClientType, createClient } from "redis";
import constants from "../constants";
import { CacheInstance } from "./cache";

export class RedisInitializer {

    private redisClient: RedisClientType;
    private subscriber: RedisClientType;
    static instance: RedisInitializer | null = null;
    private cache: any;

    constructor(password: string, host: string, port: number) {
        this.redisClient = createClient({
            password: password,
            socket: {
                host: host,
                port: port,
            }
        });

        this.subscriber = this.redisClient.duplicate();
        this.cache = CacheInstance.getInstance();
    }

    public static getInstance(): RedisInitializer {
        if (!RedisInitializer.instance) {
            RedisInitializer.instance = new RedisInitializer(constants.REDIS_PASSWORD, constants.REDIS_HOST, constants.REDIS_PORT);
        }
        return RedisInitializer.instance;
    }

    public async init(mode?: string){
        switch (mode) {
            case constants.CLIENT_TRACKING_MODES.BCAST:
                this.initBCAST();
                break;
            case constants.CLIENT_TRACKING_MODES.OPTIN:
                this.initOPTIN();
                break;
            default:
                this.initDEFAULT();
                break;
        }
    }

    private async initDEFAULT() {
        try {
            console.log(`INITIALIZING DEFAULT CLIENT TRACKING`);
            await this.redisClient.connect();
            await this.subscriber.connect();
            console.log(`Connection Successful`);
            const clientId = await this.redisClient.sendCommand(constants.REDIS_COMMANDS.CLIENT_ID);
            const subscriberId = await this.subscriber.sendCommand(constants.REDIS_COMMANDS.CLIENT_ID);
            console.log('Client ID:', clientId, 'Subscriber client ID:', subscriberId); // Log the client ID

            // Default mode, wherein redis tracks every key accessed by client. 
            console.log('Client TRACKING :', await this.redisClient.sendCommand(['CLIENT', 'TRACKING', 'ON', 'REDIRECT', `${subscriberId}`]));

            await this.subscriber.subscribe(constants.REDIS_INVALIDATE_CHANNEL, async (keys: any, message: any) => {
                console.log(`received Invalidation message ${message} for keys: ${keys}`);
                for (let key of keys) {
                    try {
                        console.log(`Retrieving new value of invalidated key : ${key}`);
                        let val = await this.getKey(key);
                        console.log(`new value of key: ${key} => ${val}`);
                        if(val){
                            await this.cache.set(key, val);
                            console.log(`Successfully updated the new value of ${key} in Nodecache`)
                        }else{
                            await this.cache.del(key);
                            console.log(`Successfully deleted the key from Nodecache`);
                        }
                    } catch (error) {
                        console.log(`Failed to update the new value of key in cache` + error);
                    }
                }
            });
            console.log(`Successfully subscribed to invalidation messages channel`);
            console.log(`DEFAULT CLIENT TRACKING INITIALIZED`);
        } catch (error) {
            console.error('Failed to connect to Redis:' + error);
            throw error;
        }
    }

    private async initBCAST() {
        try {
            console.log(`INITIALIZING BROADCAST CLIENT TRACKING`);
            await this.redisClient.connect();
            await this.subscriber.connect();
            console.log(`Connection Successful`);
            const clientId = await this.redisClient.sendCommand(constants.REDIS_COMMANDS.CLIENT_ID);
            const subscriberId = await this.subscriber.sendCommand(constants.REDIS_COMMANDS.CLIENT_ID);
            console.log('Client ID:', clientId, 'Subscriber client ID:', subscriberId); // Log the client ID

            // Broadcast mode, wherein redis only tracks keys which start with the prefix user:
            // you can specify multiple prefixes using the command :
            // CLIENT TRACKING on REDIRECT 10 BCAST PREFIX keyPrefix1: PREFIX keyPrefix2:
            console.log('Client TRACKING :', await this.redisClient.sendCommand(['CLIENT', 'TRACKING', 'ON', 'REDIRECT', `${subscriberId}`, 'BCAST', 'PREFIX', 'user:']));

            await this.subscriber.subscribe(constants.REDIS_INVALIDATE_CHANNEL, async (keys: any, message: any) => {
                console.log(`received Invalidation message ${message} for keys: ${keys}`);
                for (let key of keys) {
                    try {
                        console.log(`Retrieving new value of invalidated key : ${key}`);
                        let val = await this.getKey(key);
                        console.log(`new value of key: ${key} => ${val}`);
                        if(val){
                            await this.cache.set(key, val);
                            console.log(`Successfully updated the new value of ${key} in Nodecache`)
                        }else{
                            await this.cache.del(key);
                            console.log(`Successfully deleted the key from Nodecache`);
                        }
                    } catch (error) {
                        console.log(`Failed to update the new value of key in cache` + error);
                    }
                }
            });
            console.log(`Successfully subscribed to invalidation messages channel`);
            console.log(`BROADCAST CLIENT TRACKING INITIALIZED`);
        } catch (error) {
            console.error('Failed to connect to Redis:' + error);
            throw error;
        }

    }

    private async initOPTIN() {
        try {
            console.log(`INITIALIZING OPTIN CLIENT TRACKING`);
            await this.redisClient.connect();
            await this.subscriber.connect();
            console.log(`Connection Successful`);
            const clientId = await this.redisClient.sendCommand(constants.REDIS_COMMANDS.CLIENT_ID);
            const subscriberId = await this.subscriber.sendCommand(constants.REDIS_COMMANDS.CLIENT_ID);
            console.log('Client ID:', clientId, 'Subscriber client ID:', subscriberId); // Log the client ID

            // Opt in mode, wherein redis only tracks the keys which client tells it to track. 
            // For this, you need to tell redis that you will be caching a particular key while getting it from redis.
            console.log('Client TRACKING :', await this.redisClient.sendCommand(['CLIENT', 'TRACKING', 'ON', 'REDIRECT', `${subscriberId}`, 'OPTIN']));
            // Subscribe to the __redis__:invalidate channel to get invalidation messages
            await this.subscriber.subscribe(constants.REDIS_INVALIDATE_CHANNEL, async (keys: any, message: any) => {
                console.log(`received Invalidation message ${message} for keys: ${keys}`);
                for (let key of keys) {
                    try {
                        console.log(`Retrieving new value of invalidated key : ${key}`);
                        // for opt in option
                        await this.redisClient.sendCommand(constants.REDIS_COMMANDS.OPT_IN_CACHE);
                        let val = await this.getKey(key);
                        console.log(`new value of key: ${key} => ${val}`);
                        if(val){
                            await this.cache.set(key, val);
                            console.log(`Successfully updated the new value of ${key} in Nodecache`)
                        }else{
                            await this.cache.del(key);
                            console.log(`Successfully deleted the key from Nodecache`);
                        }
                    } catch (error) {
                        console.log(`Failed to update the new value of key in cache` + error);
                    }
                }
            });
            console.log(`Successfully subscribed to invalidation messages channel`);
            console.log(`OPTIN CLIENT TRACKING INITIALIZED`);
        } catch (error) {
            console.error('Failed to connect to Redis:' + error);
            throw error;
        }

    }

    public async setKey(key: any, value: any) {
        try {
            await this.redisClient.set(key, value);
            console.log(`Successfully set the data in redis`);
        } catch (error) {
            console.log(`Error setting data in redis`);
            throw error;
        }
    }

    public async getKey(key: any) {
        try {
            const data = await this.redisClient.get(key);
            console.log(`Successfully got the data from redis`);
            return data;
        } catch (error) {
            console.log(`Error getting data from redis` + error);
            throw error;
        }
    }

    public async getKeyOptInCache(key: any) {
        try {
            await this.redisClient.sendCommand(constants.REDIS_COMMANDS.OPT_IN_CACHE);
            const data = await this.redisClient.get(key);
            console.log(`Successfully got the data from redis`);
            return data;
        } catch (error) {
            console.log(`Error getting data from redis` + error);
            throw error;
        }
    }

    public async deleteKey(key: any) {
        try {
            await this.redisClient.del(key);
            console.log(`Successfully deleted the key from redis`);
        } catch (error) {
            console.log(`Error deleting key from redis`);
            throw error;
        }
    }
}