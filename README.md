# README

## Note-taking app

This note-taking app is crafted with React on the client-side for a dynamic user experience, while Node.js powers the server-side for seamless data management.

There are two version of the app for the client:

- _Local storage_ this variant does not communicate with the server. Instead, all notes are storaged in the browser using a local storage to persist the information. Therefore, if user closes the app or reload the page, notes won't get lost.
  The update of the local storage is made on each rendering. The creation of the local storge is made only when the component mounts. The app has one state for the notes.
- _GraphQL_ this variant uses _GraphQL_ to make queries to the server. Notes are updated on the client when the component loads and are updated on the server every time the state changes. The data (notes) are storaged on MongoDB.
  Both apps let the user to interact with notes creating, deleting and move up or down the notes.

## Technologies used:

- React
- Typescript
- Node JS
- Express as framework to create the API
- Moongose to connect with MongoDB
- MongoDB installed locally for the database.

## How to start up the app

### Start Local Storage variant

1. Clone this [repository](git@github.com:luisSilvaEs/notes-app-react-graphql-mongodb.git)
2. Open a terminal and navigate to _/client/todo-local-storage_ folder
3. Execute following command: `npm install`
4. Finally start up the app executing: `npm start`

### Start GraphQL variant

_Must have installed MongoDB locally as pre-requisite, you can see how in the following [link](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/?_ga=2.77001685.1718719020.1711153265-646846362.1710861269) also, it is recommendable to have installed [Mongo DB Compass](https://www.mongodb.com/try/download/shell) to gestionate the data base more easily_

1. Clone this [repository](git@github.com:luisSilvaEs/notes-app-react-graphql-mongodb.git)
2. Open Mongo DB Compass and create a new data base named: **tododb**
3. Now create a collection inside the data base named: **todos**
4. Copy the URI string (it should appear inmeaditely MongoDB Compass is opened), it should look like this: _mongodb://localhost:27017_
5. Navigate to _/server_ and open the file named _server.js_ in a text editor
6. Replace content from variable **DB_URI** for the URI copied from MongoDB Compass
7. Open a terminal, navigate to _/server/_ folder and execute: `npm install`
8. Now start up the server: `node server.js`
9. Finally, open another terminal and navigate to _/client/todo-graphql/_ and execute: `npm start`
