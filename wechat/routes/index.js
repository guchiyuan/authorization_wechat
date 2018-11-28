var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/sq', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

/* login */
router.get('/sq/login', function(req, res) {
  res.render('login', { title: 'login' });
});

/* mine */
router.get('/sq/mine', function(req, res) {
    res.render('mine');
});

/* userMsg */
router.get('/sq/userMsg', function(req, res) {
    res.render('mine/userMsg');
});

/* updateEmail */
router.get('/sq/updateEmail', function(req, res) {
    res.render('mine/updateEmail');
});

/* myApplication */
router.get('/sq/myApplication', function(req, res) {
    res.render('mine/myApplication');
});

/* myApply */
router.get('/sq/myApply', function(req, res) {
    res.render('mine/myApply');
});



/* application */
router.get('/sq/applicationMsg', function(req, res) {
  res.render('application/applicationMsg');
});

/* userApplication */
router.get('/sq/userApplication', function(req, res) {
    res.render('application/userApplication');
});

/* applicationList */
router.get('/sq/applicationList', function(req, res) {
    res.render('application/applicationList');
});

/* userHistoryDetails */
router.get('/sq/userHistoryDetails', function(req, res) {
    res.render('application/userHistoryDetails');
});

/* checkUser */
router.get('/sq/checkUser', function(req, res) {
    res.render('check/checkUser');
});
/* checkUserDetails */
router.get('/sq/checkUserDetails', function(req, res) {
    res.render('check/checkUserDetails');
});

/* checkApplyMsg */
router.get('/sq/checkApplyMsg', function(req, res) {
    res.render('check/checkApplyMsg');
});
/* checkApplyDetails */
router.get('/sq/checkApplyDetails', function(req, res) {
    res.render('check/checkApplyDetails');
});
/* oneList */
router.get('/sq/oneList', function(req, res) {
    res.render('check/oneList');
});

module.exports = router;