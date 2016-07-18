/*
** cookies.js
**   Functions for retrieving/setting cookies.
**   Johnny Cuervo <cuervo@digits.zerokarma.sleepers.net>
**
**   This code is public domain! :-)
**   (Caution: overdose of word "cookie"...)
**
**   http://web.zerokarma.sleepers.net/~cuervo/js/
*/

var RCSID=new Array();RCSID["cookies.js"]='$Id: cookies.js,v 1.1 2002/12/10 16:00:14 cuervo Exp cuervo $';var cookieBase64Magic=new String();cookieBase64Magic='$B64$';var Cookies=new Array();Cookies=[];var CookiesInitialized=new String();CookiesInitialized=false;function getCookie(name,raw)
{var allCookies=new String();var acookies=new Array();var ac=new Array();var v=new String();var i,sc;if(CookiesInitialized&&document.cookies!=CookiesInitialized)
{CookiesInitialized=false;}
if(!document.cookie)
{return false;}
else
if(!CookiesInitialized)
{allCookies=document.cookie;acookies=allCookies.split("; ");for(i=0;i!=acookies.length;i++)
{ac=acookies[i].split("=");if(!ac[1])
v=true;else
{v=ac[1].substr(0,(sc=ac[1].indexOf(";"))!=-1?sc:ac[1].length);if((!raw)&&v.substr(0,cookieBase64Magic.length)==cookieBase64Magic)
{v=atob(v.substr(cookieBase64Magic.length));}}
Cookies[ac[0]]=v;}
CookiesInitialized=document.cookie;}
if(!Cookies[name])
{return false;}
else
if(Cookies[name]&&Cookies[name].length&&Cookies[name].substr(0,cookieBase64Magic.length)==cookieBase64Magic)
{return(raw?Cookies[name]:atob(Cookies[name].substr(cookieBase64Magic.length)));}
else
{return Cookies[name];}
alert("NOT REACHED");return false;}
function b64_cookie(s)
{var str=new String(s);return str.substr(0,cookieBase64Magic.length)==cookieBase64Magic;}
function setCookie(name,value,properties,encode)
{var cVal=new String();if(encode)
{encode=false;}
if(encode)
{cVal=cookieBase64Magic+""+btoa(value);}
else
{cVal=value;}
document.cookie=name+'='+cVal+
(properties?("; "+properties):"");return getCookie(name);}
function unsetCookie(name)
{setCookie(name,'deleted','expires=Fri, 02-Jan-1970 00:00:00 GMT;',0);getCookie(name);}