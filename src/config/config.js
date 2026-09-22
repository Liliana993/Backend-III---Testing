import dotenv from "dotenv"

dotenv.config()

const requiredEnvs = ["MONGODB_URI", "JWT_SECRET"]

requiredEnvs.forEach((envVars)=>{
    if(!process.env[envVars]){
        throw new Error(
            "Faltan la env " + envVars
        )
    }
})

const config = {
    port: Number(process.env.PORT)|| 3000,
    mongoUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    enviroment: process.env.NODE_ENV || "development"
}

export default config;