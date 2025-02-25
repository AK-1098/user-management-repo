import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../features/users/userSlice";
import { RootState, AppDispatch } from "../store/store";
import { useNavigate } from "react-router-dom";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import SearchIcon from "@mui/icons-material/Search";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import "../styles/UserList.css";
import { logout } from "../features/auth/authSlice";
import {
  createUser,
  updateUser,
  deleteUser
} from "../features/users/userSlice";

const UsersList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { users, loading, error } = useSelector(
    (state: RootState) => state.users
  );
  const [editUser, setEditUser] = useState<any>(null);
  const [view, setView] = useState("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  useEffect(() => {
    dispatch(fetchUsers(1));
  }, [dispatch]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    dispatch(logout());
  };

  const handleEdit = (value: any) => {
    console.log("Edit user", value);
    setOpen(true);
    setEditUser(value);
  };

  const handleDelete = (id: any) => {
    console.log("Delete user", id);
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(id));
    }
  };
  const handleViewChange = (
    event: React.MouseEvent<HTMLElement>,
    nextView: string
  ) => {
    if (nextView !== null) setView(nextView);
  };
  const handleCreateUser = () => {
    // console.log("Create new user");
    setOpen(true);
  };

  const filteredUsersValue = users.filter((user) =>
    `${user.first_name} ${user.last_name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const filteredUsers = () => {
    console.log(
      "Search term:",
      users.filter((user) =>
        `${user.first_name} ${user.last_name}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    );
  };
  const handleClose = () => {
    setOpen(false);
    setEditUser(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editUser?.id) {
      dispatch(updateUser(editUser));
    } else {
      dispatch(createUser(editUser));
    }
    handleClose();
  };
  const [tableHeight, setTableHeight] = useState("auto");

  useEffect(() => {
    const adjustHeight = () => {
      const rowCount = filteredUsers.length;
      setTableHeight(rowCount > 10 ? "500px" : "auto");
    };
    adjustHeight();
  }, [filteredUsers]);
  return (
    <div className="user-list-container">
      <div className="header">
        <h2>User List</h2>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="user-list-search">
        <ToggleButtonGroup
          orientation="horizontal"
          value={view}
          exclusive
          onChange={handleViewChange}
          className="toggle-button-group"
        >
          <ToggleButton value="list" aria-label="list">
            <ViewModuleIcon /> Table
          </ToggleButton>
          <ToggleButton value="module" aria-label="module">
            <ViewListIcon /> Card
          </ToggleButton>
        </ToggleButtonGroup>
        <div className="search-box">
          <div className="search-input-container">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button className="search-btn" onClick={filteredUsers}>
              <SearchIcon />
            </button>
          </div>

          <button className="create-btn" onClick={handleCreateUser}>
            Create User
          </button>
        </div>
      </div>

      {filteredUsersValue.length === 0 ? (
        <p>No data found</p>
      ) : view === "list" ? (
        <div className="user-table-container">
          <table
            className="user-table"
            style={{ maxHeight: tableHeight, overflowY: "auto" }}
          >
            <thead>
              <tr>
                <th>Avatar</th>
                <th>First Name</th>
                <th>Second Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsersValue.map((user) => (
                <tr key={user.id}>
                  <td>
                    <img
                      src={user.avatar}
                      alt={user.first_name}
                      className="table-avatar"
                    />
                  </td>
                  <td style={{ color: "blue" }}>{user.email}</td>
                  <td>{user.first_name}</td>
                  <td>{user.last_name}</td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="user-grid" style={{ marginTop: "1rem" }}>
          {filteredUsersValue.map((user) => (
            <div key={user.id} className="user-card">
              <img
                src={user.avatar}
                alt={user.first_name}
                className="user-avatar"
              />
              <h3>
                {user.first_name} {user.last_name}
              </h3>
              <p>{user.email}</p>
              <div className="user-actions">
                <button className="edit-btn" onClick={() => handleEdit(user)}>
                  ✎
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(user.id)}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Modal open={open} onClose={handleClose}>
        <Box className="modal-box">
          <h2>{editUser ? "Edit User" : "Create New User"}</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "inline-block" }}>
              <span style={{ color: "red" }}>*</span> First Name
            </div>
            <input
              type="text"
              value={editUser?.first_name || ""}
              onChange={(e) =>
                setEditUser({ ...editUser, first_name: e.target.value })
              }
              required
            />
            <div style={{ display: "inline-block" }}>
              <span style={{ color: "red" }}>*</span> Last Name
            </div>

            <input
              type="text"
              value={editUser?.last_name || ""}
              onChange={(e) =>
                setEditUser({ ...editUser, last_name: e.target.value })
              }
              required
            />
            <div style={{ display: "inline-block" }}>
              <span style={{ color: "red" }}>*</span> Email
            </div>
            <input
              type="email"
              value={editUser?.email || ""}
              onChange={(e) =>
                setEditUser({ ...editUser, email: e.target.value })
              }
              required
            ></input>
            <div style={{ display: "inline-block" }}>
              <span style={{ color: "red" }}>*</span> Image Url
            </div>
            <input
              type="text"
              value={editUser?.avatar || ""}
              onChange={(e) =>
                setEditUser({ ...editUser, avatar: e.target.value })
              }
              required
            ></input>
            <button type="submit">{editUser ? "Update" : "Create"}</button>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default UsersList;
