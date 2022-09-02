import React from "react";
import "./App.css";
import { nanoid } from "nanoid";
import { decode } from "html-entities";
import Question from "./components/Question";
import Confetti from "react-confetti";

function App() {
  const [start, setStart] = React.useState(false);
  const [questionArray, setQuestionArray] = React.useState([]);
  const [correctAnswer, setCorrectAnswer] = React.useState([]);
  const [showResult, setShowResult] = React.useState(false);
  const [result, setResult] = React.useState([]);
  const [choiceArray, setchoiceArray] = React.useState([]);

  React.useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=5&category=12")
      .then((res) => {
        if (!res.ok) {
          throw Error("Questions not found");
        }
        return res.json();
      })
      .then((data) => {
        let answers = [];
        let questionArray = data.results.map((item) => {
          answers.push(item.correct_answer);
          let optionsArray = [
            item.correct_answer,
            item.incorrect_answers[0],
            item.incorrect_answers[1],
            item.incorrect_answers[2],
          ];
          shuffleItems(optionsArray);

          return {
            question: decode(item.question),
            options: decode(optionsArray),
            id: nanoid(),
          };
        });
        setQuestionArray(questionArray);
        setCorrectAnswer(answers);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function shuffleItems(array) {
    array.sort(() => Math.random() - 0.5);
  }

  function checkAnswers(event) {
    if (!showResult) {
      setShowResult(true);
      const arr = [...choiceArray];
      let newArray = [];
      let uniqueObject = {};

      for (let i in arr) {
        let objName = arr[i]["name"];
        uniqueObject[objName] = arr[i];
      }

      for (let i in uniqueObject) {
        newArray.push(uniqueObject[i]);
      }
      console.log(newArray);
      setchoiceArray(newArray);
      checkResult(newArray);
    } else {
      setShowResult(false);
      setStart(false);
    }
  }

  function checkResult(arr) {
    let result = 0;
    arr.map((item) => {
      for (let i = 0; i < correctAnswer.length; i++) {
        const theChoice = correctAnswer[i];
        if (theChoice === item.value) {
          result++;
        }
      }
      return result;
    });
    setResult(result);
  }

  console.log(result);

  function startQuiz() {
    setStart((prevState) => !prevState);
  }

  function handleChange(event) {
    event.persist = () => {};
    if (event.target.checked) {
      setchoiceArray((prevChoiceArray) => {
        return [
          ...prevChoiceArray,
          {
            value: event.target.value,
            name: event.target.name,
            checked: event.target.checked,
          },
        ];
      });
    }
  }

  const questionElements = questionArray.map((item, i) => (
    <Question
      key={item.id}
      question={item.question}
      optionOne={item.options[1]}
      optionTwo={item.options[2]}
      optionThree={item.options[0]}
      optionFour={item.options[3]}
      id={item.id}
      handleChange={handleChange}
      showResult={showResult}
      iscorrectAnswer={correctAnswer[i]}
      choice={choiceArray[i]}
    />
  ));

  return (
    <main>
      {start === false ? (
        <div className="start-quizz">
          <div className="intro-info">
            <h1 className="title">Let's Get Quizzical</h1>
            <p className="intro-text">How Music savvy are you?</p>
          </div>
          <button className="button" onClick={startQuiz}>
            Start Quiz
          </button>
        </div>
      ) : (
        <div className="quiz-container">
          {questionElements}
          <div className="check-answers">
            {showResult && (
              <h2 className="score-text">
                Score: {result}/{correctAnswer.length}
              </h2>
            )}
            {showResult && result === correctAnswer.length && <Confetti />}
            <button className="check-button" onClick={checkAnswers}>
              {showResult ? "New Game" : "Check Answers"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default App;
