import axios from "axios";
import React from 'react';
import { useState, useEffect } from 'react';
import { useParams,useLocation} from 'react-router-dom';
import { MenuItem, Select, InputLabel, FormControl } from '@mui/material';

export default function Survey({setToken}) {
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const bgImage = queryParams.get('bgImage');
  const token = queryParams.get('token');
  const [data, setData] = useState(null);
  const [title, setTitle] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const [questions, setQuestion] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState([]);

  useEffect(() => {
    // Check if a token already exists in localStorage
    const existingToken = localStorage.getItem('token');
    if (existingToken) {
      // If a token exists, use it
      console.log(existingToken);
      setToken(existingToken);
    } else {
      // If no token exists, retrieve the token
      axios.get('http://localhost:3100/login')
        .then((response) => {
          setToken(response.data.token);
          // Store the token in localStorage
          localStorage.setItem('token', response.data.token);
          console.log(response);
        })
        .catch((error) => {
          console.error('Error logging in:', error);
        });
    }
    if (token) {
      console.log(id)
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
      })
      .catch((error) => {
        console.log(token)
        console.error('Error retrieving data:', error);
      });
    }
  }, [token]); // The effect runs again whenever `token` changes

    useEffect(() => {
        if (finished) {
          sendPostRequest(questions,selectedAnswers);
        }
      }, [finished,id]);
      
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
  
//postResults
const sendPostRequest = async (questions, selectedAnswers) => {
  // Create an array to hold the selected answers
  let formattedAnswers = [];

  // Iterate over the questions
  for(let i = 0; i < questions.length; i++) {
    // If there is a selected answer for this question
    if(selectedAnswers[i]) {
      // Add the question and answer to the array
      formattedAnswers.push({
        question: questions[i].question,
        answers: Array.isArray(selectedAnswers[i]) ? selectedAnswers[i] : [selectedAnswers[i]]
      });
    }
  }

  try {
    // Send a post request with axios
    const response = await axios.post('http://localhost:3100/ResPost', {
      title: data.title, // replace with your actual title
      questions: formattedAnswers,
      surveyId: id, // replace with your actual surveyId
      assessorToken: token, // replace with your actual assessorToken
      assessedId: "null" // replace with your actual assessedId
    });

    console.log(response);
  } catch (error) {
    console.error(error);
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
          <h2>{questions[currentQuestionIndex].question}</h2>
  {questions[currentQuestionIndex].answersType === 'Drop Down List' ? (
    <div className="prevContainer-Answers-Select-Wrapper">
   <FormControl fullWidth>
  <InputLabel id="demo-simple-select-label">Select Answer</InputLabel>
  <Select
  style={{fontSize:"1em",fontWeight:"1em"}}
  className="prevContainer-Answers-Select"
  labelId="demo-simple-select-label"
  id="demo-simple-select"
  value={selectedAnswers[currentQuestionIndex] || ''}
  onChange={(event) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: event.target.value
    });
    handleNextClick();
  }}
>

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
            <input type="radio" id={`answer${i}`}
            className="radioAnswers" 
            name="answer" 
            value={answer}
            checked={selectedAnswers[currentQuestionIndex] === answer}
            onChange={() => {
              setSelectedAnswers({
                ...selectedAnswers,
                [currentQuestionIndex]: answer
              });
            }}
          />
          
          case 'Check Box':
            return (
              <label className="prevContainer-Answers-Answer" key={i}>
       <input 
          type="checkbox" 
          value={answer} 
          style={{cursor:"pointer"}}
          checked={selectedAnswers[currentQuestionIndex] && selectedAnswers[currentQuestionIndex].includes(answer)}
          onChange={() => {
            let newSelectedAnswers = {...selectedAnswers};
            if (newSelectedAnswers[currentQuestionIndex] && newSelectedAnswers[currentQuestionIndex].includes(answer)) {
              // If the answer is already in the array, remove it
              newSelectedAnswers[currentQuestionIndex] = newSelectedAnswers[currentQuestionIndex].filter(a => a !== answer);
            } else {
              // If the answer is not in the array, add it
              if (!newSelectedAnswers[currentQuestionIndex]) {
                newSelectedAnswers[currentQuestionIndex] = [];
              }
              newSelectedAnswers[currentQuestionIndex].push(answer);
            }
            setSelectedAnswers(newSelectedAnswers);
          }}
          />

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
                  </button> 
              </div>            
            </>
          )}
        </>
        
        )}
      </div>
    </div>
  );
}

