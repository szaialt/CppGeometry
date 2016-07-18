var loc = window.location + "";
if (loc.indexOf("www.zeuscmd.com") == -1)
{
	loc = loc.replace("zeuscmd.com", "www.zeuscmd.com");
	window.document.location = loc;
}

function externalLinks() 
{ 
	if (!document.getElementsByTagName) 
		return; 

	var anchors = document.getElementsByTagName("a"); 

	for (var i=0; i<anchors.length; i++) 
	{ 
		var anchor = anchors[i]; 
		
		if (anchor.getAttribute("href"))
		{
			if (anchor.getAttribute("rel") == "external") 
				anchor.target = "_blank"; 
			else if (anchor.getAttribute("rel") == "google")
				anchor.target = "google_window";
		}
	} 
} 
window.onload = externalLinks;