interface Props {
  description: String;
  actionDelete: () => void;
  actionMoveUp: () => void;
  actionMoveDown: () => void;
}

const Note = ({
  description,
  actionDelete,
  actionMoveUp,
  actionMoveDown,
}: Props) => {
  return (
    <div className="single-note">
      <div className="single-note__description">{description}</div>
      <button onClick={actionMoveUp}>Move up</button>
      <button onClick={actionMoveDown}>Move down</button>
      <button onClick={actionDelete}>Delete</button>
    </div>
  );
};

export default Note;
