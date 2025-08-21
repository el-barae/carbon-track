const { ApolloServer, gql } = require("apollo-server");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Schéma GraphQL
const typeDefs = gql`
  type CreditBatch {
    batchId: String!
    projectId: String!
    vintage: Int!
    standard: String!
    region: String!
    totalIssued: String!
    totalRetired: String!
    createdAt: String!
  }

  type Query {
    credits: [CreditBatch!]!
  }
`;

// Résolveurs
const resolvers = {
  Query: {
    credits: () => prisma.creditBatch.findMany(),
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀 API ready at ${url}`);
});
