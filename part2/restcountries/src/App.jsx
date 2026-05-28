import { useState, useEffect, use } from "react";
import FormCountries from "./Components/FormCountries";
import countriesService from "./service/service";
import CardCountry from "./Components/CardCountry";

const App = () => {
  const [value, setValue] = useState("");
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    countriesService.getAllCountries().then((countriesReturned) => {
      setCountries(countriesReturned);
    });
  }, []);

  const countriesToShow = countries.filter((c) =>
    c.name.common.toLowerCase().includes(value.toLowerCase()),
  );

  let content = null;

  if (value === "") {
    content = <p>Write some word to starting search</p>;
  } else if (countriesToShow.length > 10) {
    content = <p>Too many matches, specify another filter</p>;
  } else if (countriesToShow.length === 1) {
    content = <CardCountry country={countriesToShow[0]} />;
  } else {
    content = countriesToShow.map((c) => (
      <p key={c.name.common}>
        {c.name.common}
        <button onClick={() => setValue(c.name.common)}>show</button>
      </p>
    ));
  }

  const handleChange = (event) => {
    setValue(event.target.value);
  };
  return (
    <div>
      <h1>Finder</h1>
      <FormCountries value={value} onChange={handleChange} />
      {content}
    </div>
  );
};

export default App;
