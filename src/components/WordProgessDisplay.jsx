function WordProgessDisplay({ word, n_letters }) {
  let display_word = "";
  const A2Z = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let i = 0; i < word.length; i++) {
    if (word[i] == " ") {
      display_word += "  ";
    } else if (i < n_letters) {
      display_word += word[i];
    } else {
      if (A2Z.includes(word.toUpperCase()[i])) {
        display_word += "_ ";
      } else {
        display_word += word[i];
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
