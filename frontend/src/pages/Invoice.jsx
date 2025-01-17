import React, { useEffect, useState } from "react";
import axios from "axios";

const InvoicePDF = () => {
  const [invoice, setInvoice] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/generate");
        console.log("API Response:", data);
        if (data && data.success) {
          setInvoice(data.invoice); // Correct usage of setState
        } else {
          setError("Failed to fetch invoice data");
        }
      } catch (err) {
        console.error("Error fetching invoice:", err);
        setError(err.message);
      }
    };

    fetchInvoice();
  }, []);

  console.log("Invoice Data:", invoice);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {error ? (
        <p style={{ color: "red" }}>Error: {error}</p>
      ) : (
        <button style={{ padding: "10px 20px", fontSize: "16px" }}>
          Generate PDF
        </button>
      )}
    </div>
  );
};

export default InvoicePDF;
