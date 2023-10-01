import SurveyTitle from '../Title/surveyTitle';
import SurveyQuestion from '../Questions/surveyQuestion';
import { useState } from 'react';

function CreateSurvey({setView}) {
  const [title, setTitle] = useState('Survey Title');

  return (

        <>
         <> <div style={{display:"flex"}}className="Title-Container"> <SurveyTitle title={title} setTitle={setTitle}/>
         <button style={{backgroundColor:"transparent",color:"white",margin:"2em",padding:"1em",borderRadius:"8%",cursor:"pointer"}} 
          onClick={()=>setView("editSurvey")}>Browse Surveys</button>
          </div>
          </>
          <SurveyQuestion title={title}/>
        
        </>
  );
}

export default CreateSurvey;
