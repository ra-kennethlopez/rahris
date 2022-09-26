import * as dotenv from 'dotenv'
dotenv.config()

import { ApolloServer } from 'apollo-server-express'
import {
    ApolloServerPluginDrainHttpServer,
    ApolloServerPluginLandingPageLocalDefault
} from 'apollo-server-core'
import express from 'express'
import http from 'http'
import { DocumentNode } from "graphql/language";
import {resolvers, typeDefs} from "./graphql/schema";
import { connection } from "./database";
import {makeExecutableSchema} from "@graphql-tools/schema";
import {directiveTransformer} from "./graphql/directives";
import {contextProvider} from "./graphql/context";


async function startApolloServer(port: number, typeDefs: DocumentNode | DocumentNode[], resolvers: any) {
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
    }))

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
                console.log('INTERNAL_SERVER_ERROR:', err)
                return new Error('Internal server error');
            }

            // Otherwise return the original error. The error can also
            // be manipulated in other ways, as long as it's returned.
            return err;
        },
        context: contextProvider
    });

    // More required logic for integrating with Express
    await server.start();
    server.applyMiddleware({
        app,

        // By default, apollo-server hosts its GraphQL endpoint at the
        // server root. However, *other* Apollo Server packages host it at
        // /graphql. Optionally provide this to match apollo-server.
        path: '/'
    });

    // Modified server startup
    await new Promise<void>(resolve => httpServer.listen({ port }, resolve));
    console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);

}

async function main() {
    try {
        await startApolloServer(4000, typeDefs, resolvers)
    } catch (err) {
        console.error('💀 Error starting the node server', err)
    }
}

void main()