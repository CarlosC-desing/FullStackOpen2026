const Name = ({ person, deleteAction }) => (
  <li>
    {person.name} {person.number} <button onClick={deleteAction}>delete</button>
  </li>
);

const Persons = ({ people, handlerButton }) => {
  return (
    <div>
      <ul>
        {people.map((p) => (
          <Name
            key={p.id}
            person={p}
            deleteAction={() => handlerButton(p.id, p.name)}
          />
        ))}
      </ul>
    </div>
  );
};
export default Persons;
