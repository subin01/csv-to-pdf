import "./styles.css";

import React, { useState } from "react";
import _ from "lodash";
// import { users_mock, settlements_mock } from "./mocks/mock_data";
import mock_merge_data from "./mocks/mock_merge_data";
import { jsPDF } from "jspdf";
import { ToWords } from "to-words";

import CustomersView from "./CustomersView";
import SettlementsView from "./SettlementsView";
import MergeView from "./MergeView";
import PdfView from "./PdfView";
import GODlogo from "./GODlogo";

function prepareData(usersData, settlementsData) {
  const list = {};
  settlementsData &&
    settlementsData.forEach((s) => {
      const customerId = s.customer;
      if (customerId) {
        const c = _.find(usersData, { id: customerId });
        console.log("customerId", customerId, c);
        if (c) {
          const cust = list[c.id] || {};
          const custUpd = { name: c.name, email: c.email };
          const pay = list[c.id]?.payment || {};
          const payUpd = { [s.date_settled]: s.amount };
          console.log("cust", cust, custUpd, "pay:", pay, payUpd);

          list[c.id] = { ...cust, ...custUpd, payment: { ...pay, ...payUpd } }; // merge
        }
      }
    });
  // console.log(users_mock);
  // const customer = _.find(users_mock, { id: "CU00729OCWL8CZ" });
  // console.log(customer);
  console.log(list);
  return list;
}

function preparePDFs(data) {
  const toWords = new ToWords({
    localeCode: "en-IN",
    converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
    },
  });

  const entries = Object.values(data);
  // const entries = Object.values(data).slice(1, 2);

  entries.map((entry, i) => {
    console.log("entry:: ", entry);

    // var imageData = new Image(300, 300);
    // imageData.src = "https://godreams.org/android-chrome-512x512.png";

    const doc = new jsPDF();
    const LOGOHEIGHT = 12;
    const LOGOWIDTH = LOGOHEIGHT * 7.125;
    const MARGIN = 20;

    doc.addImage(GODlogo, "PNG", MARGIN, 20, LOGOWIDTH, LOGOHEIGHT);
    doc.setFont("helvetica");
    doc.setLineHeightFactor(1.5);
    //   doc.setFontSize(20);
    //   doc.text("Guardians of Dreams", 60, 25);
    doc.setFontSize(11);
    doc.text("www.godreams.org \n contact@godreams.org", 185, 24, {
      align: "right",
    });
    doc.setDrawColor("#333333");
    doc.setLineWidth(0.25);
    doc.line(0, 45, 210, 45);
    doc.text(
      "No. 8, New Friend's Colony,11th Main, 8th Cross, ST Bed Layout, Koramangala, Bangalore - 560047",
      MARGIN,
      53
    );
    doc.line(0, 58, 210, 58);

    doc.setTextColor("#000000");
    doc.setFontSize(22);
    doc.text("Receipt of Donations", 70, 75);
    doc.setFontSize(12);

    var t = "\n";
    t += `Date: ${new Date().toDateString().substring(4)} \n`;
    t += "Name of the Non-Profit Organization: Guardians of Dreams";
    // t += "TIN: 01-0284340 \n \n";

    t += `\n\nDonor’s Name\n   ${entry.name}`;
    t += `\n\nDonations\n`;
    // var lines = doc.splitTextToSize(t, 170);
    // doc.text(MARGIN, 85, lines);

    let total = 0;
    for (let m in entry.payment) {
      total += parseFloat(entry.payment[m]);
      t += `   ${m} — ₹${entry.payment[m]}\n`;
    }
    t += `\nTotal Donation\n   ₹${total.toFixed(2)} (${toWords.convert(
      total
    )})`;

    // t += `Donations: ${JSON.stringify(entry.payment)
    //   .replaceAll("{", "")
    //   .replaceAll("}", "")
    //   .replaceAll('"', " ")} \n\n`;

    // t = "";
    t +=
      "\n\n\n\n\nI, the undersigned representative, declare (or certify, verify, or state) the above mentioned information is accurate.\n\n\n";
    t += "Sincerely, \n";
    t += "Sheenu Wilson";
    // doc.text(t, 10, 72)
    var lines = doc.splitTextToSize(t, 170);
    doc.text(20, 85, lines);

    doc.save(`${i + 1}-${entry.name}-${entry.email}-receipt.pdf`);
  });
}

export default function App() {
  const [step, setStep] = useState("customers");
  const [users, setUsers] = useState(null);
  const [settlements, setSettlements] = useState(null);
  const [merged, setMerged] = useState(mock_merge_data);

  const renderView = () => {
    if (step === "customers")
      return (
        <>
          <CustomersView users={users} setUserData={setUserData} />
          {users && (
            <button onClick={() => setStep("settlements")}>
              Next (settlements)
            </button>
          )}
        </>
      );
    if (step === "settlements")
      return (
        <>
          <SettlementsView
            settlements={settlements}
            setSettlements={setSettlementsData}
          />
          {users && settlements && (
            <button onClick={handlePrepare}>Next (Merge)</button>
          )}
        </>
      );
    if (step === "merged")
      return (
        <>
          <MergeView merged={merged} />
          {merged && (
            <button onClick={() => preparePDFs(merged)}>Generate PDFs</button>
          )}
        </>
      );
    if (step === "pdf") return <PDfView />;
    return <>View</>;
  };

  const setUserData = (data) => {
    // console.log("USER DATA:", data);
    setUsers(data);
  };

  const setSettlementsData = (data) => {
    // console.log("SETTLEMENTS DATA:", data);
    setSettlements(data);
  };

  const handlePrepare = () => {
    setMerged(prepareData(users, settlements));
    setStep("merged");
  };

  return (
    <div className="App">
      <h1>CSV to PDF</h1>
      <hr></hr>
      {renderView()}
      <hr></hr>
      {/* <button onClick={() => preparePDFs(merged)}>Generate PDFs</button> */}
    </div>
  );
}
