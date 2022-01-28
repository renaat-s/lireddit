import { MikroORM } from "@mikro-orm/core";
import { ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core'; //trying to fix cookies
import { ApolloServer } from 'apollo-server-express';
import connectRedis from 'connect-redis';
import cors from 'cors';
import express from "express";
import session from 'express-session';
import http from 'http'; //trying to fix cookies
import Redis from 'ioredis';
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { COOKIE_NAME } from "./constants";
import microConfig from "./mikro-orm.config";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";

const main =  async() => {      
    const orm = await MikroORM.init(microConfig);
    await orm.getMigrator().up();
    
    const generator = orm.getSchemaGenerator();
    await generator.updateSchema();
    
   const app = express();

   const RedisStore = connectRedis(session);
//    const redisClient = new Redis(process.env.REDIS_URL);
    const redis = new Redis({
        port: 6379,
        host: 'localhost',
    });
    

   app.use(cors({origin: ['http://localhost:3000','https://studio.apollographql.com'], credentials:true}));
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
            secure: false, // __prod__,//cookie will only work in https //trying to fix cookies
            sameSite: "none" //trying to fix cookies
        },
        saveUninitialized: false,     
        secret: "thisshouldreallybehiddenlookintoenvironmentvariables",
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
       context: ({req,res}) => ({em: orm.em,req,res,redis}),
   });


    await apolloServer.start();
    apolloServer.applyMiddleware({
        app,
         cors: false
        //  { //trying to fix cookies
        //     // origin: ['https://studio.apollographql.com'],
        //     // credentials: true,
        //     origin: ['http://localhost:3000','https://studio.apollographql.com'],
        //     credentials: true,            
        // }
    });

   app.listen(4000,() => {
      console.log('server started on localhost:4000'); 
   });     
};

main().catch((err) => {
    console.log(err);
});