var express = require('express');
var router = express.Router();
var eventController = require('../controllers/eventController');
var multer = require('multer');
var upload = multer({ dest: './uploads/' });


// authorization middleware, checks if user is authorized to access routes
function isAuthorized(req, res, next) {
  if(req.session && req.user)
    return next();

  res.sendStatus(401);
}

/* EVENTS CRUD METHODS */
router.get('/', eventController.event_list);

router.get('/:event_id', eventController.event);

router.post('/create', isAuthorized, /*upload.single('picture'),*/ eventController.create_event);

router.put('/update/:event_id', isAuthorized, eventController.update_event);

router.delete('/delete/:event_id', isAuthorized, eventController.delete_event);

router.get('/:event_id/cancel', isAuthorized, eventController.cancel_event);

router.get('/:event_id/subscribe', isAuthorized, eventController.event_subscribe);



/* EVENT COMMENTS CRUD METHODS */
router.get('/:event_id/comments', eventController.comment_list);

router.post('/:event_id/new_comment', isAuthorized, eventController.new_comment);

router.put('/:event_id/update/:comment_id', isAuthorized, eventController.update_comment);

router.delete('/:event_id/delete/:comment_id', isAuthorized, eventController.delete_comment);

module.exports = router;
