var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CommentSchema = Schema({
  date_posted: {
    type: Date,
    default: Date.now
  },
  author: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  likes: {
    type: Number
  }
});

/* create virtual route to use in the router to get to specific event */
CommentSchema.virtual('url').get(function() {
  return '/event/comments/' + this.id;
});

module.exports = mongoose.model('Comment', CommentSchema);