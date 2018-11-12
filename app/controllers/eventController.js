var Event = require('../models/event');
var Comment = require('../models/comment');
var User = require('../models/user');
var request = require('request');
var EventEmitter = require('events');
var nodemailer = require('nodemailer');
var notifier = require('node-notifier');

var mailer = nodemailer.createTransport({
 service: 'mail',
 auth: {
        user: 'wearther@email.com',
        pass: '123Wearther!@#'
    }
});


// todo: if opened connection, use socket.io; else use push api
// give user to choose from given dates to reorganize the event
// show past events by location, time..

class EventUpdateEmitter extends EventEmitter {}
const eventUpdateEmitter = new EventUpdateEmitter();



class WeatherEmitter extends EventEmitter {}
const weatherEmitter = new WeatherEmitter();

/******** IF WEATHER CONDITIONS ARE LOW NOTIFY THE ************
********* USER VIA WEB API NOTIFICATION AND EMAIL **************/
weatherEmitter.on("rain", function(event_dates) {
  // find all events which are related to this dates
  for(date of event_dates) {
    Event.find({ start_date: date }, function(err, events) {
      if(err) {
        console.log("Error ocurred trying to find an events.");
      }
      if(events.length == 0) {
        console.log("No event found.");
        return;
      }

      for(event of events) {
        User.findById(event.organizer, function(err, organizer) {
          if(err) {
            console.log("Error ocurred trying to find an organizer.");
          }

          /* SEND NOTIFICATIONS */
          /* EMAIL NOTIFY */
          let mailOptions = {
            from: 'wearther@email.com',
            to: organizer.email, // list of receivers
            subject: 'Wearther - Postpone the event [Smart Notify]',
            html: '<p>Hello Organizer. As we noticed, the event you are organizing at ..\
                      will be at .. low weather conditions. To move the event\
                      on some event click here. Or you can move the event\
                      to the one of the recommended dates.\
                      Wish you ..</p>'// plain text body
          };

          mailer.sendMail(mailOptions, function (err, info) {
             if(err)
               console.log(err)
             else
               console.log(info);
          });

          /* BROWSER NOTIFY */
          notifier.notify({
            title: 'Warning: Move the event',
            message: 'Some of your events occuring when there is low weather conditions,\
            click to see more',
            sound: true,
            wait: true
          }, function(err, response) {

          });

          notifier.on('click', function(notifierObject, options) {
            // do the trick
          })
        });

        if(event.users_going == undefined) {
          console.log("Nobody is going.");
          return;
        }

        for(user_going of event.users_going) {
          User.findById(user_going, function(err, user_going) {
            if(err) {
              console.log("Error ocurred trying to get users going.");
            }

            let mailOptions = {
              from: 'wearther@email.com',
              to: user_going.email, // list of receivers
              subject: 'Wearther - Low Weather Conditions [Smart Notify]',
              html: '<p>Hello, there are low weather conditions,\
                        for the event .. stay updated by clicking the button\
                        bellow to see if the organizer is going to postpone\
                        the event .. </p>'// plain text body
            };

            mailer.sendMail(mailOptions, function (err, info) {
               if(err)
                 console.log(err)
               else
                 console.log(info);
            });
          });
        }
      }
    });
  }

  // check for next max. 5 days if there will be better weather conditions
  // give creator choice to move the event for the other better day

  // notify the users if creator moved the event
});

setInterval(function() {
  request('http://api.openweathermap.org/data/2.5/forecast?q=Maribor&cnt=10&units=\
    metric&APPID=2b754fa8798e87968c4622b3f0bc4e45', 
    function(err, response, body) {
      if(err) {
        console.log("Can not connect to the Weather API.")
      }
      // transform stringified data into java script object
      var data = JSON.parse(body);
      var event_dates = [];

      // check if there is low weather conditions for some of the next 5 days,
      // call the event handler
      for(weatherCon of data.list) {
        if(weatherCon.weather[0].main == "Snow" || weatherCon.weather[0].main == "Rain") {
          // retured date format is string: 2018-01-01 00:00:00. interpret it as date
          // and add to the aray of dates
          event_dates.push(new Date(weatherCon.dt_txt));
        }
      }

      weatherEmitter.emit("rain", event_dates, new Error("Can not emit the rain event."));
    });
}, 1000*60); // It is in ms. Get data from API provider every 10 hours


exports.event_list = function(req, res) {
  Event.find(function(err, events) {
    if(err) {
      return res.status(500).send(err);
    }

    res.json(events);
  });
}

