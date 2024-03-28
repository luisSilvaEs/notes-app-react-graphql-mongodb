interface Props {
  actionButton: () => void;
}

const Form = ({ actionButton }: Props) => {
  return (
    <div className="form-container">
      <input type="text" placeholder="Write your note here..." />
      <button onClick={actionButton}>Add Note</button>
    </div>
  );
};

export default Form;
