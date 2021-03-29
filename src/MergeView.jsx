import React from "react";

export default function MergeView({ merged }) {
  return (
    <>
      <h3>Merge View</h3>
      <table border={1}>
        {merged &&
          Object.values(merged).map((m, i) => (
            <tr className={`row_${m.customer}`}>
              <td>{i + 1}</td>
              <td>
                <strong>{m.name}</strong>
              </td>
              <td>{m.email}</td>
              {Object.keys(m.payment).map((k) => (
                <>
                  <td> {k}</td>
                  <td>
                    <b>{m.payment[k]}</b>
                  </td>
                </>
              ))}
            </tr>
          ))}
      </table>
    </>
  );
}
