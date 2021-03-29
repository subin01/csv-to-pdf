import React from "react";
import Uploader from "./Uploader";

export default function SettlementsView({ settlements, setSettlements }) {
  return (
    <>
      <h3>Upload Settlements CSV</h3>
      {!settlements && <Uploader onComplete={setSettlements} />}
      <table border={1}>
        {settlements &&
          settlements.map((s, i) => (
            <tr>
              <td>{i + 1}</td>
              <td> {s.id}</td>
              <td> {s.customer}</td>
            </tr>
          ))}
      </table>
    </>
  );
}
