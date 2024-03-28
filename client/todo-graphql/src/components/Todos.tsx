import Note from "./Notes";
import Form from "./Forms";
import "./Todos.css";
import { useEffect, useRef, useState } from "react";

interface ItemNote {
  description: String;
  date: String;
  id?: String;
}

const Todo = () => {
  const [notes, setNote] = useState<ItemNote[]>([
    /*{
      description: "Buy supplies",
    },
    {
      description: "Walk the dog",
    },*/
  ]);

  const notesRef = useRef(notes);

  const updateNotesLocal = (notesAPI: []) => {
    const notesUpdatedLocal = [...notesAPI];

    setNote(notesUpdatedLocal);
  };

  useEffect(() => {
    const getNotesAPI = () => {
      return fetch("http://localhost:5010/graphql", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          query: `
            query {
              getNotes {
                id
                description
                date
              }
            }
        `,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Read data from API", data);
          return data;
        })
        .catch((err) => {
          console.warn("Data could not be consumed, see error: ", err);
          return [];
        });
    };

    console.log("Mounting");

    const notesAPIPromise = getNotesAPI();
    let notesGraphQL = [];

    notesAPIPromise
      .then((data) => {
        notesGraphQL = data.data.getNotes;
        if (notes.length !== notesGraphQL.length) {
          updateNotesLocal(notesGraphQL);
        }
      })
      .catch((err) =>
        console.warn("Err client side getting Notes from API", err)
      );
  }, []);

  useEffect(() => {
    const updateNotesAPI = (newNotes: []) => {
      console.log("TO SEND", newNotes);

      const query = `mutation UpdateAllNotes ( $input: [NoteInput]! ) {
          updateAllNotes(newNotes: $input ) {
              id
              description
              date
          }
      }`;

      const variables = {
        input: newNotes,
      };

      const initFetch = {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          query,
          variables,
        }),
      };

      return fetch("http://localhost:5010/graphql", initFetch)
        .then((response) => response.json())
        .then((data) => {
          console.log("Notes API updated", data);
          return data.data;
        })
        .catch((err) => {
          console.warn(
            "Err sent by server, probably down or an invalid resolver for any of the schemas",
            err
          );
        });
    };

    notesRef.current = notes;
    const handelerReload = (event: any) => {
      event.preventDefault();
      const _notes = [...notesRef.current];
      if (notes.length > 0) {
        updateNotesAPI(_notes as [])
          .then((data) => {
            console.log(
              "Notes GrapQL updated due to dismounting",
              data.data.updateAllNotes
            );
          })
          .catch((err) => {
            console.warn("Err trying to updated GrapQL data");
          });
      }
    };
    window.addEventListener("beforeunload", handelerReload);

    return () => {
      console.log("Dismounting", notes);
      window.removeEventListener("beforeunload", handelerReload);
    };
  }, [notes]);

  const handleSetNote = (newNote: ItemNote) => {
    setNote((n) => [newNote, ...n]);
    console.log("Note added:", newNote);
  };

  const createNote = () => {
    const $input = document.querySelector(
      ".form-container input"
    ) as HTMLInputElement;
    let valueInput = $input.value;
    $input.value = "";
    const currentDate = Date();
    //Add validation if input is empty to avoid save not
    const noteData = {
      description: valueInput,
      date: currentDate,
    };
    handleSetNote(noteData);
  };

  const handleDelteNote = (indexToDelete: number) => {
    setNote(
      notes.filter((_, index) => {
        return indexToDelete !== index;
      })
    );
  };

  const deleteNote = (index: number) => {
    handleDelteNote(index);
  };

  const moveUp = (index: number) => {
    handleMoveUp(index);
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      let swaptArray = [...notes];
      [swaptArray[index - 1], swaptArray[index]] = [
        swaptArray[index],
        swaptArray[index - 1],
      ];
      setNote(swaptArray);
    }
  };

  const moveDown = (index: number) => {
    handleMoveDown(index);
  };

  const handleMoveDown = (index: number) => {
    if (index < notes.length) {
      let spawptArray = [...notes];
      [spawptArray[index], spawptArray[index + 1]] = [
        spawptArray[index + 1],
        spawptArray[index],
      ];
      setNote(spawptArray);
    }
  };

  return (
    <div className="todo-contaiener">
      <h1>To DO list with GraphQL</h1>
      <div className="notes-container">
        {notes.length > 0
          ? notes.map((Nte: ItemNote, index) => (
              <Note
                key={index}
                description={Nte.description}
                actionDelete={() => {
                  deleteNote(index);
                }}
                actionMoveUp={() => {
                  moveUp(index);
                }}
                actionMoveDown={() => {
                  moveDown(index);
                }}
              />
            ))
          : null}
      </div>
      <Form actionButton={createNote} />
    </div>
  );
};

export default Todo;
