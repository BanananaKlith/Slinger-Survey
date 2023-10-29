import React from 'react';
import "./surveyQuestion.css";
import DeleteIcon from '@mui/icons-material/Delete';
import TouchAppIcon from '@mui/icons-material/TouchApp';

export default function SurveyQuestion({ index,answersType,question, setQuestion, deleteQuestion, changeAnswerType, isLastSelected, selectQuestion }) {
  const handleQuestionChange = (e) => {
    const newQuestion = e.target.value;
    setQuestion(newQuestion);
  };

  return (
    <div className="QA-Wrapper" 
    onClick={selectQuestion}> 
      {isLastSelected && (
        <div className='IconWrapper'> 
          <button className="qButton" title='Change Answer Type' onClick={changeAnswerType}>
            <TouchAppIcon className='delIcon' style={{color:"grey"}} />
          </button>
          <button className="qButton" title="Delete Question" onClick={deleteQuestion}>
            <DeleteIcon className='delIcon' style={{color:"grey"}} />
          </button>
        </div>
      )}
      <p style={{alignSelf:"flex-end",lineHeight:"0",fontSize:"10px",margin:"0"}}> Q{index} {answersType}</p>
      <input
        className="QuestionInput"
        type="text"
        placeholder="Question"
        value={question}
        onChange={handleQuestionChange}
      />
         
    </div>
  );
}
