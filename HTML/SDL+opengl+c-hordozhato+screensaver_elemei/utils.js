/*

	Common javascript utils
	
	Copyright (C) 2008 by DevWorx, Inc. All rights reserved.

*/

function getCssClass(element)
{if(isBrowserIE())
return element.className;else
if(element.getAttribute)
{var cn=element.getAttribute('class');if(!cn)cn='';return cn;}
else
return'';}
function setCssClass(element,value)
{if(document.all)
element.className=value;else
element.setAttribute('class',value);}
function addCssClass(element,cssclass)
{var cn=getCssClass(element);if(cn==cssclass)return;if(cn.indexOf(' '+cssclass)>=0)return;if(cn!='')cn=cn+' ';cn=cn+cssclass;setCssClass(element,cn);}
function removeCssClass(element,cssclass)
{var cn=getCssClass(element);if(cn==cssclass)
setCssClass(element,'');else
{i=cn.indexOf(' '+cssclass);if(i>=0)
setCssClass(element,cn.substr(0,i)+cn.substr(i+cssclass.length+1));else
{i=cn.indexOf(cssclass+' ');if(i>=0)
setCssClass(element,cn.substr(0,i)+cn.substr(i+cssclass.length+1));}}}
function calculatePixel(value,base)
{if(typeof value=='undefined')return 0;else
if(typeof value!='string')return value;else
if(value.substr(value.length-2).toLowerCase()=='px')return parseInt(value.substr(0,value.length-2));else
if(value.substr(value.length-1)=='%')return(parseFloat(value.substr(0,value.length-1))/100*base);else
throw'"'+base+'" is not a valid base for calculatePixel()';}
function trimString(s)
{return s.replace(/^\s\s*/,'').replace(/\s\s*$/,'');}
function getStyle(className,returnObject,returnFileToo)
{if(typeof className=="string")className=[className];var attrs='';for(var i=0;i<document.styleSheets.length;i++)
{try
{var classes=(document.styleSheets[i].rules||document.styleSheets[i].cssRules);}
catch(e)
{var classes=new Array();}
if(classes)
for(var x=0;x<classes.length;x++)
{var def=(classes[x].cssText||classes[x].style.cssText).toLowerCase().replace('\n','');for(var y=0;y<className.length;y++)
{var match=/^([^\{]*)/.exec(def);if(match)
if(trimString(match[0].replace(/([,])/,''))==className[y])
{if(returnObject)
{if(returnFileToo)
{var r={file:document.styleSheets[i],rule:classes[x].style};return r;}
else
return classes[x].style;}
else
{def=trimString(def.replace(/[^\{]*[\{]([^\}]*)[\}]/,"$1"));if(def=='')continue;if(attrs!='')attrs=attrs+';';attrs=attrs+def;}}}}}
return attrs;}
function getUrlHostPart(url)
{var mark=url.indexOf('://');if(mark==-1)return'';var p=url.indexOf('/',mark+3);if(p==-1)p=url.length;return url.substr(0,p);}
function getUrlPathPart(url)
{var hostPart=getUrlHostPart(url);var p=url.indexOf('?',hostPart.length);if(p==-1)p=url.indexOf('#',hostPart.length);if(p==-1)p=url.length+1;return url.substr(hostPart.length,p-hostPart.length);}
function getUrlDirPart(url)
{var path=getUrlPathPart(url);var p=path.lastIndexOf('/');if(p==-1)
return'';else
return path.substr(0,p+1);}
function combineUrls(url,baseUri)
{if(!baseUri)baseUri=window.location;if(url.indexOf('://')==-1)
{if(url.substr(0,1)=='/')
url=getUrlHostPart(baseUri)+url;else
if(url.substr(0,1)=='?')
url=getUrlHostPart(url)+getUrlPathPart(url)+url;else
url=getUrlDirPart(baseUri)+url;}
return url;}
function isCssClass(element,cssclass)
{var cn=getCssClass(element);if(!cn)return false;if(cn==cssclass)
return true;else
if(typeof cn.indexOf!='undefined')
if((' '+cn+' ').indexOf(' '+cssclass+' ')!=-1)
return true;return false;}
function intersectRect(r1,r2)
{var left=Math.max(r1.left,r2.left);var right=Math.min(r1.right,r2.right);var top=Math.max(r1.top,r2.top);var bottom=Math.min(r1.bottom,r2.bottom);if((left>right)||(top>bottom))
return null;else
return rectangle(left,top,right,bottom);}
function rectangle(aleft,atop,aright,abottom)
{return{left:aleft,top:atop,right:aright,bottom:abottom};}
function getElementAbsPos(obj)
{if($===jQuery)
return $(obj).offset();else
return $(obj).cumulativeOffset();}
function setElementScrollPos(obj,pos)
{pos=[formatPos(pos[0]),formatPos(pos[1])];obj.style.left=pos[0];obj.style.top=pos[1];}
function formatPos(pos)
{var s=pos.toString();if(s!='')
if(s.substr(s.length-1,1)!='%')
s=s+'px';if(s!=pos.toString())
return s;else
return pos;}
function getElementScrollPos(obj)
{if(typeof obj=="string")obj=document.getElementById(obj);return[obj.offsetLeft,obj.offsetTop];}
function getElementSize(obj)
{if(typeof obj=="string")obj=document.getElementById(obj);if((obj.clientWidth!='')||(obj.clientHeight!=''))
return[trimpx(obj.clientWidth),trimpx(obj.clientHeight)];else
return[obj.offsetWidth,obj.offsetHeight];}
function getElementBounds(obj)
{var pos=getElementAbsPos(obj);var size=getElementSize(obj);return rectangle(pos.left,pos.top,pos.left+size[0],pos.top+size[1]);}
function getElementWindowBounds(obj)
{var bounds=getElementBounds(obj);if(getCurrentStyle(obj).position!="fixed")
{var ofs=obj.cumulativeScrollOffset();bounds=rectangle(bounds.left-ofs.left,bounds.top-ofs.top,bounds.right-ofs.left,bounds.bottom-ofs.top);}
return bounds;}
function trimpx(s)
{s=s.toString();if(s.substr(s.length-2)=='px')
s=s.substr(0,s.length-2);return parseInt(s.toString());}
function getElementFontSizeInPx(element)
{var cs=getCurrentStyle(element);var metric=cs.fontSize.toString();if(metric.substr(metric.length-1)=='%')
{var percent=metric.substr(0,metric.length-1);metric=getElementFontSizeInPx(element.parentElement)*(percent/100);}
else
if(metric.substr(metric.length-2)=='px')
metric=metric.substr(0,metric.length-2);metric=Number(metric);return metric;}
function calcPx(metric,element,totalSize)
{metric=metric.toString().trim();if(metric=='')
return 0;if(metric.substr(metric.length-2)=='em')
{var em=Number(metric.substr(0,metric.length-2));var fs=getElementFontSizeInPx(element);return Math.floor(fs*em);}
if(metric.substr(metric.length-1)=='%')
{var perc=Number(metric.substr(0,metric.length-1));return Math.floor(totalSize*1.0*(perc*1.0/100));}
if(metric.substr(metric.length-2)=='px')
return parseInt(metric.substr(0,metric.length-2),10);else
return parseInt(metric,10);}
function calcPxH(metric,element)
{return calcPx(metric,element,getElementSize(element)[0]);}
function calcPxV(metric,element)
{return calcPx(metric,element,getElementSize(element)[1]);}
function getCurrentStyle(element)
{if(typeof element.currentStyle=='undefined')
return window.getComputedStyle(element,null);else
return element.currentStyle;}
function getParentTag(element,tagname)
{var res=null;var done=false;var e=element;do
{e=e.parentElement;if(!e)break;if(e.tagName.toLowerCase()==tagname.toString().toLowerCase())
{res=e;break;}}
while(e);return res;}
function getElementsByClassName(cssclass,parent)
{if(!parent)parent=window.document;var results=[];var allElements=parent.getElementsByTagName("*");var element=null;for(var i=0;(element=allElements[i])!=null;i++)
{if(isCssClass(element,cssclass))
results.push(element);}
return results;}
function getElementByClassName(cssclass,parent)
{var elements=getElementsByClassName(cssclass,parent);if(!elements)return null;if(elements.length==0)return null;return elements[0];}
function isBrowserIE()
{return(window.navigator.userAgent.indexOf('MSIE')>0);}
function addBrowserWebSlice(url,title)
{if(canAddBrowserWebSlice())
return window.external.addToFavoritesBar(url,title,'slice');else
alert('Sajnos a böngészõd nem támogatja ezt a funkciót');}
function canAddBrowserWebSlice()
{return isBrowserIE();}
function addBrowserFavorite(url,title)
{if(isBrowserIE())
{if(window.external.addFavoritesBar)
return window.external.addFavoritesBar(url,title);else
return window.external.addFavorite(url,title);}
else
if(window.opera&&window.print)
{if(window.event.target.tagName=='A')
{var elem=window.event.target;elem.setAttribute('href',url);elem.setAttribute('title',title);elem.setAttribute('rel','sidebar');elem.click();return true;}}
else
if(window.sidebar)
return window.sidebar.addPanel(title,url,'');alert('Sajnos kézzel kell felvenned a lapot a kedvencek közé, mert a böngészõd nem támogatja ezt a funkciót');return false;}
function canAddBrowserFavorite()
{if(isBrowserIE())return true;if(window.sidebar)return true;if(window.opera&&window.print)return true;return false;}
function getPageScrollPos()
{return[(document.documentElement.scrollLeft?document.documentElement.scrollLeft:document.body.scrollLeft),(document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop)];}
function flashElement(element,afterFinishProc)
{var afterafterFinishProc=function(){removeCssClass(element,'pulsating');if(afterFinishProc)afterFinishProc();};addCssClass(element,'pulsating');if(isCssClass(element,'pulsate'))
{new Effect.Opacity(element,{from:0,to:0.9,duration:0.2,queue:'end'});new Effect.Opacity(element,{from:1.0,to:0,duration:0.5,delay:0.5,afterFinish:afterafterFinishProc,queue:'end'});}
else
{new Effect.Opacity(element,{from:1.0,to:0,duration:0.5,queue:'end'});new Effect.Opacity(element,{from:0,to:1.0,duration:0.2,afterFinish:afterafterFinishProc,queue:'end'});}}
function scrollToElement(element,proximity,flashit,afterScroll)
{if(!Effect)return false;if(typeof(flashit)=='undefined')flashit=true;element=$(element);if(proximity=='middle')proximity=Math.round(document.documentElement.clientHeight/2);else
if(proximity=='golden')proximity=Math.round(document.documentElement.clientHeight/4);else
if(!proximity)proximity=10;var oldpos=getPageScrollPos()[1];var pulsateElement=getElementByClassName('pulsate',element);if(!pulsateElement)pulsateElement=element;var b=document.body;addCssClass(b,'scrolling');element.addClassName('scrollingto');Effect.ScrollTo(element,{duration:'0.5',offset:-proximity,afterFinish:function(){if(flashit)
flashElement(pulsateElement,function(){removeCssClass(b,'scrolling');if(afterScroll)afterScroll(element);});else
{removeCssClass(b,'scrolling');if(afterScroll)afterScroll(element);}
element.removeClassName('scrollingto');}});return true;}
function morphTo(elementid,params)
{var queuename=elementid+'_queue';var queue=Effect.Queues.get(queuename);if(queue)queue.invoke('cancel');params['queue']={scope:queuename};return new Effect.Morph(elementid,params);}
function bindClipboardCopy(id,text,name)
{if(typeof(DxJavaScriptUtilsBase)!='undefined')
if(DxJavaScriptUtilsBase!='')
{ZeroClipboard.setMoviePath(DxJavaScriptUtilsBase+'/ZeroClipboard.swf');var clip=new ZeroClipboard.Client();clip.setText(text);clip.glue(id);}}
function publishToClipboard(text,name,checkerror)
{var published=false;if(window.clipboardData&&clipboardData.setData)
if(clipboardData.setData('Text',text))
published=true;if(!published)
{if(prompt('A böngészõd nem engedi a '+name+' automatikus másolását a vágólapra, de te az alábbi mezõbõl át tudod vinni oda:',text));return true;}
if(name!='')
if(published)
alert('A '+name+' a vágólapra lett másolva.');else
if(checkerror)
alert('A '+name+' a vágólapra másolása NEM sikerült, mert valószínûleg a böngészõd biztonsági beállításai nem engedik.');return published;}
function getQueryParam(paramName,queryString)
{var paramValue=null;if(!queryString)queryString=window.location.href;var paramName=paramName+'=';if(queryString.length>0)
{var startp=queryString.indexOf('?'+paramName);if(startp==-1)startp=queryString.indexOf('&'+paramName);if(startp!=-1)
{startp+=paramName.length+1;var endp=queryString.indexOf('&',startp);if(endp==-1)endp=queryString.length;paramValue=unescape(queryString.substring(startp,endp));}}
return paramValue;}
function getWindowSize()
{var winW=630,winH=460;if(document.body&&document.body.offsetWidth){winW=document.body.offsetWidth;winH=document.body.offsetHeight;}
if(document.compatMode=='CSS1Compat'&&document.documentElement&&document.documentElement.offsetWidth){winW=document.documentElement.offsetWidth;winH=document.documentElement.offsetHeight;}
if(window.innerWidth&&window.innerHeight){winW=window.innerWidth;winH=window.innerHeight;}
return[winW,winH];}
function isParentOf(parent,element)
{if(!parent)return false;while(element)
{if(typeof element.parentNode=='undefined')return null;if(element.parentNode===parent)
return true;element=element.parentNode;}
return false;}
function docCreateText(s,document)
{if(!document)document=window.document;return node=document.createTextNode(s);var node=document.createElement("span");node.innerHTML=String(s);return node;}
function docCreateElement(tagName,attrs,subElements,document)
{if(!document)document=window.document;if(attrs)
{var attrNames=new Array(attrs.length);var attrValues=new Array(attrs.length);for(var i=0;i<attrs.length;i++)
{var s=attrs[i];var p=s.indexOf('=');if(p==0)p=s.length;var attrName=s.substr(0,p);var attrValue=s.substr(p+1);attrNames[i]=attrName;attrValues[i]=attrValue;}}
var element=document.createElement(tagName);if(attrs)
for(var i=0;i<attrs.length;i++)
{if(attrNames[i].substr(0,2)=='on')
eval('element.'+attrNames[i]+' = new Function(\''+attrValues[i].replace(/\'/g,'\\\'')+'\')');else
element.setAttribute(attrNames[i],attrValues[i]);}
if(subElements)
for(var i=0;i<subElements.length;i++)
element.appendChild(subElements[i]);return element;}
function matchesMask(str,mask)
{mask=RegExp.escape(mask);mask=mask.replace('\\?','.');mask=mask.replace('\\*','.*');var reg=new RegExp('^'+mask+'$');return reg.test(str);}
function cancelEvent(e)
{if((typeof window.event!="undefined")&&window.event)e=window.event;e.cancelBubble=true;e.returnValue=false;if(typeof e.preventDefault!="undefined")e.preventDefault();return false;}
function isTouchDevice()
{if('ontouchstart'in window)return true;if('ontouchend'in document)return true;try{document.createEvent("TouchEvent");return true;}catch(e){};if(typeof TouchEvent!="undefined")return true;if('createTouch'in document)return true;if(typeof Touch=="object")return true;if(navigator.userAgent.toLowerCase().match(/(webos)/))return true;return false;}
function copyAttrs(srcElement,destElement,attrList)
{var srcStyle=getCurrentStyle(srcElement);var masks=$A();attrList=$A(attrList);attrList.each(function(attrName)
{if(attrName.indexOf('*')==-1)
destElement.style[attrName]=srcStyle[attrName];else
masks.push(attrName);});if(masks.length>0)
{var attrName;for(attrName in srcStyle)
if(typeof srcStyle[attrName]!='object')
{for(var i=0;i<masks.length;i++)
if(matchesMask(attrName,masks[i]))
{destElement.style[attrName]=srcStyle[attrName];break;}}}}
function objToString(obj,maxlevel,level)
{if(obj===null)return'null';if(!maxlevel)maxlevel=10;if(level>maxlevel)return'!!! toodeep !!!';var indent='    ';var baseindent='';for(var i=0;i<level;i++)
baseindent+=indent;if(!level)level=0;var str=obj.toString()+' {';for(var p in obj){if(obj.hasOwnProperty(p))
{str+='\n'+baseindent+indent;str+=p+' = ';if(typeof obj[p]=='object')
str+=objToString(obj[p],maxlevel,level+1);else
str+=obj[p];}}
str+='\n'+baseindent+'}';return str;}
function getAjaxParams()
{var params=$H();var query=window.location.hash;if(query.substr(0,2)=='#!')
{query=query.substr(2);var vars=query.split('&');for(var i=0;i<vars.length;i++)
{var pair=vars[i].split('=');params.set(decodeURIComponent(pair[0]),decodeURIComponent(pair[1]));}}
return params;}
function getAjaxParam(name,defValue)
{var value=defValue;var params=getAjaxParams();for(var i=0;i<params.length;i++)
if(params[i].name==name)
{value=params[i].value;break;}
return value;}
function constructAjaxHash(params)
{if(!params||(params.length==0))return'';return'#!'+$H(params).toQueryString();}
if(typeof $PR=='undefined')
$PR=function(id){return Prado.Registry.get(id)};if(!String.prototype.trim)
String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,'');};if(typeof Element!="undefined")
if(typeof Element.prototype.innerText=="undefined")
Object.defineProperty(Element.prototype,"innerText",{get:function(){return this.textContent;}});(function(){if(typeof Event=='undefined')return;var eventMatchers={'HTMLEvents':/^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,'MouseEvents':/^(?:click|mouse(?:down|up|over|move|out))$/}
var defaultOptions={pointerX:0,pointerY:0,button:0,ctrlKey:false,altKey:false,shiftKey:false,metaKey:false,bubbles:true,cancelable:true}
Event.simulate=function(element,eventName){var options=Object.extend(Object.clone(defaultOptions),arguments[2]||{});var oEvent,eventType=null;element=$(element);for(var name in eventMatchers){if(eventMatchers[name].test(eventName)){eventType=name;break;}}
if(!eventType)
throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');if(document.createEvent){oEvent=document.createEvent(eventType);if(eventType=='HTMLEvents'){oEvent.initEvent(eventName,options.bubbles,options.cancelable);}
else{oEvent.initMouseEvent(eventName,options.bubbles,options.cancelable,document.defaultView,options.button,options.pointerX,options.pointerY,options.pointerX,options.pointerY,options.ctrlKey,options.altKey,options.shiftKey,options.metaKey,options.button,element);}
element.dispatchEvent(oEvent);}
else{options.clientX=options.pointerX;options.clientY=options.pointerY;oEvent=Object.extend(document.createEventObject(),options);element.fireEvent('on'+eventName,oEvent);}
return element;}
if(typeof Element!='undefined')
if(typeof Element.simulate=='undefined')
if(typeof Element.addMethods!='undefined')
Element.addMethods({simulate:Event.simulate});})();var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(input){var output="";var chr1,chr2,chr3,enc1,enc2,enc3,enc4;var i=0;input=Base64._utf8_encode(input);while(i<input.length){chr1=input.charCodeAt(i++);chr2=input.charCodeAt(i++);chr3=input.charCodeAt(i++);enc1=chr1>>2;enc2=((chr1&3)<<4)|(chr2>>4);enc3=((chr2&15)<<2)|(chr3>>6);enc4=chr3&63;if(isNaN(chr2)){enc3=enc4=64;}else if(isNaN(chr3)){enc4=64;}
output=output+
this._keyStr.charAt(enc1)+this._keyStr.charAt(enc2)+
this._keyStr.charAt(enc3)+this._keyStr.charAt(enc4);}
return output;},decode:function(input){var output="";var chr1,chr2,chr3;var enc1,enc2,enc3,enc4;var i=0;input=input.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(i<input.length){enc1=this._keyStr.indexOf(input.charAt(i++));enc2=this._keyStr.indexOf(input.charAt(i++));enc3=this._keyStr.indexOf(input.charAt(i++));enc4=this._keyStr.indexOf(input.charAt(i++));chr1=(enc1<<2)|(enc2>>4);chr2=((enc2&15)<<4)|(enc3>>2);chr3=((enc3&3)<<6)|enc4;output=output+String.fromCharCode(chr1);if(enc3!=64){output=output+String.fromCharCode(chr2);}
if(enc4!=64){output=output+String.fromCharCode(chr3);}}
output=Base64._utf8_decode(output);return output;},_utf8_encode:function(string){string=string.replace(/\r\n/g,"\n");var utftext="";for(var n=0;n<string.length;n++){var c=string.charCodeAt(n);if(c<128){utftext+=String.fromCharCode(c);}
else if((c>127)&&(c<2048)){utftext+=String.fromCharCode((c>>6)|192);utftext+=String.fromCharCode((c&63)|128);}
else{utftext+=String.fromCharCode((c>>12)|224);utftext+=String.fromCharCode(((c>>6)&63)|128);utftext+=String.fromCharCode((c&63)|128);}}
return utftext;},_utf8_decode:function(utftext){var string="";var i=0;var c=c1=c2=0;while(i<utftext.length){c=utftext.charCodeAt(i);if(c<128){string+=String.fromCharCode(c);i++;}
else if((c>191)&&(c<224)){c2=utftext.charCodeAt(i+1);string+=String.fromCharCode(((c&31)<<6)|(c2&63));i+=2;}
else{c2=utftext.charCodeAt(i+1);c3=utftext.charCodeAt(i+2);string+=String.fromCharCode(((c&15)<<12)|((c2&63)<<6)|(c3&63));i+=3;}}
return string;}}