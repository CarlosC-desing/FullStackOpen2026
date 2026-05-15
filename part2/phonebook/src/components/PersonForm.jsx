const PersonForm = ({
  addNumber,
  newName,
  setNewName,
  newPhone,
  setNewPhone,
}) => {
  return (
    <form onSubmit={addNumber}>
      <h2>Add a new</h2>
      <div>
        <label>Name: </label>
        <input
          type="text"
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
        />
      </div>
      <div>
        <label>Number: </label>
        <input
          type="text"
          value={newPhone}
          onChange={(event) => setNewPhone(event.target.value)}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};
export default PersonForm;
