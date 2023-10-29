import SurveyTitle from '../Title/surveyTitle';
import axios from "axios";
import React from 'react';
import SurveyQuestion from '../Questions/surveyQuestion'; 
import SurveyResults from '../Results/surveyResults';
import { useState,useEffect } from 'react';
import "./createSurvey.css"
import SurveyAnswers from '../Answers/surveyAnswers';
import { useParams } from 'react-router-dom';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import CancelIcon from '@mui/icons-material/Cancel';

function SavedSurvey({bgImage, setBgImage,token,setToken}) {
  const [title, setTitle] = useState('');
  const [currentTab, setCurrentTab] = useState('Survey');
  const [questions, setQuestions] = useState([]); // Add a state variable for questions
  const [showAnswerType, setShowAnswerType] = useState(-1);
  const {id} = useParams();
  const [data, setData] = useState(null);
  const [surveyLink,setSurveyLink]=useState("");
  const [selectedQuestion, setSelectedQuestion] = useState(0);
  const [results,setResults]=useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedTab, setSelectedTab] = useState(null);


  useEffect(() => {
    // Check if a token already exists in localStorage
    const existingToken = localStorage.getItem('token');
    if (existingToken) {
      // If a token exists, use it
      setToken(existingToken);
      console.log(token);
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
  
    if (id) {
      // Check if id is a valid 24 character hex string
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        console.error('Invalid ID format');
        return;
      }
  
      console.log(token)
      console.log(id);
      axios.get(`https://apitestdocfile-4yzlt7tvdq-no.a.run.app/QAsGet/${id}`, { headers: { Authorization: `Bearer ${token}` }})
        .then((response) => {
          console.log('Data retrieved successfully:', response.data);
          let data = response.data.data;
          // Filter out any empty questions or answers
          data.questions = data.questions.filter(question => question.question.trim() !== "");
          data.questions.forEach(question => {
            question.answers = question.answers.filter(answer => answer.trim() !== "");
          });
          data.questions.forEach(question => {
            question.answers.push(''); // Add an empty string to the answers array
          });
          setData(data); // Save the data to state
          setTitle(data.title);
          setQuestions(data.questions);
  
        })
        .catch((error) => {
          console.error('Error retrieving data:', error);
          console.log(token);
          console.log(id);
        });
    }
  }, [token]);
  
  const addQuestion = () => {
    setQuestions((prevQuestions) => {
      const newQuestions = [...prevQuestions, {
         question: "", answers: [""], answersType: "Check Box" }];
       
      setShowAnswerType(newQuestions.length - 1);
      setSelectedQuestion(newQuestions.length - 1);
      console.log('Updated Questions:', newQuestions);
      
      return newQuestions;
    });
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

const handleImageClick = (imageURL) => {
  setBgImage(imageURL); // Call the prop function to update the background image URL
  console.log(bgImage);
  setSelectedImage(imageURL);
};

const previewSurvey = () => {
  if (questions[0].question === "") {
    alert("Please type at least one question");
    return;
  }

  if (questions[0].answers[0] === "") {
    alert("Please type at least one answer");
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

    // Update the database
    axios.put(`https://apitestdocfile-4yzlt7tvdq-no.a.run.app/QAsPut/${id}`, surveyData, {
      headers: { Authorization: `Bearer ${token}` }
    }).then((response) => {
      console.log('Database updated successfully:', response.data);
        window.open(window.location.origin + "/Preview/" + id+ "?bgImage=" + encodeURIComponent(bgImage) + "&token=" + encodeURIComponent(token), "_blank");
      })
    .catch((error) => {
      console.error('Error updating database:', error);
    }); 
}

const createSurveyLink=()=>{
  if ((questions[0]?.question === undefined || questions[0]?.question === "") || (questions[0]?.answers[0] === undefined || questions[0]?.answers[0] === "")) {
    setSelectedTab(currentTab)
    return alert("Please type at least one question and answer ");
  }
    else{ 
      setCurrentTab("Share");
      const filteredQuestions = questions.filter(question => {
        return question.question.trim() !== "" && question.answers.some(answer => answer.trim() !== "");
      });
        // Update the database
        axios.put(`https://apitestdocfile-4yzlt7tvdq-no.a.run.app/QAsPut/${id}`, {
          questions: filteredQuestions,
          title: title
        }, { headers: { Authorization: `Bearer ${token}` }})
        .then((response) => {
          console.log('Database updated successfully:', response.data);
          })
        .catch((error) => {
          console.error('Error updating database:', error);
        });
      const url=window.location.origin + "/Survey/" + id + "?bgImage=" + encodeURIComponent(bgImage) + "&token=" + encodeURIComponent(token);
      setSurveyLink(url);
       console.log(token);

}
    
      
  };

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

const deleteQuestion = (questionIndex) => {
  setQuestions(prevQuestions => {
    const newQuestions = [...prevQuestions];
    newQuestions.splice(questionIndex, 1);
    setSelectedQuestion(newQuestions.length - 1);
    return newQuestions;
  });
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

const changeAnswerType = (questionIndex) => {
  setShowAnswerType(questionIndex);
};

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

const closeFunction=()=>{
  setShowAnswerType(-1);
}
return (
  <div className="createSurveyContainer">
    <div>
      <img alt='sorry hehe' id='icon' src={require('../Images/zionicon.png')} />
    </div>
    <h2 id='firsth2'>Create a preview in a few clicks</h2>
    <p id='firstp'>publish your survey in seconds using #1 survey maker</p>
    <div className="frame">
      <div className="tabsWrapper">
        {     ['Survey', 'Themes','Results','Share'].map(tab => (
         <button 
              key={tab} 
              onClick={() => {
                
                setSelectedTab(tab);

                if (tab === 'Share') {
                  createSurveyLink();
                } 
                if (tab === 'Results') {
                  setCurrentTab(tab)
                  getResults()
                }
                if(tab==="Survey"){
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
          ))}
      </div>

      {currentTab === 'Survey' && (
        <div className='CentralContainer'>
          <SurveyTitle setTitle={setTitle} title={title} />
          {data &&
            data.questions &&
            questions.map((question, index) => (
              <React.Fragment key={index}>
                {showAnswerType === index && (
                <div className='PopUpDivMenu'>
                <div className='AnswersHeader'>
                  <p>Pick your poison</p> 
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

          <button id='QuestionButton' onClick={addQuestion}>
            + Add Question
          </button>
          <div style={{display:"flex",alignSelf:"flex-end",paddingRight:"2.5vw"}}>
          <button id='PreviewSurveyButton' onClick={()=>{ previewSurvey()}}>Preview</button>
          </div>
        </div>
      )}
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
    {currentTab === 'Results' && (
          <div className='resultsContainer'>
        <SurveyResults results={results}/>
        </div>
        )}
    </div>
  </div>
);

}

export default SavedSurvey;