exports.event = function(req, res) {
  Event.findById(req.params.event_id, function(err, event) {
    if(err) {
      return res.status(500).send(err);
    }

    res.json(event);
  });
}

exports.create_event = function(req, res) {
  var event = new Event({
    title: req.body.title,
    description: req.body.description,
    picture: req.body.picture,
    start_date: datetime('start'),
    end_date: datetime('end'),
    location: req.body.location,
    organizer: req.user.id
  });

  event.save(function(err, event) {
    if(err) {
      return res.status(500).send(err);
    }

    res.json(event);
  });
}

function datetime(time) {
  if(time == 'start') {
    var date = req.body.start_date;
    var time = req.body.start_time;
  } else {
    var date = req.body.end_date;
    var time = req.body.end_time;
  }

  return new Date(date + ' ' + time);
}

exports.update_event = function(req, res) {
  var event = new Event({
    title: req.body.title,
    description: req.body.description,
    picture: req.body.picture,
    start_date: req.body.start_date,
    end_date: req.body.end_date,
    location: req.body.location,
    organizer: req.user.id,
    _id: req.params.event_id
  })

  
  Event.findByIdAndUpdate(req.params.event_id, event, {}, function(err, event) {
    if(err) {
      return next(err);
    }

    eventUpdateEmitter.emit("update", event, new Error("Can not emit update event"));
    res.json(event);
  });
}

exports.delete_event = function(req, res) {
  Event.findByIdAndRemove(req.params.event_id, function(err, event) {
    if(err) {
      return res.status(500).send(err);
    }

    let response = {
      message: "Event successfully deleted",
      id: event._id
    };

    res.json(response);
  });
}

// if event is canceled, by click uncancel it!
exports.cancel_event = function(req, res) {
  var value = true;

  Event.findById(req.params.event_id, function(err, event) {
    if(err)
      return res.status(500).send(err);

    if(event.canceled)
      value = false;
  });

  var event = new Event({
    title: req.body.title,
    description: req.body.description,
    picture: req.body.picture,
    start_date: req.body.start_date,
    end_date: req.body.end_date,
    location: req.body.location,
    organizer: req.user.id,
    _id: req.params.event_id,
    canceled: value
  });

  Event.findByIdAndUpdate(req.params.event_id, event, {}, function(err, event) {
    if(err)
      return res.status(500).send(err);

    res.json(event);
  })
}

/* Subscribe to event if is not subscribed, unsubscribe if already subscribed */
exports.event_subscribe = function(req, res) {
  Event.findById(req.params.event_id, function(err, event) {
    if(err) {
      return res.status(500).send(err);
    }

    var user_exist = false;
    if(event.users_going.length > 0) {
      for(var user of event.users_going) {
        if(user == req.user.id)
          user_exist = true;
      }
    }

    if(user_exist) {
      Event.update({ "_id": event }, { $pull: { "users_going": req.user.id }}, 
        function(err, result) {
        if(err)
          return res.send(err);

        res.send(result);
      });
    } else {
      Event.update({ "_id": event }, { $push: { "users_going": req.user.id }}, 
        function(err, result) {
        if(err)
          return res.send(err);

        res.send(result);
      });
    }
  });
}

exports.comment_list = function(req, res) {
  Event.findById(req.params.event_id, function(err, event) {
    if(err) {
      return res.status(500).send(err);
    }

    res.send(event.comments);
  })
}

exports.new_comment = function(req, res) {
  var comment = new Comment({
    author: req.user.id,
    content: req.body.content
  });
  comment.save();

  Event.update({ "_id": req.params.event_id }, { $push: { "comments": comment }}, 
    function(err, result) {
    if(err) {
      return res.status(500).send(err);
    }

    res.json({ "Status": "OK" });
  });
}

exports.update_comment = function(req, res) {
  var comment = new Comment({
    _id: req.params.comment_id,
    author: req.user.id,
    content: req.body.content
  });

  Comment.findByIdAndUpdate(req.params.comment_id, comment, {}, function(err, comment) {
    if(err) {
      return res.status(500).send(err);
    }

    res.json(comment);
  });
}

exports.delete_comment = function(req, res) {
  Comment.findByIdAndRemove(req.params.comment_id, function(err, comment) {
    if(err) {
      return res.status(500).send(err);
    }

    let response = {
      message: "successfully deleted",
      id: comment._id
    }

    res.json(response);
  });
}