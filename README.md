## REDIS CLIENT TRACKING

### **This is a POC on Redis Client Caching using Redis client tracking**

### What is Redis Client tracking ? 

- It is a feature introduced in Redis 6 that allows Redis to track keys accessed by clients and send invalidation messages when those keys are modified. 
- It helps in efficient client-side caching and consistency between cached data and database updates. 

Read more about redis client tracking :  [Redis client tracking doc](https://redis.io/docs/latest/develop/use/client-side-caching/)


### Steps to Test this POC :

#### STEP 1:
`Git clone https://github.com/ChaitanyaNirf/redis-client-tracking.git`

#### SETP 2:
Once you have cloned the repo, install the dependencies using the following command
`npm i`

#### STEP 3:
Go to `src\constants.ts` file and enter your redis host and password details. 

#### STEP 4:
before you start the application, select the mode you want to test (DEFAULT, BROADCAST or OPT-IN) by passing it's value in 
`init()` in the `src\app.ts` file.

- For default mode: `await redis.init();`
- For broadcast mode: `await redis.init(constants.CLIENT_TRACKING_MODES.BCAST);`
- For opt-in caching mode: `await redis.init(constants.CLIENT_TRACKING_MODES.OPTIN);`

#### STEP 4: 
Run the following command to start the application. 
`npm start`

STEP 5: 
Invoke APIs from POSTMAN to set/get keys from redis.

STEP 6:
Check the logs on console to check invalidation messages and other information. 