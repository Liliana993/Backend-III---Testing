import dotenv from "dotenv"
dotenv.config()
// Configuración de variables de entorno
const requiredEnvs = ["MONGODB_URI", "JWT_SECRET"]

// Validación de variables de entorno obligatorias
requiredEnvs.forEach((envVars)=>{
    if(!process.env[envVars]){
        throw new Error(
            `[Config Error] La variable de entorno obligatoria '${envVars}' no está definida.`
        )
    }
})

// Validación de PORT
const rawPort = process.env.PORT || 3000
const port = Number(rawPort);
if (isNaN(port) || port <= 0 || port > 65535) {
    throw new Error(
        `[Config Error] La variable de entorno 'PORT' debe ser un número válido entre 1 y 65535. Valor actual: ${rawPort}`
    )
}

// Validación de NODE_ENV
const allowedEnvs = ["development", "production", "test"]
const environment = process.env.NODE_ENV || "development"
if (!allowedEnvs.includes(environment)) {
    throw new Error(
        `[Config Error] La variable de entorno 'NODE_ENV' debe ser uno de los siguientes valores: ${allowedEnvs.join(", ")}. Valor actual: ${environment}`
    )
}

// Exportación de configuración
const config = Object.freeze({
    port,
    environment,
    mongodbUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET
});

export default config;