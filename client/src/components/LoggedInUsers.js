import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import api from "../utils/api.util";
import { Loading } from "./Loading";

export function LoggedInUsers() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fillUsers = async () => {
      const { data } = await api.get("/api/user/logged-in-users");
      if (data.isSuccess) {
        setUsers(data.users);
      }
      setIsLoading(false);
    };
    fillUsers();
  }, []);

  return isLoading ? (
    <Loading />
  ) : (
    <div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>User Name</th>
            <th>Logged In Time</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => {
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.username}</td>
                <td>
                  {user.loggedInTime &&
                    new Date(user.loggedInTime).toLocaleString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}
