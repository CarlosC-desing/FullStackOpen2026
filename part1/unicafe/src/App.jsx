import { useState } from "react";

const Button = ({ handler, text }) => <button onClick={handler}>{text}</button>;
const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  );
};

const Statistics = ({ good, neutral, bad }) => {
  const total = good + neutral + bad;

  const average = (good - bad) / total;
  const positive = (good / total) * 100;

  if (total === 0) {
    return (
      <div>
        <h1>No feedback given</h1>
      </div>
    );
  }
  return (
    <table>
      <th>
        <h1>Statistics</h1>
      </th>
      <tbody>
        <StatisticLine text="good" value={good} />
        <StatisticLine text="neutral" value={neutral} />
        <StatisticLine text="bad" value={bad} />
        <StatisticLine text="all" value={total} />
        <StatisticLine text="average" value={average.toFixed(1)} />
        <StatisticLine text="positive" value={`${positive.toFixed(1)}%`} />
      </tbody>
    </table>
  );
};

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const handleGoodButton = () => setGood(good + 1);
  const handleNeutralButton = () => setNeutral(neutral + 1);
  const handleBadButton = () => setBad(bad + 1);
  return (
    <div>
      <p>Give feedback</p>
      <Button handler={handleGoodButton} text="Good"></Button>
      <Button handler={handleNeutralButton} text="Neutral"></Button>
      <Button handler={handleBadButton} text="Bad"></Button>
      <Statistics good={good} neutral={neutral} bad={bad}></Statistics>
    </div>
  );
};

export default App;
