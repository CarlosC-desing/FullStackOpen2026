const FormCountries = ({ value, onChange }) => {
  return (
    <form>
      <label>Find Countries: </label>
      <input type="text" value={value} onChange={onChange} />
    </form>
  );
};

export default FormCountries;
