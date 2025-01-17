import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import logo from "/company.png";

const InvoicePDF = () => {
  const [invoice, setInvoice] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await axios.get("http://localhost:3000/generate");
        // Ensure you're accessing the correct structure of the response
        if (response.data && response.data.success) {
          setInvoice(response.data.invoice); // Update the invoice state
        } else {
          setError("Failed to fetch invoice data");
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchInvoice();
  }, []);

  // Check if invoice data is available before destructuring
  if (!invoice) {
    return <div>Loading...</div>;
  }

  const { company, seller, customer, products, shipping, totals } = invoice;

  const generatePDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.text("TAX INVOICE", 85, 20);

    // Company Information
    // doc.setLineWidth(0.2);
    // doc.rect(12, 30, 180, 25); // Adjust x, y, width, height for your content

    doc.setFontSize(12);
    doc.text(`Invoice No: ${company.name}`, 16, 36);
    doc.text(`RRN: ${company.location}`, 16, 42);
    doc.text(`Date & Time: ${company.pincode}`, 16, 48);
    doc.text(`Order ID: ${company.gstIn}`, 16, 54);

    doc.setLineWidth(0.2);
    doc.rect(14, 58, 182, 25); // Adjust x, y, width, height for your content

    doc.text(`Company: ${company.name}`, 16, 62);
    doc.text(`Location: ${company.location}`, 16, 68);
    doc.text(`Pincode: ${company.pincode}`, 16, 74);
    doc.text(`GSTIN: ${company.gstIn}`, 16, 80);

    // const logoBase64 = "/logo.svg"; // Replace with your base64 image string
    doc.addImage(logo, "PNG", 150, 35, 30, 15); // x, y, width, height

    doc.setLineWidth(0.2);
    doc.rect(14, 85, 91, 39); // Adjust x, y, width, height for your content
    // Seller and Customer Information
    doc.text("Bill To :", 16, 90);
    doc.text(`Name: ${seller.name}`, 16, 96);
    doc.text(`Location: ${seller.location}`, 16, 102);
    doc.text(`                ${seller.location}`, 16, 108);
    doc.text(`Pincode: ${seller.pincode}`, 16, 114);
    doc.text(`Phone: ${seller.phone}`, 16, 120);

    doc.setLineWidth(0.2);
    doc.rect(105, 85, 91, 39); // Adjust x, y, width, height for your content

    doc.text("Customer Information:", 107, 90);
    doc.text(`Name: ${customer.name}`, 107, 96);
    doc.text(`Location: ${customer.location}`, 107, 102);
    doc.text(`                 ${customer.location}`, 107, 108);

    doc.text(`Pincode: ${customer.pincode}`, 107, 114);
    doc.text(`Phone: ${customer.phone}`, 107, 120);

    const { description, Qty, price, hsncode, discount, taxable, gst } = totals;

    console.log("this is", totals.total);

    const dataPro = [...products, shipping, totals];

    //   console.log(totals.gst)
    //   console.log(shipping)

    // Products Table
    const productRows = dataPro.map((product) => [
      product.description,
      product.Qty,
      product.price.toFixed(2),
      product.hsncode,
      product.discount,
      product.taxable.toFixed(2),
      product.gstAmount.toFixed(2),
      product.total.toFixed(2),
    ]);

    doc.autoTable({
      startY: 130,
      head: [
        [
          "Description",
          "Qty",
          "Price",
          "HSN Code",
          "Discount",
          "Taxable",
          "GST Amount",
          "Total",
        ],
      ],
      body: [...productRows],
    });

    doc.text(`Grand Total : Rs ${totals.total}`, 14, 260);

    // Shipping Section (after products)

    // Save PDF
    doc.text(
      `Declaration: This is a computer generated invoice , No signature required.`,
      40,
      280
    );
    doc.save("invoice.pdf");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {error ? (
        <p style={{ color: "red" }}>Error: {error}</p>
      ) : (
        <button
          style={{ padding: "10px 20px", fontSize: "16px" }}
          onClick={generatePDF}
        >
          Generate PDF
        </button>
      )}
      <img src={logo} alt="" />
    </div>
  );
};

export default InvoicePDF;
