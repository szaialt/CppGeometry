/*

	Custom Facebook share button & counter script

	Copyright (C) 2013 by DevWorx, Hungary

*/

var fbbuttons=$('.facebookbutton');fbbuttons.each(function(idx,fbbutton){var sharedurl=fbbutton.title;if(!sharedurl)return;var fbqueryurl='https://graph.facebook.com/fql'+'?q='+encodeURIComponent('SELECT url, normalized_url, share_count, like_count, comment_count, total_count, commentsbox_count, comments_fbid, click_count FROM link_stat WHERE url=\''+sharedurl+'\'').toString().replace(/'/g,'%27')+'&callback=fbbuttons_jsoncallback';$.getScript(fbqueryurl);});function fbbuttons_jsoncallback(result)
{if(result&&(typeof result.data!="undefined")&&(typeof result.data.length!="undefined")&&(result.data.length==1)&&(typeof result.data[0].url!="undefined")&&(typeof result.data[0].total_count!="undefined"))
{var url=result.data[0].url;var count=result.data[0].total_count;var countStr=count.toString();if(count>=1000)
{countStr=(count/1000).toFixed(1);do
{var c=countStr.substr(countStr.length-1);if((c!=".")&&(c!=",")&&(c!="0"))break;countStr=countStr.substr(0,countStr.length-1);if((c==".")||(c==","))break;}while(true);countStr=countStr+'K';}
fbbuttons.each(function(idx,fbbutton){if(fbbutton.title!=url)return;fbbutton.title='';var e=$(fbbutton).find('.counter .count');e.html(countStr);var cs=count.toString();e.title=((cs==countStr)?'':cs);});}}