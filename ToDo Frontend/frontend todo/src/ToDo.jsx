import React, { useState, useEffect } from "react";


function ToDo() {
  const [toDo, setTodo] = useState("one of the");
  const [description, setDescription] = useState("most importnant perin ");
  const [list, setList] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editid, setEditId] = useState(-1);

  //edit
  const [editTitle, setEditTitle] = useState("");
  const [editidDescription, setEditIdDescription] = useState("");



  const apiUrl = "http://localhost:8000";
  //send items to the backend database api
  const handleSubmit = () => {
    if (toDo.trim() !== '' && description.trim() !== '') {
      fetch(apiUrl + "/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "title": toDo,
          "description": description
        })
      })
        .then((res) => {
          if (res.ok) {
            setList([...list, { toDo, description }]);
            setSuccess("toDo added successfully")
          }
          else {
            setError("Error");
            console.log("error occured by:  ")
          }
        })
      setError("")
      setInterval(() => {
        setSuccess("");
      }, 5000);
    }
    else {
      setError("Please fill all the fields");
    }
    setTodo("");
    setDescription("");
  };
  // get items from api
  const getItems = () => {
    fetch(apiUrl + "/todos")
      .then((res) => res.json())
      .then((data) => {
        setList(data)
      })
  }
  useEffect(() => {
    getItems();
  }, [handleSubmit])

  //Deleteb operation
  const handleDelete = (_id) => {
    if (window.confirm("Are you sure want to delete.")) {
      fetch(apiUrl + "/todos/" + _id, {
        method: "DELETE",
      })
        .then(() => {
          const updatedTodos = list.filter((item) => item._id !== id);
          setList(updatedTodos);
        })
    }

  }

  //erdit before update
  const handleEdit = (item) => {
    setEditId(item._id);
    setEditTitle(item.title);
    setEditIdDescription(item.description)
  }
  //Update operation
  const handleUpdate = () => {
    if (editTitle.trim() !== '' && editidDescription.trim() !== '') {
      fetch(apiUrl + "/todos/" + editid, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "title": editTitle,
          "description": editidDescription
        })
      })
        .then((res) => {
          if (res.ok) {
            const updatedTodos = list.map((item) => {
              if (item._id === editid) {
                item.title = editTitle;
                item.description = editidDescription;
              }
              return item;
            })

            setList(updatedTodos)
            setSuccess("toDo updated successfully")
            setTimeout(() => {
              setSuccess("");
            }, 5000);

            setEditId(-1);

          }
        })
      setError("")

    }
    else {
      setError("Please fill all the fields");
    }
    setTodo("");
    setDescription("");
  }


  return (
    <div>
      <h1 className="text-center fw-bold ">Todo List</h1>
      <div className="form-group  d-flex  justify-content-center ">
        <span className="d-flex flex-wrap gap-2">
          <input
            type="text"
            onChange={(e) => setTodo(e.target.value)}
            value={toDo}
            placeholder="todo"
            className="form p-1 px-4 border rounded border-success"
          />
          <input
            type="text"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            placeholder="description"
            className="form p-1 px-4 border rounded border-success"
          />
          <button onClick={handleSubmit} className="border rounded border-success bg-success text-white">Submit</button>
        </span>

      </div>

      <ul className="">
        {list.map((item, index) => (
          <li className="d-flex align-items-center justify-content-between bg-primary me-5 p-2 mt-2 border rounded text-white fw-bold" key={index}>
            <span>
              {index + 1}. {editid == -1 || editid !== item._id ?
                <>
                  {item.title}  <br />  <span className="fw-normal"> {item.description} </span>
                </>
                : <>
                  <input
                    type="text"
                    onChange={(e) => setEditTitle(e.target.value)}
                    value={editTitle}
                    placeholder="todo"
                    className="form border boder-success rounded"
                  />
                  <input
                    type="text"
                    onChange={(e) => setEditIdDescription(e.target.value)}
                    value={editidDescription}
                    placeholder="description"
                    className="form ms-2 border boder-success rounded"
                  />
                </>}
            </span>
            <span>
              {editid == -1 || editid !== item._id ?
                <>
                  <span className="d-flex ">
                    <button className="me-3 bg-warning text-white border rounded px-3 fw-bold" onClick={() => handleEdit(item)}>Edit</button>
                    <button className="me-5 bg-danger border rounded fw-bold text-white" onClick={() => handleDelete(item._id)}>Delete</button>
                  </span>
                </>
                : <>
                  <span>
                    <button className="me-3 bg-success text-white border rounded px-3 fw-bold" onClick={() => handleUpdate()}>Update</button>
                    <button className="me-3 bg-danger text-white border rounded px-3 fw-bold" onClick={() => setEditId()}>Cancel</button>
                  </span>
                </>}
            </span>
          </li>
        ))}
      </ul>
      <span className="position-fixed border-secondary border fw-bold bg-white rounded bottom-0  end-0 me-5 mb-5">
        {error && <p className="text-danger  px-3 pt-3">{error}</p>}
        {success && <p className=" px-3 pt-3">{success}</p>}
      </span>
    </div>
  );
}

export default ToDo;
