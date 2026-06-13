import React, { useState, useEffect, useRef } from "react";
import { Button, Modal } from "react-bootstrap";
import { FiEdit2 } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import "./Users.css";
import api from "../utils/api.util";
import { useHistory } from "react-router-dom";
import { Loading } from "./Loading";
import axios from "axios";
import debounce from "debounce";
import { utils, writeFile, read } from "xlsx";

export function Users() {
  const [users, setUsers] = useState([]);
  const usersRef = useRef([]);
  const [isLoading, setIsLoading] = useState(true);
  const [show, setShow] = useState(false);
  const history = useHistory();
  const selectedUserId = useRef(null);
  const [searchText, setSearchText] = useState("");
  const [isDeleteButtonLoading, setIsDeleteButtonLoading] = useState(false);

  const handleClose = () => { selectedUserId.current = null; setShow(false); };
  const onDeleteClick = (userId) => { selectedUserId.current = userId; setShow(true); };

  const deleteUser = async () => {
    setIsDeleteButtonLoading(true);
    await api.delete(`/api/user/${selectedUserId.current}`);
    setUsers(() => {
      const next = usersRef.current.filter((u) => u._id !== selectedUserId.current);
      usersRef.current = next;
      return next;
    });
    setSearchText("");
    handleClose();
    setIsDeleteButtonLoading(false);
  };

  useEffect(() => {
    const fillUsers = async () => {
      const { data } = await api.get("/api/user");
      if (data.isSuccess) { setUsers(data.users); usersRef.current = data.users; }
      setIsLoading(false);
    };
    fillUsers();
  }, []);

  const search = debounce((text) => {
    if (!text) setUsers(usersRef.current);
    else {
      const t = text.toLowerCase();
      setUsers(usersRef.current.filter(
        (u) => u.username.toLowerCase().includes(t) || u.name.toLowerCase().includes(t)
      ));
    }
  }, 100);

  const downloadExcel = () => {
    const rows = usersRef.current.map(({ username, password, name, role }) => ({ username, password, name, role }));
    const ws = utils.json_to_sheet(rows);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Users");
    writeFile(wb, "users.xlsx");
  };

  const uploadExcel = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const usersData = new Uint8Array(event.target.result);
      const workbook = read(usersData, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = utils.sheet_to_json(worksheet);
      setIsLoading(true);
      await api.post("/api/user/upload", jsonData);
      const { data } = await api.get("/api/user");
      if (data.isSuccess) {
        setSearchText("");
        setUsers(data.users);
        usersRef.current = data.users;
        document.getElementById("fileInput").value = "";
      }
      setIsLoading(false);
    };
    reader.readAsArrayBuffer(file);
  };

  const deleteAllUsers = async () => {
    setIsLoading(true);
    await api.delete("/api/user/delete-all");
    const { data } = await api.get("/api/user");
    if (data.isSuccess) { setUsers(data.users); usersRef.current = data.users; }
    setSearchText("");
    setIsLoading(false);
  };

  const searchUsers = (e) => {
    setSearchText(e.target.value);
    search.clear();
    search(e.target.value);
  };

  const onEnabledCheckboxChange = async (user) => {
    setIsLoading(true);
    const updated = { ...user, isEnabled: !user.isEnabled };
    await axios.post("/api/user/enable-disable-user", updated);
    const next = usersRef.current.map((u) => (u._id === user._id ? updated : u));
    setSearchText("");
    setUsers(next);
    usersRef.current = next;
    setIsLoading(false);
  };

  if (isLoading) return <Loading />;

  return (
    <div className="page-card">
      <div className="page-title">Users</div>

      <div className="d-flex flex-wrap align-items-center mb-1">
        <Button className="toolbar-btn" variant="primary" onClick={() => history.push("/editUser")}>
          + Add User
        </Button>
        <Button className="toolbar-btn" variant="outline-secondary" onClick={downloadExcel}>
          Download
        </Button>
        <Button className="toolbar-btn" variant="outline-secondary" onClick={() => document.getElementById("fileInput").click()}>
          Upload
        </Button>
        <input id="fileInput" type="file" accept=".xlsx,.xls" style={{ display: "none" }} onChange={uploadExcel} />
        <Button
          className="toolbar-btn"
          variant="outline-danger"
          onClick={deleteAllUsers}
          disabled={users.length <= 1}
        >
          Delete All (Non-Admin)
        </Button>
      </div>

      <input
        type="text"
        className="search-input"
        value={searchText}
        placeholder="Search by name or ITS number…"
        onChange={searchUsers}
      />

      <div style={{ overflowX: "auto", borderRadius: 10, border: "1px solid var(--border)" }}>
        <table className="users-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>ITS Number</th>
              <th>Role</th>
              <th>Enabled</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id}>
                <td style={{ color: "var(--text-muted)", width: 48 }}>{index + 1}</td>
                <td style={{ fontWeight: 500 }}>{user.name}</td>
                <td style={{ color: "var(--text-secondary)", fontFamily: "monospace" }}>{user.username}</td>
                <td>
                  <span className={`role-badge role-badge--${user.role.toLowerCase()}`}>{user.role}</span>
                </td>
                <td>
                  {user.role !== "Admin" && (
                    <input
                      type="checkbox"
                      className="enable-toggle"
                      checked={user.isEnabled}
                      onChange={() => onEnabledCheckboxChange(user)}
                    />
                  )}
                </td>
                <td style={{ whiteSpace: "nowrap" }}>
                  <FiEdit2 size={17} className="icon" onClick={() => history.push(`/editUser/${user._id}`)} />
                  <AiOutlineDelete size={19} color="var(--danger)" className="icon" onClick={() => onDeleteClick(user._id)} />
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", color: "var(--text-muted)", padding: "2rem" }}>
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal centered show={show} onHide={handleClose}>
        <Modal.Header closeButton style={{ borderBottom: "1px solid var(--border)" }}>
          <Modal.Title style={{ fontSize: "1rem", fontWeight: 700 }}>Delete User</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "1.25rem 1.5rem" }}>
          Are you sure you want to delete this user? This cannot be undone.
        </Modal.Body>
        <Modal.Footer style={{ borderTop: "1px solid var(--border)" }}>
          <Button variant="outline-secondary" onClick={handleClose}>Cancel</Button>
          <Button variant="danger" disabled={isDeleteButtonLoading} onClick={deleteUser}>
            {isDeleteButtonLoading ? "Deleting…" : "Delete"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
