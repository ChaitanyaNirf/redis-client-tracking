import { RedisInitializer } from "../common/redis";
import { CacheInstance } from "../common/cache";


export class Service {
    private redis : RedisInitializer
    private cache: any
    constructor(){
        this.redis = RedisInitializer.getInstance();
        this.cache = CacheInstance.getInstance();
    }

    public async getKey(key: any): Promise<any> {
        try {
            console.log(`Checking if key ${key} exists in NodeCache`);
            let data = await this.cache.get(key);
            if(data){
                console.log(`Found key in NodeCache, returning it's value...`)
                return {message: "Found key in NodeCache", value: data};
            }
            console.log(`Key not found in NodeCache, fetching it from redis...`);
            let value = await this.redis.getKey(key);
            console.log(`Setting the key: ${key} with value: ${value} in NodeCache`);
            await this.cache.set(key, value);
            console.log(await this.cache.set(key, value));
            console.log(`Successfully set the key: ${key} with value: ${value} in NodeCache`);
            return {message: "Key fetched from redis", value: value};
        } catch (error) {
            console.log(`Error getting key`);
            throw error;
        }

    }

    public async getKeyOptInCache(key: string): Promise<any> {
        try {
            console.log(`Checking if key ${key} exists in NodeCache`);
            let data = await this.cache.get(key);
            if(data){
                console.log(`Found key in NodeCache, returning it's value...`)
                return {message: "Found key in NodeCache", value: data};
            }
            console.log(`Key not found in NodeCache, fetching it from redis...`);
            let value = await this.redis.getKeyOptInCache(key);
            console.log(`Setting the key: ${key} with value: ${value} in NodeCache`);
            await this.cache.set(key, value);
            console.log(await this.cache.set(key, value));
            console.log(`Successfully set the key: ${key} with value: ${value} in NodeCache`);
            return {message: `Fetched the value from redis`, value: value};
        } catch (error) {
            console.log(`Error getting key`);
            throw error;
        }

    }

    public async addOrUpdateKey(key: string, value: any): Promise<any> {
        try {
            await this.redis.setKey(key, value);
            console.log(`Successfully set the value in redis`);
            return {message: `Successfully set the value in redis`};
        } catch (error) {
            console.log(`Error adding key to redis`);
            throw error;
        }
        
    }

    public async deleteKey(key: any): Promise<any> {
        try {
            await this.redis.deleteKey(key);
            console.log(`Successfully deleted the key from redis`);
            return {message: `Successfully deleted the key from redis`};
        } catch (error) {
            console.log(`Erro deleting the key from redis`);
            throw error;
        }
        
    }
}