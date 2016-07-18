/******************************************************************************

	Search hits highlight by referer parsing
	
	Copyright (C) 2010 by DevWorx, Inc. All rights reserved.

******************************************************************************/

(function($,window,document){$.DxSearchHighlight=$.klass({init:function(options)
{this.onInit(options);},onInit:function(options)
{this.currentindex=0;this.options=options;this.masks=options.Masks;this.highlightclass=options.HighlightClass;if(options.RootElementID)
this.element=$('#'+options.RootElementID);else
this.element=window.document.body;if(this.element)
setTimeout(this.apply.bind(this),500);},isBrowserIE:function()
{return(window.navigator.userAgent.indexOf('MSIE')>0);},getCssClass:function(element)
{if(this.isBrowserIE())
return element.className;else
if(element.getAttribute)
{var cn=element.getAttribute('class');if(!cn)cn='';return cn;}
else
return'';},setCssClass:function(element,value)
{if(document.all)
element.className=value;else
element.setAttribute('class',value);},addCssClass:function(element,cssclass)
{var cn=this.getCssClass(element);if(cn==cssclass)return;if(cn.indexOf(' '+cssclass)>=0)return;if(cn!='')cn=cn+' ';cn=cn+cssclass;this.setCssClass(element,cn);},removeCssClass:function(element,cssclass)
{var cn=this.getCssClass(element);if(cn==cssclass)
this.setCssClass(element,'');else
{i=cn.indexOf(' '+cssclass);if(i>=0)
this.setCssClass(element,cn.substr(0,i)+cn.substr(i+cssclass.length+1));else
{i=cn.indexOf(cssclass+' ');if(i>=0)
this.setCssClass(element,cn.substr(0,i)+cn.substr(i+cssclass.length+1));}}},isCssClass:function(element,cssclass)
{var cn=this.getCssClass(element);if(!cn)return false;if(cn==cssclass)
return true;else
{var i=cn.indexOf(' '+cssclass);if(i>=0)
return true;var i=cn.indexOf(cssclass+' ');if(i>=0)
return true;}
return false;},utf8Decode:function(s)
{var utf8codes=new Array('%c3%81','%c3%a1','%c3%89','%c3%a9','%c3%8d','%c3%ad','%c3%93','%c3%b3','%c3%b6','%c5%91','%c3%b4','%c5%90','%c3%96','%c3%ba','%c3%9a','%c3%bc','%c3%9c','%c5%b1','%c5%b0');var ansicodes=new Array('%c1','%e1','%c9','%e9','%cd','%ed','%d3','%f3','%f6','%f5','%f5','%d5','%d6','%fa','%da','%fc','%dc','%fb','%fb');for(var i=0;i<utf8codes.length;i++)
{s=s.replace(utf8codes[i].toUpperCase(),ansicodes[i].toUpperCase());s=s.replace(utf8codes[i],ansicodes[i]);}
return s;},highlightNode:function(node,expression,cssclass)
{if(node.nodeType==1)
{if(node.getAttribute("shltwashere")==expression)
return false;else
node.setAttribute("shltwashere",expression);}
if(node.hasChildNodes())
{for(var i=0;i<node.childNodes.length;i++)
this.highlightNode(node.childNodes[i],expression,cssclass);}
if(node.nodeType==3)
{var p=node.parentNode;if(p)
if((p.nodeName!='TEXTAREA')&&(p.nodeName!='SCRIPT')&&(!this.isCssClass(p,cssclass)))
{var expr=new RegExp(expression,'i');var result=expr.exec(node.nodeValue);if(result!=null)
{var v=node.nodeValue;var lt=document.createTextNode(v.substr(0,result.index));var rt=document.createTextNode(v.substr(result.index+result[0].length));var span=document.createElement('SPAN');this.addCssClass(span,cssclass);span.appendChild(document.createTextNode(result[0]));p.insertBefore(lt,node);p.insertBefore(span,node);p.replaceChild(rt,node);}}}},highlight:function(expression,cssclass)
{this.highlightNode(this.element,expression,cssclass);},normalizeSearchWord:function(word)
{word=word.toString();if(word.length==0)return false;var c=word.substr(0,1);var sign='+';if((c=='+')||(c=='-'))
{sign=c;word=word.substr(1,word.length);}
if((word.substr(0,1)=='"')&&(word.substr(word.length-1,1)=='"'))
word=word.substr(1,word.length-2);if(word.length==0)return false;if(sign=='+')
return word;else
return null;},highlightSearchWord:function(word,index)
{if(word=this.normalizeSearchWord(word))
this.highlight(word,index);},highlightSearchExpression:function(expression)
{var words=new Array;var inquote=false;var curexpression='';for(var i=0;i<expression.length;i++)
{var flush=false;var c=expression.substr(i,1);if(inquote)
{if(c=='"')
{inquote=false;flush=true;}}
else
if(c=='"')
inquote=true;else
if(c==' ')
flush=true;curexpression=curexpression+c;if(flush)
{if(curexpression.length>0)
words[words.length]=new Array(curexpression,words.length);curexpression='';}}
if(curexpression.length>0)
words[words.length]=new Array(curexpression,words.length);var me=this;words.sort(function(a,b)
{var an=me.normalizeSearchWord(a[0]);var bn=me.normalizeSearchWord(b[0]);if(an==bn)return 0;else
if(an==null)return-1;else
if(bn==null)return-1;else
if(an.length>bn.length)return-1;else
return 1;});for(var i=0;i<words.length;i++)
this.highlightSearchWord(words[i][0],this.highlightclass+' num'+(words[i][1]+1));},apply:function()
{var ref=document.referrer;if(ref=='')return false;for(var i=0;i<this.masks.length;i++)
{var mask=new RegExp(this.masks[i]);var matches=mask.exec(ref);if(matches)
if(matches.length>1)
{var match=matches[1];match=this.utf8Decode(match);match=unescape(match.replace(/\+/g,' '));this.highlightSearchExpression(match);break;}}}});})(jQuery,window,document);