// ==UserScript==
// @encoding utf-8
// @name Test TypeScript
// @description Nothing else.
// @author HoJeong Go <seia@outlook.kr>
// @version 0
//
// @grant none
// @run-at document-start
//
// @match https://example.com/*
// ==/UserScript==

import isNumber from 'is-number';

console.log(
	isNumber('1')
		? 'success'
		: 'failure',
);
