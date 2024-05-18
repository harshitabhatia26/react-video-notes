import React, { useState } from 'react';

const Form = ({ setYoutubeLink }) => {
    const [input, setInput] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        setYoutubeLink(input);
        setInput('');
    }
    return (
        <div className='px-4 sm:px-6 lg:px-8 mt-8'>
            <h1 className='font-semibold text-2xl'>Video Player with Notes</h1>
            <form className='form-group custom-form py-4  flex flex-col' onSubmit={handleSubmit}>
                <label className='pb-2'>Enter YouTube URL</label>
                <input type='text' className='form-control custom-input py-2 w-92 border rounded-md' placeholder='Enter Youtube URL' required onChange={(e) => setInput(e.target.value)} value={input || ''} />
                <button type='submit' className='w-20 rounded-lg bg-blue-500 my-2 py-1 text-sm font-semibold sm:text-md text-white'>Submit</button>
            </form>
        </div>
    );
}

export default Form;
