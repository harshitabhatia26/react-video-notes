import React, { useState, useEffect, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const Notes = ({ playerRef, videoId }) => {
    const [notes, setNotes] = useState([]);
    const [currentNote, setCurrentNote] = useState('');
    const [editIndex, setEditIndex] = useState(null);
    const [image, setImage] = useState(null);
    const [editorKey, setEditorKey] = useState(0); // Initialize key with 0
    const fileInputRef = useRef(null);

    useEffect(() => {
        // Load notes from local storage for the current video ID when the component mounts or videoId changes
        const storedNotes = JSON.parse(localStorage.getItem(`notes-${videoId}`));
        if (storedNotes) {
            setNotes(storedNotes);
        } else {
            setNotes([]);
        }
    }, [videoId]);

    useEffect(() => {
        // Save notes to local storage whenever the notes state changes
        localStorage.setItem(`notes-${videoId}`, JSON.stringify(notes));
    }, [notes, videoId]);

    const addNote = () => {
        const timestamp = playerRef.current.getCurrentTime();
        const currentDate = new Date();
        const year = currentDate.getFullYear().toString().slice(-2); // Get last two digits of the year
        const date = `${currentDate.getDate()} ${currentDate.toLocaleString('default', { month: 'short' })} '${year}`;
    
        const newNote = { timestamp, date, content: currentNote, image };
        if (editIndex !== null) {
            const updatedNotes = notes.map((note, index) =>
                index === editIndex ? newNote : note
            );
            setNotes(updatedNotes);
            setEditIndex(null);
        } else {
            setNotes([...notes, newNote]);
        }
        setCurrentNote('');
        setImage(null); // Reset image state after adding the note
        fileInputRef.current.value = ''; // Reset file input value
        setEditorKey(prevKey => prevKey + 1);
    };
    

    const editNote = (index) => {
        const { content, image } = notes[index];
        setCurrentNote(content);
        setImage(image);
        setEditIndex(index);
    };

    const deleteNote = (index) => {
        setNotes(notes.filter((_, i) => i !== index));
    };

    const seekTo = (timestamp) => {
        playerRef.current.seekTo(timestamp);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            setImage(reader.result);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="container mx-auto px-4 py-2 border rounded-lg my-8">
            <div className='text-xl font-semibold'>My notes</div>
            <div className='text-sm mb-4'>All your notes at a single place. Click on any note to go to the specific timestamp at the video.</div>
            <Editor
                apiKey='o0hi96l7nw5oyj4gk3egybxr6bn0zt1q22gpnzeu82awqzay'
                key={editorKey} // Key prop to reset the Editor component
                textareaName='Body'
                initialValue="<p>Add a note...</p>"
                className="border rounded-lg p-2 w-full mb-1"
                init={{
                    height: 300,
                    menubar: false,
                    plugins: [
                        'advlist autolink lists link image charmap print preview anchor',
                        'searchreplace visualblocks code fullscreen',
                        'insertdatetime media table paste code help wordcount'
                    ],
                    toolbar: 'undo redo | formatselect | ' +
                        'bold italic backcolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help | image',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                }}
                onEditorChange={(newText) => setCurrentNote(newText)}
            />
            <div>
                <input
                    className='mt-4'
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    ref={fileInputRef}
                />
                {image && (
                    <div className='mt-2'>
                        <img src={image} alt="Uploaded" style={{ maxWidth: '100px', maxHeight: '100px' }} />
                    </div>
                )}
            </div>
            <div className='flex justify-end'>
                <button
                    className="border rounded-lg px-2 py-1 text-sm font-semibold mb-4 m-2"
                    onClick={addNote}
                >
                    {editIndex !== null ? 'Update Note' : 'Add new note'}
                </button>
            </div>
            <hr />
            <div className="mt-4">
                {notes.map((note, index) => (
                    <div key={index} className="p-2">
                        <div>
                            <span className="font-semibold">{note.date}</span>
                            <div className='flex'>
                                <p className='mr-2'>Timestamp:</p>
                                <button
                                    className="text-blue-500"
                                    onClick={() => seekTo(note.timestamp)}
                                >
                                    {new Date(note.timestamp * 1000).toISOString().substr(11, 8)}
                                </button>
                            </div>
                        </div>
                        {/* Use dangerouslySetInnerHTML to interpret HTML content */}
                        <div
                            className="border rounded-lg p-2 m-2"
                            dangerouslySetInnerHTML={{ __html: note.content }}
                        />
                        {note.image && (
                            <div>
                                <img src={note.image} alt="Note Image" style={{ maxWidth: '100px', maxHeight: '100px' }} />
                            </div>
                        )}
                        <div className='flex justify-end'>
                            <button
                                className="border rounded-lg px-2 text-sm font-semibold mx-2"
                                onClick={() => editNote(index)}
                            >
                                Edit note
                            </button>
                            <button
                                className="border rounded-lg px-2 text-sm font-semibold mr-2 text-red-500"
                                onClick={() => deleteNote(index)}
                            >
                                Delete note
                            </button>
                        </div>
                        <div className='mt-4'><hr /></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Notes;
