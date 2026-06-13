import React, { useState, useEffect } from "react";
import api from "../utils/api.util";
import { Loading } from "./Loading";

export function LoggedInUsers() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fillUsers = async () => {
      const { data } = await api.get("/api/user/logged-in-users");
      if (data.isSuccess) setUsers(data.users);
      setIsLoading(false);
    };
    fillUsers();
  }, []);

  if (isLoading) return <Loading />;

  return (
    <div className="page-card">
      <div className="page-title">Logged In Users</div>
      <div style={{ overflowX: "auto", borderRadius: 10, border: "1px solid var(--border)" }}>
        <table className="users-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>ITS Number</th>
              <th>Logged In At</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id || index}>
                <td style={{ color: "var(--text-muted)", width: 48 }}>{index + 1}</td>
                <td style={{ fontWeight: 500 }}>{user.name}</td>
                <td style={{ color: "var(--text-secondary)", fontFamily: "monospace" }}>{user.username}</td>
                <td style={{ color: "var(--text-secondary)", fontSize: "0.88rem" }}>
                  {user.loggedInTime ? new Date(user.loggedInTime).toLocaleString() : "—"}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", color: "var(--text-muted)", padding: "2rem" }}>
                  No users are currently logged in.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
