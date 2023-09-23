import { useState } from 'react';
import { ModeEditOutline } from '@mui/icons-material';
import './surveyAnswers.css';

export default function SurveyAnswers({ inputs, handleTextChange }) {
  const [showInput, setShowInput] = useState(false);

  const toggleShowInput = () => {
    setShowInput(!showInput);
  };

  return (
    <div className="Answers-Container">
      {inputs.map((input, index) => (
        <div className="Container-Wrapper" key={index}>
          <label htmlFor={`text-input-${index}`}>{input.textAnswer}</label>
          {showInput && (
            <input
              type="text"
              id={`text-input-${index}`}
              value={input.textAnswer}
              onChange={(e) => handleTextChange(index, e.target.value)}
            />
          )}
          <button className="Container-Wrapper-Button" onClick={toggleShowInput}>
            <ModeEditOutline />
          </button>
        </div>
      ))}
    </div>
  );
}
