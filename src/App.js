import "./App.css";
import axios from "axios";
import React, { useState, useEffect } from "react";

const fetchData = () => {
  return axios
    .get("https://randomuser.me/api/?results=20")
    .then((res) => {
      return res.data.results;
    })
    .catch((err) => console.log(err));
};

function App() {
  const [users, setUsers] = useState([{}]);
  const [order, setOrders] = useState(true); //if false then desc, else asc

  useEffect(() => {
    setUsers([{}]);
    fetchData().then((res) => {
      res.forEach((data) => {
        setUsers((prev) => [data, ...prev]);
      });
    });
  }, []);

  function sortHandler(e) {
    setOrders((prev) => !prev);
    const sortingValue1 = e.target.getAttribute("data");
    const sortingValue2 = e.target.getAttribute("data-second");
    const obj = [...users];

    obj.sort((a, b) => {
      if (a.name !== undefined && b.name !== undefined) {
        if (!order) {
          if (a[sortingValue1][sortingValue2] > b[sortingValue1][sortingValue2])
            return 1;
        } else if (order) {
          if (a[sortingValue1][sortingValue2] < b[sortingValue1][sortingValue2])
            return 1;
        } else return -1;
      }
      return -1;
    });

    setUsers(obj);
  }

  return (
    <div className="App">
      <table width="100%">
        <thead>
          <tr>
            <th>
              First name
              <button data="name" data-second="first" onClick={sortHandler}>
                <>&#9650;</>
              </button>
            </th>
            <th>
              Last name
              <button data="name" data-second="last" onClick={sortHandler}>
                <>&#9650;</>
              </button>
            </th>
            <th>
              City
              <button data="location" data-second="city" onClick={sortHandler}>
                <>&#9650;</>
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) =>
            user.name !== undefined ? (
              <tr key={index}>
                <td>{user.name.first}</td>
                <td>{user.name.last}</td>
                <td>{user.location.city}</td>
              </tr>
            ) : null
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
