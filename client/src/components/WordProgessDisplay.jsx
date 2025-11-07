import { invalid_chars } from "../utilities/BoardPopulator";

function WordProgessDisplay({ word, n_letters }) {
  let display_word = "";
  for (let i = 0; i < word.length; i++) {
    if (i < n_letters) {
      display_word += word[i];
    } else {
      if (invalid_chars.includes(word.toUpperCase()[i])) {
        display_word += word[i];
      } else {
        display_word += "_ ";
      }
    }
  }
  return (
    <div className="d-flex justify-content-evenly above_board">
      <pre>{display_word}</pre>
    </div>
  );
}

export default WordProgessDisplay;
