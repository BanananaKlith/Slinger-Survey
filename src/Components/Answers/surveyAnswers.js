import { useState } from 'react';
import { ModeEditOutline } from '@mui/icons-material';
import './surveyAnswers.css';

export default function SurveyAnswers({ inputs, handleTextChange }) {
  // Initialize an array of boolean states, one for each input
  const [showInputs, setShowInputs] = useState(inputs.map(() => false));

  // Function to toggle the visibility of a specific input
  const toggleShowInput = (index) => {
    const newShowInputs = [...showInputs];
    newShowInputs[index] = !newShowInputs[index];
    setShowInputs(newShowInputs);
  };

  return (
    <div className="Answers-Container">
      {inputs.map((input, index) => (
        <div className="Container-Wrapper" key={index}>
          <label htmlFor={`text-input-${index}`}>{input.textAnswer}</label>
          {showInputs[index] && (
            <input
              type="text"
              id={`text-input-${index}`}
              value={input.textAnswer}
              onChange={(e) => handleTextChange(index, e.target.value)}
            />
          )}
          <button
            className="Container-Wrapper-Button"
            onClick={() => toggleShowInput(index)} // Pass the index to the toggle function
          >
            <ModeEditOutline />
          </button>
        </div>
      ))}
    </div>
  );
}
