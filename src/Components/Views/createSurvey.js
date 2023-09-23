import SurveyTitle from '../Title/surveyTitle';
import SurveyQuestion from '../Questions/surveyQuestion';
import { useState } from 'react';

function CreateSurvey({setView}) {
  const [title, setTitle] = useState('Survey Title');

  return (

        <>
          <><button onClick={()=>setView("editSurvey")}>Browse Surveys</button></>
          <SurveyTitle title={title} setTitle={setTitle}/>
          <SurveyQuestion title={title}/>
        
        </>
  );
}

export default CreateSurvey;
