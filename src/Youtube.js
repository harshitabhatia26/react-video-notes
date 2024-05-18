import React, { useEffect, useState, forwardRef } from 'react';
import ReactPlayer from 'react-player/youtube';

const Youtube = forwardRef(({ youtubeLink }, ref) => {
    const [videoInfo, setVideoInfo] = useState({ title: '' });

    useEffect(() => {
        const getVideoInfo = async () => {
            try {
                const response = await fetch(`https://www.youtube.com/oembed?url=${youtubeLink}&format=json`);
                const data = await response.json();
                setVideoInfo({ title: data.title });
            } catch (error) {
                console.error('Error fetching video info:', error);
            }
        };

        getVideoInfo();
    }, [youtubeLink]);

    return (
        <div className='flex flex-col'>
            <div className='w-full flex justify-center align-center px-4 sm:px-6 lg:px-8'>
                <div className='relative w-full' style={{ paddingBottom: '56.25%'}}>
                    <ReactPlayer
                        ref={ref}
                        url={youtubeLink}
                        controls
                        width='100%'
                        height='100%'
                        style={{ position: 'absolute', top: 0, left: 0 }}
                    />
                </div>
            </div>
            <h2 className='text-xl font-semibold mb-2 pt-4 px-4 sm:px-6 lg:px-8'>{videoInfo.title}</h2>
            <div className='mx-4 sm:mx-6 lg:mx-8 my-2'><hr/></div>
        </div>
    );
});

export default Youtube;
