import React from "react";

function Question(props) {
  const options = [
    props.optionOne,
    props.optionTwo,
    props.optionThree,
    props.optionFour,
  ];

  return (
    <div>
      <h2 className="question-text">{props.question}</h2>
      <form className="quiz-options">
        {options.map((option, idx) => {
          let className = ""; // daca nu ai terminat intrebarea, nu face nimic
          if (props.showResult) {
            // daca e raspuns corect, sa faca verde
            if (option === props.iscorrectAnswer) {
              className = "show-answer";
            }
            // daca ai raspuns gresit, sa faca rosu
            // if (
            //   props.choice > 0 &&
            //   option === props.choice.value &&
            //   option !== props.iscorrectAnswer
            // ) {
            //   className = "show-incorrect";
            // }
          }
          // console.log("@@@", className, props);

          return (
            <label
              key={idx}
              className={className}
              onChange={props.handleChange}
            >
              <input type="radio" name={props.id} value={option} />
              <span className="span">{option}</span>
            </label>
          );
        })}
      </form>
    </div>
  );
}

export default Question;
