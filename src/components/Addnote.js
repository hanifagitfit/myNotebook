import React, { useState,useContext } from 'react'
import notesContext from '../context/notes/notesContext';


const Addnote = (props) => {
    const context = useContext(notesContext);
    const { addNote } = context;

    const [note, setNote]= useState({title:"", description:"", tag:""})
    const handleClick=(e)=>{
            e.preventDefault();  //page doesent reload by using this.
            addNote(note.title,note.description,note.tag);
            setNote({title:"", description:"", tag:""})
            props.showAlert("Note added successfully" ,"success" );

    }
    const onChange=(e)=>{
         setNote({ ...note,[e.target.name]: e.target.value})
    }
    return (
       
        <div>
            <form>
                <div className="row mb-3">
                    <label htmlFor="title" className="col-sm-2 col-form-label">Title</label>
                    <div className="col-sm-10">
                        <input type="text" className="form-control" id="title" name="title"value={note.title} onChange={onChange}  minLength={5} required/>
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="description" className="col-sm-2 col-form-label">Description</label>
                    <div className="col-sm-10">
                        <input type="text" className="form-control" id="description" name="description" value={note.description} onChange={onChange}  minLength={5} required />
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="tag"  className="col-sm-2 col-form-label">tag</label>
                    <div className="col-sm-10">
                        <input type="text" className="form-control"value={note.tag} id="tag" name="tag"onChange={onChange} />
                    </div>
                </div>
                <button disabled={note.title.length<5 || note.description.length<5} type="submit" className="btn btn-primary my-3" onClick={handleClick}>Add note</button>
            </form>
        </div>
    )
}

export default Addnote
