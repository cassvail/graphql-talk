const db = require('./db')
const express = require('express')
const _ = require('lodash')
const { ApolloServer, gql } = require('apollo-server-express')

const app = express();
app.get('/', (req, res) => {
  res.send('Hey! I\m a REST API')
})

const typeDefs = gql`
  type ID implements Int

  enum Direction {
    asc
    desc
  }

  type Book {
    id: ID
    title: String
    pubdate: String
    authors: [Author]
    publishers: [Publisher]
  }

  type Author {
    id: ID
    name: String
  }

  type Publisher {
    id: ID
    name: String
  }

  input BooksFilterInput {
    title: String
  }

  input BooksSortInput {
    title: Direction
  }

  type Query {
    books (filter: BooksFilterInput, sort: BooksSortInput): [Book]
    book(id: ID!): Book
    authors: [Author]
    publishers: [Publisher]
  }

  input BookInput {
    title: String
  }

  type Mutation {
    updateBook(id: ID!, data: BookInput): Book
  }
`

const resolvers = {
  Query: {
    books: async (root, args = {}, context) => {
      const { filter = {}, sort = {} } = args

      let query = db.select().from('books')
        // .where('title', 'like', '%Harry%').offset(1).limit(1)

      if (filter.title) query.where('title', 'like', `${filter.title}%` )
      if (sort.title) query.orderBy('title', sort.title)

      console.log(query.toString())
      return await query
    },
    book: async (root, args, context) => {
      let query = db.select().from('books').where('id', '=', args.id)

      console.log(query.toString())
      let res = await query
      return res[0] || {}
    },
    authors: async (root, args, context) => {
      let query = db.select().from('authors')
        // .where('name', 'like', '%Rowling%').limit(1)


      console.log(query.toString())
      return await query
    },
    publishers: async (root, args, context) => {
      let query = db.select().from('publishers').limit(5)
      // .offset(3).limit(1)

      console.log(query.toString())
      return await query
    },
  },
  Book: {
    authors: async (root, args, context) => {
      return db.raw(`
        select authors.*
        from books_authors_link
        left join authors on books_authors_link.author = authors.id
        where books_authors_link.book = ?
      `, root.id)
    },
    publishers: async (root, args, context) => {
      return db.raw(`
      select publishers.*
      from books_publishers_link
      left join publishers on books_publishers_link.publisher = publishers.id
      where books_publishers_link.book = ?
    `, root.id)

    }
  },
  Mutation: {
    updateBook: async (root, args, context) => {
      console.log (args)
      return {
        id: 1,
        title: "asd",
      }
      // return db.raw('update authors set name = ? where id = ?', args.name, args.id)
    }
  }
};

const server = new ApolloServer({
  graphqlPath: '/graphql',
  graphiql: true,
  playground: {
    settings: {
      'editor.theme': 'light',
    },
  },
  typeDefs,
  resolvers,
});

server.applyMiddleware({ app });

app.listen({ port: 3000 }, () =>
  console.log(`🚀 Server ready at http://localhost:3000${server.graphqlPath}`)
);
