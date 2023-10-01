import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ModeEditOutline } from "@mui/icons-material";
class Fields {
  constructor(id, question, answer, title) {
    this.id = id;
    this.question = question;
    this.answer = Array.isArray(answer) && answer.every(item => typeof item === 'string') ? answer : [answer.toString()];
    this.title = title;
  }
}

export default function EditSurvey({ setView }) {
  const [data, setData] = useState([]);
  const [uniqueTitles, setUniqueTitles] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState('');
  const [visibleFields, setVisibleFields] = useState({});

  useEffect(() => {
    axios
      .get('https://apitestdocfile-4yzlt7tvdq-no.a.run.app/Qas')
      .then((response) => {
        const fieldsData = response.data.map(item => new Fields(item._id, item.question, item.answer, item.title));
        setData(fieldsData);
      })
      .catch((error) => {
        console.error(`Error fetching data: ${error}`);
      });
  }, []);

  useEffect(() => {
    const titlesSet = new Set(data.map((item) => item.title));
    setUniqueTitles(Array.from(titlesSet));
  }, [data]);

  const handleTitleChange = (event) => {
    setSelectedTitle(event.target.value);
  };

  const handleInputChange = (event, fieldId, answerIndex) => {
    const newData = [...data];
    const field = newData.find(field => field.id === fieldId);
    field.answer[answerIndex] = event.target.value;
    setData(newData);
  };

  const handleQuestionChange = (event, fieldId) => {
    const newData = [...data];
    const field = newData.find(field => field.id === fieldId);
    field.question = event.target.value;
    setData(newData);
  };

  const handleUpdate = (fieldId) => {
    const fieldToUpdate = data.find(field => field.id === fieldId);
    axios
      .put(`https://apitestdocfile-4yzlt7tvdq-no.a.run.app/QAsPut/${fieldToUpdate.id}`, {title: fieldToUpdate.title,question: fieldToUpdate.question, answer: fieldToUpdate.answer})
      .then((response) => {
        console.log(`Update successful: ${response}`);
      })
      .catch((error) => {
        console.error(`Error updating data: ${error}`);
      });
  };

  const toggleVisibility = (fieldId) => {
    setVisibleFields(prevVisibleFields => ({
      ...prevVisibleFields,
      [fieldId]: !prevVisibleFields[fieldId],
    }));
  };

  const filteredData = data.filter(item => item.title === selectedTitle);

  const handleAddAnswer = (fieldId) => {
    // Find the field to update
    const fieldToUpdate = data.find(field => field.id === fieldId);
  
    // Add a new answer to the field's answers
    const updatedAnswers = [...fieldToUpdate.answer, 'added answer'];
  
    // Update the field in the data
    axios
      .put(`https://apitestdocfile-4yzlt7tvdq-no.a.run.app/QAsPut/${fieldToUpdate.id}`, {title: fieldToUpdate.title, question: fieldToUpdate.question, answer: updatedAnswers})
      .then((response) => {
        console.log(`Update successful: ${response}`);
  
        // Update the local state with the new data
        const updatedData = data.map(field => {
          if (field.id === fieldId) {
            return {...field, answer: updatedAnswers};
          } else {
            return field;
          }
        });
        setData(updatedData);
      })
      .catch((error) => {
        console.error(`Error updating data: ${error}`);
      });
  };

  const handleDeleteAnswer = (fieldId, answerIndex) => {
    // Find the field to update
    const fieldToUpdate = data.find(field => field.id === fieldId);
  
    // Remove the answer from the field's answers
    const updatedAnswers = fieldToUpdate.answer.filter((_, index) => index !== answerIndex);
  
    // Update the field in the data
    axios
      .put(`https://apitestdocfile-4yzlt7tvdq-no.a.run.app/QAsPut/${fieldToUpdate.id}`, {title: fieldToUpdate.title, question: fieldToUpdate.question, answer: updatedAnswers})
      .then((response) => {
        console.log(`Update successful: ${response}`);
  
        // Update the local state with the new data
        const updatedData = data.map(field => {
          if (field.id === fieldId) {
            return {...field, answer: updatedAnswers};
          } else {
            return field;
          }
        });
        setData(updatedData);
      })
      .catch((error) => {
        console.error(`Error updating data: ${error}`);
      });
  };

  const handleDeleteQuestion = (fieldId) => {
    // Delete the field from the data
    axios
      .delete(`https://apitestdocfile-4yzlt7tvdq-no.a.run.app/QAsDelete/${fieldId}`)
      .then((response) => {
        console.log(`Delete successful: ${response}`);
      })
      .catch((error) => {
        console.error(`Error deleting data: ${error}`);
      });
  };

  return (
    <div>
      <div style={{display:"flex",alignItems:"center"}}>  <h1 style={{padding:"1em"}}>{selectedTitle}</h1>
      <select style={{backgroundColor:"transparent",padding:"1em",cursor:"pointer"}} onChange={handleTitleChange}>
        <option value="">Select a title</option>
        {uniqueTitles.map((title, index) => (
          <option key={index} value={title}>
            {title}
          </option>
        ))}
      </select>
      <><button style={{backgroundColor:"transparent",margin:"2em",padding:"1em",cursor:"pointer"}} onClick={()=>setView("createSurvey")}>Create a new survey</button></>
      </div>
    

      {filteredData.map((field) => (<div style={{
              padding: "2em",
              backgroundImage: "linear-gradient(to right, black 50%, transparent 50%)",
              backgroundSize: "100% 1px",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "bottom"
            }} key={field.id}>

    <div style={{display:"flex",}}>
      <h2>{field.question}</h2>
      {visibleFields[field.id] && (
        <input style={{margin:"1em",alignSelf:"center",padding:"1em"}} id={`question-${field.id}`} type="text" onChange={(event) => handleQuestionChange(event, field.id)} />
      )}
      <button style={{padding:"2em",backgroundColor:"transparent",cursor:"pointer",border:"none"}} onClick={() => toggleVisibility(field.id)}>
        <ModeEditOutline/>
      </button>
    </div>
    {field.answer.map((answer, answerIndex) => (
      <div style={{display:"flex",alignItems:"baseline"}} key={answerIndex}>
        <p style={{minWidth:"10em"}}>{answer}</p>
        <button style={{borderRadius:"10%", padding:"0.5em", cursor:"pointer", backgroundColor:"transparent"}} onClick={() => handleDeleteAnswer(field.id, answerIndex)}>Delete</button>
               {visibleFields[field.id] && (
          <input style={{margin:"0.5em",padding:"0.5em"}} id={`input-${field.id}-${answerIndex}`} type="text" onChange={(event) => handleInputChange(event, field.id, answerIndex)} />
          
       )}
      </div>
    ))}
    <button style={{borderRadius:"10%",padding:"1em",cursor:"pointer",backgroundColor:"transparent"}}onClick={() => handleUpdate(field.id)}>Update</button>
    <button style={{borderRadius:"10%", padding:"1em", cursor:"pointer", backgroundColor:"transparent"}} onClick={() => handleAddAnswer(field.id)}>Add Answer</button>
    <button style={{borderRadius:"10%", padding:"1em", cursor:"pointer", backgroundColor:"transparent"}} onClick={() => handleDeleteQuestion(field.id)}>Delete Question</button>           
  </div>
))}

    </div>
  );
}
