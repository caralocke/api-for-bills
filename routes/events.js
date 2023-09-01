const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

const router = express.Router();
const eventsFilePath = path.join(__dirname, './events.json')

const getEvents = async (req, res, next) => {
  try{
    const data = fs.readFileSync(eventsFilePath);
    const events = JSON.parse(data);
    if (!events) {
      const err = new Error('No events found');
      err.status = 404;
      throw err;
    }
    res.json(events)
  } catch (e) {
    next (e);
  }
  
}


router.route('/api/v1/events').get(getEvents)

const getEvent = async (req, res, next) => {
  try {
    const data = fs.readFileSync(eventsFilePath);
    const events = JSON.parse(data);
    const eventStats = events.find(event => event.id === Number(req.params.id));
    if (!eventStats) {
      const err = new Error('No event found');
      err.status = 404;
      throw err;
    }
    res.json(eventStats);
  } catch (e) {
    next(e);
  }
};

router.route('/api/v1/events/:id').get(getEvent);


const createEvent = async (req, res, next) => {
  try {
    const data = fs.readFileSync(eventsFilePath);
    const events = JSON.parse(data);
    console.log('req.body', req.body)
    const newEvent = {
      id: req.body.id,
      title: req.body.billName,
      billAmount: req.body.billAmount,
      start: req.body.dueDate,
      end: req.body.dueDate,
      hexColor: req.body.hexColor
    };
    if(!req.body.id){
      res.send('An id is required');
    } else if (!req.body.title) {
      res.send('A billName is required');
    } else if (!req.body.billAmount) {
      res.send('A billAmount is required');
    } else if (!req.body.dueDate) {
      res.send('A dueDate is required');
    } else {
      events.push(newEvent);
    }
    
    fs.writeFileSync(path.join(__dirname, './events.json'), JSON.stringify(events));
    res.status(201).json(newEvent);
  } catch (e) {
    console.log('error', e);
  }
};
  
router
  .route('/api/v1/events')
  .post(createEvent);  


const updateEvent = async (req, res, next) => {
  try {
    const data = fs.readFileSync(eventsFilePath);
    const events = JSON.parse(data);
    const eventStats = events.find(event => event.id === Number(req.params.id));
    if (!eventStats) {
      const err = new Error('No event found');
      err.status = 404;
      throw err;
    }
    const newEventData = {
      id: req.body.id,
      billName: req.body.billName,
      billAmount: req.body.billAmount,
      start: req.body.dueDate,
      end: req.body.dueDate
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
      const newEvent = events.map(event => {
        if (event.id === Number(req.params.id)) {
          return newEventData;
        } else {
          return event;
        }
      });
      fs.writeFileSync(eventsFilePath, JSON.stringify(newEvent));
      res.status(200).json(newEventData);
    }
    
  } catch (e) {
    next(e);
  }
};

router
  .route('/api/v1/events/:id')
  .get(getEvent)
  .put(updateEvent);


const deleteEvent = async (req, res, next) => {
  try {
    const data = fs.readFileSync(eventsFilePath);
    const events = JSON.parse(data);
    const eventStats = events.find(event => event.id === Number(req.params.id));
    if (!eventStats) {
      const err = new Error('No event found');
      err.status = 404;
      throw err;
    }
    const newEvent = events.map(event => {
      if (event.id === eventStats.id) {
        return null;
      } else {
        return event;
      }
    })
    .filter(event => event !== null);
    fs.writeFileSync(eventsFilePath, JSON.stringify(newEvent));
    res.status(200).end();
  } catch (e) {
    next(e);
  }
};

router
  .route('/api/v1/events/:id')
  .get(getEvent)
  .put(updateEvent)
  .delete(deleteEvent);

module.exports = router;