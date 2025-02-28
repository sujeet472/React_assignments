import { useReducer, useState } from 'react';
import './App.css';

function InputBox({ addToList }) {
  const [text, setText] = useState("");

  function formSubmit(e) {
    e.preventDefault();
    if (text.trim() === "") return;
    addToList(text);
    setText("");
  }

  return (
    <div className="inputBox">
      <form onSubmit={formSubmit}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button style={{ margin: "10px" }} type="submit">Submit</button>
      </form>
    </div>
  );
}

function FinalList({ list, deleteTask, editTask }) {
  const [clickedItems, setClickedItems] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState("");

  function handleClick(id) {
    if (editIndex !== id) {
      setClickedItems((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      );
    }
  }

  function itemStyle(id) {
    return {
      cursor: "pointer",
      padding: "5px",
      textDecoration: clickedItems.includes(id) ? 'line-through' : 'none',
    };
  }

  function startEditing(id, description) {
    setEditIndex(id);
    setEditValue(description);
  }

  function saveEdit(id) {
    if (editValue.trim() !== "") {
      editTask(id, editValue);
      setEditIndex(null);
    }
  }

  return (
    <ul style={{ listStyle: "circle" }}>
      {list.map(({ id, description }) => (
        <li key={id} onClick={() => handleClick(id)} style={itemStyle(id)}>
          {editIndex === id ? (
            <>
              <input
                type="text"
                value={editValue}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => setEditValue(e.target.value)}
              />
              <button onClick={(e) => { e.stopPropagation(); saveEdit(id); }}>Save</button>
              <button onClick={(e) => { e.stopPropagation(); setEditIndex(null); }}>Cancel</button>
            </>
          ) : (
            <>
              {description}
              <button style={{ margin: "10px" }} onClick={(e) => { e.stopPropagation(); deleteTask(id); }}>Delete</button>
              <button onClick={(e) => { e.stopPropagation(); startEditing(id, description); }}>Edit</button>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}

const todoReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [...state, { id: Date.now(), description: action.payload }];
    case 'DELETE_TODO':
      return state.filter((todo) => todo.id !== action.payload);
    case 'EDIT_TODO':
      return state.map((todo) =>
        todo.id === action.payload.id ? { ...todo, description: action.payload.newValue } : todo
      );
    default:
      return state;
  }
};

function App() {
  const [list, dispatch] = useReducer(todoReducer, []);

  const addToList = (value) => {
    dispatch({ type: 'ADD_TODO', payload: value });
  };

  const deleteTask = (id) => {
    dispatch({ type: 'DELETE_TODO', payload: id });
  };

  const editTask = (id, newValue) => {
    dispatch({ type: 'EDIT_TODO', payload: { id, newValue } });
  };

  return (
    <>
      <InputBox addToList={addToList} />
      <FinalList list={list} deleteTask={deleteTask} editTask={editTask} />
    </>
  );
}

export default App;
