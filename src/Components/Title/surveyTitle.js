// SurveyTitle.js
import './surveyTitle.css';
import { ModeEditOutline } from '@mui/icons-material';
import { useState } from 'react';
export default function SurveyTitle({ title, setTitle }) {
  const [showInput, setShowInput] = useState(false);

  const handleInputChange = (event) => {
    setTitle(event.target.value);
  };

  return (
    <>
      <div className="Title-Container">
        <h1>{title}</h1>
        {showInput && <input type='text' onChange={handleInputChange} />}
        <button className='Title-ContainerButton' onClick={() => setShowInput(!showInput)}><ModeEditOutline color='primary'/></button>
      </div>
    </>
  );
}