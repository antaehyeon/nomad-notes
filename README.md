# Nomad Notes
> Offline First Markdown Note Taking App built with Apollo.

<br/>

## STEP 1. SETUP

1. npx create-react-app
   1. Delete default files other than `App.js and index.js`
2. git clone & git remote add origin 'URL' (git pull origin branchname --allow-unrelated-histories)

<br/>

## STEP 2. Install Modules

1. yarn add apollo-cache-inmemory apollo-client graphql react-apollo styled-components styled-reset react-textarea-autosize graphql-tag apollo-link-state

2. create folder in src `Components` `Routes`

3. yarn add react-router-dom

<br/>

## STEP 3. Configuration

1. create `src/apollo.js`

   ```react
   import { ApolloClient } from "apollo-client";
   import { InMemoryCache } from "apollo-cache-inmemory";
   import { withClientState } from "apollo-link-state";
   import { ApolloLink } from "apollo-link";
   
   import { typeDefs, defaults, resolvers } from "./clientState";
   
   const cache = new InMemoryCache();
   
   const stateLink = withClientState({
     cache,
     typeDefs,
     defaults,
     resolvers
   });
   
   const client = new ApolloClient({
     cache,
     link: ApolloLink.from([stateLink])
   });
   
   export default client;
   ```

2. create `clientState.js`

   ```javascript
   export const defaults = {};
   export const resolvers = {};
   export const typeDefs = {};
   ```

3. modify `index.js`

   ```react
   import React from "react";
   import ReactDOM from "react-dom";
   import App from "./App";
   import { ApolloProvider } from "react-apollo";
   import client from "./apollo";
   import GlobalStyle from "./globalStyles";
   
   ReactDOM.render(
     <ApolloProvider client={client}>
       <GlobalStyle>
         <App />
       </GlobalStyle>
     </ApolloProvider>,
     document.getElementById("root")
   );
   ```

<br/>

## STEP 4. Type Definitions for Offline Schema (GraphQL)

1. modify `clientState.js`

   ```javascript
   export const defaults = {
     notes: []
   };
   export const typeDefs = [
     `
       schema {
           query: Query
           mutation: Mutation
       }
       type Query {
           notes: [Note]!
           note(id: Int!): Note
       }
       type Mutation {
           createNote(title: String!, content: String!)
           editNote(id: String!, title: String!, content: String!)
       }
       type Note {
           id: Int!
           title: String!
           content: String!
       }
       `
   ];
   export const resolvers = {
     Query: {
       notes: () => {}
     }
   };
   ```

<br/>

## STEP 5. Note Query

1. modify `clientState.js`

   ```javascript
   export const defaults = {
     notes: [
       {
         __typename: "Note",
         id: 1,
         title: "First",
         content: "Second"
       }
     ]
   };
   ```

2. GraphQL Query

   ```mysql
   {
       notes(id:1) @client {
           id
           title
       }
   }
   ```

3. creaate Mutation

   ```javascript
   export const resolvers = {
     Query: {
       note: (_, variables, { getCacheKey }) => {
         const id = getCacheKey({ __typename: "Note", id: variables.id });
         console.log(id);
         return null;
       }
     }
   };
   ```

4. modify `clientState.js`

   ```javascript
   export const resolvers = {
     Query: {
       note: (_, variables, { cache }) => {
         const id = cache.config.dataIdFromObject({
           __typename: "Note",
           id: variables.id
         });
         console.log(id);
         return null;
       }
     }
   };
   ```

5. create `fragments.js`

   ```javascript
   import gql from "graphql-tag";
   
   export const NOTE_FRAGMENT = gql`
     fragment NotePars on Note {
       id
       title
       content
     }
   `;
   ```

6. modify `clientState.js`

   ```javascript
   export const resolvers = {
     Query: {
       note: (_, variables, { cache }) => {
         const id = cache.config.dataIdFromObject({
           __typename: "Note",
           id: variables.id
         });
         const note = cache.readFragment({ fragment: NOTE_FRAGMENT, id });
         return note;
       }
     }
   };
   ```

   









