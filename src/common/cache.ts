import NodeCache from "node-cache";

export class CacheInstance {
    static instance : CacheInstance | null = null;
    public static getInstance(){
        if(!CacheInstance.instance){
            CacheInstance.instance = new NodeCache();
        }
        return CacheInstance.instance;
    }
}
