import "./previewSurvey.css"
import axios from "axios";
import React from 'react';
import { useState,useEffect } from 'react';
import { useParams,useLocation} from 'react-router-dom';
import { MenuItem, Select,InputLabel,FormControl } from '@mui/material';



function PreviewSurvey() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const bgImage = queryParams.get('bgImage');
  const token = queryParams.get('token');
  console.log(bgImage)
    const [data, setData] = useState(null);
    const { id } = useParams();
    const [title,setTitle]=useState('');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [finished, setFinished] = useState(false);
    const[questions,setQuestion]=useState([]);
    const [selectedValue, setSelectedValue] = useState("");
    useEffect(() => {
      if (id) {
        axios.get(`http://localhost:3100/QAsGet/${id}`,{
            headers: { Authorization: `Bearer ${token}` }})
          .then((response) => {
            console.log('Data retrieved successfully:', response.data);
            let data = response.data.data;
            // Filter out any empty questions or answers
            data.questions = data.questions.filter(question => question.question.trim() !== "");
            data.questions.forEach(question => {
              question.answers = question.answers.filter(answer => answer.trim() !== "");
            });
            setData(data); // Save the data to state
            setTitle(data.title);
            setQuestion(data.questions);
            console.log(token)
          })
          .catch((error) => {
           
            console.error('Error retrieving data:', error);
          });
      }
    }, [id]);
  const handleNextClick = () => {
    if (currentQuestionIndex < data.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setFinished(true);
    }
  };
  const handleBackClick = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex-1);
    } 
  };
  
  return (
      <div className={bgImage}>
      <div className="previewframe">
        {finished ? (
          <h1>Thanks for taking The survey</h1>
        ) : (
          <>
          <h1>{data ? data.title : title}</h1>
          {data && data.questions && (
            <>
          <div className='prevContainer'>
  <h2>
    {questions[currentQuestionIndex].question}
  </h2>
  {questions[currentQuestionIndex].answersType === 'Drop Down List' ? (
    <div className="prevContainer-Answers-Select-Wrapper">
   <FormControl fullWidth>
  <InputLabel className="selectInputLabel" id="demo-simple-select-label">Select Answer</InputLabel>
  <Select
  style={{fontSize:"1em",fontWeight:"1em"}}
    className="prevContainer-Answers-Select"
    labelId="demo-simple-select-label"
    id="demo-simple-select"
    value={selectedValue}
    onChange={(event) => {setSelectedValue(event.target.value);
      handleNextClick()}}
  >
    <MenuItem className="selectMenuItem" value="" disabled>
    </MenuItem>
    {questions[currentQuestionIndex].answers.map((answer, i) => (
      <MenuItem className="selectMenuItem" key={i} value={answer}>
        {answer}
      </MenuItem>
    ))}
  </Select>
</FormControl>
  </div>
  
  ) : (
    <div className="prevContainer-Answers">
      {questions[currentQuestionIndex].answers.map((answer, i) => {
        switch (questions[currentQuestionIndex].answersType) {
          case 'Radio':
            return (
              <label className="prevContainer-Answers-Answer" key={i}>
                <input type="radio" id={`answer${i}`} className="radioAnswers" name="answer" value={answer} />
                <span htmlFor={`answer${i}`}>{answer}</span>
              </label>

            );
          case 'Check Box':
            return (
              <label className="prevContainer-Answers-Answer" key={i}>
                <input style={{cursor:"pointer"}} type="checkbox" id={`answer${i}`} name="answer" value={answer} />
                <span htmlFor={`answer${i}`}>{answer}</span>
              </label>

            );
          default:
            return null;
        }
      })}
    </div>
  )}
</div>
               <div style={{marginLeft:"6em",display:"flex",gap:"10em",justifyContent:"space-between"}}>    {currentQuestionIndex > 0 && (
                  <button className="backButton" onClick={handleBackClick}>
                    Back
                  </button>
                )}

              <button className="nextButton" onClick={handleNextClick}>
                {currentQuestionIndex < data.questions.length - 1 ? 'Next' : 'Finish'}
              </button> </div>
            
              
              
            </>
          )}
        </>
        
        )}
      </div>
    </div>
  );
  
  
  

}

export default PreviewSurvey;
