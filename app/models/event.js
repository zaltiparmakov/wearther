var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var EventSchema = Schema({
  title: {
    type: String,
    required: true,
    max: 100
  },
  description: {
    type: String
  },
  picture: {
    data: Buffer,
    contentType: String
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  start_date: {
    type: Date,
    required: true
  },
  end_date: {    
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  users_going: [
    {
      type: Schema.ObjectId,
      ref: 'User'
    }
  ],
  organizer: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  comments: [
    {
      type: Schema.ObjectId,
      ref: 'Comment'
    }
  ],
  canceled: {
    type: Boolean,
    default: false
  },
  event_type: {
    type: String,
    default: 'casual'
  }
});

/* create virtual route to use in the router to get to specific event */
EventSchema.virtual('url').get(function() {
  return '/events/' + this.id;
});

module.exports = mongoose.model('Event', EventSchema);