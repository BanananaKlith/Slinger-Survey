import SurveyTitle from '../Title/surveyTitle';
import axios from "axios";
import React from 'react';
import SurveyQuestion from '../Questions/surveyQuestion'; // Import the SurveyQuestion component
import { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import "./createSurvey.css"
import SurveyAnswers from '../Answers/surveyAnswers';
import SurveyResults from '../Results/surveyResults';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import CancelIcon from '@mui/icons-material/Cancel';


function CreateSurvey({bgImage, setBgImage,token }) {

  const [title, setTitle] = useState('');
  const [currentTab, setCurrentTab] = useState('Survey');
  const [questions, setQuestions] = useState([]); // Add a state variable for questions
  const [showAnswerType, setShowAnswerType] = useState(-1);
  const [selectedQuestion, setSelectedQuestion] = useState(0);
  const [surveyLink,setSurveyLink]=useState("");
  const [results,setResults]=useState(null);
  const [id,setId]=useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedTab, setSelectedTab] = useState(null);



const addQuestion = () => {
    setQuestions(prevQuestions => {const newQuestions = [...prevQuestions,{
          question: "",
          answers: [""], // No answers initially
          answersType:"Check Box"
        }]; setShowAnswerType(newQuestions.length - 1); // Set to index of new question
        setSelectedQuestion(newQuestions.length - 1);
        return newQuestions; 
    
    }
    ); 
      
    };

const selectAnswerType = (inputType,index) => {
        setQuestions(prevQuestions => {
          const newQuestions = [...prevQuestions];
          if(newQuestions[index].answers.length === 0) {
            newQuestions[index].answers.push("");
          }
          newQuestions[index].answersType=inputType ;
          return newQuestions;
        });
        setShowAnswerType(-1); // Hide the div after selection
      };           
  //answers update 
const updateAnswers = (newAnswers, questionIndex) => {
  setQuestions(prevQuestions => {
    const newQuestions = [...prevQuestions];
    newQuestions[questionIndex].answers = newAnswers;

    // Check if the last answer is being typed into
    if (newAnswers[newAnswers.length - 1] !== '') {
      // Add a new answer
      newQuestions[questionIndex].answers.push('');
    }

    return newQuestions;
  });
};
//createSurvey button functionality
const navigate = useNavigate();
const createNewSurvey = () => {
  if ((questions[0]?.question === undefined || questions[0]?.question === "") || (questions[0]?.answers[0] === undefined || questions[0]?.answers[0] === "")) {
    return alert("Please type at least one question and answer ");
    
  }
  console.log(token)
  // Filter out empty questions and answers
  const filteredQuestions = questions.filter(question => {
    return question.question.trim() !== "" && question.answers.some(answer => answer.trim() !== "");
  });

  // Create the survey data structure
  const surveyData = {
    title: title,
    questions: filteredQuestions.map((question) => ({
      question: question.question,
      answers: question.answers.filter(answer => answer.trim() !== ""),
      answersType: question.answersType,
    })),
  };

  // Send the POST request using Axios
  axios.post('https://apitestdocfile-4yzlt7tvdq-no.a.run.app/QAsPost', surveyData, {
    headers: { Authorization: `Bearer ${token}` }
  }).then((response) => {
      // Handle success response
      console.log('Survey saved successfully:', response.data);
      const url=response.data.id;
      setId(url);   
      navigate("/"+url);
    })
    .catch((error) => {
      // Handle error
      console.error('Error saving survey:', error);
    });
    
};
const handleImageClick = (imageURL) => {
  setBgImage(imageURL); // Call the prop function to update the background image URL
  console.log(bgImage);
  setSelectedImage(imageURL);
};
const deleteQuestion = (questionIndex) => {
  setQuestions(prevQuestions => {
    const newQuestions = [...prevQuestions];
    newQuestions.splice(questionIndex, 1);
    setSelectedQuestion(newQuestions.length - 1);
    return newQuestions;
  });
};
const changeAnswerType = (questionIndex) => {
  setShowAnswerType(questionIndex);
};

const deleteAnswer = (questionIndex, answerIndex) => {
  setQuestions(prevQuestions => {
    const newQuestions = [...prevQuestions];
    newQuestions[questionIndex].answers.splice(answerIndex, 1);

    // If all answers are deleted, add an empty answer
    if (newQuestions[questionIndex].answers.length === 0) {
      newQuestions[questionIndex].answers.push('');
    }

    return newQuestions;
  });
};

const createSurveyLink = () => {
  // Check if the first question and its first answer are defined and not empty
  if (!questions[0]?.question || !questions[0]?.answers[0]) {
    alert("Please type at least one question and answer");
    setSelectedTab(currentTab);
    return;
  }

  // Filter out empty questions and answers
  const filteredQuestions = questions.filter(question => {
    return question.question.trim() !== "" && question.answers.some(answer => answer.trim() !== "");
    
  });

  // Create the survey data structure
  const surveyData = {
    title: title,
    questions: filteredQuestions.map((question) => ({
      question: question.question,
      answers: question.answers.filter(answer => answer.trim() !== ""),
      answersType: question.answersType,
    })),
  };

  // Send the POST request using Axios
  axios.post('https://apitestdocfile-4yzlt7tvdq-no.a.run.app/QAsPost', surveyData, {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then((response) => {
    // Handle success response
    console.log('Survey saved successfully:', response.data);
    setId(response.data.id);
    setCurrentTab("Share");

    // Generate the survey link
    const url = `${window.location.origin}/Survey/${response.data.id}?bgImage=${encodeURIComponent(bgImage)}&token=${encodeURIComponent(token)}`;
    setSurveyLink(url);
    console.log(`Token: ${token}`);
    console.log(`ID: ${response.data.id}`);
  })
  .catch((error) => {
    // Handle error
    console.error('Error saving survey:', error);
  });
};


const previewSurvey=()=>{   if (questions[0].question === "") {
    alert("Please type at least one question ");
    return;
  }

  if (questions[0].answers[0] === "") {
    alert("Please type at least one answer ");
    return;
  }
  // Filter out empty questions and answers
  const filteredQuestions = questions.filter(question => {
    return question.question.trim() !== "" && question.answers.some(answer => answer.trim() !== "");
  });

  // Create the survey data structure
  const surveyData = {
    title: title,
    questions: filteredQuestions.map((question) => ({
      question: question.question,
      answers: question.answers.filter(answer => answer.trim() !== ""),
      answersType: question.answersType,
    })),
  };

  // Send the POST request using Axios
  axios.post('https://apitestdocfile-4yzlt7tvdq-no.a.run.app/QAsPost', surveyData, {
        headers: { Authorization: `Bearer ${token}` }
      }).then((response) => {
        // Handle success response
        console.log('Survey saved successfully:', response.data);
        const url = response.data.id;
        window.open(window.location.origin + "/Preview/" + url + "?bgImage=" + encodeURIComponent(bgImage) + "&token=" + encodeURIComponent(token), "_blank");
      }).catch((error) => {
        // Handle error
        console.error('Error saving survey:', error);
      });

               
              }

const getResults=()=>{
axios.get(`https://apitestdocfile-4yzlt7tvdq-no.a.run.app/ResGet/${token}`)
.then((response) => {
  // Handle success
  console.log('Data retrieved successfully:', response.data);
  setResults(response.data.data)
})
.catch((error) => {
  // Handle error
  console.error('Error retrieving data:', error);
});
}
const surveyAssessment=()=>{
  const url=window.location.origin + "/Survey/" + id + "?bgImage=" + encodeURIComponent(bgImage) + "&token=" + encodeURIComponent(token);
  setSurveyLink(url);
  window.open(url, "_blank");
    
}      

const urlCopy=()=>{
  /* Get the text field */
  var copyText = document.getElementById("surveyLink");

  /* Select the text field */
  copyText.select();
  copyText.setSelectionRange(0, 99999); /* For mobile devices */

  /* Copy the text inside the text field */
  document.execCommand("copy");

  /* Change the button text to "Copied" */
  var copyButton = document.getElementById("copyButton");
  copyButton.innerHTML = "Copied";

  /* Change the button text back to "Copy" after 1 second */
  setTimeout(function() {
    copyButton.innerHTML = "Copy";
  }, 1000);
}
const closeFunction=()=>{

  setShowAnswerType(-1);
}



  return (
    <div className="createSurveyContainer">
      <div>
        <img alt='sorry hehe' id='icon' src={require('../Images/zionicon.png')} />
      </div> 
      <h2 id='firsth2'>Create a Preview in a Few Clicks</h2>
      <p id='firstp'>Publish your survey in seconds using #1 survey maker</p>
      <div className="frame">
        <div className="tabsWrapper">
        {
       ['Survey', 'Themes','Results','Share'].map(tab => (
         <button 
              key={tab} 
              onClick={() => {
                setSelectedTab(tab);
                if (tab === 'Share') {
                  createSurveyLink();
                }  if (tab === 'Results') {
                  setCurrentTab(tab);
                  getResults();
                }   if(tab==="Survey"){
                  setCurrentTab("Survey")
                }
                if(tab==="Themes"){
                  setCurrentTab("Themes")
                }
             
              }}
              className={`tabs ${selectedTab === tab ? 'selected' : ''}`}
            >
              {tab}
            </button>
          ))
        }
        </div>
        {currentTab === 'Survey' && 
        <div className='CentralContainer'>
          <SurveyTitle setTitle={setTitle} title={title}/>
          {questions.map((question, index) => (
            <React.Fragment key={index}>
              {showAnswerType === index && (
             <div className='PopUpDivMenu'>
            <div className='AnswersHeader'>
                  <p>pick your poison</p> 
                  <div className='CloseButton' onClick={closeFunction}><CancelIcon className='closeIcon'/></div>
                </div>
                <div className='PopUpButtons'>  
                  <button onClick={() => selectAnswerType('Radio', index)}> <RadioButtonCheckedIcon className='inputIcon'/> True/False</button>
                  <button onClick={() => selectAnswerType('Check Box', index)}><CheckBoxIcon className='inputIcon'/>Checkboxes</button>
                  <button onClick={() => selectAnswerType('Drop Down List', index)}><ArrowDropDownCircleIcon className='inputIcon'/>Drop list</button>
                </div>
              </div>           
              )}
        <div className='Container'>
              <SurveyQuestion
              question={question.question}
              index={index}
              answersType={question.answersType}
              setQuestion={(newQuestion) => {
                const updatedQuestions = [...questions];
                updatedQuestions[index].question = newQuestion;
                setQuestions(updatedQuestions);
              }}
              deleteQuestion={() => deleteQuestion(index)}
              changeAnswerType={() => changeAnswerType(index)}
              isLastSelected={index === selectedQuestion} 
              selectQuestion={() => setSelectedQuestion(index)} 
            />
          <SurveyAnswers
            answers={question.answers}
            updateAnswers={(newAnswers) => updateAnswers(newAnswers, index)}
            deleteAnswer={(answerIndex) => deleteAnswer(index, answerIndex)}
            selectQuestion={() => setSelectedQuestion(index)} 
              />
         
        </div>
      </React.Fragment>
    ))}
  {questions.length === 0 ? (
        <button id='QuestionButton' onClick={addQuestion}>
          + Add Question
        </button>
      ) : (
          <>
            <button id='QuestionButton' onClick={addQuestion}>
              + Add Question
            </button>
            <div style={{display:"flex",alignSelf:"flex-end",paddingRight:"2.5vw"}}> 
              <button id='CreateSurveyButton' onClick={createNewSurvey}>
              Create Survey
                </button>
                <button id='PreviewSurveyButton'
                onClick={previewSurvey}>Preview</button>
                  </div>
                    </>
                  )}
            </div>
        }
        {currentTab === 'Themes' && (
          <div className='themeContainer'>
        <div className='imgContainer'>
        <img
          className={`themeImage ${selectedImage === 'bgImage1' ? 'selected' : ''}`}
          alt='hehe'
          src={require('../Images/bgImage1.jpg')}
          onClick={() => handleImageClick('bgImage1')}
        />
          <p>Virus</p>
        </div>
        <div className='imgContainer'>
        <img
          className={`themeImage ${selectedImage === 'bgImage2' ? 'selected' : ''}`}
          alt='hehe'
          src={require('../Images/bgImage2.jpg')}
          onClick={() => handleImageClick('bgImage2')}
        />
          <p>Feint</p>
        </div>
        </div>
        )}
       {currentTab === 'Results' && (
          <div className='resultsContainer'>
        <SurveyResults results={results}/>
        </div>
        )}
         {currentTab === 'Share' && (
  <div className='shareContainer'>
      <h4>Your assessment is ready to be shared</h4>
        <div className='shareButtons'>    
        <input id="surveyLink"
         className='shareContainerLink'
         type="text" value={surveyLink}
          readOnly onClick={(e) => e.target.select()} />
          <button
           id="copyButton" 
           onClick={urlCopy}>
            Copy
           </button>
          <button 
          onClick={surveyAssessment}>
            View
            </button>
        </div>
        </div>
        )}
      </div>
    </div>
  );
}

export default CreateSurvey;
