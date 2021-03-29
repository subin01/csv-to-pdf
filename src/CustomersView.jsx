import React from "react";
import Uploader from "./Uploader";

export default function CustomersView({ users, setUserData }) {
  return (
    <>
      <h3>Upload Customers Master list CSV</h3>
      {!users && <Uploader onComplete={setUserData} maxFiles={1} />}
      <table border={1}>
        {users &&
          users.map((u, i) => (
            <tr className={`row_${u.id}`}>
              <td>{i + 1}</td>
              <td>{u.id} </td>
              <td>
                <b>{u.name}</b>
              </td>
            </tr>
          ))}
      </table>
    </>
  );
}
