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
    type AuthData{
        token:String!
        userId:String!
    }
    type PostsData {
        posts : [Post!]
        totalPosts: Int
    }

    input UserData {
        email: String!
        name: String!
        password: String!
    }

    input PostData {
        title: String!
        content : String!
        imageUrl: String!
    }

    type RootMutation {
        createUser(userInput:UserData): User!
        createPost(postInput: PostData): Post!
        updatePost(id: ID!, postInput: PostData): Post!
        deletePost(id: ID!): Boolean
    }

    type RootQuery {
        login(email: String!, password: String!):AuthData!
        posts(page: Int): PostsData!
        post(id: ID): Post!
    }

    schema {
        query: RootQuery
        mutation:RootMutation
    }
`);
