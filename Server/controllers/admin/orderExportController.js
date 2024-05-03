const Order = require("../../model/orderModel");
const PDFDocument = require("pdfkit");
const ExcelJS = require("exceljs");
const generateOrderPDF = async (req, res) => {
  const { startingDate, endingDate } = req.query;
  try {
    const filter = {};
    if (startingDate) {
      const date = new Date(startingDate);
      filter.createdAt = { $gte: date };
    }
    if (endingDate) {
      const date = new Date(endingDate);
      filter.createdAt = { ...filter.createdAt, $lte: date };
    }
    const orders = await Order.find(filter).populate([
      "user",
      "address",
      "statusHistory",
      "products",
      "products.productId",
    ]);
    const pdfBuffer = await generatePDF(orders);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment;filename=orders.pdf");
    res.status(200).end(pdfBuffer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const generatePDF = async (orderData) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });

      const buffers = [];
      doc.on("data", (buffer) => buffers.push(buffer));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", (error) => reject(error));

      doc.text("Order History", { align: "center", fontSize: 18 }).moveDown();

      // Headers
      const headers = [
        "_id",
        "user._id",
        "user.firstName",
        "user.email",
        "status",
        "address.address",
        "address.city",
        "subTotal",
        "shipping",
        "tax",
        "totalPrice",
      ];
      const columnWidths = headers.map((header) =>
        Math.max(
          header.length,
          ...orderData.map((item) => String(item[header]).length)
        )
      );
      const generateTableRow = (y, values) => {
        values.forEach((value, index) => {
          doc.text(value, 50 + index * 100, y);
          if (index < values.length - 1) {
            doc
              .moveTo(50 + (index + 1) * 100, y)
              .lineTo(50 + (index + 1) * 100, y + 15);
          }
        });
      };
      generateTableRow(doc.y + 10, headers);

      doc.moveDown();
      orderData.forEach((item) => {
        generateTableRow(
          doc.y,
          headers.map((header) => String(item[header]))
        );
        doc.moveDown();
      });
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};
const generateOrderExcel = async (req, res) => {
  const { startingDate, endingDate } = req.query;
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Orders");

    worksheet.columns = [
      { header: "Order ID", key: "_id", width: 20 },
      { header: "User ID", key: "user._id", width: 20 },
      { header: "User Name", key: "user.firstName" },
      { header: "User Email", key: "user.email" },
      { header: "Status", key: "status" },
      { header: "Address", key: "address.address", width: 35 },
      { header: "City", key: "address.city" },
      { header: "Products", key: "products", width: 40 },
      { header: "Subtotal", key: "subTotal" },
      { header: "Shipping", key: "shipping" },
      { header: "Tax", key: "tax" },
      { header: "Total Price", key: "totalPrice" },
    ];

    // Filtering based on dates. If they are provided along the URL as query
    const filter = {};
    if (startingDate) {
      const date = new Date(startingDate);
      filter.createdAt = { $gte: date };
    }
    if (endingDate) {
      const date = new Date(endingDate);
      filter.createdAt = { ...filter.createdAt, $lte: date };
    }

    // Fetching all the orders
    const orders = await Order.find(filter).populate([
      "user",
      "address",
      "statusHistory",
      "products",
      "products.productId",
    ]);

    orders.map((item) => {
      const productsDetails = item.products
        .map((product) => {
          return `${product.productId.name} (${product.quantity} units, ₹${product.price} each)`;
        })
        .join("\n");

      const row = {
        _id: item._id.toString(),
        "user._id": item.user._id.toString(),
        "user.firstName": item.user.firstName + " " + item.user.lastName,
        "user.email": item.user.email,
        status: item.status,
        "address.address": item.address.address,
        "address.city": item.address.city,
        products: productsDetails,
        subTotal: item.subTotal,
        shipping: item.shipping,
        tax: item.tax,
        totalPrice: item.totalPrice,
      };

      worksheet.addRow(row);
    });

    // Set headers for the response
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=orders.xlsx");

    const buffer = await workbook.xlsx.writeBuffer();

    res.send(buffer);
  } catch (error) {
    console.error(error, "admin generating excel");
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  generateOrderExcel,
  generateOrderPDF,
};
