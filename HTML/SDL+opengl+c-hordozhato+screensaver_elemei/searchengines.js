/******************************************************************************

	Most common search engine referer parse expressions
	
	Copyright (C) 2010 by DevWorx, Inc. All rights reserved.

******************************************************************************/

function registerSearchEngineMasks(rootelementid)
{new $.DxSearchHighlight({'HighlightClass':'searchhighlight','RootElementID':rootelementid,'Masks':['http(?:s|)://(?:|[^/]+[\\.])google[\\.][^/]{2,5}/.*(?:[\\?]|[&])q=([^=&]*)','http(?:s|)://(?:|[^/]+[\\.])yahoo[\\.][^/]{2,5}/.*(?:[\\?]|[&])p=([^=&]*)','http(?:s|)://(?:|[^/]+[\\.])search\\.live[\\.][^/]{2,5}/.*(?:[\\?]|[&])query=([^=&]*)','http(?:s|)://(?:|[^/]+[\\.])bing\\.[^/]{2,5}/.*(?:[\\?]|[&])q=([^=&]*)','http(?:s|)://(?:|[^/]+[\\.])search\\.aol[\\.][^/]{2,5}/.*(?:[\\?]|[&])userQuery=([^=&]*)','http(?:s|)://(?:|[^/]+[\\.])ask\\.com/.*(?:[\\?]|[&])q=([^=&]*)','http(?:s|)://(?:|[^/]+[\\.])altavista[\\.][^/]{2,5}/.*(?:[\\?]|[&])q=([^=&]*)','http(?:s|)://(?:|[^/]+[\\.])ok\\.hu/.*(?:[\\?]|[&])q=([^=&]*)','http(?:s|)://(?:|[^/]+[\\.])startlapkereso\\.hu/.*(?:[\\?]|[&])q=([^=&]*)','http(?:s|)://(?:|[^/]+[\\.])miner\\.hu/k/([^=&\\/]*)','http(?:s|)://(?:|[^/]+[\\.])bluu\\.hu/.*(?:[\\?]|[&])kerdes=([^=&]*)','/kereses/\\?expr\\=([^&]*)']});}