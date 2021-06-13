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
  const [forFilter, setForFilter] = useState([{}]);
  const [order, setOrders] = useState({
    first: false,
    last: false,
    city: false,
  }); //if false then desc, else asc
  const [filtering, setFiltering] = useState(false);

  useEffect(() => {
    setUsers([{}]);
    fetchData().then((res) => {
      res.forEach((data) => {
        setUsers((prev) => [data, ...prev]);
      });
    });
  }, []);

  function sortHandler(e) {
    const sortingValue1 = e.target.getAttribute("data");
    const sortingValue2 = e.target.getAttribute("data-second");
    const obj = [...users];
    setOrders((prev) => ({
      ...prev,
      [sortingValue2]: !prev[sortingValue2],
    }));

    obj.sort((a, b) => {
      if (a.name !== undefined && b.name !== undefined) {
        if (!order[sortingValue2]) {
          if (
            a[sortingValue1][sortingValue2] > b[sortingValue1][sortingValue2]
          ) {
            e.target.innerText = "▲";
            return 1;
          }
        } else if (order[sortingValue2]) {
          if (
            a[sortingValue1][sortingValue2] < b[sortingValue1][sortingValue2]
          ) {
            e.target.innerText = "▼";
            return 1;
          }
        } else return -1;
      }
      return -1;
    });

    setUsers(obj);
  }

  function filterData(e) {
    if (e.target.value !== "") {
      setFiltering(true);
      setForFilter(users);
      displayFilteredData(e);
    } else {
      setFiltering(false);
    }
  }

  function displayFilteredData(e) {
    if (e.target.value.match(/^[0-9a-z]+$/)) {
      let re = new RegExp(e.target.value);
      setForFilter((prev) =>
        prev.filter(
          (item) =>
            item.name !== undefined &&
            (re.test(item.name.first.toLowerCase()) ||
              re.test(item.name.last.toLowerCase()) ||
              re.test(item.location.city.toLowerCase()))
        )
      );
    }
  }

  return (
    <div className="container">
      <input type="text" onChange={filterData} placeholder="Search" />
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
          {!filtering
            ? users.map((user, index) =>
                user.name !== undefined ? (
                  <tr key={index}>
                    <td>{user.name.first}</td>
                    <td>{user.name.last}</td>
                    <td>{user.location.city}</td>
                  </tr>
                ) : null
              )
            : forFilter.map((user, index) =>
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
