import React, { useState, useEffect, useRef } from "react";
import { Table, Button, Modal } from "react-bootstrap";
import { FiEdit2 } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import "./Users.css";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { Loading } from "./Loading";

export function Users() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [show, setShow] = useState(false);
  const history = useHistory();
  const selectedUserId = useRef(null);
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
    await axios.delete(`/api/user/${selectedUserId.current}`);

    setUsers((prevUsers) =>
      prevUsers.filter((user) => user._id !== selectedUserId.current)
    );
    handleClose();
    setIsDeleteButtonLoading(false);
  };

  useEffect(() => {
    const fillUsers = async () => {
      const { data } = await axios.get("/api/user");
      if (data.isSuccess) {
        setUsers(data.users);
      }
      setIsLoading(false);
    };
    fillUsers();
  }, []);

  const onAddUserClick = () => {
    history.push("/editUser");
  };

  const onEditUserClick = (userId) => {
    history.push(`/editUser/${userId}`);
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

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>User Name</th>
            <th>Role</th>
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
