import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {  ModeEditOutline } from "@mui/icons-material";
import "./editSurvey.css"

export default function EditSurvey({ setView }) {
  const [data, setData] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [uniqueTitles, setUniqueTitles] = useState([]);
  const [updatedData, setUpdatedData] = useState({});

  useEffect(() => {
    axios
      .get('https://apitestdocfile-4yzlt7tvdq-no.a.run.app/Qas')
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error(`Error fetching data: ${error}`);
      });
  }, []);

  useEffect(() => {
    const titlesSet = new Set(data.map((item) => item.title));
    setUniqueTitles(Array.from(titlesSet));
  }, [data]);

  useEffect(() => {
    if (selectedTitle) {
      const result = data.filter(
        (item) =>
          item.title === selectedTitle &&
          item.answer &&
          (Array.isArray(item.answer) ? item.answer.length > 0 : item.answer.trim() !== '')
      );
      setFilteredData(result);
    } else {
      setFilteredData([]);
    }
  }, [selectedTitle, data]);

  

  const handleAnswerEdit = (index, answerIndex, newText) => {
    
    setFilteredData((prevData) => {
      const newData = [...prevData];
      if (Array.isArray(newData[index].answer)) {
        newData[index].answer[answerIndex] = newText;
      } else {
        newData[index].answer = newText;
      }
      return newData;
    });

    setUpdatedData((prevUpdatedData) => {
      const newUpdatedData = { ...prevUpdatedData };
      if (!newUpdatedData.answer) {
        newUpdatedData.answer = [];
      }
      if (Array.isArray(newUpdatedData.answer)) {
        newUpdatedData.answer[answerIndex] = newText;
      } else {
        newUpdatedData.answer = [newText];
      }
      return newUpdatedData;
    });
  };

  const handleShowHideQuestionInput = (index) => {
    setFilteredData((prevData) =>
      prevData.map((item, i) => {
        if (i === index) {
          return { ...item, showQuestionInput: !item.showQuestionInput };
        } else {
          return item;
        }
      })
    );
  };

 

  const handleAddAnswer = (index) => {
    let newData = [...filteredData];
    if (Array.isArray(newData[index].answer)) {
      newData[index].answer.push('');
    } else {
      newData[index].answer = [newData[index].answer, ''];
    }
    setFilteredData(newData);
  };

  const handleView = () => setView('createSurvey');

// Create a new state variable for the visibility of the answer inputs
const [showAnswerInput, setShowAnswerInput] = useState(filteredData.map(item => (Array.isArray(item.answer) ? item.answer.map(() => false) : [false])));
const handleShowHideAnswerInput = (itemIndex, answerIndex) => {
  setShowAnswerInput((prevShowAnswerInput) => {
    // Create a deep copy of the array
    const newShowAnswerInput = JSON.parse(JSON.stringify(prevShowAnswerInput));
    if (!newShowAnswerInput[itemIndex]) {
      newShowAnswerInput[itemIndex] = [];
    }
    newShowAnswerInput[itemIndex][answerIndex] = !newShowAnswerInput[itemIndex][answerIndex];
    return newShowAnswerInput;
  });
};

const handleUpdateClick = (itemId) => {
  if (itemId===undefined) {
    console.error('No document selected for update');
    return;
  }

  const currentItem = filteredData.find((item) => item._id === itemId);
  const currentTitle = currentItem.title;
  let updatedDataWithCurrentTitle = {
    ...updatedData,
    title: currentTitle,
  };

  // Initialize updatedDataWithCurrentTitle.answer and updatedDataWithCurrentTitle.question if they don't exist
  if (!updatedDataWithCurrentTitle.answer) {
    updatedDataWithCurrentTitle.answer = [];
  }
  
  if (!updatedDataWithCurrentTitle.question) {
    updatedDataWithCurrentTitle.question = currentItem.question;
  }

  // Check if answers have been edited or are empty
  currentItem.answer.forEach((ans, index) => {
    if (!updatedData.answer || !updatedData.answer[index]) {
      updatedDataWithCurrentTitle.answer[index] = ans;
    }
  });

  // Check if question has been edited or is empty
  if (!updatedData.question || updatedData.question === '') {
    updatedDataWithCurrentTitle.question = currentItem.question;
  };

  

  axios
    .put(`https://apitestdocfile-4yzlt7tvdq-no.a.run.app/QAsPut/${itemId}`, updatedDataWithCurrentTitle)
    .then((response) => {
      console.log('Data updated successfully', response.data);
      axios
        .get('https://apitestdocfile-4yzlt7tvdq-no.a.run.app/Qas')
        .then((response) => {
          setData(response.data);
          setUpdatedData({});
        })
        .catch((error) => {
          console.error(`Error fetching updated data: ${error}`);
        });
    })
    .catch((error) => {
      console.error('Error updating data', error);
    });
};

return (
  <>
    <div>
      <label>All Surveys: </label>
      <select value={selectedTitle} onChange={(e) => setSelectedTitle(e.target.value)}>
        <option value="">Surveys</option>
        {uniqueTitles.map((title) => (
          <option key={title} value={title}>
            {title}
          </option>
        ))}
      </select>{' '}
      <button onClick={handleView}>Create New Survey</button>
    </div>

    {filteredData.length > 0 ? (
      <>
        <div className="Title-Container">
          <h1>Current survey Title : {filteredData[0].title}</h1>
        </div>
        {filteredData.map((item, index) => (
          <div className="Container" key={index}  >
            <h2 className="QA-Wrapper-Questions">{item.question}</h2>
            <input
              type="text"
              style={{ display: item.showQuestionInput ? 'block' : 'none' }}
              value={updatedData.question || ''}
              onChange={(e) => setUpdatedData({ ...updatedData, question: e.target.value })}
              placeholder="Edit Question"
            />
            <button className='Container-Question-Button' onClick={() => handleShowHideQuestionInput(index)}><ModeEditOutline /></button>

            {Array.isArray(item.answer) ? (
              item.answer.map((answer, i) => (
                <div className="QA-Wrapper-Answers" key={i}>
                  <p>{answer || ''}</p>
                  <input
                    type="text"
                    style={{ display: showAnswerInput[index] && showAnswerInput[index][i] ? 'block' : 'none' }}
                    value={answer || ''}
                    onChange={(e) => handleAnswerEdit(index, i, e.target.value)}
                    placeholder="Edit Answer"
                  />
                  <button  className="QA-Wrapper-Answers-EditButton" 
                  onClick={() => handleShowHideAnswerInput(index, i)}><ModeEditOutline /></button>
                </div>
              ))
            ) : (
              <div>
                <p>{item.answer && item.answer.text ? item.answer.text : ''}</p>
                <input
                  type="text"
                  style={{ display: item.answer && item.answer.showAnswerInput ? 'block' : 'none' }}
                  value={item.answer && item.answer.text ? item.answer.text : ''}
                  onChange={(e) => handleAnswerEdit(index, null, e.target.value)}
                  placeholder="Edit Answer"
                />
              </div>
            )}

            <button onClick={() => handleAddAnswer(index)}>Add Answer</button>

            <button onClick={()=>handleUpdateClick(item._id)}>Update Data</button>
          </div>
        ))}
      </>
    ) : (
      <p>No data available for the selected title.</p>
    )}
  </>
);

}

