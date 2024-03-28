import Note from "./Notes";
import Form from "./Forms";
import "./Todos.css";
import { useEffect, useState } from "react";

const Todo = () => {
  const [notes, setNote] = useState([
    {
      description: "Buy supplies",
    },
    {
      description: "Walk the dog",
    },
  ]);

  const updateCreateLocaleStorage = () => {
    let todoList = [...notes];
    let todoListSerialized = JSON.stringify(todoList);
    localStorage.setItem("todoItemsStorage", todoListSerialized);
  };

  const updateComponentToDoList = (listLocalStorge: []) => {
    console.log("CMP Stg -> ", listLocalStorge);
    let todoCmponentUpdated = [...listLocalStorge];
    setNote(todoCmponentUpdated);
  };

  const getValueFromLocalStorage = () => {
    let todoListSerialized = localStorage.getItem("todoItemsStorage") as string;
    let todoListDeserialized = JSON.parse(todoListSerialized);

    return todoListDeserialized;
  };

  useEffect(() => {
    let thereIsALocalStorage =
      localStorage.getItem("todoItemsStorage") !== null ? true : false;
    console.log("Cmp MOUNTED");
    console.log("LOC VAL", thereIsALocalStorage);
    if (thereIsALocalStorage) {
      //GET
      let listFromLocalStorage = getValueFromLocalStorage();
      console.log("CONTENT STG", listFromLocalStorage);
      updateComponentToDoList(listFromLocalStorage);
    } else {
      //CREATE/UPDATE
      updateCreateLocaleStorage();
    }

    //ON DIMOUNT
    /*
    return () => {
      console.log("Cmp dimounted");
      updateCreateLocaleStorage();
    };
    */
  }, []);

  //WORKS WELL
  useEffect(() => {
    updateCreateLocaleStorage();
  });

  const hanldeSetNote = (newNote: any) => {
    console.log("Note added:", newNote);
    setNote((n) => [newNote, ...n]);
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
    hanldeSetNote(noteData);
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
      <h1>To DO list</h1>
      <div className="notes-container">
        {notes.map((Nte, index) => (
          <Note
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
        ))}
      </div>
      <Form actionButton={createNote} />
    </div>
  );
};

export default Todo;
