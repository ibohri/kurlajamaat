import React, { useState, useEffect, useRef } from "react";
import { Table, Button, Modal } from "react-bootstrap";
import { FiEdit2 } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import "./Users.css";
import api from "../utils/api.util";
import { useHistory } from "react-router-dom";
import { Loading } from "./Loading";
import axios from "axios";
import debounce from "debounce";
import { utils, writeFile, read } from "xlsx";
import { set } from "mongoose";

export function Users() {
  const [users, setUsers] = useState([]);
  const usersRef = useRef([]);
  const [isLoading, setIsLoading] = useState(true);
  const [show, setShow] = useState(false);
  const history = useHistory();
  const selectedUserId = useRef(null);
  const [searchText, setSearchText] = useState();
  const [isDeleteButtonLoading, setIsDeleteButtonLoading] = useState(false);
  const handleClose = () => {
    selectedUserId.current = null;
    setShow(false);
  };
  const onDeleteClick = (userId) => {
    selectedUserId.current = userId;
    setShow(true);
  };

  const deleteUser = async () => {
    setIsDeleteButtonLoading(true);
    await api.delete(`/api/user/${selectedUserId.current}`);

    setUsers((prevUsers) => {
      const usersToSet = usersRef.current.filter(
        (user) => user._id !== selectedUserId.current
      );
      usersRef.current = usersToSet;
      return usersToSet;
    });
    setSearchText("");
    handleClose();
    setIsDeleteButtonLoading(false);
  };

  useEffect(() => {
    const fillUsers = async () => {
      const { data } = await api.get("/api/user");
      if (data.isSuccess) {
        setUsers(data.users);
        usersRef.current = data.users;
      }
      setIsLoading(false);
    };
    fillUsers();
  }, []);

  const search = debounce((text) => {
    if (!text) setUsers(usersRef.current);
    else {
      text = text.toLowerCase();
      setUsers(
        usersRef.current.filter(
          (user) =>
            user.username.toLowerCase().indexOf(text) > -1 ||
            user.name.toLowerCase().indexOf(text) > -1
        )
      );
    }
  }, 100);

  const downloadExcel = () => {
    const filteredUsers = usersRef.current.map(
      ({ username, password, name, role }) => ({
        username,
        password,
        name,
        role,
      })
    );
    const worksheet = utils.json_to_sheet(filteredUsers);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Users");
    writeFile(workbook, "users.xlsx");
  };

  const uploadExcel = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const usersData = new Uint8Array(event.target.result);
      const workbook = read(usersData, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = utils.sheet_to_json(worksheet);
      setIsLoading(true);
      // Assuming the API endpoint to upload users is /api/user/upload
      await api.post("/api/user/upload", jsonData);
      const { data: updatedData } = await api.get("/api/user");
      if (updatedData.isSuccess) {
        setSearchText("");
        setUsers(updatedData.users);
        setIsLoading(false);
        usersRef.current = updatedData.users;
        document.getElementById("fileInput").value = ""; // Clear the file input
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const deleteAllUsers = async () => {
    setIsLoading(true);
    await api.delete("/api/user/delete-all");
    const { data } = await api.get("/api/user");
    if (data.isSuccess) {
      setUsers(data.users);
      usersRef.current = data.users;
    }
    setSearchText("");
    setIsLoading(false);
  };

  const searchUsers = (e) => {
    setSearchText(e.target.value);
    search.clear();
    search(e.target.value);
  };

  const onAddUserClick = () => {
    history.push("/editUser");
  };

  const onEditUserClick = (userId) => {
    history.push(`/editUser/${userId}`);
  };
  const onEnabledCheckboxChange = async (user, index) => {
    setIsLoading(true);
    user = {
      ...user,
      isEnabled: !user.isEnabled,
    };
    await axios.post("/api/user/enable-disable-user", user);
    const updatesUsers = usersRef.current.map((u) => {
      if (u._id === user._id) {
        return user;
      }
      return u;
    });
    setSearchText("");
    setUsers(updatesUsers);
    usersRef.current = updatesUsers;

    setIsLoading(false);
  };

  return isLoading ? (
    <Loading />
  ) : (
    <div>
      <Button
        onClick={onAddUserClick}
        className="ml-auto mb-3"
        variant="primary"
      >
        Add User +
      </Button>
      <Button
        className="ml-auto mb-3 ml-3"
        variant="secondary"
        onClick={downloadExcel}
      >
        Download Users
      </Button>
      <Button
        className="ml-auto mb-3 ml-3"
        variant="secondary"
        onClick={() => document.getElementById("fileInput").click()}
      >
        Upload Users
      </Button>
      <input
        id="fileInput"
        type="file"
        accept=".xlsx, .xls"
        style={{ display: "none" }}
        onChange={uploadExcel}
      />
      <Button
        className="ml-auto mb-3 ml-3"
        variant="secondary"
        onClick={deleteAllUsers}
        disabled={users.length <= 1} // Disable if only admin exists
      >
        Delete All Users (Except Admin)
      </Button>
      <input
        type="text"
        className="form-control mb-3"
        value={searchText}
        placeholder="Search"
        onChange={searchUsers}
      ></input>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>User Name</th>
            <th>Role</th>
            <th>Is Enabled</th>
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
                <td>{user.role}</td>
                <td>
                  {user.role !== "Admin" && (
                    <input
                      type="checkbox"
                      className="enable-checkbox"
                      checked={user.isEnabled}
                      onChange={() => onEnabledCheckboxChange(user, index)}
                    />
                  )}
                </td>
                <td width="140px">
                  <FiEdit2
                    onClick={() => onEditUserClick(user._id)}
                    className="icon"
                  />
                  <AiOutlineDelete
                    color="red"
                    className="icon"
                    onClick={() => onDeleteClick(user._id)}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <Modal centered={true} show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete the user?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            disabled={isDeleteButtonLoading}
            onClick={deleteUser}
          >
            {isDeleteButtonLoading ? "Loading..." : "Confirm"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
