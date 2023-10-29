import "./surveyAnswers.css";
import DeleteIcon from '@mui/icons-material/Delete';

export default function SurveyAnswers({ selectQuestion,answers, updateAnswers,deleteAnswer}) {
  const handleInputChange = (e, answerIndex) => {
    const newAnswers = [...answers];
    newAnswers[answerIndex] = e.target.value;
    updateAnswers(newAnswers);
  };

  return (
    <div className="Answers-Container" >
      {answers.map((answer, answerIndex) => (
        <div className="Container-Wrapper" key={answerIndex}>
          <input
            type="text"
            value={answer}
            onChange={(e) => handleInputChange(e, answerIndex)}
            className="inputStyle"
            placeholder="Answer"
            onClick={selectQuestion}
          />
          {answerIndex !== answers.length - 1 && ( // Check if it's not the last answer
            <button className="deleteButton" onClick={deleteAnswer}>
              <DeleteIcon className="adelIcon" style={{color:"grey"}}/>
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
