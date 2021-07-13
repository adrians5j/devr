import { GraphQLSchemaPlugin } from "@webiny/handler-graphql/plugins/GraphQLSchemaPlugin";
import { ElasticsearchContext } from "@webiny/api-elasticsearch/types";
import { CmsContext } from "@webiny/api-headless-cms/types";

interface Context extends CmsContext, ElasticsearchContext {}

export default new GraphQLSchemaPlugin<Context>({
    typeDefs: /* GraphQL */ `
        extend type Query {
            getTopicOfMonth: Topic
        }
    `,


    resolvers: {
        Query: {
            getTopicOfMonth: async (_, args, context) => {
               /* const result = await context.cms.entries.listPublished({
                    modelId: "topic",
                    where: {
                        title_
                    }
                });*/
                return null;
            }
        }
    }
});
