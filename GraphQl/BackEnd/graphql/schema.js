const { buildSchema } = require("graphql");

module.exports = buildSchema(`
    type Post {
        _id: ID!
        title: String!
        content: String!
        imageUrl: String!
        creator: User!
        createdAt: String!
        updatedAt: String!
    }

    type User {
        _id: ID!
        name: String!
        email: String
        status: String
        posts: [Post!]!
    }

    input UserData {
        email: String!
        name: String!
        password: String!
    }

    type RootMutation {
        createUser(userInput:UserData): User!
    }

    type RootQuery {
        hello: String
    }

    schema {
        query: RootQuery
        mutation:RootMutation
    }
`);
