// ==UserScript==
// @name         Netmozi skipper
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  átirányítás
// @author       kinkat
// @match        https://mindjart.megnezed.com/?l=*
// @grant        none
// ==/UserScript==

(function() {

  //console.log(l);
  var searchableStr = document.URL + '&';

  var value1 = searchableStr.match(/[\?\&]l=([^\&\#]+)[\&\#]/i)[1];
    var replaced = value1.replace(/%3D/g,'=');
  var dec = window.atob(replaced);

  console.log(dec);

  window.location.replace(dec);
})();