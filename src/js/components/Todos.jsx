import React, { useEffect, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";

const API_URL = "https://playground.4geeks.com/todo";
const username = "Maximiliano";

const Todos = () => {
  // Hook que se encarga de manejar las tasks
  const [task, setTask] = useState([]);
  // Hook que se encarga de manejar el valor del input para las tasks
  const [inputValue, setInputValue] = useState("");
  // Hook que se encarga de manejar que task esta siendo apuntada con el cursor
  const [idShown, setIdShown] = useState(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch(`${API_URL}/users/${username}`);
      let user = await response.json();
      if (!response.ok) {
        const postResponse = await fetch(`${API_URL}/users/${username}`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
          }),
        });
        user = await postResponse.json();
        setTask([]);
        console.log("User created:", postResponse);
      } else {
        setTask(user.todos || []);
        console.log("User exists:", user);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const postTodo = async (todo) => {
    try {
      await fetch(`${API_URL}/todos/${username}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          label: todo,
        }),
      });
    } catch (error) {}
    fetchUser();
  };

  const deleteTodo = async (todoId) => {
    const response = await fetch(`${API_URL}/todos/${todoId}`, {
      method: "DELETE",
      header: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      fetchUser();
    }
  };

  const deleteAllTodos = async () => {
    try {
      const response = await fetch(`${API_URL}/users/${username}`);
      const user = await response.json();

      await Promise.all(
        (user.todos || []).map((todo) =>
          fetch(`${API_URL}/todos/${todo.id}`, {
            method: "DELETE",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          })
        )
      );

      fetchUser();
    } catch (error) {}
  };
  // Funcion que renderiza las tasks
  const displayTask = () => {
    // Esto creo que puedo hacerlo con operador ternario, pero la sintaxis me confundio al intentarlo xD
    // Si el largo del array de las tasks es mayor a 0, entonces muestra la lista
    if (task.length > 0) {
      return task.map((item) => (
        <li
          className="list-group-item fs-1 d-flex align-items-center justify-content-between"
          key={item.id}
          onMouseEnter={() => setIdShown(item.id)}
          onMouseLeave={() => setIdShown(null)}
        >
          <div className="text-start" style={{ overflow: "auto" }}>
            {item.label}
          </div>
          <div style={{ width: "50px", minWidth: "50px" }} className="text-end">
            {idShown === item.id ? (
              <button
                className="btn btn-danger btn-sm"
                onClick={() => deleteTodo(item.id)}
              >
                <FaRegTrashAlt />
              </button>
            ) : (
              <span></span>
            )}
          </div>
        </li>
      ));

      // En caso contrario, muestra un span indicando que no hay tareas
    } else {
      return (
        <span className="fst-italic text-danger mt-5 opacity-50">
          NO HAY TAREAS PENDIENTES!
        </span>
      );
    }
  };
  return (
    <div className>
      <h2 className="text-center mb-5">Tareas Pendientes</h2>
      <div className="btn-group d-flex justify-content-center">
        <input
          className="mb-3 form-control shadow-sm"
          type="text"
          value={inputValue}
          placeholder="Agrega una tarea!"
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.target.value.trim() !== "") {
              postTodo(inputValue);
              setInputValue("");
            }
          }}
        />
      </div>

      <ul
        className={`text-center list-group ${
          task.length > 0 ? "shadow-sm" : ""
        }`}
      >
        {displayTask()}
      </ul>
      <div className="justify-content-center d-flex opacity-50">
        {task.length === 1 ? (
          <span>{task.length} tarea pendiente</span>
        ) : task.length > 1 ? (
          <span>{task.length} tareas pendientes</span>
        ) : null}
      </div>

      <div className="d-flex justify-content-center mt-3">
        {task.length > 0 && (
          <button className="btn btn-danger" onClick={() => deleteAllTodos()}>
            Eliminar todas las tareas
          </button>
        )}
      </div>
    </div>
  );
};

export default Todos;
