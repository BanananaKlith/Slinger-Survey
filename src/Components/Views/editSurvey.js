import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function EditSurvey({ setView }) {
  const [data, setData] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [uniqueTitles, setUniqueTitles] = useState([]);
  const [selectedId, setSelectedId] = useState(null); // State to store the selected document's _id
  const [updatedData, setUpdatedData] = useState({}); // State to store updated data

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
    // Extract unique titles from the fetched data
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
      // Reset selectedId to null whenever a new title is selected
      setSelectedId(null);
    } else {
      setFilteredData([]);
    }
  }, [selectedTitle, data]);

  const handleUpdateClick = () => {
    if (!selectedId) {
      console.error('No document selected for update');
      return;
    }

    // Include the current title from the selected document in updatedData
    const currentTitle = filteredData.find((item) => item._id === selectedId).title;
    const updatedDataWithCurrentTitle = {
      ...updatedData,
      title: currentTitle,
    };

    // Assuming you have updated data that you want to send for the update
    axios
      .put(`https://apitestdocfile-4yzlt7tvdq-no.a.run.app/QAsPut/${selectedId}`, updatedDataWithCurrentTitle)
      .then((response) => {
        // Handle the successful update, if needed
        console.log('Data updated successfully', response.data);
        // You may want to refresh the data by making a GET request again
        axios
          .get('https://apitestdocfile-4yzlt7tvdq-no.a.run.app/Qas')
          .then((response) => {
            setData(response.data);
            setUpdatedData("");
          })
          .catch((error) => {
            console.error(`Error fetching updated data: ${error}`);
          });
      })
      .catch((error) => {
        // Handle errors during the update
        console.error('Error updating data', error);
      });
  };

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
  setFilteredData(prevData => prevData.map((item, i) => {
    if (i === index) {
      return {...item, showQuestionInput: !item.showQuestionInput};
    } else {
      return item;
    }
  }));
}

const handleShowHideAnswerInput = (index) => {
  setFilteredData(prevData => prevData.map((item, i) => {
    if (i === index) {
      return {...item, showAnswerInput: !item.showAnswerInput};
    } else {
      return item;
    }
  }));
}

const handleAddAnswer = (index) => {
  let newData = [...filteredData];
  if (Array.isArray(newData[index].answer)) {
    newData[index].answer.push('');
  } else {
    newData[index].answer = [newData[index].answer, ''];
  }
  setFilteredData(newData);
};
const handleView=()=>setView("createSurvey")

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
    </select> <button onClick={handleView}>Create New Survey</button>
  </div>

  {filteredData.length > 0 ? (
    <>
      <div className='Title-Container'> 
        <h1>Current survey Title : {filteredData[0].title}</h1> 
      </div>
      {filteredData.map((item, index) => (
        <div className='Container'>
          <div key={index} onClick={() => setSelectedId(item._id)}>
            <h2 className='QA-Wrapper-Questions'>{item.question}</h2>      
            <input
              type="text"
              style={{display: item.showQuestionInput ? 'block' : 'none'}}
              value={updatedData.question || ''}
              onChange={(e) => setUpdatedData({ ...updatedData, question: e.target.value })}
              placeholder="Edit Question"
            />
            <button onClick={() => handleShowHideQuestionInput(index)}>Show/Hide Question Input</button>
            <button onClick={() => handleShowHideAnswerInput(index)}>Show/Hide Answer Input</button>   
            {Array.isArray(item.answer) ? (
              item.answer.map((answer, i) => (
                <div className='QA-Wrapper-Answers' key={i}>
                  <p>{answer || ''}</p> 
                  <input
                    type="text"
                    style={{display: item.showAnswerInput ? 'block' : 'none'}}
                    value={answer || ''}
                    onChange={(e) => handleAnswerEdit(index, i, e.target.value)}
                    placeholder="Edit Answer"
                  />                                            
                </div>
                
              ))
            ) : (
              <div>
                <p>{item.answer || ''}</p>
                <input
                  type="text"
                  style={{display: item.showAnswerInput ? 'block' : 'none'}}
                  value={item.answer || ''}
                  onChange={(e) => handleAnswerEdit(index, null, e.target.value)}
                  placeholder="Edit Answer"
                />
               </div>
            )}
            {/* Add button */}
            <button onClick={() => handleAddAnswer(index)}>Add Answer</button>

            <button onClick={()=>{handleUpdateClick()}}>Update Data</button>
          </div>
        </div>

      ))}   
    </>
  ) : (
    <p>No data available for the selected title.</p>
  )}
  
</>


);

}
