// MouseOver Java Script

// Check for browser support.
 ver = navigator.appVersion.substring(0, 1);
 flip=0;
 if ( (navigator.appName == "Netscape") && ( ver >= 3 ) ) flip=1;
 if ( (navigator.appName == "Microsoft Internet Explorer") && (ver >= 4) ) flip=1;

function change(a,im)
{
//document.ff.flag.src=im; // yawn .. doesn't work in 3.0 on unix
x = eval("document."+a);
if (flip ==1)
  x.src=im;
}

function changeLong(a,im,msg)
{
//document.ff.flag.src=im; // yawn .. doesn't work in 3.0 on unix
x = eval("document."+a);
if (msg!="null")
  window.status=msg;
if (flip ==1)
  x.src=im;
}

var fred=1;

function MouseOver(image1,image2,imgflags, imghref)
{
var x = "a"+fred;
  document.write("<a onMouseOver='change(\""+x+"\",\""+image2+"\")' onMouseOut='change(\""+x+"\",\""+image1+"\")' href=\""+imghref+"\"><IMG name=\""+x+"\" "+imgflags+" SRC=\""+image1+"\"></a>");
  fred=fred+1;
}

function MouseOverLong(image1,image2,imgflags, imghref, hrefflags,msg)
{
var x = "a"+fred;
  document.write("<a "+hrefflags+" onMouseOver='changeLong(\""+x+"\",\""+image2+"\",\""+msg+"\")' onMouseOut='changeLong(\""+x+"\",\""+image1+"\",\"\")' href=\""+imghref+"\"><IMG name=\""+x+"\" "+imgflags+" SRC=\""+image1+"\"></a>");
  fred=fred+1;
}

