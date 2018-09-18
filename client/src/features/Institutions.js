import React from "react";
import {
  deleteItemFromApp,
  // populateUserItems
} from "./api";

const Institutions = (props) => {
  const idToken = props.idToken;
  const userItems = props.userItems;
  const populateUserItems = props.populateUserItems;
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
                  await populateUserItems();
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