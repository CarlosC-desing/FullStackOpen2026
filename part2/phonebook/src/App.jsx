import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import contactsService from "./services/contacts";
import { useEffect, useState } from "react";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [filter, setFilter] = useState("");
  const [notification, setNotification] = useState({
    message: null,
    type: null,
  });

  useEffect(() => {
    contactsService.getContacts().then((contacts) => {
      setPersons(contacts);
    });
  }, []);

  const personToShow = persons.filter((p) =>
    p.name.toLowerCase().includes(filter.toLowerCase()),
  );

  const addNumber = (event) => {
    event.preventDefault();
    const exist = persons.some((p) => p.name === newName.trim());
    if (exist) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`,
        )
      ) {
        const contactToUpdate = persons.find((p) => p.name === newName.trim());
        const contactId = contactToUpdate.id;
        const contactUpdated = { ...contactToUpdate, number: newPhone };

        contactsService
          .updateContact(contactId, contactUpdated)
          .then((contactReturned) => {
            setNotification({
              message: `${newName} was modified :)`,
              type: "success",
            });
            setTimeout(() => {
              setNotification({ message: null, type: null });
            }, 5000);
            setPersons(
              persons.map((p) => (p.id !== contactId ? p : contactReturned)),
            );
            setNewName("");
            setNewPhone("");
          })
          .catch((error) => {
            setNotification({
              message: `Information of ${newName} has already been removed from server`,
              type: "error",
            });
            setPersons(persons.filter((p) => p.id !== contactId));
            setTimeout(() => {
              setNotification({ message: null, type: null });
            }, 5000);
          });
      }
    } else {
      const newPerson = {
        name: newName,
        number: newPhone,
      };
      contactsService.createContact(newPerson).then((returnedPerson) => {
        setNotification({ message: `Added ${newName}`, type: "success" });
        setTimeout(() => {
          setNotification({ message: null, type: null });
        }, 5000);
        setPersons(persons.concat(returnedPerson));
        setNewName("");
        setNewPhone("");
      });
    }
  };

  const handleDeleteButton = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      contactsService
        .deleteContact(id)
        .then(() => {
          const newList = persons.filter((p) => p.id !== id);
          setPersons(newList);
        })
        .catch((error) => {
          alert(`El contacto ${name} ya hania sido eliminado del servidor`);
        });
    }
  };

  return (
    <div className="container">
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <Filter filter={filter} setFilter={setFilter} />
      <PersonForm
        addNumber={addNumber}
        newName={newName}
        setNewName={setNewName}
        newPhone={newPhone}
        setNewPhone={setNewPhone}
      />
      <h2>Numbers</h2>
      <Persons people={personToShow} handlerButton={handleDeleteButton} />
    </div>
  );
};

export default App;
