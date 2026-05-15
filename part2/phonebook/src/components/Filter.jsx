const Filter = ({ filter, setFilter }) => {
  return (
    <div>
      <label>Filter show whith: </label>
      <input
        type="text"
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
      />
    </div>
  );
};
export default Filter;
