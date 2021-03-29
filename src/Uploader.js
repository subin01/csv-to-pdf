import React from "react";
import "react-dropzone-uploader/dist/styles.css";
import Dropzone from "react-dropzone-uploader";
import Papa from "papaparse";

const Uploader = ({ onComplete, maxFiles = 6 }) => {
  let csvData = [];

  // called every time a file's `status` changes
  const handleChangeStatus = ({ meta, file }, status) => {
    // console.log(status, meta, file);
    if (status === "done") {
      Papa.parse(file, {
        worker: true,
        header: true,
        complete: function (results) {
          csvData = [...csvData, ...results.data];
          console.table(results.data);
        },
      });
    }
  };

  const handleClick = () => {
    console.log("csvData:", JSON.stringify(csvData));
    onComplete(csvData);
  };

  return (
    <>
      <Dropzone
        onChangeStatus={handleChangeStatus}
        accept=".csv"
        autoUpload={false}
        maxFiles={maxFiles}
        styles={{
          dropzone: { width: 800, height: maxFiles * 50 },
          dropzoneActive: { borderColor: "green" },
        }}
      />

      <div>
        <button onClick={handleClick}>Upload</button>
      </div>
    </>
  );
};

export default Uploader;
