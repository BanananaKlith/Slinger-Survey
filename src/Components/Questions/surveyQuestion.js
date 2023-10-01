import { useState } from "react";
import SurveyAnswers from "../Answers/surveyAnswers";
import { AddCircle, ModeEditOutline } from "@mui/icons-material";
import "./surveyQuestion.css";
import axios from 'axios';

export default function SurveyQuestion({ title }) {
  const [questions, setQuestions] = useState([
    {
      textQuestion: "New survey Question",
      showText: false,
      answers: [
        { textAnswer: "Answer", showInput: false },
        { textAnswer: "Answer", showInput: false },
        { textAnswer: "Answer", showInput: false },
        { textAnswer: "Answer", showInput: false }
      ]
    }
  ]);

  const handleTextChange = (questionIndex, answerIndex, newText) => {
    setQuestions(prevQuestions =>
      prevQuestions.map((question, qIndex) => {
        if (qIndex === questionIndex) {
          return {
            ...question,
            answers: question.answers.map((answer, aIndex) =>
              aIndex === answerIndex ? { ...answer, textAnswer: newText } : answer
            )
          };
        }
        return question;
      })
    );
  };

  const handleShowQuestionInput = (questionIndex) => {
    setQuestions(prevQuestions =>
      prevQuestions.map((question, qIndex) => {
        if (qIndex === questionIndex) {
          return {
            ...question,
            showText: !question.showText
          };
        }
        return question;
      })
    );
  };

  const handleQuestionChange = (questionIndex, newText) => {
    setQuestions(prevQuestions =>
      prevQuestions.map((question, qIndex) =>
        qIndex === questionIndex ? { ...question, textQuestion: newText } : question
      )
    );
  };

  const surveyTitle = title;

  const handleSubmit = () => {
    // Iterate through questions and send each question and its answers via POST request
    questions.forEach(questionData => {
      const question = questionData.textQuestion;
      const answers = questionData.answers.map(answer => answer.textAnswer);

      axios.post('https://apitestdocfile-4yzlt7tvdq-no.a.run.app/QAsPost', {
        question: question,
        answer: answers,
        title: surveyTitle
      })
      .then(response => {
        // handle success
        console.log(response.data);
      })
      .catch(error => {
        // handle error
        console.log(error);
      });
    });
  };
      // Add a new question with default values******************************

  const handleAddQuestion = () => {
    setQuestions(prevQuestions => [
      ...prevQuestions,
      {
        textQuestion: "New Survey Question",
        showText: false,
        answers: [
          { textAnswer: "answer1", showInput: false },
          { textAnswer: "answer2", showInput: false },
          { textAnswer: "answer3", showInput: false },
          { textAnswer: "answer4", showInput: false }
        ]
      }
    ]);
  };

  return (
    <div className="Container">
      {questions.map((question, questionIndex) => (
        <div key={questionIndex} className="QA-Wrapper">
          <div className="QA-Wrapper-Questions">
            <h2>{question.textQuestion}</h2>
            {question.showText && (
              <input
                type="text"
                value={question.textQuestion}
                onChange={event => handleQuestionChange(questionIndex, event.target.value)}
              />
            )}
            <button
              className="QA-Wrapper-Questions-EditButton"
              onClick={() => handleShowQuestionInput(questionIndex)}
            >
              <ModeEditOutline />
            </button>
          </div>
          <div className="QA-Wrapper-Answers">
            <SurveyAnswers 
              inputs={question.answers}
              handleTextChange={(answerIndex, newText) =>
                handleTextChange(questionIndex, answerIndex, newText)
              }
            />
          </div>
        </div>
      ))}
      <div className="Buttons-Wrapper">
        <button className="Buttons-Wrapper-Add" onClick={handleAddQuestion}>
          <AddCircle />
        </button>
        <button className="Buttons-Wrapper-Send" onClick={handleSubmit}>
          Create Survey
        </button>
      </div>
    </div>
  );
}
