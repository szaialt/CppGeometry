/*

	Site engine page scripts

	Copyright (C) 2013-2014 by DevWorx, Hungary. All rights reserved.
	
*/

var pageJS;(function()
{pageJS=new(jQuery.klass({init:function(params)
{this.DOMReady=false;this.APIURL='/api/v1/';this.IsDev=($('meta[name=X-Dev]').length>0);this.LocalStorageDataIdPrefix=(this.IsDev?'_______xx':'');this.LocalStorageExtendedDataPrefix='**[ext]***:';this.CookieDomain=document.location.hostname.replace(/[\.\s]*$/,'').split('.').slice(-2).join('.');this.FontSizes=$(['tiny','small','medium','big','large']);this.AdaptiveImages=[];this.AutoSaveRestored=false;this.ScriptsToLoad=[];this.ScriptsLoading=[];this.ScriptLoadedHooks=[];this.FullUrlCache=[];this.HeartBeatScheduled=false;$(document).ready(this.documentReady.bind(this));if(window.localStorage)
this.setInterval(this.localStorageMaintenance.bind(this),60*1000);},log:function(s)
{if(typeof console!='undefined')
if(typeof console.log!='undefined')
console.log(s);},setInterval:function(call,delay,randomrange)
{if(randomrange)delay=delay+Math.floor(Math.random()*randomrange);window.setTimeout(function(){call();this.setInterval(call,delay);}.bind(this),delay);},bodyReady:function()
{var body=$(document.body);body.addClass("scripted");this.applyFontSize(this.getCookie('fontsize'));if(body.hasClass("adaptivesupported"))
if(Modernizr.mq("screen and (max-width: 1234567px)"))
body.addClass("adaptive");body.addClass(Modernizr.touch?"touch":"notouch");body.addClass(Modernizr.backgroundsize?"backgroundsize":"nobackgroundsize");this.processVisibilityTriggerMarkers();},documentReady:function()
{if(this.DOMReady)return;this.DOMReady=true;if(typeof currentUserName!='undefined')
this.currentUserName=currentUserName;else
this.currentUserName=null;if(this.currentUserName)
this.setInterval(this.sendHeartBeat.bind(this),2*60*1000,30*1000);if(false)
if(this.IsDev)
setTimeout(this.sendHeartBeat.bind(this),3000);setTimeout(this.processAdZoneMarkers.bind(this),10);this.processMarkers();this.windowSizeChanged(true);this.windowSizeChanged();window.setTimeout(this.windowSizeChanged.bind(this),10);var midcol=$('#mainmidcol')[0];if(midcol)
{$('.kbaseentry.modermsg').each(function(idx,e){this.forumEntryInitModer(e);}.bind(this));$('.forumentry.modermsg').each(function(idx,e){this.forumEntryInitModer(e);}.bind(this));}
$(window).resize(this.windowSizeChanged.bind(this));$(window).on('orientationchange',this.windowSizeChanged.bind(this));$(window).on('scroll',this.windowScrolled.bind(this));this.installControlHooks();this.updateWindowSize();setTimeout(this.checkScriptLoads.bind(this),50);$(document.body).addClass('loaded');if(this.AutoSaveRestored)
setTimeout(function()
{alert('Egy vagy több szerkesztõmezõben visszaállítottuk a korábban nem mentett adatokat. '+'Ha ezekre már nincs szükséged vagy helyettük mást akarsz felvinni, nyugodtan töröld ki õket!');},50);},installControlHooks:function()
{var hb=$('.pageheader');if(hb.length>0)
{var ctrls=hb.find('input[type=text],input[type=password],input[type=email],*[type=submit],button');ctrls.on('focus',this.formControlFocus.bind(this));ctrls.on('click',this.formControlFocus.bind(this));ctrls.on('blur',this.formControlBlur.bind(this));}
var ll=$('#pageloginlink');if(ll.length>0)
ll.on('click',function(e){cancelEvent(e);$('#pagelogin').find('[name=email]').focus();});var fsc=$('#fontsizecontroller');if(fsc.length>0)
{fsc.find('.decrease').on('click',this.changeFontSize.bind(this,-1));fsc.find('.reset').on('click',this.changeFontSize.bind(this,null));fsc.find('.increase').on('click',this.changeFontSize.bind(this,+1));}
var loginform=$('#pagelogin');if(loginform.length>0)
loginform.on('submit',this.formLoginSubmit.bind(this));},updateWindowSize:function()
{if(!$(window.document.body).hasClass('popup'))return;var bottom=$('#pagebottom')[0];if(!bottom)return;var docHeight=Math.round($(bottom).offset().top);docHeight+=getElementFontSizeInPx(window.document.body);var screenHeight=Math.floor(screen.height-Math.min(screen.height*0.9,60));var wndHeight=Math.min(docHeight+(window.outerHeight-window.innerHeight),screenHeight);window.resizeTo(window.outerWidth,wndHeight);window.moveTo(Math.floor((screen.width-window.innerWidth)/2),Math.floor((screen.height-wndHeight)/3));},htmlToText:function(s)
{s=s.replace(/<script\s*[^\>]*>\.*?<\/script\s*>/gim,'');var e=document.createElement('div');$(e).html(s);return $(e).text();},processAutoCompleteMarkers:function()
{var controls=$('input[data-autocompletemethod][data-autocompletetarget]');if(controls.length==0)return;this.loadScript('/common/js/jquery.autocomplete.js',function(){controls.each(function(idx,e){var ee=$(e);var method=ee.attr('data-autocompletemethod');if(!method)return;ee.attr('data-autocompletemethod',null);ee.autocomplete({serviceUrl:this.APIURL,type:'POST',params:this.getStdApiParams(method),paramName:'text',minChars:3,ajaxBegin:function(jqHXR,settings)
{ee.addClass('inautocompletequery');},ajaxComplete:function(jqHXR,textStatus)
{ee.removeClass('inautocompletequery');},transformResult:function(result)
{var r=$.parseJSON(result);var suggestions=[];$.each(r.rsp.suggestions,function(idx,e){suggestions.push({data:e,value:this.htmlToText(e)});}.bind(this));return{suggestions:suggestions};}.bind(this),formatResult:function(suggestion,value)
{return suggestion.data;}});}.bind(this));}.bind(this));},processHideMarkers:function()
{$('[data-hideid]').each(function(idx,e){var ee=$(e);if(ee.hasClass('scripted'))return;var close=ee.find('.close');if(close)
{(function(cookieid,ee)
{if(this.getCookie(cookieid))
ee.addClass('hidden');else
{close.on('click',function(e){cancelEvent(e);this.setCookie(cookieid,'closed');ee.addClass('hidden');}.bind(this));ee.addClass('scripted');}}.bind(this))('hidden-'+ee.attr('data-hideid'),ee);}},this);},processExpandableControlMarkers:function()
{$('.expandable-control[data-maxheight]').each(function(idx,e){var ee=$(e);if(!ee.attr('data-expandinited'))
{var content=ee.find('.fullcontent')[0];if(!content)
{ee.html('<div class="fullcontent">'+ee.html()+'</div>'+'<div class="expander"><font>Mutass többet!</font></div>');ee.addClass('expanded');content=ee.find('.fullcontent')[0];}
var mh=ee.attr('data-maxheight');if(mh&&mh.endsWith('sh'))
var maxHeight=Math.round(parseFloat(mh)*$(window).height());else
if(mh&&mh.endsWith('sw'))
var maxHeight=Math.round(parseFloat(mh)*$(window).width());else
var maxHeight=calcPx(mh,content);if(maxHeight<10)return;if($(content).height()>maxHeight)
{e.style.maxHeight=maxHeight+'px';ee.removeClass('expanded');}
ee.find('.expander').on('click',this.expanderClicked.bind(this,e));ee.attr('data-expandinited',1);}}.bind(this));},processSmoothScrollMarkers:function()
{$('a[href][data-smoothscroll]').each(function(idx,e){$(e).on('click',this.smoothScrollLinkClicked.bind(this));$(e).attr('data-smoothscroll',null);}.bind(this));},processPopupMarkers:function()
{$('a[href][data-pop]').each(function(idx,e){var ee=$(e);ee.on('click',this.popupLinkClicked.bind(this));ee.attr('data-pop',null);e.href=e.href.replace(/[\?\&]pop=1/,'');}.bind(this));},processEncodedHRefs:function()
{$('a[href=#][data-href]').each(function(idx,e){var ee=$(e);e.href=Base64.decode(ee.attr('data-href'));ee.removeAttr('data-href');}.bind(this));},processVisibilityTriggerMarkers:function()
{$('[data-visiblecontent]').each(function(idx,e){var ee=$(e);if(this.isControlVisible(e))
{var content=ee.attr('data-visiblecontent');if(content)content=Base64.decode(content);ee.removeAttr('data-visiblecontent');ee.replaceWith(content);ee.removeClass('notvisibleyet');}
else
ee.addClass('notvisibleyet');}.bind(this));},updateElement:function(element,s,context,inlineLoadedScripts)
{if(!inlineLoadedScripts)inlineLoadedScripts=[];if(!context)context=element;$(element).html(s.stripScripts());var re='<script(\\s+[^>]*|)>\\s*<\\/script>';s.match(new RegExp(re,'gim')).each(function(idx,match){match=match.strip();var inner=match.match(new RegExp(re,'im'));if(inner)
{inner=inner[1].strip()+' ';var attrs=$();var attrre='([\\w\\-\\_]+)(?:\\s*\\=\\s*(?:\\"([^\\"]+)\\"|\\\'([^\\\']+)\\\')|([^\\s]+))\\s+';$.each(inner.match(new RegExp(attrre,'gim')),function(idx,attr){var am=attr.match(new RegExp(attrre,'im'));v=(am[2]!==undefined?am[2]:(am[3]!==undefined?am[3]:(am[4]!==undefined?am[4]:undefined)));if(typeof v=='undefined')
v=true;attrs.set(am[1],v);}.bind(this));var async=false;if(attrs.get('async'))async=true;var src=attrs.get('src');var js=document.createElement('script');js.async=async;js.type='text/javascript';js.src=src;js.inlineLoadedScripts=[];if(!js.async)
{js.onreadystatechange=function(js){if((js.readyState=='loaded')||(js.readyState=='complete'))
if(js.onload)
js.onload();}.bind(this,js);js.onload=function(context){this.ScriptLoadedHooks.each(function(hook){hook(js.src);}.bind(this));document.write=function(s){this.inplaceWriter(context,s,js.inlineLoadedScripts);}.bind(this);}.bind(this,context);}
this.captureWrite(function(){context.appendChild(js);}.bind(this),function(s){this.inplaceWriter(context,s,js.inlineLoadedScripts);}.bind(this));inlineLoadedScripts.push(js);}},this);this.captureWrite(function(){s.evalScripts();}.bind(this),function(s){this.inplaceWriter(context,s,inlineLoadedScripts);}.bind(this));return inlineLoadedScripts;},inplaceWriter:function(e,s,inlineLoadedScripts)
{if(!inlineLoadedScripts)inlineLoadedScripts=[];this.captureWrite(function(){var ee=$(e);var ne=document.createElement('span');e.appendChild(ne);this.updateElement(ne,s,null,inlineLoadedScripts);}.bind(this),function(s){this.inplaceWriter(e,s,inlineLoadedScripts);}.bind(this));},processOpenXMarkers:function(onFinish)
{var zoneclass='zone';var zoneidprefix='zone-';var e=$('meta[name=openx]');if(e.length==0)
{$('div.'+zoneclass+'[id^='+zoneidprefix+']').each(function(idx,e){var ee=$(e);if(ee.hasClass('loaded'))return;ee.addClass('loaded');ee.addClass('empty');}.bind(this));if(onFinish)onFinish();return;}
var baseurl=$(e[0]).attr('content');var zones=[];$('div.'+zoneclass+'[id^='+zoneidprefix+']').each(function(idx,e){var ee=$(e);var zonename=e.id.substr(zoneidprefix.length);var zone={};zone.id=ee.attr('data-zoneid');if(!zone.id)return;zone.name=zonename;zone.element=e;zone.minwidth=123;zone.maxwidth=345;zone.minheight=456;zone.maxheight=789;zones.push(zone);}.bind(this));var url=baseurl;var zoneids=[];$.each(zones,function(idx,zone){zoneids.push(zone.id);var zoneparams={};zoneparams['zone-'+zone.name+'-max-width']=(zone.maxwidth?zone.maxwidth:9999);zoneparams['zone-'+zone.name+'-min-width']=(zone.minwidth?zone.minwidth:-1);zoneparams['zone-'+zone.name+'-max-height']=(zone.maxheight?zone.maxheight:9999);zoneparams['zone-'+zone.name+'-min-height']=(zone.minheight?zone.minheight:-1);url=this.applyParamsToUrl(url,zoneparams);}.bind(this));url=this.applyParamsToUrl(url,{zones:zoneids.join("|")});this.loadScript(url,function(){$.each(zones,function(idx,zone){var ee=$(zone.element);ee.html("");ee.addClass("loaded");var code=OA_output[zone.id];if(!code)
ee.addClass("empty");else
ee.html(code);}.bind(this));if(onFinish)onFinish();}.bind(this));},processAdverticumMarkers:function()
{this.loadScript('http://ad.adverticum.net/g3.js',function(){}.bind(this));},processAdZoneMarkers:function()
{this.processOpenXMarkers(function(){setTimeout(this.processAdverticumMarkers.bind(this),50);}.bind(this));},processAutoPostBackMarkers:function()
{$('select[data-autopostback=1],input[data-autopostback=1]').each(function(idx,e){var ee=$(e);ee.on('change',this.autoPostBackTrigger.bind(this,e));ee.attr('data-autopostback',null);}.bind(this));},processMarkers:function()
{$('a[rel=permalink]').each(function(idx,e){var ee=$(e);if(!ee.attr('data-pchi'))
{ee.on('click',this.permaLinkClicked.bind(this));ee.attr('data-pchi','true')}}.bind(this));$(['processVisibilityTriggerMarkers','processEncodedHRefs','processPopupMarkers','processSmoothScrollMarkers','processExpandableControlMarkers','processHideMarkers','processAutoCompleteMarkers','processAdaptiveImageMarkers','processApiCallMarkers','processLikeMarkers','processAutoPostBackMarkers',]).each(function(idx,func){try
{if(func)this[func]();}
catch(e)
{if(this.IsDev)
alert('Exception in pageJS.processMarkers() while calling '+func+'(): '+e);debugger;}}.bind(this));this.createConfigControls();this.imagesInit();},autoPostBackTrigger:function(e,ev)
{e.form.submit();},getViewRect:function()
{var so={left:$(document).scrollLeft(),top:$(document).scrollTop()};var di={width:$(window).width(),height:$(window).height()};return rectangle(so.left,so.top,so.left+di.width,so.top+di.height);},isControlVisible:function(e)
{var vr=this.getViewRect();var xrange=Math.round((vr.right-vr.left)/6);var yrange=Math.round((vr.bottom-vr.top)*0.8);vr.left+=-xrange;vr.right+=xrange;vr.top+=-yrange;vr.bottom+=xrange;return intersectRect(vr,getElementBounds(e));},getListAttribute:function(e,attrName,sepChar)
{if(!sepChar)sepChar=';';var list=[];e=$(e);var v=e.attr(attrName);if(v)
list=v.toString().split(sepChar);return list;},parseQueryParams:function(query)
{var params={};$(query.split("&")).each(function(idx,part){var item=part.split("=");params[decodeURIComponent(item[0])]=decodeURIComponent(item[1]);});return params;},processApiCallMarkers:function()
{$('[data-apicall]').each(function(idx,e){var ee=$(e);var matches=/^([\w\.]+)\!(.*)$/.exec(ee.attr('data-apicall'));if(matches.length==3)
{var method=matches[1];var params=this.parseQueryParams(decodeURIComponent(matches[2]));ee.click(this.apiCallElementClicked.bind(this,e,method,params));ee.attr('data-apicall',null);}}.bind(this));},processLikeMarkers:function()
{$('[data-likers][data-poster]').each(function(idx,e){var ee=$(e);if(ee.hasClass('data-likehooked'))return;ee.addClass('data-likehooked',1);var likers=this.getListAttribute(ee,'data-likers',' ');var poster=ee.attr('data-poster');var currentUser=this.getCurrentUserId();if(poster!=currentUser)
{ee.addClass('likeable');if(likers&&(likers.indexOf(currentUser)!=-1))
ee.addClass('liked');var likebtn=ee.find('.actions .like a')[0];if(!likebtn)likebtn=ee.find('.like a')[0];if(likebtn)$(likebtn).click(this.likeButtonClicked.bind(this,e));var unlikebtn=ee.find('.actions .unlike a')[0];if(!unlikebtn)unlikebtn=ee.find('.unlike a')[0];if(unlikebtn)$(unlikebtn).click(this.unLikeButtonClicked.bind(this,e));}}.bind(this));},like_:function(e,like)
{var ee=$(e);var oid=ee.attr('data-uuid');var method=null;if(ee.hasClass('forumentry')||ee.hasClass('forumentrywrapper')){if(like)method='ui.forum.likepost';else method='ui.forum.unlikepost';}else;if(!method)alert('Unable to determine like method');else
if(!oid)alert('Unable to determine like id');else
{this.api(method,{entryUID:oid,unique:this.getStaticParam()});}},apiCallElementClicked:function(e,method,params,ev)
{cancelEvent(ev);var np=jQuery.extend({unique:this.getStaticParam()},params);this.api(method,np);},likeButtonClicked:function(e,ev)
{cancelEvent(ev);this.like_(e,true);},unLikeButtonClicked:function(e,ev)
{cancelEvent(ev);this.like_(e,false);},processAdaptiveImageMarkers:function()
{var found=false;$('img[data-adaptiveversions]').each(function(idx,e){found=true;var ee=$(e);var id=e.id;if(!id)e.id='adaptiveimage_rnd_'+Math.floor(Math.random()*1000*1000);var adaptiveImage={img:e,versions:[],loadedMaxScreenWidth:null};var vers=eval(Base64.decode(ee.attr('data-adaptiveversions')));$.each(vers,function(idx,ver){adaptiveImage.versions.push(ver);}.bind(this));this.AdaptiveImages.push(adaptiveImage);ee.removeAttr('data-adaptiveversions');ee.on('load',this.adaptiveImageLoaded.bind(this,adaptiveImage));}.bind(this));if(found)
this.checkAdaptiveImages();},lazyloadRegister:function(dataid,ctrlid,url)
{if(window.localStorage)
{var v=this.localStorageGetItem(dataid+'__lastkey');if(v==url)
if(v=this.localStorageGetItem(dataid+'__value'))
return this.lazyloadSetContent(ctrlid,v);}
setTimeout(this.lazyloadAjaxBegin.bind(this,dataid,ctrlid,url),10);},lazyloadAjaxBegin:function(dataid,ctrlid,url)
{var req=$.ajax(url,{method:'get',success:function(data,textStatus,jqXHR){this.lazyloadAjaxSuccess(dataid,ctrlid,url,jqXHR)}.bind(this),error:function(jqXHR,textStatus,errorThrown){this.lazyloadAjaxFailure(dataid,ctrlid,url,jqXHR)}.bind(this)})},lazyloadAjaxSuccess:function(dataid,ctrlid,url,transport)
{if((200<=transport.status)&&(transport.status<=299))
{var text=transport.responseText;this.lazyloadSetContent(ctrlid,text);if(window.localStorage)
{this.localStorageSetItem(dataid+'__lastkey',url);this.localStorageSetItem(dataid+'__value',text);}}
else
debugger;},lazyloadAjaxFailure:function(dataid,ctrlid,url,transport)
{debugger;},lazyloadSetContent:function(ctrlid,content)
{var e=$('#'+ctrlid);if(e.length>0)
{e.replaceWith(content);this.processMarkers();}},expanderClicked:function(expandable,e)
{cancelEvent(e);expandable.style.maxHeight='';$(expandable).addClass('expanded');setTimeout(function(){$('.jspScrollable').each(function(idx,child){var jsp=$(child).data('jsp');if(jsp)jsp.reinitialise();});}.bind(this),50);},popupLinkClicked:function(e)
{var url=e.currentTarget.href;if(url.indexOf('?')==-1)url+='?';else url+='&';url+='pop=1';$(e.currentTarget).addClass('clicked');this.popup(url);cancelEvent(e);},permaLinkClicked:function(e)
{publishToClipboard(e.currentTarget.href,'permalink',true);cancelEvent(e);},smoothScrollLinkClicked:function(e)
{var frag=e.currentTarget.href.match(/\#(.+)/);if(frag)
{var anchor=$('a[name='+frag[1]+']')[0];if(anchor)
{var e=$(frag[1]);if(e)e.addClass('scrollingto');scrollToElement(anchor,null,true,function(){if(e)e.removeClass('scrollingto');});}}},changeFontSize:function(diff)
{var curIndex=Math.floor(this.FontSizes.length/2);if(diff)
{this.FontSizes.each(function(idx,e){if($(document.body).hasClass('fontsize-'+e))
curIndex=idx;}.bind(this));curIndex=Math.min(Math.max(curIndex+diff,0),this.FontSizes.length-1);}
var fontSizeId=this.FontSizes[curIndex];this.applyFontSize(fontSizeId);if(!diff)
this.unsetCookie('fontsize')
else
this.setCookie('fontsize',fontSizeId);},applyFontSize:function(fontSizeId)
{this.FontSizes.each(function(idx,e){if(e==fontSizeId)
$(document.body).addClass('fontsize-'+e);else
$(document.body).removeClass('fontsize-'+e);}.bind(this));},popup:function(url,height,width,id,callback)
{var maxwidth=768;if($(document.body).hasClass('withouterwrapper'))maxwidth=710;if(!id)id='popup_'+Math.floor(Math.random()*1000*1000);if(!height)height=Math.min(600,screen.height);if(!width)width=Math.min(maxwidth,screen.width);var left=Math.max((screen.width/2)-(width/2),0);var top=Math.max((screen.height/2)-(height/3*2),0);return window.open(url,id,"toolbar=0,status=0,menubar=no,scrollbars=yes,resizable=yes,copyhistory=no,width="+width+",height="+height+",top="+top+",left="+left);},createConfigControls:function()
{$('[data-configmenu=true]').each(function(idx,control){$(control).removeAttr('data-configmenu');var menu={ctrlid:control.id,items:{}};if($(control).attr('data-config-view-compact')||$(control).attr('data-config-view-details'))
{if($(control).attr('data-config-view-compact'))
menu.items['viewmode-compact']={title:'Kompakt nézet',type:'radio',group:'viewmode',isdefault:false};menu.items['viewmode-normal']={title:'Normál nézet',type:'radio',group:'viewmode',isdefault:true};if($(control).attr('data-config-view-details'))
menu.items['viewmode-details']={title:'Részletes nézet',type:'radio',group:'viewmode',isdefault:false};menu.items['separator-views']='-';var m=$(control).attr('data-config-view-default');if(m)
$.each(menu.items,function(idx,mi){if(mi.group=='viewmode')
mi.isdefault=(idx=='viewmode-'+m);}.bind(this));}
var ics=$(control).attr('data-config-itemcounts');if(ics)
{var itemcounts=ics.split(';');$(itemcounts).each(function(idx,num){num=num.toString().trim();var isdef=(num.substr(0,1)=='*');if(isdef)num=num.substr(1);menu.items['itemcount-'+num]={title:num+' elem',type:'radio',group:'itemcount',isdefault:isdef};}.bind(this));menu.items['separator-itemcounts']='-';}
var olditems=menu.items;menu.items={};var lastissep=true;$.each(olditems,function(id,item){if((typeof item=='string')&&(item=='-'))
{if(lastissep)return;lastissep=true;}
else
lastissep=false;menu.items[id]=item;}.bind(this));var mi;if(false)
while((menu.items.values().length>0)&&((menu.items.values()[menu.items.values().length-1])=='-'))
delete menu.items[menu.items.keys()[menu.items.keys().length-1]];if($.makeArray(menu.items).length==0)return;var elements=[];$.each(menu.items,function(idx,item){if(typeof item=='object')
{item.element=docCreateElement('a',['href=#'],[docCreateText(item.title)]);$(item.element).on('click',this.configMenuItemClicked.bind(this,control,idx,item,menu));elements.push(docCreateElement('li',['class=mi-'+idx+' type-'+item.type],[item.element]));}
else
elements.push(docCreateElement('li',['class=sep'],[]));}.bind(this));var cc=docCreateElement('div',['class=configcontrol'],[docCreateElement('font',[],[docCreateText('Beállítások')]),docCreateElement('div',['class=popup'],[docCreateElement('ul',[],elements)])]);control.appendChild(cc);var founds={};var defs={};$.each(menu.items,function(idx,item){switch(item.type)
{case'radio':var cookiename=menu.ctrlid+'---'+item.group;if(typeof founds[item.group]=='undefined')
founds[item.group]=false;if(this.getCookie(cookiename)==idx)
{item.element.click();founds[item.group]=true;}
if(item.isdefault)
defs[item.group]=item;break;}}.bind(this));$.each(founds,function(groupid,found){if(!found)
{var def=defs[groupid];if(def)
$(def.element).trigger('click');}}.bind(this));}.bind(this));},getCookie:function(name)
{return getCookie(name);},setCookie:function(name,value)
{var exp=new Date();exp=new Date(exp.getTime()+1000*60*60*24*365);return setCookie(name,value,'path=/'+(this.CookieDomain?'; domain='+this.CookieDomain:'')+'; expires='+exp.toGMTString());},unsetCookie:function(name)
{this.setCookie(name,'deleted');},configMenuItemClicked:function(control,id,item,menu,e)
{if(e)cancelEvent(e);var items=menu.items;var ctrlid=menu.ctrlid;switch(item.type)
{case'radio':var groupItems={};$.each(items,function(idx,mi){if((mi.type=='radio')&&(mi.group==item.group))
groupItems[idx]=mi;}.bind(this));$.each(groupItems,function(eid,emi){if(eid==id)
{$(control).addClass('config-'+eid);$(emi.element.parentElement).addClass('checked');}
else
{$(control).removeClass('config-'+eid);$(emi.element.parentElement).removeClass('checked');}}.bind(this));var cookiename=ctrlid+'---'+item.group;if(item.isdefault)
this.unsetCookie(cookiename);else
this.setCookie(cookiename,id);break;default:debugger;alert('Unknown menu item type');}},formLoginSubmit:function(e)
{var ok=false;if($('#email')[0].value.trim()=='')alert('Nem adtál meg e-mail címet!');else
if($('#password')[0].value.trim()=='')alert('Nem adtál meg jelszót!');else
ok=true;if(!ok)
cancelEvent(e);},formControlFocus:function(e)
{var element=e.currentTarget;$(element.form).addClass('focused');var ph=$('.pageheader');ph.find('form').each(function(idx,e){ph.removeClass('currentform-'+e.id);}.bind(this));ph.addClass('currentform-'+element.form.id);},formControlBlur:function(e)
{var element=e.currentTarget;if(navigator.userAgent.indexOf('Chrome/')!=-1)
return;$(element.form).removeClass('focused');var ph=$('.pageheader');ph.find('form').each(function(idx,e){ph.removeClass('currentform-'+e.id);}.bind(this));},windowScrolled:function()
{this.processVisibilityTriggerMarkers();},getContentColForElement:function(e)
{var ee=$(e);var maincol=ee.closest('.contentbody')[0];if(!maincol)maincol=ee.closest('.maincol')[0];if(!maincol)maincol=$('#pageheader')[0];if(!maincol)maincol=$('.docarea')[0];return maincol;},windowSizeChanged:function(initial)
{this.checkAdaptiveImages();this.processVisibilityTriggerMarkers();var body=$(document.body);if(!(body.hasClass('mobile')||body.hasClass('newdesign2')))return;$('*[freelyscalable][originalwidth][referencewidth]').each(function(idx,e){e.width=0;e.height=0;}.bind(this));$('*[freelyscalable][originalwidth][referencewidth]').each(function(idx,e){var ee=$(e);var maincol=this.getContentColForElement(e);var maincolSize={width:$(maincol).width(),height:$(maincol).height()};var windowSize={width:$(window).width(),height:$(window).height()};var p=e;var lastp=null;do
{var cs=getCurrentStyle(p);var horizAttrs=$([cs.borderLeftWidth,cs.borderRightWidth]);var vertAttrs=$([cs.borderTopWidth,cs.borderBottomWidth]);{horizAttrs.push(cs.paddingLeft);horizAttrs.push(cs.paddingRight);vertAttrs.push(cs.paddingTop);vertAttrs.push(cs.paddingBottom);}
if(p!=maincol)
{if((typeof cs.webkitMarginStart=='undefined')||(cs.webkitMarginStart=='0px'))horizAttrs.push(cs.marginLeft);if((typeof cs.webkitMarginEnd=='undefined')||(cs.webkitMarginEnd=='0px'))horizAttrs.push(cs.marginRight);vertAttrs.push(cs.marginTop);vertAttrs.push(cs.marginBottom);}
var nonValidAttrs=['auto','medium'];horizAttrs=horizAttrs.filter(function(idx,attr){return(nonValidAttrs.indexOf(attr)==-1);});vertAttrs=vertAttrs.filter(function(idx,attr){return(nonValidAttrs.indexOf(attr)==-1);});horizAttrs.each(function(idx,v){if(v)if(v=calcPx(v,maincol,maincolSize.width))maincolSize.width=maincolSize.width-v;}.bind(this));vertAttrs.each(function(idx,v){if(v)if(v=calcPx(v,maincol,maincolSize.height))maincolSize.height=maincolSize.height-v;}.bind(this));lastp=p;p=p.parentElement;}
while(p&&(lastp!=maincol));var originalWidth=ee.attr('originalwidth');var originalHeight=ee.attr('originalheight');var referenceWidth=ee.attr('referencewidth');if(!originalWidth||!originalHeight||!referenceWidth)return;var ratio=(maincolSize.width*1.0/referenceWidth);var nw=Math.floor(originalWidth*ratio);var nh=Math.floor(originalHeight*ratio);var maxHeight=Math.floor(windowSize.height*0.9);var maxWidth=Math.min(windowSize.width,maincolSize.width);if(ee.attr('unlimitedscale'))maxHeight=99999;if((nh>maxHeight)&&(originalHeight<900))
{oh=nh;nh=maxHeight;nw=Math.floor((nh/oh)*nw);}
if(nw>maxWidth)
{ow=nw;nw=maxWidth;nh=Math.floor((nw/ow)*nh);}
if(nw!=e.width)e.width=nw;if(nh!=e.height)e.height=nh;}.bind(this));},imagesInit:function()
{var body=$(document.body);$('[freelyscalable]').each(function(idx,e){var ee=$(e);var width=ee.attr('width');var height=ee.attr('height');if(typeof ee.attr('originalwidth')=='undefined')
if((width!='')&&(height!=''))
{ee.attr('originalwidth',e.width);ee.attr('originalheight',e.height);}
if(typeof ee.attr('referencewidth')=='undefined')
{var mc=this.getContentColForElement(e);ee.attr('referencewidth',$(mc).width());}}.bind(this));this.checkAdaptiveImages();},checkAdaptiveImages:function()
{var screenWidth=$(window).width();$.each(this.AdaptiveImages,function(idx,ai){if(!ai.loadedMaxScreenWidth||(ai.loadedMaxScreenWidth<screenWidth))
{var verToLoad=null;$.each(ai.versions,function(idx,ver){if((!verToLoad||(ver.maxscreenwidth<verToLoad.maxscreenwidth))&&(ver.maxscreenwidth>=screenWidth))
verToLoad=ver;}.bind(this));if(verToLoad)
if(verToLoad.url!=ai.img.src)
ai.img.src=verToLoad.url;}}.bind(this));},adaptiveImageLoaded:function(ai)
{var loadedVersion=null;$.each(ai.versions,function(idx,ver){if(ver.url==ai.img.src)
loadedVersion=ver;}.bind(this));if(loadedVersion)
ai.loadedMaxScreenWidth=loadedVersion.maxscreenwidth;},forumEntryInitModer:function(e)
{var aun=$(e).attr('data-authoruser');var irtun=$(e).attr('data-inreplytouser');if(aun||irtun)
if((this.currentUserName!=aun)&&(this.currentUserName!=irtun))
{var expander=e.find('#author .expand');expander.onclick=this.forumEntryExpandClicked.bind(this,e);this.forumEntryCollapse(e);}},forumEntryExpandClicked:function(e)
{this.forumEntryExpand(e);},forumEntryCollapse:function(e)
{e.addClassName('collapsed');},forumEntryExpand:function(e)
{e.removeClassName('collapsed');},registerTabControl:function(id)
{var e=$('#'+id);var i=0;this.tabControlGetTabs(e).each(function(idx,li){$(li).find('a').on('click',this.tabControlTabClicked.bind(this,e,i));$(li).find('a').on('mouseover',this.tabControlTabClicked.bind(this,e,i));i++;}.bind(this));e.addClass('scripted');e.removeClass('nonscripted');this.tabControlSetIndex(e,0);},tabControlTabClicked:function(control,index,event)
{this.tabControlSetIndex(control,index);cancelEvent(event);},tabControlSetIndex:function(control,index)
{this.tabControlSelectItem(this.tabControlGetTabs(control),index);this.tabControlSelectItem(this.tabControlGetViews(control),index);},tabControlSelectItem:function(controls,index)
{var i=0;controls.each(function(idx,li){li=$(li);if(i==index)
li.addClass('active');else
li.removeClass('active');i++;}.bind(this));},tabControlGetTabs:function(control)
{return control.find('> .tabs > ul > li');},tabControlGetViews:function(control)
{return control.find('> .views > ul > li');},getGlobalSecurityToken:function()
{if(typeof this.globalSecurityToken!="undefined")
return this.globalSecurityToken;var e=$('head meta[name=gstk]');if(e.length>0)
this.globalSecurityToken=$(e[0]).attr('content');else
this.globalSecurityToken=null;return this.globalSecurityToken;},getCurrentUserId:function()
{if(typeof this.currentUserId!="undefined")
return this.currentUserId;var e=$('head meta[name=usid]');if(e.length>0)
this.currentUserId=$(e[0]).attr('content');else
this.currentUserId=null;return this.currentUserId;},getStaticParam:function()
{if(typeof this.staticParam=='undefined')
{if(typeof getXMLRequest2=='undefined')
{alert('Ez a funkció csak bejelentkezést követõen használható');debugger;throw'Internal error';}
this.staticParam=getXMLRequest2();}
return this.staticParam;},apiAjaxSuccess:function(params,transport)
{if(!transport.responseJSON)this.apiError(-1,'Malformed response (1): '+transport.responseText,params);else
if(typeof transport.responseJSON.rsp=="undefined")this.apiError(-1,'Malformed response (2)',params);else
if(typeof transport.responseJSON.rsp.stat=="undefined")this.apiError(-1,'Malformed response (3)',params);else
if(transport.responseJSON.rsp.stat!='ok')this.apiError(transport.responseJSON.rsp.err.code,transport.responseJSON.rsp.err.msg,params);else
this.apiSuccess(transport.responseJSON.rsp,params);},apiAjaxFailure:function(params,transport)
{this.apiError(-1,'Request failed',params);},apiSuccess:function(response,params)
{if(response)
this.processApiUpdates(response);if(params&&params.success)
params.success(response,params.data);else
debugger;},apiError:function(code,text,params)
{if((code==105)&&params)
{if(params.method!='ui.session.heartbeat')
setTimeout(function(){this.popup('/belepes/?pop=1',null,null,null,function(closeData){setTimeout(function(){if(closeData=='loggedin')
this.api(params.method,params.params,params.success,params.error,params.data);else
if(params.error)
params.error(105,'Login cancelled',params.data);},50);});}.bind(this),50);return;}
if(params&&params.error)
params.error(code,text,params.data);else
{var msg=text;if(this.IsDev||(params.method!='ui.session.heartbeat'))
alert(msg);}},applyParamsToUrl:function(baseUrl,params)
{var url=baseUrl;$.each(params,function(pn,pv){url+=((url.indexOf('?')==-1)?'?':'&');url+=encodeURIComponent(pn)+'='+encodeURIComponent(pv);}.bind(this));return url;},getStdApiParams:function(methodName)
{return{method:methodName,format:'json',gstk:this.getGlobalSecurityToken()};},api:function(methodName,methodParams,successFunc,errorFunc,userData,completeFunc)
{var params=$.extend(this.getStdApiParams(methodName),(methodParams?methodParams:{}));new $.ajax(this.APIURL,{method:'POST',data:params,complete:completeFunc,success:function(data,textStatus,jqXHR){this.apiAjaxSuccess({method:methodName,params:methodParams,success:successFunc,error:errorFunc,data:userData},jqXHR)}.bind(this),error:function(jqXHR,textStatus,errorThrown){this.apiAjaxFailure({method:methodName,params:methodParams,success:successFunc,error:errorFunc,data:userData},jqXHR)}.bind(this)});},processApiUpdates:function(response)
{var updated=false;if(typeof response.updates!='undefined')
$.each(response.updates,function(key,value){$(key).html(value);updated=true;}.bind(this));if(typeof response.replaces!='undefined')
$.each(response.replaces,function(key,value){$(key).replaceWith(value);updated=true;}.bind(this));if(typeof response.addClasses!='undefined')
$.each(response.addClasses,function(key,value){$(key).addClass(value);updated=true;}.bind(this));if(typeof response.removeClasses!='undefined')
$.each(response.removeClasses,function(key,value){$(key).removeClass(value);updated=true;}.bind(this));if(typeof response.scripts!='undefined')
$.each(response.scripts,function(key,value){eval(value);updated=true;}.bind(this));if(updated)
setTimeout(function()
{this.processMarkers();if(typeof processSyntaxHighlightBlocks!='undefined')
window.processSyntaxHighlightBlocks();}.bind(this),50);return true;},sendHeartBeat:function()
{this.HeartBeatScheduled=false;this.api('ui.session.heartbeat',{timestamp:(new Date()).getTime()},function(response,calldata){}.bind(this),function(errorcode,errormsg,calldata){debugger;if(this.IsDev)
alert('Error sending heartbeat: '+errormsg);}.bind(this));},scheduleHeartBeat:function()
{if(!this.HeartBeatScheduled)
{setTimeout(this.sendHeartBeat.bind(this),500);this.HeartBeatScheduled=true;}},localStorageGetExtendedDataId:function(dataid)
{return this.LocalStorageExtendedDataPrefix+dataid;},localStorageCheckExtendedData:function(dataid)
{var v=null;var exdataid=this.localStorageGetExtendedDataId(dataid);var ed=window.localStorage.getItem(this.LocalStorageDataIdPrefix+exdataid);if(ed)
{ed=JSON.parse(ed);if((new Date).getTime()<=(ed._timestamp+ed._expires))
v=ed._data;else
window.localStorage.removeItem(this.LocalStorageDataIdPrefix+exdataid);}
return v;},localStorageGetItem:function(dataid)
{if(this.IsDev)return null;var v=null;if(window.localStorage)
{v=window.localStorage.getItem(this.LocalStorageDataIdPrefix+dataid);if(!v)v=this.localStorageCheckExtendedData(dataid);}
return v;},localStorageSetItem:function(dataid,data,expires)
{if(expires)
{window.localStorage.removeItem(this.LocalStorageDataIdPrefix+dataid);data=JSON.stringify({_data:data,_timestamp:(new Date).getTime(),_expires:expires*1000});dataid=this.localStorageGetExtendedDataId(dataid);}
window.localStorage.setItem(this.LocalStorageDataIdPrefix+dataid,data);},localStorageRemoveItem:function(dataid)
{window.localStorage.removeItem(this.LocalStorageDataIdPrefix+this.localStorageGetExtendedDataId(dataid));return window.localStorage.removeItem(this.LocalStorageDataIdPrefix+dataid);},localStorageMaintenance:function()
{if(window.localStorage)
for(var key in window.localStorage)
{if(key.substr(0,this.LocalStorageExtendedDataPrefix.length)==this.LocalStorageExtendedDataPrefix)
try
{this.localStorageCheckExtendedData(key.substr(this.LocalStorageExtendedDataPrefix.length));}
catch(e)
{debugger;}}},apiCached:function(cachedid,period,methodName,methodParams,successFunc,errorFunc,userData,completeFunc)
{if(window.localStorage)
{var v=this.localStorageGetItem(cacheid+'__lastresponse');var ts=this.localStorageGetItem(cacheid+'__lasttimestamp');var curts=Math.floor((new Date()).getTime()/1000);if(v&&ts&&((curts-period)>ts))
return this.successFunc(v.rsp,v.params);}
this.api(methodName,methodParams,function(rsp,params){if(window.localStorage)
{this.localStorageSetItem(cacheid+'__lastresponse',{rsp:rsp,params:params});this.localStorageSetItem(cacheid+'__lasttimestamp',curts);}
successFunc(rsp,params);},errorFunc,userData,completeFunc);},getControlData:function(ctrlid)
{var data=null;var ctrl=$(ctrlid);if(ctrl)
{try
{if(typeof tinyMCE!='undefined')tinyMCE.triggerSave();}
catch(e)
{debugger;}
if(typeof ctrl.value!='undefined')data=ctrl.value;else;if((data=='undefined')&&(ctrl.tag=='textarea'))
data=null;}
return data;},setControlData:function(ctrlid,data)
{var ctrl=$(ctrlid);if(ctrl)
{if(typeof ctrl.value!='undefined')ctrl.value=data;else;}},getAutoSaveControlDataId:function(ctrlid,autosaveid)
{if(!autosaveid)autosaveid=ctrlid;return'autosave---'+autosaveid;},markAutoSaveDataCommitted:function(autosaveid)
{if(window.localStorage)
this.localStorageRemoveItem(this.getAutoSaveControlDataId('######',autosaveid));},registerAutoSaveControl:function(ctrlid,autosaveid)
{if(window.localStorage)
{if(!this.getControlData(ctrlid))
{var asid=this.getAutoSaveControlDataId(ctrlid,autosaveid);var data=this.localStorageGetItem(asid);if(data)
{this.localStorageRemoveItem(asid);this.setControlData(ctrlid,data);this.AutoSaveRestored=true;}}
this.setInterval(this.autoSaveControlData.bind(this,ctrlid,autosaveid),10*1000);}},autoSaveControlData:function(ctrlid,autosaveid)
{if(window.localStorage)
{var data=this.getControlData(ctrlid);if((typeof data!='undefined')&&(data!==null))
this.localStorageSetItem(this.getAutoSaveControlDataId(ctrlid,autosaveid),data,30*60);}},captureWrite:function(func,writeHandler)
{var owrite=document.write;var result='';if(!writeHandler)writeHandler=function(s){result=result+s;};try
{document.write=writeHandler;func();}
catch(e)
{document.write=owrite;throw e;}
return result;},escapeHTML:function(s)
{return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');},makeFullUrl:function(url)
{var fullurl=this.FullUrlCache[url];if(!fullurl)
{var el=document.createElement('div');$(el).html('<a href="'+this.escapeHTML(url)+'">x</a>');fullurl=el.firstChild.href;this.FullUrlCache[url]=fullurl;}
return fullurl;},findScript:function(url)
{url=this.makeFullUrl(url);var scripts=document.getElementsByTagName('script');for(var i=0;i<scripts.length;i++)
if(scripts[i].src==url)
return scripts[i];return null;},loadScript:function(scriptUrl,onFinish,scriptDependencies,parentElement)
{scriptUrl=this.makeFullUrl(scriptUrl);if(!this.findScript(scriptUrl))
{var deps=[];if(scriptDependencies)
$(scriptDependencies).each(function(idx,url){deps.push(this.makeFullUrl(url));}.bind(this));if(deps.length==0)deps=null;this.ScriptsToLoad.push({url:scriptUrl,onfinish:onFinish,dependencies:deps,element:parentElement});if(this.DOMReady)
this.checkScriptLoads();}},loadScriptsInOrder:function(scriptUrls,onFinish,scriptDependencies,parentElement)
{for(var i=0;i<scriptUrls.length;i++)
{var deps=scriptDependencies;if(!deps)deps=[];deps=$.merge(deps,scriptUrls.slice(0,i));this.loadScript(scriptUrls[i],((i==scriptUrls.length-1)?onFinish:null),deps,parentElement);}},checkScriptLoads:function()
{var i=0;while(i<this.ScriptsToLoad.length)
{var script=this.ScriptsToLoad[i];if(this.canLoadScript(script))
{this.ScriptsToLoad=$.merge(this.ScriptsToLoad.slice(0,i),this.ScriptsToLoad.slice(i+1,this.ScriptsToLoad.length));if(!this.findScript(script.url))
this.beginLoadScript(script);}
else
i++;}},canLoadScript:function(script)
{var can=true;if(script.dependencies)
$.each(script.dependencies,function(idx,depurl){if(!this.findScript(depurl)||this.ScriptsLoading[depurl])
{can=false;return false;}}.bind(this));return can;},beginLoadScript:function(script)
{var js=document.createElement('script');js.async=true;js.type='text/javascript';js.onreadystatechange=this.scriptReadyStateChanged.bind(this,script,js);js.onload=this.scriptLoaded.bind(this,script);js.onerror=this.scriptLoadFailed.bind(this,script);js.src=script.url;var context=script.element;if(!context)context=document.head;if(!context)context=document.body;this.ScriptsLoading[js.src]=1;this.captureWrite(function(){context.appendChild(js);}.bind(this),this.inplaceWriter.bind(this,context));},scriptReadyStateChanged:function(script,js)
{if((js.readyState=='loaded')||(js.readyState=='complete'))
this.scriptLoaded(script);},scriptLoaded:function(script)
{delete this.ScriptsLoading[script.url];if(script.onfinish)script.onfinish(script.url);$.each(this.ScriptLoadedHooks,function(idx,hook){hook(script.url);}.bind(this));this.checkScriptLoads();},scriptLoadFailed:function(script)
{if(this.IsDev)
{alert('FAILED to load script: '+script.url);debugger;}
delete this.ScriptsLoading[script.url];this.checkScriptLoads();},registerScriptLoadHook:function(hook,url)
{this.ScriptLoadedHooks.push(function(script){if(!url||(script.url==url))
hook(script);}.bind(this));}}));pageJS.init();window.pageJS=pageJS;}());if(typeof String.prototype.endsWith=='undefined')
String.prototype.endsWith=function(suffix){return this.indexOf(suffix,this.length-suffix.length)!==-1;};