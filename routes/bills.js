const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

const router = express.Router();
const billsFilePath = path.join(__dirname, './bills.json')

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
  
}


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
    const bills = data;
    console.log('request.body', req.body)
    const newBill = {
      id: req.body.id,
      billName: req.body.billName,
      billAmount: req.body.billAmount,
      dueDate: req.body.dueDate,
    };
    if(!req.body.id){
      res.send('An id is required');
    } else if (!req.body.billName) {
      res.send('A billName is required');
    } else if (!req.body.billAmount) {
      res.send('A billAmount is required');
    } else if (!req.body.dueDate) {
      res.send('A dueDate is required');
    } else {
      bills.push(newBill);
    }
    
    fs.writeFileSync(path.join(__dirname, './bills.json'), JSON.stringify(bills));
    res.status(201).json(newBill);
  } catch (e) {
    next(e);
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
    console.log('req.params', req.params)
    if (!billStats) {
      const err = new Error('No bill found');
      err.status = 404;
      throw err;
    }
    const newBillData = {
      id: req.body.id,
      billName: req.body.billName,
      billAmount: req.body.billAmount,
      dueDate: req.body.dueDate,
    };
    if(!req.body.id){
      res.send('An id is required');
    } else if (!req.body.billName) {
      res.send('A billName is required');
    } else if (!req.body.billAmount) {
      res.send('A billAmount is required');
    } else if (!req.body.dueDate) {
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
    console.log('req.params.id', req.params.id)
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
        console.log('bill inside newBill', bill)
        console.log('billstats', billStats)
        return bill;
      }
    })
    .filter(bill => bill !== null);
    console.log('server bills', bills)
    fs.writeFileSync(billsFilePath, JSON.stringify(newBill));
    res.status(200).end();
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