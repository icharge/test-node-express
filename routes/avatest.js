/// <reference path="../typings/index.d.ts" />

const express = require('express');
const router = express.Router();
const encoding = require('encoding');

const avaLib = require('./ava-lib');
const cheerio = require('cheerio');
// var $ = cheerio.load('<div id="aa" class="bar"><p>abcdefg</p></div>');

const unirest = require('unirest');

var cookie = unirest.jar(true);
var headers = {
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': 0,
  'Content-type': 'text/html; charset=utf-8'
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

      var username = avaLib.getUsername($);

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
      res.status(200).send(`
      <h2>Logged in as ${avaLib.getUsername($)}</h2>
      `)
    });
});

router.get('/timesheet', function (req, res, next) {

  unirest.get(url.timesheet)
    .jar(cookie)
    .followRedirect(true)
    .end(function (response) {
      var $ = cheerio.load(encoding.convert(response.body, 'UTF-8', 'TIS620'), {
        normalizeWhitespace: false
      });

      var $timesheetTable = $('form[name=ToDoForm] table table table tr:has(.textlabeldate0)');
      var timesheetList = [];
      // console.log('Timesheet table : ', $timesheetTable);
      if ($timesheetTable && $timesheetTable.length) {
        $timesheetTable.each(function (i, row) {
          var $row = $(row);
          var $column = $row.find('td');

          timesheetList.push({
            id: $($column[0]).find('a').text(),
            name: $($column[1]).text(),
            weekOf: $($column[2]).text(),
            createDate: $($column[3]).text(),
            status: $($column[4]).text(),
            note: $($column[5]).text()
          });
        });
        // for (var i = 0; i < $timesheetTable.length; i++) {
        //   var row = $($timesheetTable[i]);
        //   var column = row.find('td');

        //   timesheetList.push({
        //     id: $(column[0]).find('a').text(),
        //     name: $(column[1]).text(),
        //     weekOf: $(column[2]).text(),
        //     createDate: $(column[3]).text(),
        //     status: $(column[4]).text(),
        //     note: $(column[5]).text()
        //   });

        // }
      }

      res.set(headers);
      res.status(200).send(`
      <h2>Saved Timesheet table</h2>
      <pre>${JSON.stringify(timesheetList, null, 2)}</pre>
      `);
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