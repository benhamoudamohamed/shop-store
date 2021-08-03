export const Config = () => ({
    port: Number(process.env.PORT),
    jwtSecret: process.env.JWT_SECRET,
    database: {
        type: process.env.DB_TYPE,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        synchronize: process.env.TYPEORM_SYNC,
        entities: ["./scr/**/*.entity.ts", "./dist/**/*.entity.js"]
    }
})