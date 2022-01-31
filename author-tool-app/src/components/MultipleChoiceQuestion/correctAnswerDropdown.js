import React from "react";

export default (options, onChangeFunction) => {
  let correctAnswerOptions = ["-"];
  let correctOption = "";
  for (var i = 0; i < options.length; i++) {
    let optionLetterFromInteger = String.fromCharCode(65 + i);
    correctAnswerOptions.push(optionLetterFromInteger);
    if (options[i].is_correct) {
      correctOption = i;
    }
  }

  return (
    <select
      ref="userInput"
      required
      className="form-control col-md-1 ml-2"
      value={correctOption}
      onChange={onChangeFunction}
    >
      {correctAnswerOptions.map((val, idx) => {
        return (
          // value is idx-1 due to first option "-"
          <option key={idx} value={idx - 1}>
            {val}
          </option>
        );
      })}
    </select>
  );
};
