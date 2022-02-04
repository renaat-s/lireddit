"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_core_1 = require("apollo-server-core");
const apollo_server_express_1 = require("apollo-server-express");
const connect_redis_1 = __importDefault(require("connect-redis"));
const cors_1 = __importDefault(require("cors"));
require("dotenv-safe/config");
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const http_1 = __importDefault(require("http"));
const ioredis_1 = __importDefault(require("ioredis"));
const path_1 = __importDefault(require("path"));
require("reflect-metadata");
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const constants_1 = require("./constants");
const Post_1 = require("./entities/Post");
const Updoot_1 = require("./entities/Updoot");
const User_1 = require("./entities/User");
const hello_1 = require("./resolvers/hello");
const post_1 = require("./resolvers/post");
const user_1 = require("./resolvers/user");
const createUpdootLoader_1 = require("./utils/createUpdootLoader");
const createUserLoader_1 = require("./utils/createUserLoader");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('test');
    const conn = yield (0, typeorm_1.createConnection)({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        logging: true,
        synchronize: true,
        entities: [Post_1.Post, User_1.User, Updoot_1.Updoot],
        migrations: [path_1.default.join(__dirname, "./migrations/*")]
    });
    yield conn.runMigrations();
    const app = (0, express_1.default)();
    const RedisStore = (0, connect_redis_1.default)(express_session_1.default);
    const redis = new ioredis_1.default(process.env.REDIS_URL);
    app.set('trust proxy', 1);
    app.use((0, cors_1.default)({
        origin: "http://localhost:3000",
        credentials: true
    }));
    app.use((0, express_session_1.default)({
        name: constants_1.COOKIE_NAME,
        store: new RedisStore({
            client: redis,
            disableTouch: true,
        }),
        cookie: {
            maxAge: 1000 * 3600 * 24 * 3650,
            httpOnly: true,
            secure: constants_1.__prod__,
            sameSite: "none",
        },
        saveUninitialized: false,
        secret: process.env.SESSION_SECRET,
        resave: true,
    }));
    app.set('trust proxy', 1);
    const httpServer = http_1.default.createServer(app);
    const plugins = [(0, apollo_server_core_1.ApolloServerPluginDrainHttpServer)({ httpServer })];
    process.env.__dev__ &&
        plugins.push((0, apollo_server_core_1.ApolloServerPluginLandingPageLocalDefault)());
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: yield (0, type_graphql_1.buildSchema)({
            resolvers: [hello_1.HelloResolver, post_1.PostResolver, user_1.UserResolver],
            validate: false,
        }),
        context: ({ req, res }) => ({
            req,
            res,
            redis,
            userLoader: (0, createUserLoader_1.createUserLoader)(),
            updootLoader: (0, createUpdootLoader_1.createUpdootLoader)()
        }),
    });
    yield apolloServer.start();
    apolloServer.applyMiddleware({
        app,
        cors: false
    });
    app.listen(parseInt(process.env.PORT), () => {
        console.log('server started on localhost:4000');
    });
});
main().catch((err) => {
    console.log(err);
});
//# sourceMappingURL=index.js.map