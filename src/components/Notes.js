import React, { useContext, useEffect, useRef, useState } from 'react';
import notesContext from '../context/notes/notesContext';
import Noteitem from './Noteitem';
import Addnote from './Addnote';
import { useNavigate } from 'react-router-dom';


const Notes = (props) => {
    const context = useContext(notesContext);
    let navigate = useNavigate();
    const { notes, getNotes, editNote } = context;
    useEffect(() => {
        if (localStorage.getItem('token')) {

            getNotes()
        }
        else {
            navigate('/login');
        }


        // eslint-disable-next-line
    }, [])

    const ref = useRef(null)
    const refClose = useRef(null)
    const updateNote = (currentNote) => {
        ref.current.click();
        setNote({ id: currentNote._id, etitle: currentNote.title, edescription: currentNote.description, etag: currentNote.tag });
    }

    //Addnote vala h for getiing rid from error.
    const [note, setNote] = useState({ id: "", etitle: "", edescription: "", etag: "" })
    const handleClick = (e) => {
        // eslint-disable-next-line
        console.log("Updated", note)
        editNote(note.id, note.etitle, note.edescription, note.etag)
        refClose.current.click();
        props.showAlert("Note updated successfully", "success");


    }
    const onChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value })
    }


    return (
        <>
            <Addnote showAlert={props.showAlert} />

            <button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Launch demo modal
            </button>


            <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Edit note</h5>
                            <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="row mb-3">
                                    <label htmlFor="title" className="col-sm-2 col-form-label">Title</label>
                                    <div className="col-sm-10">
                                        <input type="text" className="form-control" id="etitle" name="etitle" value={note.etitle} onChange={onChange} minLength={5} required />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="description" className="col-sm-2 col-form-label">Description</label>
                                    <div className="col-sm-10">
                                        <input type="text" className="form-control" id="edescription" name="edescription" value={note.edescription} onChange={onChange} minLength={5} required />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="tag" className="col-sm-2 col-form-label">tag</label>
                                    <div className="col-sm-10">
                                        <input type="text" className="form-control" id="etag" name="etag" value={note.etag} onChange={onChange} />
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button disabled={note.etitle.length < 5 || note.edescription.length < 5} type="button" className="btn btn-primary" onClick={handleClick}>Update note</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className='row'>
                <h3>Your Notes</h3>
                <div className="container">
                    {notes.length === 0 && "No notes to display"}
                </div>
                {notes.map((note) => {
                    return <Noteitem key={note._id} updateNote={updateNote} showAler={props.showAler} note={note} />
                })}
            </div>
        </>
    )
}

export default Notes
