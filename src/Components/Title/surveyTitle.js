// SurveyTitle.js
import './surveyTitle.css';
export default function SurveyTitle({ title, setTitle }) {
 

  const handleInputChange = (event) => {
    setTitle(event.target.value);
  };

  return (
    <>
      <div className="Title-Container">
             <div className='Title-Container-Wrapper'>
        <input 
                className='Title-Input' 
                type='text' 
                value={title} 
                onChange={handleInputChange} 
                placeholder='Type your Survey Title'
              />
                </div> 
          <div>
            <select className='Title-Wrapper-Select'>
                  <option className='Title-Select-Option' value="option1">Survey/Other</option>
                  <option  className='Title-Select-Option' value="option2">Poll/Vote(Incoming)</option>
            </select>
          </div>
      </div>

    </>
  );
}