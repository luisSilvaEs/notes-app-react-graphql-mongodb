const express = require('express');
const mongoose = require('mongoose');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const DB_URI = 'mongodb://localhost:27017/tododb';

mongoose.connect( DB_URI, { useNewUrlParser: true, useUnifiedTopology: true } );
const db = mongoose.connection;

const cors = require('cors');

const schema = buildSchema(`
    type Note {
        id: ID!
        description: String
        date: String
    }

    input NoteInput {
        id: ID
        description: String
        date: String
    }

    type Query {
        getNotes : [Note]
    }

    type Mutation {
        addNote( input: NoteInput! ) : Note
        deleteNote( id: ID! ) : Boolean
        updateAllNotes ( newNotes: [NoteInput]! ) : [Note]
    }
`);

//Define model for DB
const NoteModel = mongoose.model( 'Todo', {
    description: String,
    date: String
} );

// Function to update array A with values from array B
const updateArray = (A, B) => {
    // Update existing values and add new values from B
    for (let i = 0; i < B.length; i++) {
        let index = A.findIndex(item => item.description === B[i].description);
        if (index !== -1) {
            A[index] = B[i];
        } else {
            A.push(B[i]);
        }
    }

    // Remove missing values from A if B has less values
    A = A.filter(itemA => B.some(itemB => itemA.description === itemB.description));

    return A;
}

//Root resolver, basically define the operations for the queries
const root = {
    getNotes: async () => {
        try {
            const notes = await NoteModel.find();
            console.log("Returning", notes);
            return notes;

        } catch( err ) {
            console.error('Error on query getNotes', err );
            throw err;
        }
    },
    addNote: async ( { input } ) => {
        //This implementation could have been done without the need to create the input type. Input type is recommended when many parameters (more than 6 maybe)
        console.log("Adding -->", input )
        try {
            const { description, date } = input;
            const newNote = new NoteModel( { description, date } )
            await newNote.save();
            return newNote;
        } catch ( err ) {
            console.error('Error creating new note', err);
            throw err;        
        }
    },
    deleteNote: async ( {id} ) => {
        console.log("Deleting -->", id )
        try {
            const deletedNote = await NoteModel.findByIdAndDelete(id);
            if (deletedNote) {
                return true; // Note successfully deleted
              } else {
                return false; // Note not found or deletion failed
              }
        } catch( err ) {
            console.error('Error deleting note', err)
            throw err
        }
    },
    updateAllNotes: async ( {newNotes} ) => {
        console.log("New Notes ->", newNotes)
        try {
            const currentNotes = await NoteModel.find();
            if ( currentNotes.length !== newNotes.length ) {
                newNotes.forEach(async (objB) => {
                    try {
                        // Update the document in the collection based on the id
                        await NoteModel.findOneAndUpdate({ description: objB.description }, objB, { upsert: true, new: true });
                    } catch (error) {
                        console.error('Error updating document:', error);
                    }
                });

                // Remove documents from the collection where id not present in array B
                try {
                    await NoteModel.deleteMany({ description: { $nin: newNotes.map(obj => obj.description) } });
                } catch (error) {
                    console.error('Error removing documents:', error);
                }

                const notesUpdated = await NoteModel.find();
                return notesUpdated;
            }
        } catch ( err ) {
            console.error('Error updating all notes', err)
            throw err
        }
    }
};

const app = express();
const PORT = 5010;


app.use(cors({
  origin: 'http://localhost:3000', // Replace this with the origin of your frontend application
  methods: ['GET', 'POST'], // Adjust allowed methods as needed
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

//GraphQL endpoint


app.use( '/graphql', graphqlHTTP( {
    schema: schema,
    rootValue: root,
    graphiql: true 
} ) )



app.listen( PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/graphql`);
});

