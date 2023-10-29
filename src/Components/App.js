import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import CreateSurvey from './Views/createSurvey';
import SavedSurvey from './Views/savedSurvey';
import PreviewSurvey from './Views/previewSurvey';
import Survey from './Survey/survey';
import { useState, useEffect } from 'react';
import axios from 'axios';

function ConditionalRoute({bgImage,setBgImage,setId,setToken, token}) {
  const { id } = useParams();
  if (id.length > 20) {
    return <SavedSurvey bgImage={bgImage} setBgImage={setBgImage} token={token} setToken={setToken} />;
  } else {
    return <CreateSurvey bgImage={bgImage} setId={setId} setBgImage={setBgImage} token={token} />;
  }
}

function App() {
  const [bgImage, setBgImage] = useState('previewSurveyContainer');
  const [token, setToken] = useState(null);
  const [id,setId]=useState(null)
  useEffect(() => {
    // Check if a token already exists in localStorage
    const existingToken = localStorage.getItem('token');
    if (existingToken) {
      // If a token exists, use it
      setToken(existingToken);
    } else {
      // If no token exists, retrieve the token
      axios.get('https://apitestdocfile-4yzlt7tvdq-no.a.run.app/login')
        .then((response) => {
          setToken(response.data.token);
          // Store the token in localStorage
          localStorage.setItem('token', response.data.token);
          console.log(response)
        })
        .catch((error) => {
          console.error('Error logging in:', error);
        });
    }
  }, []); // Empty dependency array means this effect runs once on mount
  

  return (
    <Router>
      <Routes>
       <Route path="SurveyUI/" element={<CreateSurvey bgImage={bgImage} setId={setId} setBgImage={setBgImage} token={token} />} />
       <Route path="SurveyUI/Survey/:id" element={<Survey bgImage={bgImage} id={id} setToken={setToken} token={token} />} />
        <Route path="SurveyUI/:id" element={<ConditionalRoute bgImage={bgImage} setToken={setToken}setBgImage={setBgImage} token={token} />} />
        <Route path="SurveyUI/Preview/:id" element={<PreviewSurvey setBgImage={setBgImage} token={token}/>} />
      </Routes>
    </Router>
  );
}

export default App;
