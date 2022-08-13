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

export interface ISample {
  b: string
}

const a: ISample = {
	b: 'test-typescript',
};

console.log(a.b);
