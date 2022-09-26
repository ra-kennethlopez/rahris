var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as dotenv from 'dotenv';
dotenv.config();
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import express from 'express';
import http from 'http';
import { resolvers, typeDefs } from "./graphql/schema";
import { connection } from "./database";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { directiveTransformer } from "./graphql/directives";
import { contextProvider } from "./graphql/context";
function startApolloServer(port, typeDefs, resolvers) {
    return __awaiter(this, void 0, void 0, function* () {
        // Required logic for integrating with Express
        const app = express();
        // Our httpServer handles incoming requests to our Express app.
        // Below, we tell Apollo Server to "drain" this httpServer,
        // enabling our servers to shut down gracefully.
        const httpServer = http.createServer(app);
        // Transform the schema by applying directive logic
        const schema = directiveTransformer(makeExecutableSchema({
            typeDefs,
            resolvers
        }));
        // Same ApolloServer initialization as before, plus the drain plugin
        // for our httpServer.
        const server = new ApolloServer({
            schema,
            csrfPrevention: true,
            cache: 'bounded',
            plugins: [
                ApolloServerPluginDrainHttpServer({ httpServer }),
                ApolloServerPluginLandingPageLocalDefault({ embed: true }),
            ],
            dataSources: () => ({ db: connection }),
            formatError: (err) => {
                // Don't give the specific errors to the client.
                if (err.extensions.code === 'INTERNAL_SERVER_ERROR') {
                    console.log('INTERNAL_SERVER_ERROR:', err);
                    return new Error('Internal server error');
                }
                // Otherwise return the original error. The error can also
                // be manipulated in other ways, as long as it's returned.
                return err;
            },
            context: contextProvider
        });
        // More required logic for integrating with Express
        yield server.start();
        server.applyMiddleware({
            app,
            // By default, apollo-server hosts its GraphQL endpoint at the
            // server root. However, *other* Apollo Server packages host it at
            // /graphql. Optionally provide this to match apollo-server.
            path: '/'
        });
        // Modified server startup
        yield new Promise(resolve => httpServer.listen({ port }, resolve));
        console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield startApolloServer(4000, typeDefs, resolvers);
        }
        catch (err) {
            console.error('💀 Error starting the node server', err);
        }
    });
}
void main();
