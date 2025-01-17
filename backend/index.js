import express from "express";
import cors from "cors";

const app = express();
const PORT = 3000;
app.use(express.json());

app.use(cors());

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Welcome to the Node.js backend!");
});

app.get("/generate", async (req, res) => {
  const company = {
    name: "Sphran",
    location: "dfthsif sfhsfjdf sfsdf dfsdfhsfs",
    pincode: 499999,
    gstIn: "fsdrerer3434434",
  };
  const seller = {
    name: "Dushyant",
    location: "dfthsif sfhsfjdf sfsdf dfsdfhsfs",
    pincode: 490023,
    phone: "9303844782",
  };
  const customer = {
    name: "Takesh",
    location: "dfthsif sfhsfjdf sfsdf dfsdfhsfs",
    pincode: 491885,
    phone: "7771906032",
  };
  const products = [
    {
      description: "Maxx T-shirt (Gray-XL)",
      Qty: 1,
      price: 4444.44,
      hsncode: 6109,
      discount: 0.0,
      taxable: 4444.44,
      gst: 18,
      gstAmount: (4444.44 * 18) / 100,
      total: 4444.44 - 0 + (4444.44 * 18) / 100,
    },
    {
      description: "Maxx T-shirt (Gray-XL)",
      Qty: 1,
      price: 100,
      hsncode: 6109,
      discount: 0.0,
      taxable: 100,
      gst: 18,
      gstAmount: (100 * 18) / 100,
      total: 100 - 0 + (100 * 18) / 100,
    },
  ];

  const shipping = {
    description: "Shipping",
    Qty: 0,
    price: 90,
    hsncode: 0,
    discount: 90,
    taxable: 0.0,
    gst: 0.0,
    gstAmount: (90 * 0) / 100,
    total: 90 - 90 + (90 * 0) / 100,
  };

  try {
    // Calculate totals
    let Qty = 0;
    let price = shipping.price;
    let discount = shipping.discount;
    let taxable = shipping.taxable;
    let gst = shipping.gst;
    let gstAmount = shipping.gstAmount;
    let total = shipping.total;

    products.forEach((item) => {
      gstAmount += (item.taxable * item.gst) / 100;
      Qty += item.Qty;
      price += item.price;
      discount += item.discount;
      taxable += item.taxable;

      total += item.taxable + (item.taxable * item.gst) / 100;
    });

    // Add shipping details
    total += shipping.price - shipping.discount;

    // Create response object
    const invoice = {
      company,
      seller,
      customer,
      products,
      shipping,
      totals: {
        description: "Total",
        Qty: parseFloat(Qty.toFixed(0)),
        price: parseFloat(price.toFixed(2)),
        hsncode: 0,
        discount: parseFloat(discount.toFixed(2)),
        taxable: parseFloat(taxable.toFixed(2)),
        gstAmount: parseFloat(gstAmount.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
      },
    };

    // Return the invoice as a response
    res.status(200).json({ success: true, invoice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message, success: false });
  }
});
