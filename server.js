const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const Event = require('./models/event');

const app = express();

const events = [];
app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
  schema: buildSchema(`
        type Event {
          _id: ID!
          title: String!
          description: String!
          price: Float!
          date: String!
        }

        input EventInput {
          title: String!
          description: String!
          price: Float!
          date: String!
        }

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
  rootValue: {
    events: () => {
      return Event.find()
      .then(result => {
        return result;
      }).catch(err => {
        console.log(err)
      });
    },

    createEvent: args => {
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: args.eventInput.date
      });
      return event
      .save()
      .then(result => {
        console.log(result);
        return result;
      }).catch(err => {
        console.log(err)
      });
    }
  },
  graphiql: true
})
);

mongoose.connect(`mongodb+srv://sonhung:${process.env.MONGO_PASS}@cluster0-6dwdm.mongodb.net/test?retryWrites=true`,
  { useNewUrlParser: true }
).then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Listen on port: ${process.env.PORT}`)
  });
}).catch(err => {
  console.log(err);
})

