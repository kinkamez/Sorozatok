// ==UserScript==
// @name         Sorozatbarat-addon
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.sorozatbarat.online/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
let jeles;
   var links=document.getElementsByTagName('a'), hrefs = [];
for (var i = 0; i<links.length; i++)
{
    hrefs.push(links[i].href);
}

const filterItems = (arr, query) => {
  return arr.filter(el => el.toLowerCase().indexOf(query.toLowerCase()) !== -1)
}
function getSecondPart(str) {
    return str.split('-')[1];
}
     jeles = window.location.href.split('#')[1];

let filer = document.URL.substring(document.URL.lastIndexOf('#') + 1);

//console.log(filterItems(hrefs, filer), "itt vagyok", jeles);

if(typeof jeles !== "undefined" && jeles !== "" )
{
     //alert("megyek");
     window.location.replace(filterItems(hrefs, filer));
  console.log( jeles ,"macska");
}
    else {
console.log( jeles ,"macska");
       //
    }

  console.log( jeles ,"macska");


})();