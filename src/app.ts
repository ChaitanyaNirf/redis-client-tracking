import express from "express";
import applicationRouter from './routers/router';
import { RedisInitializer } from "./common/redis";
import constants from "./constants";
const app = express();

app.use(express.json());
const basePath = 'redis'
app.use('/' + basePath + '/', applicationRouter.router);

async function initializeRedis() {
    try {
        console.log(`Initializing Redis`);
        const redis = RedisInitializer.getInstance();
        // default mode
        // await redis.init();
        // Broadcast mode
        // await redis.init(constants.CLIENT_TRACKING_MODES.BCAST);
        // Optin 
        await redis.init(constants.CLIENT_TRACKING_MODES.OPTIN);
    } catch (error) {
        console.log(`Failed to Initialize Redis`);
        process.exit(1);
    }
}

app.listen(3000, () => {
    console.log(`Express server started on port 3000`);
    initializeRedis();
})

export default app;