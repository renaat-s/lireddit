import { ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core'; //trying to fix cookies
import { ApolloServer } from 'apollo-server-express';
import connectRedis from 'connect-redis';
import cors from 'cors';
import "dotenv-safe/config";
import express from "express";
import session from 'express-session';
import http from 'http'; //trying to fix cookies
import Redis from 'ioredis';
import path from "path";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { COOKIE_NAME, __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { Updoot } from './entities/Updoot';
import { User } from "./entities/User";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import { createUpdootLoader } from './utils/createUpdootLoader';
import { createUserLoader } from './utils/createUserLoader';

const main =  async() => {
    //test
    console.log('test');
    const conn = 
    await createConnection({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        logging: true,
        synchronize: true, //auto migrates, good for development
        entities: [Post, User, Updoot],
        migrations: [path.join(__dirname, "./migrations/*")]
    });
    await conn.runMigrations();

   const app = express();

   const RedisStore = connectRedis(session);
//    const redisClient = new Redis(process.env.REDIS_URL);
    const redis = new Redis(process.env.REDIS_URL);
    
    app.set('trust proxy',1)
    app.use(
        cors({
            origin: "http://localhost:3000", //process.env.CORS_ORIGIN,
            credentials: true
        })
    );
    //original setting for locahost and graphql studio usage:
    //app.use(cors({origin: ['http://localhost:3000','https://studio.apollographql.com'], credentials:true}));
    app.use(
     session({
        name: COOKIE_NAME,
        store: new RedisStore({ 
            client: redis,
            disableTouch: true,
        }),
        cookie:{
            maxAge: 1000 * 3600 * 24 * 3650, //10 years
            httpOnly: true,
            secure: __prod__, // __prod__,//cookie will only work in https //trying to fix cookies
            sameSite:  "none",//"lax",    //"none" for fixing localhost //trying to fix cookies
            // domain: __prod__ ? ".betterthrucode.com" : undefined
        },
        saveUninitialized: false,     
        secret: process.env.SESSION_SECRET,
        resave: true,        
     }),     
   )
    //trying to fix cookies
   app.set('trust proxy', 1);

   const httpServer = http.createServer(app);
   const plugins = [ApolloServerPluginDrainHttpServer({ httpServer })];

   process.env.__dev__ &&
        plugins.push(ApolloServerPluginLandingPageLocalDefault());

   const apolloServer = new ApolloServer({
       schema: await buildSchema({
           resolvers: [HelloResolver, PostResolver,UserResolver],
           validate: false,           
       }),
       context: ({req,res}) => ({
            req,
            res,
            redis, 
            userLoader: createUserLoader(),
            updootLoader: createUpdootLoader()}),
   });


    await apolloServer.start();
    apolloServer.applyMiddleware({
        app,
         cors: 
            false //this line is the last working setting for localhost
        //  { //trying to fix cookies
        //     // origin: ['https://studio.apollographql.com'],
        //     // credentials: true,
        //     origin: ['http://localhost:3000','https://studio.apollographql.com'],
        //     credentials: true,            
        // }
    });

   app.listen(parseInt(process.env.PORT),() => {
      console.log('server started on localhost:4000'); 
   });     
};

main().catch((err) => {
    console.log(err);
});