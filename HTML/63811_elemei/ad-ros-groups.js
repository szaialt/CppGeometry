(function(){if(window.dmRosAds!==undefined){return}var b=function(d){return({}).toString.call(d).match(/\s([a-zA-Z]+)/)[1].toLowerCase()},c={idList:[]},a=50,e=document;window.dmRosAds={info:c,insertMultiAd:function(k){var p=window,v=encodeURIComponent,x=k.dmRosAdConfig||"",D=k.dmRosAdTrafficType||"",A=k.dmRosAdTypeTag||"",f=k.dmRosAdDss||"",o="1",t="1",z="",q=[];var s="",r="",g="";if(null!=k.dmRosPropParams){s=k.dmRosPropParams.src_spaceid||"";r=k.dmRosPropParams.srcpvid||"";g=k.dmRosPropParams.sample_id||""}if(b(k.dmRosAdSlotInfo)!=="array"){return}for(i=0;i<k.dmRosAdSlotInfo.length;i++){var l=k.dmRosAdSlotInfo[i];l.dmRosAdSlotId=(b(l.dmRosAdSlotId)==="string"&&l.dmRosAdSlotId.match(/^[\w-]+$/))?l.dmRosAdSlotId:"";if(l.dmRosAdSlotId===""){continue}l.dmRosAdDivId=(b(l.dmRosAdDivId)==="string"&&l.dmRosAdDivId.match(/^[\w-]+$/))?l.dmRosAdDivId:"";if(l.dmRosAdDivId===""){continue}l.dmRosAdWidth=(b(l.dmRosAdWidth)==="string"&&l.dmRosAdWidth.match(/^\d+$/))?l.dmRosAdWidth:"0";if(l.dmRosAdWidth==="0"){continue}l.dmRosAdHeight=(b(l.dmRosAdHeight)==="string"&&l.dmRosAdHeight.match(/^\d+$/))?l.dmRosAdHeight:"0";if(l.dmRosAdHeight==="0"){continue}l.dmRosAdResize=(b(l.dmRosAdResize)==="string"&&l.dmRosAdResize==="false")?"false":"true";l.dmRosAdId="dmRosAd-"+(c.idList.length+1)+"-"+l.dmRosAdSlotId;c.idList.push(l.dmRosAdId);q.push(l);if(z!==""){z+=","}z+=l.dmRosAdSlotId+":"+l.dmRosAdWidth+"x"+l.dmRosAdHeight;if(l.dmRosAdResize==="true"){l.dmRosAdHeight="0"}}if(q.length===0){return}var m=document.location.protocol+"//dmros.ysm.yahoo.com/ros/?ct=1&c="+v(x)+"&w="+v(o)+"&h="+v(t)+"&si="+v(z)+"&ty="+v(A)+(D?"&tv="+v(D):"")+(s?"&sp="+v(s):"")+(r?"&sr="+v(r):"")+(g?"&sa="+v(g):"")+"&d="+v(f)+"&u="+v(e.location.href.substring(0,800))+"&r="+v(e.referrer.substring(0,800))+"&tt="+v(e.title.substring(0,250)),B=e.createElement("script"),d=e.head||e.getElementsByTagName("head")[0];B.type="text/javascript";B.src=m;d.appendChild(B);var y=function(E,F,w){var h=function(){var G=0;if(navigator.userAgent.match(/WebKit/)){G=w.documentElement.scrollHeight}else{G=w.body.scrollHeight}if(G>30&&E.contentWindow.dmRosAdHeightOffset!==undefined){G+=(parseInt(E.contentWindow.dmRosAdHeightOffset)||0)}E.height=G;if(G<=30){F.style.display="none"}};h();return h},j=function(G,h,w){var F=e.createElement("iframe");F.id=q[w].dmRosAdDivId+"-iframe";F.src="about:blank";F.frameBorder="0";F.marginWidth="0";F.marginHeight="0";F.scrolling="no";F.width=q[w].dmRosAdWidth;F.height=q[w].dmRosAdHeight;G.appendChild(F);var E=F.contentDocument?F.contentDocument:(F.contentWindow.document||F.document);E.open();E.write(h);E.close();if(q[w].dmRosAdResize==="true"){if(F.contentWindow){F.contentWindow.onresize=y(F,G,E)}}},C={},u=1,n=function(){var w=0;for(var h in C){var E=e.getElementById(q[C[h].index].dmRosAdDivId);if(E){j(E,C[h].html,C[h].index);delete C[h]}else{w++}}if(w===0){clearInterval(n)}};window.dmRosAdCallback=function(F){for(var E=0;E<q.length;E++){var h="markup_"+q[E].dmRosAdSlotId,w=F[h]||"",G=e.getElementById(q[E].dmRosAdDivId);if(w===""){continue}if(G){j(G,w,E)}else{C[q[E].dmRosAdDivId]={html:w,index:E};if(u){setInterval(n,a)}u=0}}}}};if(window.dmRosAdConfig){window.dmRosAds.insertMultiAd(window.dmRosAdConfig)}})();