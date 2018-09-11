import React from "react";
import {
  handleDeleteUser,
  deleteAllItems,
} from "./api";

const UserAdminPanel = (props) => {
  const idToken = props.idToken;
  return (
    <div>
      Logged in
      <button type="submit" onClick={this.handleLogout}>
        Logout
      </button>
      <button
        type="submit"
        onClick={async () => {
          try {
            await handleDeleteUser(idToken);
            await this.handleLogout();
          } catch (error) {
            console.log(error);
          }
        }}
      >
        Delete User
      </button>
      <button
        type="submit"
        onClick={async () => {
          try {
            await deleteAllItems(idToken);
            await this.populateUserItems();
          } catch (error) {
            console.log(error);
          }
        }}
      >
        Delete all items
      </button>
    </div>
  );
};

export default UserAdminPanel;