function popup(URL, ewidth, eheight, nwidth, nheight, resizable)
{
	var isNav = navigator.appName == "Netscape";
	var popup = null;
	
	if (isNav)
		popup = window.open(URL,"popup","width=" + nwidth + ", height=" + nheight + ", resizable = " + (resizable ? "yes" : "no") + ", scrollbars = yes, top = 30, left = 50");
	else
		popup = window.showModelessDialog(URL,"popup","dialogWidth : " + ewidth + "px; dialogHeight : " + eheight + "px; resizable : " + (resizable ? "yes" : "no") + "; scroll : yes; dialogTop = 10px; dialogLeft = 50px; status : no;");
		
	popup.focus();	
}

function newWindow(URL, ewidth, eheight, nwidth, nheight, resizable)
{
	var isNav = navigator.appName == "Netscape";
	
	if (isNav)
		popup = window.open(URL,"popup","width=" + nwidth + ", height=" + nheight + ", resizable = " + (resizable ? "yes" : "no") + ", scrollbars = yes, top = 30, left = 50");
	else
		popup = window.open(URL,"popup","width=" + ewidth + ", height=" + eheight + ", resizable = " + (resizable ? "yes" : "no") + ", scrollbars = yes, top = 30, left = 50");
	
	popup.focus();
}