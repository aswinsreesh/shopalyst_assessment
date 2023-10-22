const express = require('express');
const csvParser = require('csv-parser'); // CSV parsing library that allows to parse CSV data easily.
const fs = require('fs'); // file system module used for reading the CSV file.

const app = express();

const filePath = 'C:/Career/Company/Shopalyt/Nodejs/Sample Data - Sheet1.csv'; //Location of the CSV file.

async function parseCSV(customerId, startDate, endDate) {
  const activities = []; //To store activities
  const products = {}; //To store product summary.

  const fileStream = fs.createReadStream(filePath); //For reading the CSV file.
  fileStream.pipe(csvParser()) //It pipes the read stream through csvParser() to parse the CSV data row by row.
    .on('data', (row) => {
      const timestamp = new Date(row.Timestamp);
      const activityDate = new Date(timestamp);
      const count = parseInt(row.Count);
      // Conditions to check CustomerId and Date range
      if (row.CustomerId === customerId && (!startDate || activityDate >= startDate) && (!endDate || activityDate <= endDate)) 
      {
        activities.push({
          customerId: row.CustomerId,
          timestamp: row.Timestamp,
          action: row.Action,
          productId: row.ProductId,
          count: count
        });

        if (row.Action === 'PRODUCT_VIEW') {
          if (products[row.ProductId]) {
            products[row.ProductId] += count;
          } else {
            products[row.ProductId] = count;
          }
        }
      }
    });
//After processing all rows, it resolves a Promise when the read stream ends and returns an object containing activities and products.
  await new Promise((resolve) => {
    fileStream.on('end', resolve);
  });

  return { activities, products };
}

//API Endpoints

//It extracts customerId, startDate, and endDate from the request parameters and queries the CSV data using the parseCSV function. 
//It responds with the filtered customer activities.
app.get('/api/customer/:customerId', async (req, res) => {
  const customerId = req.params.customerId;
  const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
  const endDate = req.query.endDate ? new Date(req.query.endDate) : null;
  const { activities } = await parseCSV(customerId, startDate, endDate);
  res.json(activities);
});

//It extracts customerId, startDate, and endDate from the request parameters and queries the CSV data using the parseCSV function. 
//It calculates the product summary and responds with the product summary data.
app.get('/api/customer/summary/:customerId', async (req, res) => {
  const customerId = req.params.customerId;
  const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
  const endDate = req.query.endDate ? new Date(req.query.endDate) : null;
  const { products } = await parseCSV(customerId, startDate, endDate);
  const productSummary = Object.keys(products).map(productId => ({
    productId,
    count: products[productId]
  }));

  res.json({ products: productSummary });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
