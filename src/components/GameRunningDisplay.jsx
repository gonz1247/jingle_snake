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
  return <pre>{display_word}</pre>;
}

function GameRunningDisplay({ word, score, n_letters }) {
  return (
    <>
      <div className="d-flex justify-content-evenly">
        <p>Have Fun Playing!</p>
      </div>
      <div className="d-flex justify-content-evenly">
        <p>Current Score: {score}</p>
      </div>
      <div className="d-flex justify-content-evenly">
        <WordProgessDisplay word={word} n_letters={n_letters} />
      </div>
    </>
  );
}

export default GameRunningDisplay;
