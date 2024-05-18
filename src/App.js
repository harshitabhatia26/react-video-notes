import Form from './Form';
import Youtube from './Youtube';
import { useState, useRef } from 'react';
import Notes from './Notes';

function App() {
  const [youtubeLink, setYoutubeLink] = useState(null);
  const playerRef = useRef(null);
  const videoId = youtubeLink ? youtubeLink.split('v=')[1].split('&')[0] : null;

  // Render only the Form component if youtubeLink is null
  if (youtubeLink === null) {
    return <Form setYoutubeLink={setYoutubeLink} />;
  }

  // Render the entire app if youtubeLink is not null
  return (
    <div>
      <Form setYoutubeLink={setYoutubeLink}/>
      <br></br>
      <Youtube ref={playerRef} youtubeLink={youtubeLink}/>
      <Notes playerRef={playerRef} videoId={videoId} />
    </div>
  );
}

export default App;
