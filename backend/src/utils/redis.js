import redis from 'redis'
import env from 'dotenv'
env.config()

const redisClient = redis.createClient({
    url : env.REDIS_URL
})

redisClient.connect()

redisClient.on('error', (err) => {
    console.error('Redis Client Error', err);
})

const setCache = async (Key,value,expireTime = 3600) => {
    try {
        await redisClient.set(Key,JSON.stringify(value),
            {
                EX: expireTime, // Set expiration time in seconds
                NX: true // Only set the key if it does not already exist
            }
        );
    } catch (error) {
        console.error('error setting cache :',error)
    }
}

export {redisClient, setCache};