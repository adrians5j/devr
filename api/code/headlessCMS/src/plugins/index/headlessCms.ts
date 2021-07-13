import { GraphQLSchemaPlugin } from "@webiny/handler-graphql/plugins/GraphQLSchemaPlugin";

export default new GraphQLSchemaPlugin({
    typeDefs: /* GraphQL */ `extend type Query {
        getTopicOfMonth: Topic
    }`,

    resolvers: {
        Query: {
            getTopicOfMonth: new class {}
        }
    }
});
