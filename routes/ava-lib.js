/**
 * Ava library functions
 */

exports.getUsername = function ($) {
	var username = '';
	var $topMenu = $('form[name="topMenu"] table tr td font.bkbold');
	if ($topMenu.length) {
		username = $topMenu[0].children[0].data;
		username = String.prototype.trim.call(username);
		username = username.substring(username.indexOf(':') + 1, username.length).trim();
	}

	return username;
}

