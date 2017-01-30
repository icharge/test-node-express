/// <reference path="../typings/index.d.ts" />

const express = require('express');
const router = express.Router();

const cheerio = require('cheerio');
// var $ = cheerio.load('<div id="aa" class="bar"><p>abcdefg</p></div>');

const UniRest = require('unirest');
var Cookie = UniRest.jar(true); // Make future uses
const ResponseHeader = {
	'Cache-Control': 'no-cache',
	'Pragma': 'no-cache',
	'Expires': 0,
	'Content-type': 'text/html'
};

const Host = 'https://my.fbs.com';
const Url = {
	HOME: Host + '',
	LOGIN: Host + '/login',
	LOGOUT: Host + '/logout',
	PARTNER_COMMISSION: Host + '/partner/commission?period=mounth&page=1&ajax=table&pageSize=1000'
};

const Auth = {
	USER_NAME: 'Sarocha.dev@gmail.com',
	PASSWORD: 'abcd1234'
};

const UserAgent = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36';

module.exports = router;


function login(req, res, next) {
	UniRest.post(Url.LOGIN)
		.jar(Cookie)
		.headers({
			'Content-Type': 'application/x-www-form-urlencoded',
			'User-Agent': UserAgent
		})
		.send({
			'LoginForm[login]': Auth.USER_NAME,
			'LoginForm[password]': Auth.PASSWORD,
			yt0: 'Log in'
		})
		.end(function (response) {
			var $ = cheerio.load(response.body, {
				normalizeWhitespace: true
			});

			var username = $('.user-name').text();
			console.log(`Logged in as ${username}.`);


			res.set(ResponseHeader);
			res.status(200).send(`<h1>Logged in as ${username}`);
		});
}

function logout(req, res, next) {
	UniRest.get(Url.LOGOUT)
		.jar(Cookie)
		.followRedirect(true)
		.end(function (response) {
			var $ = cheerio.load(response.body, {
				normalizeWhitespace: false
			});

			console.log('Logged out.');

			res.set(ResponseHeader);
			res.status(200).send('<h2>Logged out</h2>');
		});
}

router.get('/', function (req, res, next) {
	UniRest.get(Url.HOME)
		.jar(Cookie)
		.followRedirect(true)
		.end((response) => {
			var $ = cheerio.load(response.body, {
				normalizeWhitespace: false
			});

			var $title = $('head title');
			if ($title.length) {
				console.log(`Landing page ${Url.HOME}`);
				console.log('Got title :', $title.text());
			}

			res.set(ResponseHeader);
			res.status(200).send(`Home page title : ${$title.text()}`);
		});

});

router.get('/login', function (req, res, next) {
	login(req, res, next);
});

router.get('/logout', function (req, res, next) {
	logout(req, res, next);
});


router.get('/commission', function (req, res, next) {
	UniRest.get(Url.PARTNER_COMMISSION)
		.jar(Cookie)
		.followRedirect(true)
		.end(function (response) {
			res.set(ResponseHeader);

			var $ = cheerio.load(response.body, {
				normalizeWhitespace: false
			});

			console.log('Get Commission partner...');
			// console.log('HTML', $.html());
			var $accountsFromTable = $('.scroll-block .table-def tbody tr td a');
			var accounts = [];

			if ($accountsFromTable && $accountsFromTable.length) {
				for (var i = 0; i < $accountsFromTable.length; i++) {
					accounts.push($($accountsFromTable[i]).text());
				}

				console.log(`Found accounts : `, accounts);
				res.status(200).send(`
				<p> Found accounts : </p>
				<ul>
					<li>${accounts.join('</li><li>')}</li>
				</ul>

				`);
			} else {
				console.log('Not found accounts.');
				res.status(404).send('<h2>Accounts not found</h2>');
			}
		});
});