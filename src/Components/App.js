
import { useState } from 'react';
import CreateSurvey from './Views/createSurvey';
import EditSurvey from './Views/editSurvey';

function App() {

  const [view,setView] = useState('createSurvey');

   
 

  return (
    <div>
      {view === 'createSurvey' ? (
        <>
        <CreateSurvey setView={setView}/>
         </>
      ) :'editSurvey' ? (
        <>
        <EditSurvey setView={setView}/>
        </>
      ) :'sendSurvey'(
        <>
       
        </>
        )
      }
   
    </div>
  );
}

export default App;
