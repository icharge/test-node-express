/// <reference path="../typings/index.d.ts" />

var express = require('express');
var router = express.Router();

var cheerio = require('cheerio');
// var $ = cheerio.load('<div id="aa" class="bar"><p>abcdefg</p></div>');

var unirest = require('unirest');
var cookie = unirest.jar();
var headers = {
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': 0,
  'Content-type': 'text/plain'
};

var host = 'http://portal.avalant.co.th/Avale_CRWeb';
var url = {
  'home': host + '/index.jsp',
  'frontctrl': host + '/FrontController',
  'logout': host + '/FrontController?action=LogOutCR',
  'timesheet': host + '/FrontController?action=Menu_Show&handleForm=N&menuSequence=4'
};

router.get('/', function (req, res, next) {
  unirest.get(url.home)
    .jar(cookie)
    .followRedirect(true)
    .end(function (response) {
      var $ = cheerio.load(response.body, {
        normalizeWhitespace: false
      });

      var username = '';
      var $topMenu = $('form[name="topMenu"] table tr td font.bkbold');
      if ($topMenu.length) {
        username = $topMenu[0].children[0].data;
        username = String.prototype.trim.call(username);
        username = username.substring(username.indexOf(':') + 1, username.length).trim();
      }
      
      console.log('Username :', username);

      res.set(headers);
      res.send(200, $.html());
    });

});

router.get('/login', function (req, res, next) {

  unirest.post(url.frontctrl)
    .jar(cookie)
    .headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    })
    .send({
      action: 'XenozUserLogin',
      handleForm: 'N',
      userName: 'norrapat',
      password: 'password',
    })
    .end(function (response) {
      var $ = cheerio.load(response.body, {
        normalizeWhitespace: false
      });

      res.set(headers);
      res.send(200, $.html());
    });
});

router.get('/logout', function (req, res, next) {
  unirest.get(url.logout)
    .jar(cookie)
    .followRedirect(true)
    .end(function (response) {
      var $ = cheerio.load(response.body, {
        normalizeWhitespace: false
      });

      res.set(headers);
      res.send(200, $.html());
    });
});

module.exports = router;