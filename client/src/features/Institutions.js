import React from "react";
import {
  deleteItemFromApp,
} from "./api";

const Institutions = (props) => {
  const idToken = props.idToken;
  const userItems = props.userItems;
  return (
    <div>
      <ul>
        {userItems.map(item => (
          <li key={item.itemId}>
            <button
              type="submit"
              onClick={async () => {
                try {
                  await deleteItemFromApp(idToken, item.itemId);
                  await this.populateUserItems();
                } catch (error) {
                  console.log(error);
                }
              }}
            >
              Delete {item.institutionName}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Institutions;