import { QUESTIONS } from "./questions";

import React, { useState, useEffect } from 'react';
// import questions from './questions';
import localforage from 'localforage';

const App: React.FC = () => {
  const [answers, setAnswers] = useState<{ [key: number]: boolean | null }>({});
  const [score, setScore] = useState<number | null>(null);
  const [averageScore, setAverageScore] = useState<number | null>(null);

  useEffect(() => {
    loadAverageScore();
  }, []);

  const handleAnswer = (index: number, answer: boolean) => {
    setAnswers(prev => ({ ...prev, [index]: answer }));
  };

  const calculateScore = () => {
    const numberOfYesAnswers = Object.values(answers).filter(answer => answer).length;
    const calculatedScore = (100 * numberOfYesAnswers) / Object.values(QUESTIONS).length;
    setScore(calculatedScore);
    saveScore(calculatedScore);
  };

  const saveScore = async (score: number) => {
    const scores: number[] = (await localforage.getItem('scores')) || [];
    scores.push(score);
    await localforage.setItem('scores', scores);
    calculateAverageScore(scores);
  };

  const loadAverageScore = async () => {
    const scores: number[] = (await localforage.getItem('scores')) || [];
    calculateAverageScore(scores);
  };

  const calculateAverageScore = (scores: number[]) => {
    const total = scores.reduce((acc, score) => acc + score, 0);
    const average = total / scores.length;
    setAverageScore(average);
  };

  return (
    <div>
      <h1>Yes/No Questions</h1>
      {Object.values(QUESTIONS).map((question, index) => (
        <div key={index}>
          <p>{question}</p>
          <button onClick={() => handleAnswer(index, true)}>Yes</button>
          <button onClick={() => handleAnswer(index, false)}>No</button>
        </div>
      ))}
      <button onClick={calculateScore}>Submit</button>
      {score !== null && <p>Your score: {score.toFixed(2)}</p>}
      {averageScore !== null && <p>Average score: {averageScore.toFixed(2)}</p>}
    </div>
  );
};

export default App;

// class App extends Component {
//   state = {
//   };

//   render() {
//     return (
//       <div className="main__wrap">
//         <main className="container">
//           <div>
//             TODO
//           </div>
//         </main>
//       </div>
//     );
//   }
// }
