const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

const router = express.Router();
const billsFilePath = path.join(__dirname, '../data/bills.json')

const getBills = async (req, res, next) => {
  try{
    const data = fs.readFileSync(billsFilePath);
    const bills = JSON.parse(data);
    if (!bills) {
      const err = new Error('No bills found');
      err.status = 404;
      throw err;
    }
    res.json(bills)
  } catch (e) {
    next (e);
  }
};


router.route('/api/v1/bills').get(getBills)

const getBill = async (req, res, next) => {
  try {
    const data = fs.readFileSync(billsFilePath);
    const bills = JSON.parse(data);
    const billStats = bills.find(bill => bill.id === Number(req.params.id));
    if (!billStats) {
      const err = new Error('No bill found');
      err.status = 404;
      throw err;
    }
    res.json(billStats);
  } catch (e) {
    next(e);
  }
};

router.route('/api/v1/bills/:id').get(getBill);


const createBill = async (req, res, next) => {
  try {
    const data = fs.readFileSync(billsFilePath);
    const bills = JSON.parse(data);
    const { id, bill_name, bill_amount, due_date } = req.body
    const newBill = {
      id,
      bill_name,
      bill_amount,
      due_date,
      start: due_date,
      end: due_date,
      title: `${bill_name}: $${bill_amount}`,
      hex_color: '00FFFF'
    };
    if(!req.body.id){
      res.send(JSON.stringify('An id is required'));
    } else if (!req.body.bill_name) {
      res.send(JSON.stringify('A bill_name is required'));
    } else if (!req.body.bill_amount) {
      res.send(JSON.stringify('A bill_amount is required'));
    } else if (!req.body.due_date) {
      res.send(JSON.stringify('A due_date is required'));
    } else {
      bills.push(newBill);
    }
    
    fs.writeFileSync(path.join(__dirname, '../data/bills.json'), JSON.stringify(bills));
    res.status(201).json(newBill);
  } catch (e) {
    console.log('error', e);
  }
};
  
router
  .route('/api/v1/bills')
  .post(createBill);  


const updateBill = async (req, res, next) => {
  try {
    const data = fs.readFileSync(billsFilePath);
    const bills = JSON.parse(data);
    const billStats = bills.find(bill => bill.id === Number(req.params.id));
    if (!billStats) {
      const err = new Error('No bill found');
      err.status = 404;
      throw err;
    }
    const { id, bill_name, bill_amount, due_date } = JSON.parse(req.body.body)
    const newBillData = {
      id,
      bill_name,
      bill_amount,
      due_date,
      start: due_date,
      end: due_date,
      title: `${bill_name}: $${bill_amount}`,
      hex_color: '00FFFF'
    };
     if (!newBillData.bill_name) {
      res.send('A billName is required');
    } else if (!newBillData.bill_amount) {
      res.send('A billAmount is required');
    } else if (!newBillData.due_date) {
      res.send('A dueDate is required');
    } else {
      const newBill = bills.map(bill => {
        if (bill.id === Number(req.params.id)) {
          return newBillData;
        } else {
          return bill;
        }
      });
      fs.writeFileSync(billsFilePath, JSON.stringify(newBill));
      res.status(200).json(newBillData);
    
    }
  } catch (e) {
    next(e);
  }
};

router
  .route('/api/v1/bills/:id')
  .get(getBill)
  .put(updateBill);


const deleteBill = async (req, res, next) => {
  try {
    const data = fs.readFileSync(billsFilePath);
    const bills = JSON.parse(data);
    const billStats = bills.find(bill => bill.id === Number(req.params.id));
    if (!billStats) {
      const err = new Error('No bill found');
      err.status = 404;
      throw err;
    }
    const newBill = bills.map(bill => {
      if (bill.id === billStats.id) {
        return null;
      } else {
        return bill;
      }
    })
    .filter(bill => bill !== null);
    fs.writeFileSync(billsFilePath, JSON.stringify(newBill));
    res.status(200).json(billStats).end();
  } catch (e) {
    next(e);
  }
};

router
  .route('/api/v1/bills/:id')
  .get(getBill)
  .put(updateBill)
  .delete(deleteBill);

module.exports = router;