import NoteContext from "./notesContext";
import { useState } from "react";
const NotesState = (props) => {
  const host = "http://localhost:5000"
  const notesInitial = []

  const [notes, setNotes] = useState(notesInitial);

  const getNotes = async () => {
    // Api call
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // 'auth-token': localStorage.getItem('auth-token')
        'auth-token': localStorage.getItem('token')
      }
    });

    const json = await response.json()
    console.log(json)
    setNotes(json)
  }
  //Add a note
  const addNote = async (title, description, tag) => {
    // Api call
    const response = await fetch(`${host}/api/notes/addnewnote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'auth-token': localStorage.getItem('auth-token')
        'auth-token': localStorage.getItem('token')
      },

      body: JSON.stringify({ title, description, tag })
    });
    const note = await response.json();
    setNotes(notes.concat(note));
  }

  //Delete a note
  const deleteNote = async (id) => {
    // Api call
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        // 'auth-token': localStorage.getItem('auth-token')
        'auth-token': localStorage.getItem('token')
      }


    });
    const json = response.json();


    console.log("note is deleted" + id);
    const delNotes = notes.filter((note) => { return (note._id !== id) })
    setNotes(delNotes)
  }

  //Edit a note
  const editNote = async (id, title, description, tag) => {
    // Api call
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // 'auth-token': localStorage.getItem('auth-token')
        'auth-token': localStorage.getItem('token')
      },

      body: JSON.stringify({ title, description, tag })
    });
    const json = await response.json();
    console.log(json)

    let newNotes = JSON.parse(JSON.stringify(notes))

    for (let index = 0; index < newNotes.length; index++) {
      const element = notes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break;
      }
      setNotes(newNotes);

    }
  }


  return (
    <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes }}>
      {props.children}
    </NoteContext.Provider>
  )
}

export default NotesState;