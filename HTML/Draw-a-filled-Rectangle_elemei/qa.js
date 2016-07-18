// --------------------------------------------------------------------
// Copyright (c) 2010, The Code Project. All rights reserved.
// --------------------------------------------------------------------

// --------------------------------------------------------------------
// This file contains common Javascript for Quick Answers.
// --------------------------------------------------------------------

var isDebug = false;
var maxRetryLimit = 3;

// Attempt to approve a tip/trick (i.e. where PublishingStatus = 'Pending')
function ApproveTip(requestUrl, jsonData, moderateDivId, approveBtnId, onApproved) {
	var moderateDiv = $('#' + moderateDivId);

	$('#' + approveBtnId).after('&nbsp;<img id="LoadingImg" src="/Images/animated_loading_blue.gif" alt="Approving.." />');
	$('#ApproveResult').remove();

	$.ajax(
	{
		type       : 'POST',
		cache      : false,
		url        : requestUrl,
		data       : jsonData,
		contentType: 'application/json; charset=utf-8',
		dataType   : 'json',
		success    : function (data) {
			$('#LoadingImg').remove();
			if (data.d.status == 'OK') {
				moderateDiv.after('<div id="ApproveResult">' + data.d.html + '</div>');
				moderateDiv.slideUp();
				if (onApproved)
					onApproved();
			}
			else {
				moderateDiv.after('<div id="ApproveResult">' + data.d.html + '</div>');
			}
		}
	});
}

// Attempt to delete a QA entry
function DeleteEntry(entryId, requestUrl, deleteLinkId, onDeleted) {
	var loadingImgId = 'LoadingImg' + entryId;
	var statusMsgId  = 'StatusMsgId' + entryId;
	$('#' + deleteLinkId).after('&nbsp;<img id="' + loadingImgId + '" src="/Images/animated_loading_blue.gif" alt="Deleting.." align="absmiddle" />');
	$('#' + statusMsgId).remove();

	$.get(requestUrl, function (data) {
		$('#' + loadingImgId).remove();
		$('#' + deleteLinkId).parent().after('<br><div class="float-right padded-top" id="' + statusMsgId + '">' + data + '</span>');
		if (onDeleted && data && data.indexOf('Deleted') != -1) {
			$('#' + deleteLinkId).remove();
			setTimeout(function () { onDeleted() }, 500);
		}
	});
}

var previewHelper = {};

// HACK: Use previewRefresh to update edit lock status as well
// TODO: Should be renamed to answer object or something like this. Then
// properties will be answer.previewEditor etc
// Register dynamic refreshing of preview
function RegisterPreviewRefresh(interval, editorId, wysiwygMode, ignoreHtmlId, 
								editLockStatusUpdateServiceUrl, objectId) {
	previewHelper.interval                       = interval;
	previewHelper.editorId                       = editorId;
	previewHelper.editorInWysiwygMode            = wysiwygMode;
	previewHelper.lastEditorContent              = "";
	previewHelper.intervalId                     = 0;
	previewHelper.objectId                       = objectId;
	previewHelper.editLockStatusUpdateServiceUrl = editLockStatusUpdateServiceUrl;
	
	$('#' + editorId).focusin(function () {
		UpdatePreview();
		previewHelper.intervalId = setInterval(UpdatePreview, interval);       
	});

	$('#' + editorId).focusout(function () {
		UpdatePreview();
		clearInterval(previewHelper.intervalId);		
	});

	$('#' + ignoreHtmlId).change(function () {
		RefreshPreview(previewHelper);
		if (previewHelper.objectId > 0)
			UpdateEditLockStatus();
	});
}

function UpdateEditLockStatus() {
	if (previewHelper.objectId <= 0)
		return;

	var jsonData = '{ articleId:   ' + previewHelper.objectId + '}';
	
	$.ajax({
			type:        'POST',
			cache:       false,
			url:         previewHelper.editLockStatusUpdateServiceUrl,
			data:        jsonData,
			contentType: 'application/json; charset=utf-8',
			dataType:    'json',
			tryCount:    0,
			retryLimit:  maxRetryLimit,
			timeout:     5000,
			success: function (msg) {
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
		}
	});
}

// Update preview area
function UpdatePreview() {
	var updated = false;
	 if (HasNewNonEmptyContent()) {
		 RefreshPreview(previewHelper);
		 updated = true;
	 }
	 else if (previewHelper.lastEditorContent == "") {
		 $("#Preview").html("&hellip;");
		 updated = true;
	 }
	 if (updated)
		 UpdateEditLockStatus();
}

// Determine if the editor has new/modified content
function HasNewNonEmptyContent() {
	var editorContent = GetEditorContent(previewHelper.editorInWysiwygMode, previewHelper.editorId);
	if (!editorContent) {
		previewHelper.lastEditorContent = "";
		return false;
	}

	// editorContent = editorContent.replace(/\s/g, ""); 

	if (editorContent == "" || editorContent == previewHelper.lastEditorContent) {
		previewHelper.lastEditorContent = editorContent;
		return false;
	}

	previewHelper.lastEditorContent = editorContent;

	if (isDebug) {
		$('#refresh-count').show();
		var refreshCount = $('#refresh-count').html();
		refreshCount = parseInt(refreshCount) + 1;
		$('#refresh-count').html(refreshCount);
	}

	return true;
}

// Get HTML content from the QA editor - appropriately escaped.
function GetEditorContent(wysiwygMode, editorId) {
	if (wysiwygMode)
		return editor.getHTML();
	else
		return $('#' + editorId)[0].value;
}

// Attempt to post a new child entry, first validating page and attempting to sign-in/register member if needed
function TryPostNewEntry(validationData, newEntryData, logonData)
{
	var htmlContent   = GetEditorContent(newEntryData.useWysiwygEditor, newEntryData.contentId);
	var postErrorDiv  = $('#' + validationData.postErrorDivId);
	var logonErrorDiv = $('#' + validationData.logonErrorDivId);

	postErrorDiv.hide();
	logonErrorDiv.hide();

	if (htmlContent.length < validationData.minContentLength)
		postErrorDiv.show().html(validationData.tooShortMsg);
	else {
		if (!logonData.loggedIn)
			DoLogon(logonData, newEntryData, validationData, postErrorDiv, logonErrorDiv);
		else
			DoPostEntry(newEntryData, validationData, postErrorDiv);
	}
}

// Attempt logon or sign-up
function DoLogon(logonData, newEntryData, validationData, postErrorDiv, logonErrorDiv) {
	var logonJson = GetLogonFormJson(logonData);

	if (logonJson != null) {
		PreSubmitUI(newEntryData);

		$.ajax(
		{
			type      : 'POST',
			cache     : false,
			url       : logonData.postUrl,
			data      : logonJson,
			dataType  : 'html',
			tryCount  : 0,
			retryLimit: maxRetryLimit,
			timeout   : 5000,
			success   : function (data) {
				var postSuccess = data == null || data.length == 0;
				PostSubmitUI(newEntryData, postSuccess,
							function () { DoPostEntry(newEntryData, validationData, postErrorDiv); });

				if (data == null) {
					postErrorDiv.show().html(validationData.generalErrorMsg);
				}
				else if (data.length > 0) {
					postErrorDiv.show().html('Failed to logon or sign-up');
					logonErrorDiv.show().html(data);
				}
			},
			error: function (xhr, textStatus, errorThrown) {
				var errorMsg;
				if (textStatus == 'timeout') {
					this.tryCount++;
					if (this.tryCount <= this.retryLimit) {
						//try again
						$.ajax(this);
						return;
					}

					errorMsg = 'We have tried to log you on ' + this.retryLimit +
								' times without success. Our servers are just a little overworked. Sorry.';
					PostSubmitUI(newEntryData, false);
					postErrorDiv.show().html(errorMsg);
					return;
				}

				if (isDebug)
					errorMsg = GetDebugError(xhr, textStatus, errorThrown);
				else if (xhr.status == 500)
					errorMsg = 'Oops! There seems to be a server problem. Please try posting your ' + newEntryData.typeName + ' later.';
				else
					errorMsg = 'Oops! There was an unexpected problem adding your ' + newEntryData.typeName + '. Please try again later.';

				PostSubmitUI(newEntryData, false);
				postErrorDiv.show().html(errorMsg);
			}
		});
	}
	else {
		postErrorDiv.show().html(validationData.generalErrorMsg);
	}
}

// Construct JSON object to be sent as AJAX request
function GetLogonFormJson(logonData) {
	if (logonData == null) return null;

	var logOnContainer = $('#' + logonData.containerId);
	if (logOnContainer.length == 0) return null;
		
	// Get sign-in info
	var jsonData = {
		'Email':		logOnContainer.find('input[name$="CurrentEmail"]').val(),
		'Password':		logOnContainer.find('input[name$="CurrentPassword"]').val(),
		'RememberMe':	true // logOnContainer.find(':checkbox[id$="RememberMe"]')[0].checked
	}

	// If no sign-in data, get signup data
	if (jsonData.Email.replace(/\s/g, "").length == 0 || jsonData.Password.replace(/\s/g, "").length == 0) {
		jsonData = {
			'Email':		logOnContainer.find('input[name$="QuickEmail"]').val(),
			'Password':		logOnContainer.find('input[name$="QuickPassword"]').val(),
			'RememberMe':	true, // logOnContainer.find(':checkbox[id$="RememberMe"]')[0].checked

			'Name':			logOnContainer.find('input[name$="QuickName"]').val(),
			'AgreeToTerms':	logOnContainer.find(':checkbox[id$="TermsOfUse"]')[0].checked,
			'Subscribe':	logOnContainer.find(':checkbox[id$="AllNewsletters"]')[0].checked
		};
	}

	return jsonData;
}

// Post a new child entry
function DoPostEntry(newEntryData, validationData, postErrorDiv) {
	var htmlContent = GetEditorContent(newEntryData.useWysiwygEditor, newEntryData.contentId);

	PreSubmitUI(newEntryData);

	postData = {
		'ParentId': newEntryData.parentId,
		'Content': htmlContent,
		'WysiwygEditorUsed': newEntryData.useWysiwygEditor,
		'IgnoreHtml': $('#' + newEntryData.ignoreHtmlId)[0].checked
	};

	$.ajax(
	{
		type      : 'POST',
		cache     : false,
		url       : newEntryData.postUrl,
		data      : postData,
		dataType  : 'json',
		tryCount  : 0,
		retryLimit: maxRetryLimit,
		timeout   : 5000,
		success   : function (data) {
			var postSuccess = data.success;
			PostSubmitUI(newEntryData, postSuccess,
						function () {
							Submitted = true;
							$('#' + newEntryData.containerId).slideUp();
							$('#new-child-loading').after(unescape(data.html));
						});

			if (!postSuccess)
				postErrorDiv.show().html(unescape(data.html));
		},
		error: function (xhr, textStatus, errorThrown) {
			if (textStatus == 'timeout') {
				this.tryCount++;
				if (this.tryCount <= this.retryLimit) {
					//try again
					$.ajax(this);
					return;
				}

				var errorMsg = 'We have tried to add your ' + newEntryData.typeName + ' ' + this.retryLimit +
								' times without success. Our servers are just a little overworked. Sorry.';
				PostSubmitUI(newEntryData, false);
				postErrorDiv.show().html(errorMsg);
				return;
			}

			var errorMessage;
			if (isDebug)
				errorMessage = GetDebugError(xhr, textStatus, errorThrown);
			else if (xhr.status == 500)
				errorMessage = 'Oops! There seems to be a server problem. Please try posting your ' + newEntryData.typeName + ' later.';
			else
				errorMessage = 'Oops! There was an unexpected problem adding your ' + newEntryData.typeName + '. Please try again later.';

			PostSubmitUI(newEntryData, false);
			postErrorDiv.show().html(errorMessage);
		}
	});
}

// Alter UI to indicate that request is being processed
function PreSubmitUI(newEntryData) {
	if ($('#new-child-loading').length == 0) {
		$('#' + newEntryData.containerId).after('<div id="new-child-loading">' +
											'<img src="/images/animated_loading_blue.gif" alt="" />' +
											'&nbsp;<span class="bold">Submitting your ' +
											newEntryData.parentTypeName + '</span></div>');
	}
	else {
		$('#new-child-loading').show();
	}

	$('#' + newEntryData.containerId).fadeTo('slow', 0.33);
	$('#' + newEntryData.submitBtnId).attr('disabled', true);
	$('#' + newEntryData.submitBtnId).css('cursor', 'wait');
	$('#' + newEntryData.helpTipsId).slideUp();
}

// Alter UI to show results of processed request
function PostSubmitUI(newEntryData, success, onSuccess) {
	$('#new-child-loading').slideUp();

	if (success && onSuccess != null) {
		onSuccess();
	}
	else {
		$('#' + newEntryData.containerId).fadeTo('normal', 1);
		$('#' + newEntryData.submitBtnId).attr('disabled', false);
		$('#' + newEntryData.submitBtnId).css('cursor', 'default');
	}
}

function GetDebugError(xhr, textStatus, errorThrown) {
	var errorMsg = 'An unexpected error occurred retrieving response.<br />';

	if (xhr == null)
		return errorMsg;

	if (xhr.status)
		errorMsg += '<b>Response error status</b>: ' + xhr.status + '.<br />';
	if (textStatus)
		errorMsg += '<b>Text-status</b>: ' + textStatus + '.<br />';
	if (errorThrown && errorThrown.message) {
		var errorText = (errorThrown + '').replace(/\\n/g, ' ');
		errorMsg += 'Click <a href="javascript:void(0)" onclick="$(\'#DbgErrorTxt\').toggle()">here</a> to show/hide error details.<br />';
		errorMsg += '<div id="DbgErrorTxt" style="display:none">' + errorText + '</div>';
	}
	if (xhr.responseText) {
		var responseText = xhr.responseText.replace(/\\n/g, ' ');
		errorMsg += 'Click <a href="javascript:void(0)" onclick="$(\'#DbgResponseTxt\').toggle()">here</a> to show/hide the response text.<br />';
		errorMsg += '<div id="DbgResponseTxt" style="display:none">' + responseText + '</div>';
	}

	return errorMsg;
}
function NavBarMenu(varName, menuSelector) {

	// Private variables ---------------------------------------------------------------------------

	var self          = this;
	var openTimeout   = 100;
	var closeTimeout  = 500;
	var openTimer     = 0;
	var closeTimer    = 0;
	var openMenuItem  = 0;
	var hoverMenuItem = 0;
	var myName        = varName;			 // Name of "this"'s variable
	var selector      = menuSelector;

	// Private methods -----------------------------------------------------------------------------

	var CancelTimer = function () {
		if (openTimer) {
			window.clearTimeout(openTimer);
			openTimer = null;
		}
	}

	var OpenMenu = function () {
		CancelTimer();
		CloseMenu();

		// hoverMenuItem is the item the cursor is currently over. it's the candidate for having its
		// submenu opened.
		if (hoverMenuItem) 
			openMenuItem = $(hoverMenuItem).addClass('open');
	}

	var CloseMenu = function () {

		// openMenuItem is the item whose submenu is currently open. We only close this menu if the 
		// cursor isn't over this, or any of this item's children.
		if (openMenuItem) {

			// This or a child of this is under the cursor? If so, don't close.
			if (openMenuItem.attr('over') || openMenuItem.find('[over=true]').length > 0)
				return;

			openMenuItem.removeClass('open');

			// This item may be a submenu of a menu and so if this item is being closed, we also
			// need to check, and close, all parent menus of this item that aren't currently under
			// the cursor.
			openMenuItem.parents('[over!=true].open').removeClass('open');
		}

		// We've closed this item, and possible parent items. We should now traverse up the 
		// hierarchy of menu items to see if there's a parent item that is open under the cursor. If
		// so, remember this as the currently opened item so we can close it when another item is
		// hovered over.
		if (openMenuItem) {
			var openParents = openMenuItem.parents('[over=true]');
			openMenuItem = (openParents.length > 0)? $(openParents[0]) : null;
		}
	}

	// Delay the open so that a cursor transiting over the menu doesn't accidentally open it.
	var ScheduleOpen = function () {
		hoverMenuItem = this;	// Candidate for having it's menu opened
		openTimer     = window.setTimeout(OpenMenu, openMenuItem? 0 : openTimeout);
	}

	// Delay the close so that a cursor accidentally leaving the menu doesn't prematurely close it.
	var ScheduleClose = function () {
		hoverMenuItem = 0;
		closeTimer    = window.setTimeout(CloseMenu, closeTimeout);
	}

	// Public methods ------------------------------------------------------------------------------

	if ($.support.opacity) // Means everyone except IE8 and below.
		$(document).ready(function () { eval(myName + '.InitMenu();'); }).click(self.CloseMenu);

	this.InitMenu = function () {
	    if (!navigator.msMaxTouchPoints) {
		    $(selector + '.openable').removeClass('openable').hover(ScheduleOpen, ScheduleClose);
		    $(selector).hover(function (e) { $(this).attr('over', 'true'); },
					          function (e) { $(this).removeAttr('over'); });
        }
	}

	// Specific to the Article dropdown. Included here just to keep it out of harm's way.
	this.ShowMap = function (prnt, elmId) {
		var map = $('#' + elmId);

		if (!prnt.populated && !prnt.populating) {
			prnt.populating = true;
			map.css({ 'height': '200px', 'width': '100px' });
			map.load("/script/content/Ajax/SiteMap.aspx", function () { prnt.populated = true; });
			window.setTimeout(this.InitMenu, 200); // process new additions to menu so they are openable.
			prnt.populated = true;
			prnt.populating = false;
		}

		if (prnt.populated) {
			this.InitMenu(); //  Just in case it didn't work the first time.

			map.css('margin', '0');
			map.css('width', 'auto');
			map.css('height', 'auto');
		}
	}

}

var navBarMenu = new NavBarMenu('navBarMenu', '.navmenu li');
var signinMenu = new NavBarMenu('signinMenu', '.member-signin');
(function ($) {
	var control, staticOffset;
	var iLastMousePos = 0;
	var iMin = 32;
	var grip;
	var vertical = false;
	$.fn.TextAreaResizer = function (verticalSizer) {
		vertical = verticalSizer;
		var focus = document.activeElement;
		return this.each(function () {
			control = $(this).addClass('processed'),
            staticOffset = null;
			if (vertical) {
				$(this).wrap('<div class="resizable-control"><div class="wrap"></div></div>').parent().parent().append($('<div class="grippie"> </div>').bind("mousedown", {
					el: this
				}, startDrag));
			} else {
				$(this).wrap('<div class="resizable-control"><span></span></div>').parent().append($('<div class="grippie"> </div>').bind("mousedown", {
					el: this
				}, startDrag));
			}
			var grippie = $('div.grippie', $(this).parent())[0];
			if (vertical) grippie.style.marginBottom = (grippie.offsetHeight - $(this)[0].offsetHeight) + 'px';
			else grippie.style.marginRight = (grippie.offsetWidth - $(this)[0].offsetWidth) + 'px';
			if (focus) focus.focus();
		})
	};

	function startDrag(e) {
		control = $(e.data.el);
		control.blur();
		iLastMousePos = vertical ? mousePosition(e).x : mousePosition(e).y;
		staticOffset = (vertical ? control.width() : control.height()) - iLastMousePos;
		control.css('opacity', 0.25);
		$(document).mousemove(performDrag).mouseup(endDrag);
		return false
	}
	function performDrag(e) {
		var iThisMousePos = vertical ? mousePosition(e).x : mousePosition(e).y;
		var iMousePos = staticOffset + iThisMousePos;
		if (iLastMousePos >= (iThisMousePos)) {
			iMousePos -= 5
		}
		iLastMousePos = iThisMousePos;
		iMousePos = Math.max(iMin, iMousePos);
		if (vertical) control.width(iMousePos + 'px');
		else control.height(iMousePos + 'px');
		if (iMousePos < iMin) {
			endDrag(e)
		}
		return false
	}
	function endDrag(e) {
		$(document).unbind('mousemove', performDrag).unbind('mouseup', endDrag);
		if (control) {
			control.css('opacity', 1);
			control.focus();
		}
		control = null;
		staticOffset = null;
		iLastMousePos = 0
	}
	function mousePosition(e) {
		return {
			x: e.clientX + document.documentElement.scrollLeft,
			y: e.clientY + document.documentElement.scrollTop
		}
	}
})(jQuery);
/*
 * jQuery Autocomplete plugin 1.1
 *
 * Copyright (c) 2009 Jörn Zaefferer
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Revision: $Id: jquery.autocomplete.js 15 2009-08-22 10:30:27Z joern.zaefferer $
 */

/*
 * Include CodeProject hack to prevent an IE bug where selecting an auto-suggest always replaces
 * first element. See jquery.autocomplete.js for readable changes.
*/

var lastCursorPos = 0; (function($) { $.fn.extend({ autocomplete: function(urlOrData, options) { var isUrl = typeof urlOrData == "string"; options = $.extend({}, $.Autocompleter.defaults, { url: isUrl ? urlOrData : null, data: isUrl ? null : urlOrData, delay: isUrl ? $.Autocompleter.defaults.delay : 10, max: options && !options.scroll ? 10 : 150 }, options); options.highlight = options.highlight || function(value) { return value }; options.formatMatch = options.formatMatch || options.formatItem; return this.each(function() { new $.Autocompleter(this, options) }) }, result: function(handler) { return this.bind("result", handler) }, search: function(handler) { return this.trigger("search", [handler]) }, flushCache: function() { return this.trigger("flushCache") }, setOptions: function(options) { return this.trigger("setOptions", [options]) }, unautocomplete: function() { return this.trigger("unautocomplete") } }); $.Autocompleter = function(input, options) { var KEY = { UP: 38, DOWN: 40, DEL: 46, TAB: 9, RETURN: 13, ESC: 27, COMMA: 188, PAGEUP: 33, PAGEDOWN: 34, BACKSPACE: 8 }; var $input = $(input).attr("autocomplete", "off").addClass(options.inputClass); var timeout; var previousValue = ""; var cache = $.Autocompleter.Cache(options); var hasFocus = 0; var lastKeyPressCode; var config = { mouseDownOnSelect: false }; var select = $.Autocompleter.Select(options, input, selectCurrent, config); var blockSubmit; $.browser.opera && $(input.form).bind("submit.autocomplete", function() { if (blockSubmit) { blockSubmit = false; return false } }); $input.bind(($.browser.opera ? "keypress" : "keydown") + ".autocomplete", function(event) { hasFocus = 1; lastKeyPressCode = event.keyCode; switch (event.keyCode) { case KEY.UP: event.preventDefault(); if (select.visible()) { select.prev() } else { onChange(0, true) } break; case KEY.DOWN: event.preventDefault(); if (select.visible()) { select.next() } else { onChange(0, true) } break; case KEY.PAGEUP: event.preventDefault(); if (select.visible()) { select.pageUp() } else { onChange(0, true) } break; case KEY.PAGEDOWN: event.preventDefault(); if (select.visible()) { select.pageDown() } else { onChange(0, true) } break; case options.multiple && $.trim(options.multipleSeparator) == "," && KEY.COMMA: case KEY.TAB: case KEY.RETURN: if (selectCurrent()) { event.preventDefault(); blockSubmit = true; return false } break; case KEY.ESC: select.hide(); break; default: clearTimeout(timeout); timeout = setTimeout(onChange, options.delay); break } }).keypress(function() { lastCursorPos = $input.selection().start }).mouseup(function() { lastCursorPos = $input.selection().start }).focus(function() { hasFocus++ }).blur(function() { hasFocus = 0; if (!config.mouseDownOnSelect) { hideResults() } }).click(function() { if (hasFocus++ > 1 && !select.visible()) { onChange(0, true) } }).bind("search", function() { var fn = (arguments.length > 1) ? arguments[1] : null; function findValueCallback(q, data) { var result; if (data && data.length) { for (var i = 0; i < data.length; i++) { if (data[i].result.toLowerCase() == q.toLowerCase()) { result = data[i]; break } } } if (typeof fn == "function") fn(result); else $input.trigger("result", result && [result.data, result.value]) } $.each(trimWords($input.val()), function(i, value) { request(value, findValueCallback, findValueCallback) }) }).bind("flushCache", function() { cache.flush() }).bind("setOptions", function() { $.extend(options, arguments[1]); if ("data" in arguments[1]) cache.populate() }).bind("unautocomplete", function() { select.unbind(); $input.unbind(); $(input.form).unbind(".autocomplete") }); function selectCurrent() { var selected = select.selected(); if (!selected) return false; var v = selected.result; previousValue = v; if (options.multiple) { var words = trimWords($input.val()); if (words.length > 1) { var seperator = options.multipleSeparator.length; var cursorAt = $(input).selection().start; if (cursorAt <= 0) cursorAt = lastCursorPos; var wordAt, progress = 0; $.each(words, function(i, word) { progress += word.length; if (cursorAt <= progress) { wordAt = i; return false } progress += seperator }); words[wordAt] = v; v = words.join(options.multipleSeparator) } v += options.multipleSeparator } $input.val(v); hideResultsNow(); $input.trigger("result", [selected.data, selected.value]); return true } function onChange(crap, skipPrevCheck) { if (lastKeyPressCode == KEY.DEL) { select.hide(); return } var currentValue = $input.val(); if (!skipPrevCheck && currentValue == previousValue) return; previousValue = currentValue; currentValue = lastWord(currentValue); if (currentValue.length >= options.minChars) { $input.addClass(options.loadingClass); if (!options.matchCase) currentValue = currentValue.toLowerCase(); request(currentValue, receiveData, hideResultsNow) } else { stopLoading(); select.hide() } }; function trimWords(value) { if (!value) return [""]; if (!options.multiple) return [$.trim(value)]; return $.map(value.split(options.multipleSeparator), function(word) { return $.trim(value).length ? $.trim(word) : null }) } function lastWord(value) { if (!options.multiple) return value; var words = trimWords(value); if (words.length == 1) return words[0]; var cursorAt = $(input).selection().start; if (cursorAt == value.length) { words = trimWords(value) } else { words = trimWords(value.replace(value.substring(cursorAt), "")) } return words[words.length - 1] } function autoFill(q, sValue) { if (options.autoFill && (lastWord($input.val()).toLowerCase() == q.toLowerCase()) && lastKeyPressCode != KEY.BACKSPACE) { $input.val($input.val() + sValue.substring(lastWord(previousValue).length)); $(input).selection(previousValue.length, previousValue.length + sValue.length) } }; function hideResults() { clearTimeout(timeout); timeout = setTimeout(hideResultsNow, 200) }; function hideResultsNow() { var wasVisible = select.visible(); select.hide(); clearTimeout(timeout); stopLoading(); if (options.mustMatch) { $input.search(function(result) { if (!result) { if (options.multiple) { var words = trimWords($input.val()).slice(0, -1); $input.val(words.join(options.multipleSeparator) + (words.length ? options.multipleSeparator : "")) } else { $input.val(""); $input.trigger("result", null) } } }) } }; function receiveData(q, data) { if (data && data.length && hasFocus) { stopLoading(); select.display(data, q); autoFill(q, data[0].value); select.show() } else { hideResultsNow() } }; function request(term, success, failure) { if (!options.matchCase) term = term.toLowerCase(); var data = cache.load(term); if (data && data.length) { success(term, data) } else if ((typeof options.url == "string") && (options.url.length > 0)) { var extraParams = { timestamp: +new Date() }; $.each(options.extraParams, function(key, param) { extraParams[key] = typeof param == "function" ? param() : param }); $.ajax({ mode: "abort", port: "autocomplete" + input.name, dataType: options.dataType, url: options.url, data: $.extend({ q: lastWord(term), limit: options.max }, extraParams), success: function(data) { var parsed = options.parse && options.parse(data) || parse(data); cache.add(term, parsed); success(term, parsed) } }) } else { select.emptyList(); failure(term) } }; function parse(data) { var parsed = []; var rows = data.split("\n"); for (var i = 0; i < rows.length; i++) { var row = $.trim(rows[i]); if (row) { row = row.split("|"); parsed[parsed.length] = { data: row, value: row[0], result: options.formatResult && options.formatResult(row, row[0]) || row[0]} } } return parsed }; function stopLoading() { $input.removeClass(options.loadingClass) } }; $.Autocompleter.defaults = { inputClass: "ac_input", resultsClass: "ac_results", loadingClass: "ac_loading", minChars: 1, delay: 400, matchCase: false, matchSubset: true, matchContains: false, cacheLength: 10, max: 100, mustMatch: false, extraParams: {}, selectFirst: true, formatItem: function(row) { return row[0] }, formatMatch: null, autoFill: false, width: 0, multiple: false, multipleSeparator: ", ", highlight: function(value, term) { return value.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + term.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi, "\\$1") + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>") }, scroll: true, scrollHeight: 180 }; $.Autocompleter.Cache = function(options) { var data = {}; var length = 0; function matchSubset(s, sub) { if (!options.matchCase) s = s.toLowerCase(); var i = s.indexOf(sub); if (options.matchContains == "word") { i = s.toLowerCase().search("\\b" + sub.toLowerCase()) } if (i == -1) return false; return i == 0 || options.matchContains }; function add(q, value) { if (length > options.cacheLength) { flush() } if (!data[q]) { length++ } data[q] = value } function populate() { if (!options.data) return false; var stMatchSets = {}, nullData = 0; if (!options.url) options.cacheLength = 1; stMatchSets[""] = []; for (var i = 0, ol = options.data.length; i < ol; i++) { var rawValue = options.data[i]; rawValue = (typeof rawValue == "string") ? [rawValue] : rawValue; var value = options.formatMatch(rawValue, i + 1, options.data.length); if (value === false) continue; var firstChar = value.charAt(0).toLowerCase(); if (!stMatchSets[firstChar]) stMatchSets[firstChar] = []; var row = { value: value, data: rawValue, result: options.formatResult && options.formatResult(rawValue) || value }; stMatchSets[firstChar].push(row); if (nullData++ < options.max) { stMatchSets[""].push(row) } }; $.each(stMatchSets, function(i, value) { options.cacheLength++; add(i, value) }) } setTimeout(populate, 25); function flush() { data = {}; length = 0 } return { flush: flush, add: add, populate: populate, load: function(q) { if (!options.cacheLength || !length) return null; if (!options.url && options.matchContains) { var csub = []; for (var k in data) { if (k.length > 0) { var c = data[k]; $.each(c, function(i, x) { if (matchSubset(x.value, q)) { csub.push(x) } }) } } return csub } else if (data[q]) { return data[q] } else if (options.matchSubset) { for (var i = q.length - 1; i >= options.minChars; i--) { var c = data[q.substr(0, i)]; if (c) { var csub = []; $.each(c, function(i, x) { if (matchSubset(x.value, q)) { csub[csub.length] = x } }); return csub } } } return null } } }; $.Autocompleter.Select = function(options, input, select, config) { var CLASSES = { ACTIVE: "ac_over" }; var listItems, active = -1, data, term = "", needsInit = true, element, list; function init() { if (!needsInit) return; element = $("<div/>").hide().addClass(options.resultsClass).css("position", "absolute").appendTo(document.body); list = $("<ul/>").appendTo(element).mouseover(function(event) { if (target(event).nodeName && target(event).nodeName.toUpperCase() == 'LI') { active = $("li", list).removeClass(CLASSES.ACTIVE).index(target(event)); $(target(event)).addClass(CLASSES.ACTIVE) } }).click(function(event) { $(target(event)).addClass(CLASSES.ACTIVE); select(); input.focus(); return false }).mousedown(function() { config.mouseDownOnSelect = true }).mouseup(function() { config.mouseDownOnSelect = false }); if (options.width > 0) element.css("width", options.width); needsInit = false } function target(event) { var element = event.target; while (element && element.tagName != "LI") element = element.parentNode; if (!element) return []; return element } function moveSelect(step) { listItems.slice(active, active + 1).removeClass(CLASSES.ACTIVE); movePosition(step); var activeItem = listItems.slice(active, active + 1).addClass(CLASSES.ACTIVE); if (options.scroll) { var offset = 0; listItems.slice(0, active).each(function() { offset += this.offsetHeight }); if ((offset + activeItem[0].offsetHeight - list.scrollTop()) > list[0].clientHeight) { list.scrollTop(offset + activeItem[0].offsetHeight - list.innerHeight()) } else if (offset < list.scrollTop()) { list.scrollTop(offset) } } }; function movePosition(step) { active += step; if (active < 0) { active = listItems.size() - 1 } else if (active >= listItems.size()) { active = 0 } } function limitNumberOfItems(available) { return options.max && options.max < available ? options.max : available } function fillList() { list.empty(); var max = limitNumberOfItems(data.length); for (var i = 0; i < max; i++) { if (!data[i]) continue; var formatted = options.formatItem(data[i].data, i + 1, max, data[i].value, term); if (formatted === false) continue; var li = $("<li/>").html(options.highlight(formatted, term)).addClass(i % 2 == 0 ? "ac_even" : "ac_odd").appendTo(list)[0]; $.data(li, "ac_data", data[i]) } listItems = list.find("li"); if (options.selectFirst) { listItems.slice(0, 1).addClass(CLASSES.ACTIVE); active = 0 } if ($.fn.bgiframe) list.bgiframe() } return { display: function(d, q) { init(); data = d; term = q; fillList() }, next: function() { moveSelect(1) }, prev: function() { moveSelect(-1) }, pageUp: function() { if (active != 0 && active - 8 < 0) { moveSelect(-active) } else { moveSelect(-8) } }, pageDown: function() { if (active != listItems.size() - 1 && active + 8 > listItems.size()) { moveSelect(listItems.size() - 1 - active) } else { moveSelect(8) } }, hide: function() { element && element.hide(); listItems && listItems.removeClass(CLASSES.ACTIVE); active = -1 }, visible: function() { return element && element.is(":visible") }, current: function() { return this.visible() && (listItems.filter("." + CLASSES.ACTIVE)[0] || options.selectFirst && listItems[0]) }, show: function() { var offset = $(input).offset(); element.css({ width: typeof options.width == "string" || options.width > 0 ? options.width : $(input).width(), top: offset.top + input.offsetHeight, left: offset.left }).show(); if (options.scroll) { list.scrollTop(0); list.css({ maxHeight: options.scrollHeight, overflow: 'auto' }); if ($.browser.msie && typeof document.body.style.maxHeight === "undefined") { var listHeight = 0; listItems.each(function() { listHeight += this.offsetHeight }); var scrollbarsVisible = listHeight > options.scrollHeight; list.css('height', scrollbarsVisible ? options.scrollHeight : listHeight); if (!scrollbarsVisible) { listItems.width(list.width() - parseInt(listItems.css("padding-left")) - parseInt(listItems.css("padding-right"))) } } } }, selected: function() { var selected = listItems && listItems.filter("." + CLASSES.ACTIVE).removeClass(CLASSES.ACTIVE); return selected && selected.length && $.data(selected[0], "ac_data") }, emptyList: function() { list && list.empty() }, unbind: function() { element && element.remove() } } }; $.fn.selection = function(start, end) { if (start !== undefined) { return this.each(function() { if (this.createTextRange) { var selRange = this.createTextRange(); if (end === undefined || start == end) { selRange.move("character", start); selRange.select() } else { selRange.collapse(true); selRange.moveStart("character", start); selRange.moveEnd("character", end); selRange.select() } } else if (this.setSelectionRange) { this.setSelectionRange(start, end) } else if (this.selectionStart) { this.selectionStart = start; this.selectionEnd = end } }) } var field = this[0]; if (field.createTextRange) { var range = document.selection.createRange(), orig = field.value, teststring = "<->", textLength = range.text.length; range.text = teststring; var caretAt = field.value.indexOf(teststring); field.value = orig; this.selection(caretAt, caretAt + textLength); return { start: caretAt, end: caretAt + textLength} } else if (field.selectionStart !== undefined) { return { start: field.selectionStart, end: field.selectionEnd} } } })(jQuery);
(function(n){n.fn.hoverIntent=function(t,i){var r={sensitivity:7,interval:100,timeout:0};r=n.extend(r,i?{over:t,out:i}:t);var u,f,e,o,s=function(n){u=n.pageX;f=n.pageY},h=function(t,i){if(i.hoverIntent_t=clearTimeout(i.hoverIntent_t),Math.abs(e-u)+Math.abs(o-f)<r.sensitivity)return n(i).unbind("mousemove",s),i.hoverIntent_s=1,r.over.apply(i,[t]);e=u;o=f;i.hoverIntent_t=setTimeout(function(){h(t,i)},r.interval)},l=function(n,t){return t.hoverIntent_t=clearTimeout(t.hoverIntent_t),t.hoverIntent_s=0,r.out.apply(t,[n])},c=function(t){var u=jQuery.extend({},t),i=this;i.hoverIntent_t&&(i.hoverIntent_t=clearTimeout(i.hoverIntent_t));t.type=="mouseenter"?(e=u.pageX,o=u.pageY,n(i).bind("mousemove",s),i.hoverIntent_s!=1&&(i.hoverIntent_t=setTimeout(function(){h(u,i)},r.interval))):(n(i).unbind("mousemove",s),i.hoverIntent_s==1&&(i.hoverIntent_t=setTimeout(function(){l(u,i)},r.timeout)))};return this.bind("mouseenter",c).bind("mouseleave",c)}})(jQuery);
/*******

	***	Anchor Slider by Cedric Dugas   ***
	*** Http://www.position-absolute.com ***
	
	Never have an anchor jumping your content, slide it.

	Don't forget to put an id to your anchor !
	You can use and modify this script for any project you want, but please leave this comment as credit.
	
*****/

function scrollToAnchor(hash, settings) {

    settings = jQuery.extend({
        speed: 1100
    }, settings);

    var elmId;
    var anchorIndex = hash.indexOf("#");
    if (anchorIndex > 0)
    	elmId = hash.substring(anchorIndex);
    else
    	elmId = hash;

	var destination = $(elmId);

	if (destination.length > 0) {
		var top = destination.offset().top;
		$("html:not(:animated),body:not(:animated)").animate({ scrollTop: top }, settings.speed, function () {
			window.location.hash = hash
		});
	}

	return false;
}

function anchorAnimate(settings) {

	$('a.anchorLink').each(function () {
		var caller = this;

		$(caller).click(function (event) {
			event.preventDefault();
			var locationHref = window.location.href
			var elementClick = $(caller).attr("href")

			var destination;
			var anchorIndex = elementClick.indexOf("#");
			if (anchorIndex > 0)
				destination = elementClick.substring(anchorIndex);
			else
				destination = elementClick;

			return scrollToAnchor(destination, settings);
		});
	});
}
/*!
 * jQuery UI 1.8.6
 *
 * Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI
 */
(function(c,j){function k(a){return!c(a).parents().andSelf().filter(function(){return c.curCSS(this,"visibility")==="hidden"||c.expr.filters.hidden(this)}).length}c.ui=c.ui||{};if(!c.ui.version){c.extend(c.ui,{version:"1.8.6",keyCode:{ALT:18,BACKSPACE:8,CAPS_LOCK:20,COMMA:188,COMMAND:91,COMMAND_LEFT:91,COMMAND_RIGHT:93,CONTROL:17,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,INSERT:45,LEFT:37,MENU:93,NUMPAD_ADD:107,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,NUMPAD_ENTER:108,NUMPAD_MULTIPLY:106,
NUMPAD_SUBTRACT:109,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SHIFT:16,SPACE:32,TAB:9,UP:38,WINDOWS:91}});c.fn.extend({_focus:c.fn.focus,focus:function(a,b){return typeof a==="number"?this.each(function(){var d=this;setTimeout(function(){c(d).focus();b&&b.call(d)},a)}):this._focus.apply(this,arguments)},scrollParent:function(){var a;a=c.browser.msie&&/(static|relative)/.test(this.css("position"))||/absolute/.test(this.css("position"))?this.parents().filter(function(){return/(relative|absolute|fixed)/.test(c.curCSS(this,
"position",1))&&/(auto|scroll)/.test(c.curCSS(this,"overflow",1)+c.curCSS(this,"overflow-y",1)+c.curCSS(this,"overflow-x",1))}).eq(0):this.parents().filter(function(){return/(auto|scroll)/.test(c.curCSS(this,"overflow",1)+c.curCSS(this,"overflow-y",1)+c.curCSS(this,"overflow-x",1))}).eq(0);return/fixed/.test(this.css("position"))||!a.length?c(document):a},zIndex:function(a){if(a!==j)return this.css("zIndex",a);if(this.length){a=c(this[0]);for(var b;a.length&&a[0]!==document;){b=a.css("position");
if(b==="absolute"||b==="relative"||b==="fixed"){b=parseInt(a.css("zIndex"),10);if(!isNaN(b)&&b!==0)return b}a=a.parent()}}return 0},disableSelection:function(){return this.bind((c.support.selectstart?"selectstart":"mousedown")+".ui-disableSelection",function(a){a.preventDefault()})},enableSelection:function(){return this.unbind(".ui-disableSelection")}});c.each(["Width","Height"],function(a,b){function d(f,g,l,m){c.each(e,function(){g-=parseFloat(c.curCSS(f,"padding"+this,true))||0;if(l)g-=parseFloat(c.curCSS(f,
"border"+this+"Width",true))||0;if(m)g-=parseFloat(c.curCSS(f,"margin"+this,true))||0});return g}var e=b==="Width"?["Left","Right"]:["Top","Bottom"],h=b.toLowerCase(),i={innerWidth:c.fn.innerWidth,innerHeight:c.fn.innerHeight,outerWidth:c.fn.outerWidth,outerHeight:c.fn.outerHeight};c.fn["inner"+b]=function(f){if(f===j)return i["inner"+b].call(this);return this.each(function(){c(this).css(h,d(this,f)+"px")})};c.fn["outer"+b]=function(f,g){if(typeof f!=="number")return i["outer"+b].call(this,f);return this.each(function(){c(this).css(h,
d(this,f,true,g)+"px")})}});c.extend(c.expr[":"],{data:function(a,b,d){return!!c.data(a,d[3])},focusable:function(a){var b=a.nodeName.toLowerCase(),d=c.attr(a,"tabindex");if("area"===b){b=a.parentNode;d=b.name;if(!a.href||!d||b.nodeName.toLowerCase()!=="map")return false;a=c("img[usemap=#"+d+"]")[0];return!!a&&k(a)}return(/input|select|textarea|button|object/.test(b)?!a.disabled:"a"==b?a.href||!isNaN(d):!isNaN(d))&&k(a)},tabbable:function(a){var b=c.attr(a,"tabindex");return(isNaN(b)||b>=0)&&c(a).is(":focusable")}});
c(function(){var a=document.body,b=a.appendChild(b=document.createElement("div"));c.extend(b.style,{minHeight:"100px",height:"auto",padding:0,borderWidth:0});c.support.minHeight=b.offsetHeight===100;c.support.selectstart="onselectstart"in b;a.removeChild(b).style.display="none"});c.extend(c.ui,{plugin:{add:function(a,b,d){a=c.ui[a].prototype;for(var e in d){a.plugins[e]=a.plugins[e]||[];a.plugins[e].push([b,d[e]])}},call:function(a,b,d){if((b=a.plugins[b])&&a.element[0].parentNode)for(var e=0;e<b.length;e++)a.options[b[e][0]]&&
b[e][1].apply(a.element,d)}},contains:function(a,b){return document.compareDocumentPosition?a.compareDocumentPosition(b)&16:a!==b&&a.contains(b)},hasScroll:function(a,b){if(c(a).css("overflow")==="hidden")return false;b=b&&b==="left"?"scrollLeft":"scrollTop";var d=false;if(a[b]>0)return true;a[b]=1;d=a[b]>0;a[b]=0;return d},isOverAxis:function(a,b,d){return a>b&&a<b+d},isOver:function(a,b,d,e,h,i){return c.ui.isOverAxis(a,d,h)&&c.ui.isOverAxis(b,e,i)}})}})(jQuery);
;/*!
 * jQuery UI Widget 1.8.6
 *
 * Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Widget
 */
(function(b,j){if(b.cleanData){var k=b.cleanData;b.cleanData=function(a){for(var c=0,d;(d=a[c])!=null;c++)b(d).triggerHandler("remove");k(a)}}else{var l=b.fn.remove;b.fn.remove=function(a,c){return this.each(function(){if(!c)if(!a||b.filter(a,[this]).length)b("*",this).add([this]).each(function(){b(this).triggerHandler("remove")});return l.call(b(this),a,c)})}}b.widget=function(a,c,d){var e=a.split(".")[0],f;a=a.split(".")[1];f=e+"-"+a;if(!d){d=c;c=b.Widget}b.expr[":"][f]=function(h){return!!b.data(h,
a)};b[e]=b[e]||{};b[e][a]=function(h,g){arguments.length&&this._createWidget(h,g)};c=new c;c.options=b.extend(true,{},c.options);b[e][a].prototype=b.extend(true,c,{namespace:e,widgetName:a,widgetEventPrefix:b[e][a].prototype.widgetEventPrefix||a,widgetBaseClass:f},d);b.widget.bridge(a,b[e][a])};b.widget.bridge=function(a,c){b.fn[a]=function(d){var e=typeof d==="string",f=Array.prototype.slice.call(arguments,1),h=this;d=!e&&f.length?b.extend.apply(null,[true,d].concat(f)):d;if(e&&d.charAt(0)==="_")return h;
e?this.each(function(){var g=b.data(this,a),i=g&&b.isFunction(g[d])?g[d].apply(g,f):g;if(i!==g&&i!==j){h=i;return false}}):this.each(function(){var g=b.data(this,a);g?g.option(d||{})._init():b.data(this,a,new c(d,this))});return h}};b.Widget=function(a,c){arguments.length&&this._createWidget(a,c)};b.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",options:{disabled:false},_createWidget:function(a,c){b.data(c,this.widgetName,this);this.element=b(c);this.options=b.extend(true,{},this.options,
this._getCreateOptions(),a);var d=this;this.element.bind("remove."+this.widgetName,function(){d.destroy()});this._create();this._trigger("create");this._init()},_getCreateOptions:function(){return b.metadata&&b.metadata.get(this.element[0])[this.widgetName]},_create:function(){},_init:function(){},destroy:function(){this.element.unbind("."+this.widgetName).removeData(this.widgetName);this.widget().unbind("."+this.widgetName).removeAttr("aria-disabled").removeClass(this.widgetBaseClass+"-disabled ui-state-disabled")},
widget:function(){return this.element},option:function(a,c){var d=a;if(arguments.length===0)return b.extend({},this.options);if(typeof a==="string"){if(c===j)return this.options[a];d={};d[a]=c}this._setOptions(d);return this},_setOptions:function(a){var c=this;b.each(a,function(d,e){c._setOption(d,e)});return this},_setOption:function(a,c){this.options[a]=c;if(a==="disabled")this.widget()[c?"addClass":"removeClass"](this.widgetBaseClass+"-disabled ui-state-disabled").attr("aria-disabled",c);return this},
enable:function(){return this._setOption("disabled",false)},disable:function(){return this._setOption("disabled",true)},_trigger:function(a,c,d){var e=this.options[a];c=b.Event(c);c.type=(a===this.widgetEventPrefix?a:this.widgetEventPrefix+a).toLowerCase();d=d||{};if(c.originalEvent){a=b.event.props.length;for(var f;a;){f=b.event.props[--a];c[f]=c.originalEvent[f]}}this.element.trigger(c,d);return!(b.isFunction(e)&&e.call(this.element[0],c,d)===false||c.isDefaultPrevented())}}})(jQuery);
;/*
 * jQuery UI Position 1.8.6
 *
 * Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Position
 */
(function(c){c.ui=c.ui||{};var n=/left|center|right/,o=/top|center|bottom/,t=c.fn.position,u=c.fn.offset;c.fn.position=function(b){if(!b||!b.of)return t.apply(this,arguments);b=c.extend({},b);var a=c(b.of),d=a[0],g=(b.collision||"flip").split(" "),e=b.offset?b.offset.split(" "):[0,0],h,k,j;if(d.nodeType===9){h=a.width();k=a.height();j={top:0,left:0}}else if(d.setTimeout){h=a.width();k=a.height();j={top:a.scrollTop(),left:a.scrollLeft()}}else if(d.preventDefault){b.at="left top";h=k=0;j={top:b.of.pageY,
left:b.of.pageX}}else{h=a.outerWidth();k=a.outerHeight();j=a.offset()}c.each(["my","at"],function(){var f=(b[this]||"").split(" ");if(f.length===1)f=n.test(f[0])?f.concat(["center"]):o.test(f[0])?["center"].concat(f):["center","center"];f[0]=n.test(f[0])?f[0]:"center";f[1]=o.test(f[1])?f[1]:"center";b[this]=f});if(g.length===1)g[1]=g[0];e[0]=parseInt(e[0],10)||0;if(e.length===1)e[1]=e[0];e[1]=parseInt(e[1],10)||0;if(b.at[0]==="right")j.left+=h;else if(b.at[0]==="center")j.left+=h/2;if(b.at[1]==="bottom")j.top+=
k;else if(b.at[1]==="center")j.top+=k/2;j.left+=e[0];j.top+=e[1];return this.each(function(){var f=c(this),l=f.outerWidth(),m=f.outerHeight(),p=parseInt(c.curCSS(this,"marginLeft",true))||0,q=parseInt(c.curCSS(this,"marginTop",true))||0,v=l+p+parseInt(c.curCSS(this,"marginRight",true))||0,w=m+q+parseInt(c.curCSS(this,"marginBottom",true))||0,i=c.extend({},j),r;if(b.my[0]==="right")i.left-=l;else if(b.my[0]==="center")i.left-=l/2;if(b.my[1]==="bottom")i.top-=m;else if(b.my[1]==="center")i.top-=m/2;
i.left=parseInt(i.left);i.top=parseInt(i.top);r={left:i.left-p,top:i.top-q};c.each(["left","top"],function(s,x){c.ui.position[g[s]]&&c.ui.position[g[s]][x](i,{targetWidth:h,targetHeight:k,elemWidth:l,elemHeight:m,collisionPosition:r,collisionWidth:v,collisionHeight:w,offset:e,my:b.my,at:b.at})});c.fn.bgiframe&&f.bgiframe();f.offset(c.extend(i,{using:b.using}))})};c.ui.position={fit:{left:function(b,a){var d=c(window);d=a.collisionPosition.left+a.collisionWidth-d.width()-d.scrollLeft();b.left=d>0?
b.left-d:Math.max(b.left-a.collisionPosition.left,b.left)},top:function(b,a){var d=c(window);d=a.collisionPosition.top+a.collisionHeight-d.height()-d.scrollTop();b.top=d>0?b.top-d:Math.max(b.top-a.collisionPosition.top,b.top)}},flip:{left:function(b,a){if(a.at[0]!=="center"){var d=c(window);d=a.collisionPosition.left+a.collisionWidth-d.width()-d.scrollLeft();var g=a.my[0]==="left"?-a.elemWidth:a.my[0]==="right"?a.elemWidth:0,e=a.at[0]==="left"?a.targetWidth:-a.targetWidth,h=-2*a.offset[0];b.left+=
a.collisionPosition.left<0?g+e+h:d>0?g+e+h:0}},top:function(b,a){if(a.at[1]!=="center"){var d=c(window);d=a.collisionPosition.top+a.collisionHeight-d.height()-d.scrollTop();var g=a.my[1]==="top"?-a.elemHeight:a.my[1]==="bottom"?a.elemHeight:0,e=a.at[1]==="top"?a.targetHeight:-a.targetHeight,h=-2*a.offset[1];b.top+=a.collisionPosition.top<0?g+e+h:d>0?g+e+h:0}}}};if(!c.offset.setOffset){c.offset.setOffset=function(b,a){if(/static/.test(c.curCSS(b,"position")))b.style.position="relative";var d=c(b),
g=d.offset(),e=parseInt(c.curCSS(b,"top",true),10)||0,h=parseInt(c.curCSS(b,"left",true),10)||0;g={top:a.top-g.top+e,left:a.left-g.left+h};"using"in a?a.using.call(b,g):d.css(g)};c.fn.offset=function(b){var a=this[0];if(!a||!a.ownerDocument)return null;if(b)return this.each(function(){c.offset.setOffset(this,b)});return u.call(this)}}})(jQuery);
;/*
 * jQuery UI Dialog 1.8.6
 *
 * Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Dialog
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *  jquery.ui.button.js
 *	jquery.ui.draggable.js
 *	jquery.ui.mouse.js
 *	jquery.ui.position.js
 *	jquery.ui.resizable.js
 */
(function(c,j){var k={buttons:true,height:true,maxHeight:true,maxWidth:true,minHeight:true,minWidth:true,width:true},l={maxHeight:true,maxWidth:true,minHeight:true,minWidth:true};c.widget("ui.dialog",{options:{autoOpen:true,buttons:{},closeOnEscape:true,closeText:"close",dialogClass:"",draggable:true,hide:null,height:"auto",maxHeight:false,maxWidth:false,minHeight:150,minWidth:150,modal:false,position:{my:"center",at:"center",of:window,collision:"fit",using:function(a){var b=c(this).css(a).offset().top;
b<0&&c(this).css("top",a.top-b)}},resizable:true,show:null,stack:true,title:"",width:300,zIndex:1E3},_create:function(){this.originalTitle=this.element.attr("title");if(typeof this.originalTitle!=="string")this.originalTitle="";this.options.title=this.options.title||this.originalTitle;var a=this,b=a.options,d=b.title||"&#160;",e=c.ui.dialog.getTitleId(a.element),g=(a.uiDialog=c("<div></div>")).appendTo(document.body).hide().addClass("ui-dialog ui-widget ui-widget-content ui-corner-all "+b.dialogClass).css({zIndex:b.zIndex}).attr("tabIndex",
-1).css("outline",0).keydown(function(i){if(b.closeOnEscape&&i.keyCode&&i.keyCode===c.ui.keyCode.ESCAPE){a.close(i);i.preventDefault()}}).attr({role:"dialog","aria-labelledby":e}).mousedown(function(i){a.moveToTop(false,i)});a.element.show().removeAttr("title").addClass("ui-dialog-content ui-widget-content").appendTo(g);var f=(a.uiDialogTitlebar=c("<div></div>")).addClass("ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix").prependTo(g),h=c('<a href="#"></a>').addClass("ui-dialog-titlebar-close ui-corner-all").attr("role",
"button").hover(function(){h.addClass("ui-state-hover")},function(){h.removeClass("ui-state-hover")}).focus(function(){h.addClass("ui-state-focus")}).blur(function(){h.removeClass("ui-state-focus")}).click(function(i){a.close(i);return false}).appendTo(f);(a.uiDialogTitlebarCloseText=c("<span></span>")).addClass("ui-icon ui-icon-closethick").text(b.closeText).appendTo(h);c("<span></span>").addClass("ui-dialog-title").attr("id",e).html(d).prependTo(f);if(c.isFunction(b.beforeclose)&&!c.isFunction(b.beforeClose))b.beforeClose=
b.beforeclose;f.find("*").add(f).disableSelection();b.draggable&&c.fn.draggable&&a._makeDraggable();b.resizable&&c.fn.resizable&&a._makeResizable();a._createButtons(b.buttons);a._isOpen=false;c.fn.bgiframe&&g.bgiframe()},_init:function(){this.options.autoOpen&&this.open()},destroy:function(){var a=this;a.overlay&&a.overlay.destroy();a.uiDialog.hide();a.element.unbind(".dialog").removeData("dialog").removeClass("ui-dialog-content ui-widget-content").hide().appendTo("body");a.uiDialog.remove();a.originalTitle&&
a.element.attr("title",a.originalTitle);return a},widget:function(){return this.uiDialog},close:function(a){var b=this,d;if(false!==b._trigger("beforeClose",a)){b.overlay&&b.overlay.destroy();b.uiDialog.unbind("keypress.ui-dialog");b._isOpen=false;if(b.options.hide)b.uiDialog.hide(b.options.hide,function(){b._trigger("close",a)});else{b.uiDialog.hide();b._trigger("close",a)}c.ui.dialog.overlay.resize();if(b.options.modal){d=0;c(".ui-dialog").each(function(){if(this!==b.uiDialog[0])d=Math.max(d,c(this).css("z-index"))});
c.ui.dialog.maxZ=d}return b}},isOpen:function(){return this._isOpen},moveToTop:function(a,b){var d=this,e=d.options;if(e.modal&&!a||!e.stack&&!e.modal)return d._trigger("focus",b);if(e.zIndex>c.ui.dialog.maxZ)c.ui.dialog.maxZ=e.zIndex;if(d.overlay){c.ui.dialog.maxZ+=1;d.overlay.$el.css("z-index",c.ui.dialog.overlay.maxZ=c.ui.dialog.maxZ)}a={scrollTop:d.element.attr("scrollTop"),scrollLeft:d.element.attr("scrollLeft")};c.ui.dialog.maxZ+=1;d.uiDialog.css("z-index",c.ui.dialog.maxZ);d.element.attr(a);
d._trigger("focus",b);return d},open:function(){if(!this._isOpen){var a=this,b=a.options,d=a.uiDialog;a.overlay=b.modal?new c.ui.dialog.overlay(a):null;a._size();a._position(b.position);d.show(b.show);a.moveToTop(true);b.modal&&d.bind("keypress.ui-dialog",function(e){if(e.keyCode===c.ui.keyCode.TAB){var g=c(":tabbable",this),f=g.filter(":first");g=g.filter(":last");if(e.target===g[0]&&!e.shiftKey){f.focus(1);return false}else if(e.target===f[0]&&e.shiftKey){g.focus(1);return false}}});c(a.element.find(":tabbable").get().concat(d.find(".ui-dialog-buttonpane :tabbable").get().concat(d.get()))).eq(0).focus();
a._isOpen=true;a._trigger("open");return a}},_createButtons:function(a){var b=this,d=false,e=c("<div></div>").addClass("ui-dialog-buttonpane ui-widget-content ui-helper-clearfix"),g=c("<div></div>").addClass("ui-dialog-buttonset").appendTo(e);b.uiDialog.find(".ui-dialog-buttonpane").remove();typeof a==="object"&&a!==null&&c.each(a,function(){return!(d=true)});if(d){c.each(a,function(f,h){h=c.isFunction(h)?{click:h,text:f}:h;f=c('<button type="button"></button>').attr(h,true).unbind("click").click(function(){h.click.apply(b.element[0],
arguments)}).appendTo(g);c.fn.button&&f.button()});e.appendTo(b.uiDialog)}},_makeDraggable:function(){function a(f){return{position:f.position,offset:f.offset}}var b=this,d=b.options,e=c(document),g;b.uiDialog.draggable({cancel:".ui-dialog-content, .ui-dialog-titlebar-close",handle:".ui-dialog-titlebar",containment:"document",start:function(f,h){g=d.height==="auto"?"auto":c(this).height();c(this).height(c(this).height()).addClass("ui-dialog-dragging");b._trigger("dragStart",f,a(h))},drag:function(f,
h){b._trigger("drag",f,a(h))},stop:function(f,h){d.position=[h.position.left-e.scrollLeft(),h.position.top-e.scrollTop()];c(this).removeClass("ui-dialog-dragging").height(g);b._trigger("dragStop",f,a(h));c.ui.dialog.overlay.resize()}})},_makeResizable:function(a){function b(f){return{originalPosition:f.originalPosition,originalSize:f.originalSize,position:f.position,size:f.size}}a=a===j?this.options.resizable:a;var d=this,e=d.options,g=d.uiDialog.css("position");a=typeof a==="string"?a:"n,e,s,w,se,sw,ne,nw";
d.uiDialog.resizable({cancel:".ui-dialog-content",containment:"document",alsoResize:d.element,maxWidth:e.maxWidth,maxHeight:e.maxHeight,minWidth:e.minWidth,minHeight:d._minHeight(),handles:a,start:function(f,h){c(this).addClass("ui-dialog-resizing");d._trigger("resizeStart",f,b(h))},resize:function(f,h){d._trigger("resize",f,b(h))},stop:function(f,h){c(this).removeClass("ui-dialog-resizing");e.height=c(this).height();e.width=c(this).width();d._trigger("resizeStop",f,b(h));c.ui.dialog.overlay.resize()}}).css("position",
g).find(".ui-resizable-se").addClass("ui-icon ui-icon-grip-diagonal-se")},_minHeight:function(){var a=this.options;return a.height==="auto"?a.minHeight:Math.min(a.minHeight,a.height)},_position:function(a){var b=[],d=[0,0],e;if(a){if(typeof a==="string"||typeof a==="object"&&"0"in a){b=a.split?a.split(" "):[a[0],a[1]];if(b.length===1)b[1]=b[0];c.each(["left","top"],function(g,f){if(+b[g]===b[g]){d[g]=b[g];b[g]=f}});a={my:b.join(" "),at:b.join(" "),offset:d.join(" ")}}a=c.extend({},c.ui.dialog.prototype.options.position,
a)}else a=c.ui.dialog.prototype.options.position;(e=this.uiDialog.is(":visible"))||this.uiDialog.show();this.uiDialog.css({top:0,left:0}).position(a);e||this.uiDialog.hide()},_setOptions:function(a){var b=this,d={},e=false;c.each(a,function(g,f){b._setOption(g,f);if(g in k)e=true;if(g in l)d[g]=f});e&&this._size();this.uiDialog.is(":data(resizable)")&&this.uiDialog.resizable("option",d)},_setOption:function(a,b){var d=this,e=d.uiDialog;switch(a){case "beforeclose":a="beforeClose";break;case "buttons":d._createButtons(b);
break;case "closeText":d.uiDialogTitlebarCloseText.text(""+b);break;case "dialogClass":e.removeClass(d.options.dialogClass).addClass("ui-dialog ui-widget ui-widget-content ui-corner-all "+b);break;case "disabled":b?e.addClass("ui-dialog-disabled"):e.removeClass("ui-dialog-disabled");break;case "draggable":var g=e.is(":data(draggable)");g&&!b&&e.draggable("destroy");!g&&b&&d._makeDraggable();break;case "position":d._position(b);break;case "resizable":(g=e.is(":data(resizable)"))&&!b&&e.resizable("destroy");
g&&typeof b==="string"&&e.resizable("option","handles",b);!g&&b!==false&&d._makeResizable(b);break;case "title":c(".ui-dialog-title",d.uiDialogTitlebar).html(""+(b||"&#160;"));break}c.Widget.prototype._setOption.apply(d,arguments)},_size:function(){var a=this.options,b,d;this.element.show().css({width:"auto",minHeight:0,height:0});if(a.minWidth>a.width)a.width=a.minWidth;b=this.uiDialog.css({height:"auto",width:a.width}).height();d=Math.max(0,a.minHeight-b);if(a.height==="auto")if(c.support.minHeight)this.element.css({minHeight:d,
height:"auto"});else{this.uiDialog.show();a=this.element.css("height","auto").height();this.uiDialog.hide();this.element.height(Math.max(a,d))}else this.element.height(Math.max(a.height-b,0));this.uiDialog.is(":data(resizable)")&&this.uiDialog.resizable("option","minHeight",this._minHeight())}});c.extend(c.ui.dialog,{version:"1.8.6",uuid:0,maxZ:0,getTitleId:function(a){a=a.attr("id");if(!a){this.uuid+=1;a=this.uuid}return"ui-dialog-title-"+a},overlay:function(a){this.$el=c.ui.dialog.overlay.create(a)}});
c.extend(c.ui.dialog.overlay,{instances:[],oldInstances:[],maxZ:0,events:c.map("focus,mousedown,mouseup,keydown,keypress,click".split(","),function(a){return a+".dialog-overlay"}).join(" "),create:function(a){if(this.instances.length===0){setTimeout(function(){c.ui.dialog.overlay.instances.length&&c(document).bind(c.ui.dialog.overlay.events,function(d){if(c(d.target).zIndex()<c.ui.dialog.overlay.maxZ)return false})},1);c(document).bind("keydown.dialog-overlay",function(d){if(a.options.closeOnEscape&&
d.keyCode&&d.keyCode===c.ui.keyCode.ESCAPE){a.close(d);d.preventDefault()}});c(window).bind("resize.dialog-overlay",c.ui.dialog.overlay.resize)}var b=(this.oldInstances.pop()||c("<div></div>").addClass("ui-widget-overlay")).appendTo(document.body).css({width:this.width(),height:this.height()});c.fn.bgiframe&&b.bgiframe();this.instances.push(b);return b},destroy:function(a){this.oldInstances.push(this.instances.splice(c.inArray(a,this.instances),1)[0]);this.instances.length===0&&c([document,window]).unbind(".dialog-overlay");
a.remove();var b=0;c.each(this.instances,function(){b=Math.max(b,this.css("z-index"))});this.maxZ=b},height:function(){var a,b;if(c.browser.msie&&c.browser.version<7){a=Math.max(document.documentElement.scrollHeight,document.body.scrollHeight);b=Math.max(document.documentElement.offsetHeight,document.body.offsetHeight);return a<b?c(window).height()+"px":a+"px"}else return c(document).height()+"px"},width:function(){var a,b;if(c.browser.msie&&c.browser.version<7){a=Math.max(document.documentElement.scrollWidth,
document.body.scrollWidth);b=Math.max(document.documentElement.offsetWidth,document.body.offsetWidth);return a<b?c(window).width()+"px":a+"px"}else return c(document).width()+"px"},resize:function(){var a=c([]);c.each(c.ui.dialog.overlay.instances,function(){a=a.add(this)});a.css({width:0,height:0}).css({width:c.ui.dialog.overlay.width(),height:c.ui.dialog.overlay.height()})}});c.extend(c.ui.dialog.overlay.prototype,{destroy:function(){c.ui.dialog.overlay.destroy(this.$el)}})})(jQuery);
;/*
 * jQuery UI Tabs 1.8.6
 *
 * Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Tabs
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 */
(function(d,p){function u(){return++v}function w(){return++x}var v=0,x=0;d.widget("ui.tabs",{options:{add:null,ajaxOptions:null,cache:false,cookie:null,collapsible:false,disable:null,disabled:[],enable:null,event:"click",fx:null,idPrefix:"ui-tabs-",load:null,panelTemplate:"<div></div>",remove:null,select:null,show:null,spinner:"<em>Loading&#8230;</em>",tabTemplate:"<li><a href='#{href}'><span>#{label}</span></a></li>"},_create:function(){this._tabify(true)},_setOption:function(b,e){if(b=="selected")this.options.collapsible&&
e==this.options.selected||this.select(e);else{this.options[b]=e;this._tabify()}},_tabId:function(b){return b.title&&b.title.replace(/\s/g,"_").replace(/[^\w\u00c0-\uFFFF-]/g,"")||this.options.idPrefix+u()},_sanitizeSelector:function(b){return b.replace(/:/g,"\\:")},_cookie:function(){var b=this.cookie||(this.cookie=this.options.cookie.name||"ui-tabs-"+w());return d.cookie.apply(null,[b].concat(d.makeArray(arguments)))},_ui:function(b,e){return{tab:b,panel:e,index:this.anchors.index(b)}},_cleanup:function(){this.lis.filter(".ui-state-processing").removeClass("ui-state-processing").find("span:data(label.tabs)").each(function(){var b=
d(this);b.html(b.data("label.tabs")).removeData("label.tabs")})},_tabify:function(b){function e(g,f){g.css("display","");!d.support.opacity&&f.opacity&&g[0].style.removeAttribute("filter")}var a=this,c=this.options,h=/^#.+/;this.list=this.element.find("ol,ul").eq(0);this.lis=d(" > li:has(a[href])",this.list);this.anchors=this.lis.map(function(){return d("a",this)[0]});this.panels=d([]);this.anchors.each(function(g,f){var i=d(f).attr("href"),l=i.split("#")[0],q;if(l&&(l===location.toString().split("#")[0]||
(q=d("base")[0])&&l===q.href)){i=f.hash;f.href=i}if(h.test(i))a.panels=a.panels.add(a._sanitizeSelector(i));else if(i&&i!=="#"){d.data(f,"href.tabs",i);d.data(f,"load.tabs",i.replace(/#.*$/,""));i=a._tabId(f);f.href="#"+i;f=d("#"+i);if(!f.length){f=d(c.panelTemplate).attr("id",i).addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").insertAfter(a.panels[g-1]||a.list);f.data("destroy.tabs",true)}a.panels=a.panels.add(f)}else c.disabled.push(g)});if(b){this.element.addClass("ui-tabs ui-widget ui-widget-content ui-corner-all");
this.list.addClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all");this.lis.addClass("ui-state-default ui-corner-top");this.panels.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom");if(c.selected===p){location.hash&&this.anchors.each(function(g,f){if(f.hash==location.hash){c.selected=g;return false}});if(typeof c.selected!=="number"&&c.cookie)c.selected=parseInt(a._cookie(),10);if(typeof c.selected!=="number"&&this.lis.filter(".ui-tabs-selected").length)c.selected=
this.lis.index(this.lis.filter(".ui-tabs-selected"));c.selected=c.selected||(this.lis.length?0:-1)}else if(c.selected===null)c.selected=-1;c.selected=c.selected>=0&&this.anchors[c.selected]||c.selected<0?c.selected:0;c.disabled=d.unique(c.disabled.concat(d.map(this.lis.filter(".ui-state-disabled"),function(g){return a.lis.index(g)}))).sort();d.inArray(c.selected,c.disabled)!=-1&&c.disabled.splice(d.inArray(c.selected,c.disabled),1);this.panels.addClass("ui-tabs-hide");this.lis.removeClass("ui-tabs-selected ui-state-active");
if(c.selected>=0&&this.anchors.length){d(a._sanitizeSelector(a.anchors[c.selected].hash)).removeClass("ui-tabs-hide");this.lis.eq(c.selected).addClass("ui-tabs-selected ui-state-active");a.element.queue("tabs",function(){a._trigger("show",null,a._ui(a.anchors[c.selected],d(a._sanitizeSelector(a.anchors[c.selected].hash))))});this.load(c.selected)}d(window).bind("unload",function(){a.lis.add(a.anchors).unbind(".tabs");a.lis=a.anchors=a.panels=null})}else c.selected=this.lis.index(this.lis.filter(".ui-tabs-selected"));
this.element[c.collapsible?"addClass":"removeClass"]("ui-tabs-collapsible");c.cookie&&this._cookie(c.selected,c.cookie);b=0;for(var j;j=this.lis[b];b++)d(j)[d.inArray(b,c.disabled)!=-1&&!d(j).hasClass("ui-tabs-selected")?"addClass":"removeClass"]("ui-state-disabled");c.cache===false&&this.anchors.removeData("cache.tabs");this.lis.add(this.anchors).unbind(".tabs");if(c.event!=="mouseover"){var k=function(g,f){f.is(":not(.ui-state-disabled)")&&f.addClass("ui-state-"+g)},n=function(g,f){f.removeClass("ui-state-"+
g)};this.lis.bind("mouseover.tabs",function(){k("hover",d(this))});this.lis.bind("mouseout.tabs",function(){n("hover",d(this))});this.anchors.bind("focus.tabs",function(){k("focus",d(this).closest("li"))});this.anchors.bind("blur.tabs",function(){n("focus",d(this).closest("li"))})}var m,o;if(c.fx)if(d.isArray(c.fx)){m=c.fx[0];o=c.fx[1]}else m=o=c.fx;var r=o?function(g,f){d(g).closest("li").addClass("ui-tabs-selected ui-state-active");f.hide().removeClass("ui-tabs-hide").animate(o,o.duration||"normal",
function(){e(f,o);a._trigger("show",null,a._ui(g,f[0]))})}:function(g,f){d(g).closest("li").addClass("ui-tabs-selected ui-state-active");f.removeClass("ui-tabs-hide");a._trigger("show",null,a._ui(g,f[0]))},s=m?function(g,f){f.animate(m,m.duration||"normal",function(){a.lis.removeClass("ui-tabs-selected ui-state-active");f.addClass("ui-tabs-hide");e(f,m);a.element.dequeue("tabs")})}:function(g,f){a.lis.removeClass("ui-tabs-selected ui-state-active");f.addClass("ui-tabs-hide");a.element.dequeue("tabs")};
this.anchors.bind(c.event+".tabs",function(){var g=this,f=d(g).closest("li"),i=a.panels.filter(":not(.ui-tabs-hide)"),l=d(a._sanitizeSelector(g.hash));if(f.hasClass("ui-tabs-selected")&&!c.collapsible||f.hasClass("ui-state-disabled")||f.hasClass("ui-state-processing")||a.panels.filter(":animated").length||a._trigger("select",null,a._ui(this,l[0]))===false){this.blur();return false}c.selected=a.anchors.index(this);a.abort();if(c.collapsible)if(f.hasClass("ui-tabs-selected")){c.selected=-1;c.cookie&&
a._cookie(c.selected,c.cookie);a.element.queue("tabs",function(){s(g,i)}).dequeue("tabs");this.blur();return false}else if(!i.length){c.cookie&&a._cookie(c.selected,c.cookie);a.element.queue("tabs",function(){r(g,l)});a.load(a.anchors.index(this));this.blur();return false}c.cookie&&a._cookie(c.selected,c.cookie);if(l.length){i.length&&a.element.queue("tabs",function(){s(g,i)});a.element.queue("tabs",function(){r(g,l)});a.load(a.anchors.index(this))}else throw"jQuery UI Tabs: Mismatching fragment identifier.";
d.browser.msie&&this.blur()});this.anchors.bind("click.tabs",function(){return false})},_getIndex:function(b){if(typeof b=="string")b=this.anchors.index(this.anchors.filter("[href$="+b+"]"));return b},destroy:function(){var b=this.options;this.abort();this.element.unbind(".tabs").removeClass("ui-tabs ui-widget ui-widget-content ui-corner-all ui-tabs-collapsible").removeData("tabs");this.list.removeClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all");this.anchors.each(function(){var e=
d.data(this,"href.tabs");if(e)this.href=e;var a=d(this).unbind(".tabs");d.each(["href","load","cache"],function(c,h){a.removeData(h+".tabs")})});this.lis.unbind(".tabs").add(this.panels).each(function(){d.data(this,"destroy.tabs")?d(this).remove():d(this).removeClass("ui-state-default ui-corner-top ui-tabs-selected ui-state-active ui-state-hover ui-state-focus ui-state-disabled ui-tabs-panel ui-widget-content ui-corner-bottom ui-tabs-hide")});b.cookie&&this._cookie(null,b.cookie);return this},add:function(b,
e,a){if(a===p)a=this.anchors.length;var c=this,h=this.options;e=d(h.tabTemplate.replace(/#\{href\}/g,b).replace(/#\{label\}/g,e));b=!b.indexOf("#")?b.replace("#",""):this._tabId(d("a",e)[0]);e.addClass("ui-state-default ui-corner-top").data("destroy.tabs",true);var j=d("#"+b);j.length||(j=d(h.panelTemplate).attr("id",b).data("destroy.tabs",true));j.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom ui-tabs-hide");if(a>=this.lis.length){e.appendTo(this.list);j.appendTo(this.list[0].parentNode)}else{e.insertBefore(this.lis[a]);
j.insertBefore(this.panels[a])}h.disabled=d.map(h.disabled,function(k){return k>=a?++k:k});this._tabify();if(this.anchors.length==1){h.selected=0;e.addClass("ui-tabs-selected ui-state-active");j.removeClass("ui-tabs-hide");this.element.queue("tabs",function(){c._trigger("show",null,c._ui(c.anchors[0],c.panels[0]))});this.load(0)}this._trigger("add",null,this._ui(this.anchors[a],this.panels[a]));return this},remove:function(b){b=this._getIndex(b);var e=this.options,a=this.lis.eq(b).remove(),c=this.panels.eq(b).remove();
if(a.hasClass("ui-tabs-selected")&&this.anchors.length>1)this.select(b+(b+1<this.anchors.length?1:-1));e.disabled=d.map(d.grep(e.disabled,function(h){return h!=b}),function(h){return h>=b?--h:h});this._tabify();this._trigger("remove",null,this._ui(a.find("a")[0],c[0]));return this},enable:function(b){b=this._getIndex(b);var e=this.options;if(d.inArray(b,e.disabled)!=-1){this.lis.eq(b).removeClass("ui-state-disabled");e.disabled=d.grep(e.disabled,function(a){return a!=b});this._trigger("enable",null,
this._ui(this.anchors[b],this.panels[b]));return this}},disable:function(b){b=this._getIndex(b);var e=this.options;if(b!=e.selected){this.lis.eq(b).addClass("ui-state-disabled");e.disabled.push(b);e.disabled.sort();this._trigger("disable",null,this._ui(this.anchors[b],this.panels[b]))}return this},select:function(b){b=this._getIndex(b);if(b==-1)if(this.options.collapsible&&this.options.selected!=-1)b=this.options.selected;else return this;this.anchors.eq(b).trigger(this.options.event+".tabs");return this},
load:function(b){b=this._getIndex(b);var e=this,a=this.options,c=this.anchors.eq(b)[0],h=d.data(c,"load.tabs");this.abort();if(!h||this.element.queue("tabs").length!==0&&d.data(c,"cache.tabs"))this.element.dequeue("tabs");else{this.lis.eq(b).addClass("ui-state-processing");if(a.spinner){var j=d("span",c);j.data("label.tabs",j.html()).html(a.spinner)}this.xhr=d.ajax(d.extend({},a.ajaxOptions,{url:h,success:function(k,n){d(e._sanitizeSelector(c.hash)).html(k);e._cleanup();a.cache&&d.data(c,"cache.tabs",
true);e._trigger("load",null,e._ui(e.anchors[b],e.panels[b]));try{a.ajaxOptions.success(k,n)}catch(m){}},error:function(k,n){e._cleanup();e._trigger("load",null,e._ui(e.anchors[b],e.panels[b]));try{a.ajaxOptions.error(k,n,b,c)}catch(m){}}}));e.element.dequeue("tabs");return this}},abort:function(){this.element.queue([]);this.panels.stop(false,true);this.element.queue("tabs",this.element.queue("tabs").splice(-2,2));if(this.xhr){this.xhr.abort();delete this.xhr}this._cleanup();return this},url:function(b,
e){this.anchors.eq(b).removeData("cache.tabs").data("load.tabs",e);return this},length:function(){return this.anchors.length}});d.extend(d.ui.tabs,{version:"1.8.6"});d.extend(d.ui.tabs.prototype,{rotation:null,rotate:function(b,e){var a=this,c=this.options,h=a._rotate||(a._rotate=function(j){clearTimeout(a.rotation);a.rotation=setTimeout(function(){var k=c.selected;a.select(++k<a.anchors.length?k:0)},b);j&&j.stopPropagation()});e=a._unrotate||(a._unrotate=!e?function(j){j.clientX&&a.rotate(null)}:
function(){t=c.selected;h()});if(b){this.element.bind("tabsshow",h);this.anchors.bind(c.event+".tabs",e);h()}else{clearTimeout(a.rotation);this.element.unbind("tabsshow",h);this.anchors.unbind(c.event+".tabs",e);delete this._rotate;delete this._unrotate}return this}})})(jQuery);
;/*
 * jQuery UI Datepicker 1.8.6
 *
 * Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Datepicker
 *
 * Depends:
 *	jquery.ui.core.js
 */
(function(d,G){function K(){this.debug=false;this._curInst=null;this._keyEvent=false;this._disabledInputs=[];this._inDialog=this._datepickerShowing=false;this._mainDivId="ui-datepicker-div";this._inlineClass="ui-datepicker-inline";this._appendClass="ui-datepicker-append";this._triggerClass="ui-datepicker-trigger";this._dialogClass="ui-datepicker-dialog";this._disableClass="ui-datepicker-disabled";this._unselectableClass="ui-datepicker-unselectable";this._currentClass="ui-datepicker-current-day";this._dayOverClass=
"ui-datepicker-days-cell-over";this.regional=[];this.regional[""]={closeText:"Done",prevText:"Prev",nextText:"Next",currentText:"Today",monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],monthNamesShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],dayNamesShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],dayNamesMin:["Su",
"Mo","Tu","We","Th","Fr","Sa"],weekHeader:"Wk",dateFormat:"mm/dd/yy",firstDay:0,isRTL:false,showMonthAfterYear:false,yearSuffix:""};this._defaults={showOn:"focus",showAnim:"fadeIn",showOptions:{},defaultDate:null,appendText:"",buttonText:"...",buttonImage:"",buttonImageOnly:false,hideIfNoPrevNext:false,navigationAsDateFormat:false,gotoCurrent:false,changeMonth:false,changeYear:false,yearRange:"c-10:c+10",showOtherMonths:false,selectOtherMonths:false,showWeek:false,calculateWeek:this.iso8601Week,shortYearCutoff:"+10",
minDate:null,maxDate:null,duration:"fast",beforeShowDay:null,beforeShow:null,onSelect:null,onChangeMonthYear:null,onClose:null,numberOfMonths:1,showCurrentAtPos:0,stepMonths:1,stepBigMonths:12,altField:"",altFormat:"",constrainInput:true,showButtonPanel:false,autoSize:false};d.extend(this._defaults,this.regional[""]);this.dpDiv=d('<div id="'+this._mainDivId+'" class="ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all ui-helper-hidden-accessible"></div>')}function E(a,b){d.extend(a,
b);for(var c in b)if(b[c]==null||b[c]==G)a[c]=b[c];return a}d.extend(d.ui,{datepicker:{version:"1.8.6"}});var y=(new Date).getTime();d.extend(K.prototype,{markerClassName:"hasDatepicker",log:function(){this.debug&&console.log.apply("",arguments)},_widgetDatepicker:function(){return this.dpDiv},setDefaults:function(a){E(this._defaults,a||{});return this},_attachDatepicker:function(a,b){var c=null;for(var e in this._defaults){var f=a.getAttribute("date:"+e);if(f){c=c||{};try{c[e]=eval(f)}catch(h){c[e]=
f}}}e=a.nodeName.toLowerCase();f=e=="div"||e=="span";if(!a.id){this.uuid+=1;a.id="dp"+this.uuid}var i=this._newInst(d(a),f);i.settings=d.extend({},b||{},c||{});if(e=="input")this._connectDatepicker(a,i);else f&&this._inlineDatepicker(a,i)},_newInst:function(a,b){return{id:a[0].id.replace(/([^A-Za-z0-9_-])/g,"\\\\$1"),input:a,selectedDay:0,selectedMonth:0,selectedYear:0,drawMonth:0,drawYear:0,inline:b,dpDiv:!b?this.dpDiv:d('<div class="'+this._inlineClass+' ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all"></div>')}},
_connectDatepicker:function(a,b){var c=d(a);b.append=d([]);b.trigger=d([]);if(!c.hasClass(this.markerClassName)){this._attachments(c,b);c.addClass(this.markerClassName).keydown(this._doKeyDown).keypress(this._doKeyPress).keyup(this._doKeyUp).bind("setData.datepicker",function(e,f,h){b.settings[f]=h}).bind("getData.datepicker",function(e,f){return this._get(b,f)});this._autoSize(b);d.data(a,"datepicker",b)}},_attachments:function(a,b){var c=this._get(b,"appendText"),e=this._get(b,"isRTL");b.append&&
b.append.remove();if(c){b.append=d('<span class="'+this._appendClass+'">'+c+"</span>");a[e?"before":"after"](b.append)}a.unbind("focus",this._showDatepicker);b.trigger&&b.trigger.remove();c=this._get(b,"showOn");if(c=="focus"||c=="both")a.focus(this._showDatepicker);if(c=="button"||c=="both"){c=this._get(b,"buttonText");var f=this._get(b,"buttonImage");b.trigger=d(this._get(b,"buttonImageOnly")?d("<img/>").addClass(this._triggerClass).attr({src:f,alt:c,title:c}):d('<button type="button"></button>').addClass(this._triggerClass).html(f==
""?c:d("<img/>").attr({src:f,alt:c,title:c})));a[e?"before":"after"](b.trigger);b.trigger.click(function(){d.datepicker._datepickerShowing&&d.datepicker._lastInput==a[0]?d.datepicker._hideDatepicker():d.datepicker._showDatepicker(a[0]);return false})}},_autoSize:function(a){if(this._get(a,"autoSize")&&!a.inline){var b=new Date(2009,11,20),c=this._get(a,"dateFormat");if(c.match(/[DM]/)){var e=function(f){for(var h=0,i=0,g=0;g<f.length;g++)if(f[g].length>h){h=f[g].length;i=g}return i};b.setMonth(e(this._get(a,
c.match(/MM/)?"monthNames":"monthNamesShort")));b.setDate(e(this._get(a,c.match(/DD/)?"dayNames":"dayNamesShort"))+20-b.getDay())}a.input.attr("size",this._formatDate(a,b).length)}},_inlineDatepicker:function(a,b){var c=d(a);if(!c.hasClass(this.markerClassName)){c.addClass(this.markerClassName).append(b.dpDiv).bind("setData.datepicker",function(e,f,h){b.settings[f]=h}).bind("getData.datepicker",function(e,f){return this._get(b,f)});d.data(a,"datepicker",b);this._setDate(b,this._getDefaultDate(b),
true);this._updateDatepicker(b);this._updateAlternate(b)}},_dialogDatepicker:function(a,b,c,e,f){a=this._dialogInst;if(!a){this.uuid+=1;this._dialogInput=d('<input type="text" id="'+("dp"+this.uuid)+'" style="position: absolute; top: -100px; width: 0px; z-index: -10;"/>');this._dialogInput.keydown(this._doKeyDown);d("body").append(this._dialogInput);a=this._dialogInst=this._newInst(this._dialogInput,false);a.settings={};d.data(this._dialogInput[0],"datepicker",a)}E(a.settings,e||{});b=b&&b.constructor==
Date?this._formatDate(a,b):b;this._dialogInput.val(b);this._pos=f?f.length?f:[f.pageX,f.pageY]:null;if(!this._pos)this._pos=[document.documentElement.clientWidth/2-100+(document.documentElement.scrollLeft||document.body.scrollLeft),document.documentElement.clientHeight/2-150+(document.documentElement.scrollTop||document.body.scrollTop)];this._dialogInput.css("left",this._pos[0]+20+"px").css("top",this._pos[1]+"px");a.settings.onSelect=c;this._inDialog=true;this.dpDiv.addClass(this._dialogClass);this._showDatepicker(this._dialogInput[0]);
d.blockUI&&d.blockUI(this.dpDiv);d.data(this._dialogInput[0],"datepicker",a);return this},_destroyDatepicker:function(a){var b=d(a),c=d.data(a,"datepicker");if(b.hasClass(this.markerClassName)){var e=a.nodeName.toLowerCase();d.removeData(a,"datepicker");if(e=="input"){c.append.remove();c.trigger.remove();b.removeClass(this.markerClassName).unbind("focus",this._showDatepicker).unbind("keydown",this._doKeyDown).unbind("keypress",this._doKeyPress).unbind("keyup",this._doKeyUp)}else if(e=="div"||e=="span")b.removeClass(this.markerClassName).empty()}},
_enableDatepicker:function(a){var b=d(a),c=d.data(a,"datepicker");if(b.hasClass(this.markerClassName)){var e=a.nodeName.toLowerCase();if(e=="input"){a.disabled=false;c.trigger.filter("button").each(function(){this.disabled=false}).end().filter("img").css({opacity:"1.0",cursor:""})}else if(e=="div"||e=="span")b.children("."+this._inlineClass).children().removeClass("ui-state-disabled");this._disabledInputs=d.map(this._disabledInputs,function(f){return f==a?null:f})}},_disableDatepicker:function(a){var b=
d(a),c=d.data(a,"datepicker");if(b.hasClass(this.markerClassName)){var e=a.nodeName.toLowerCase();if(e=="input"){a.disabled=true;c.trigger.filter("button").each(function(){this.disabled=true}).end().filter("img").css({opacity:"0.5",cursor:"default"})}else if(e=="div"||e=="span")b.children("."+this._inlineClass).children().addClass("ui-state-disabled");this._disabledInputs=d.map(this._disabledInputs,function(f){return f==a?null:f});this._disabledInputs[this._disabledInputs.length]=a}},_isDisabledDatepicker:function(a){if(!a)return false;
for(var b=0;b<this._disabledInputs.length;b++)if(this._disabledInputs[b]==a)return true;return false},_getInst:function(a){try{return d.data(a,"datepicker")}catch(b){throw"Missing instance data for this datepicker";}},_optionDatepicker:function(a,b,c){var e=this._getInst(a);if(arguments.length==2&&typeof b=="string")return b=="defaults"?d.extend({},d.datepicker._defaults):e?b=="all"?d.extend({},e.settings):this._get(e,b):null;var f=b||{};if(typeof b=="string"){f={};f[b]=c}if(e){this._curInst==e&&
this._hideDatepicker();var h=this._getDateDatepicker(a,true);E(e.settings,f);this._attachments(d(a),e);this._autoSize(e);this._setDateDatepicker(a,h);this._updateDatepicker(e)}},_changeDatepicker:function(a,b,c){this._optionDatepicker(a,b,c)},_refreshDatepicker:function(a){(a=this._getInst(a))&&this._updateDatepicker(a)},_setDateDatepicker:function(a,b){if(a=this._getInst(a)){this._setDate(a,b);this._updateDatepicker(a);this._updateAlternate(a)}},_getDateDatepicker:function(a,b){(a=this._getInst(a))&&
!a.inline&&this._setDateFromField(a,b);return a?this._getDate(a):null},_doKeyDown:function(a){var b=d.datepicker._getInst(a.target),c=true,e=b.dpDiv.is(".ui-datepicker-rtl");b._keyEvent=true;if(d.datepicker._datepickerShowing)switch(a.keyCode){case 9:d.datepicker._hideDatepicker();c=false;break;case 13:c=d("td."+d.datepicker._dayOverClass,b.dpDiv).add(d("td."+d.datepicker._currentClass,b.dpDiv));c[0]?d.datepicker._selectDay(a.target,b.selectedMonth,b.selectedYear,c[0]):d.datepicker._hideDatepicker();
return false;case 27:d.datepicker._hideDatepicker();break;case 33:d.datepicker._adjustDate(a.target,a.ctrlKey?-d.datepicker._get(b,"stepBigMonths"):-d.datepicker._get(b,"stepMonths"),"M");break;case 34:d.datepicker._adjustDate(a.target,a.ctrlKey?+d.datepicker._get(b,"stepBigMonths"):+d.datepicker._get(b,"stepMonths"),"M");break;case 35:if(a.ctrlKey||a.metaKey)d.datepicker._clearDate(a.target);c=a.ctrlKey||a.metaKey;break;case 36:if(a.ctrlKey||a.metaKey)d.datepicker._gotoToday(a.target);c=a.ctrlKey||
a.metaKey;break;case 37:if(a.ctrlKey||a.metaKey)d.datepicker._adjustDate(a.target,e?+1:-1,"D");c=a.ctrlKey||a.metaKey;if(a.originalEvent.altKey)d.datepicker._adjustDate(a.target,a.ctrlKey?-d.datepicker._get(b,"stepBigMonths"):-d.datepicker._get(b,"stepMonths"),"M");break;case 38:if(a.ctrlKey||a.metaKey)d.datepicker._adjustDate(a.target,-7,"D");c=a.ctrlKey||a.metaKey;break;case 39:if(a.ctrlKey||a.metaKey)d.datepicker._adjustDate(a.target,e?-1:+1,"D");c=a.ctrlKey||a.metaKey;if(a.originalEvent.altKey)d.datepicker._adjustDate(a.target,
a.ctrlKey?+d.datepicker._get(b,"stepBigMonths"):+d.datepicker._get(b,"stepMonths"),"M");break;case 40:if(a.ctrlKey||a.metaKey)d.datepicker._adjustDate(a.target,+7,"D");c=a.ctrlKey||a.metaKey;break;default:c=false}else if(a.keyCode==36&&a.ctrlKey)d.datepicker._showDatepicker(this);else c=false;if(c){a.preventDefault();a.stopPropagation()}},_doKeyPress:function(a){var b=d.datepicker._getInst(a.target);if(d.datepicker._get(b,"constrainInput")){b=d.datepicker._possibleChars(d.datepicker._get(b,"dateFormat"));
var c=String.fromCharCode(a.charCode==G?a.keyCode:a.charCode);return a.ctrlKey||c<" "||!b||b.indexOf(c)>-1}},_doKeyUp:function(a){a=d.datepicker._getInst(a.target);if(a.input.val()!=a.lastVal)try{if(d.datepicker.parseDate(d.datepicker._get(a,"dateFormat"),a.input?a.input.val():null,d.datepicker._getFormatConfig(a))){d.datepicker._setDateFromField(a);d.datepicker._updateAlternate(a);d.datepicker._updateDatepicker(a)}}catch(b){d.datepicker.log(b)}return true},_showDatepicker:function(a){a=a.target||
a;if(a.nodeName.toLowerCase()!="input")a=d("input",a.parentNode)[0];if(!(d.datepicker._isDisabledDatepicker(a)||d.datepicker._lastInput==a)){var b=d.datepicker._getInst(a);d.datepicker._curInst&&d.datepicker._curInst!=b&&d.datepicker._curInst.dpDiv.stop(true,true);var c=d.datepicker._get(b,"beforeShow");E(b.settings,c?c.apply(a,[a,b]):{});b.lastVal=null;d.datepicker._lastInput=a;d.datepicker._setDateFromField(b);if(d.datepicker._inDialog)a.value="";if(!d.datepicker._pos){d.datepicker._pos=d.datepicker._findPos(a);
d.datepicker._pos[1]+=a.offsetHeight}var e=false;d(a).parents().each(function(){e|=d(this).css("position")=="fixed";return!e});if(e&&d.browser.opera){d.datepicker._pos[0]-=document.documentElement.scrollLeft;d.datepicker._pos[1]-=document.documentElement.scrollTop}c={left:d.datepicker._pos[0],top:d.datepicker._pos[1]};d.datepicker._pos=null;b.dpDiv.css({position:"absolute",display:"block",top:"-1000px"});d.datepicker._updateDatepicker(b);c=d.datepicker._checkOffset(b,c,e);b.dpDiv.css({position:d.datepicker._inDialog&&
d.blockUI?"static":e?"fixed":"absolute",display:"none",left:c.left+"px",top:c.top+"px"});if(!b.inline){c=d.datepicker._get(b,"showAnim");var f=d.datepicker._get(b,"duration"),h=function(){d.datepicker._datepickerShowing=true;var i=d.datepicker._getBorders(b.dpDiv);b.dpDiv.find("iframe.ui-datepicker-cover").css({left:-i[0],top:-i[1],width:b.dpDiv.outerWidth(),height:b.dpDiv.outerHeight()})};b.dpDiv.zIndex(d(a).zIndex()+1);d.effects&&d.effects[c]?b.dpDiv.show(c,d.datepicker._get(b,"showOptions"),f,
h):b.dpDiv[c||"show"](c?f:null,h);if(!c||!f)h();b.input.is(":visible")&&!b.input.is(":disabled")&&b.input.focus();d.datepicker._curInst=b}}},_updateDatepicker:function(a){var b=this,c=d.datepicker._getBorders(a.dpDiv);a.dpDiv.empty().append(this._generateHTML(a)).find("iframe.ui-datepicker-cover").css({left:-c[0],top:-c[1],width:a.dpDiv.outerWidth(),height:a.dpDiv.outerHeight()}).end().find("button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a").bind("mouseout",function(){d(this).removeClass("ui-state-hover");
this.className.indexOf("ui-datepicker-prev")!=-1&&d(this).removeClass("ui-datepicker-prev-hover");this.className.indexOf("ui-datepicker-next")!=-1&&d(this).removeClass("ui-datepicker-next-hover")}).bind("mouseover",function(){if(!b._isDisabledDatepicker(a.inline?a.dpDiv.parent()[0]:a.input[0])){d(this).parents(".ui-datepicker-calendar").find("a").removeClass("ui-state-hover");d(this).addClass("ui-state-hover");this.className.indexOf("ui-datepicker-prev")!=-1&&d(this).addClass("ui-datepicker-prev-hover");
this.className.indexOf("ui-datepicker-next")!=-1&&d(this).addClass("ui-datepicker-next-hover")}}).end().find("."+this._dayOverClass+" a").trigger("mouseover").end();c=this._getNumberOfMonths(a);var e=c[1];e>1?a.dpDiv.addClass("ui-datepicker-multi-"+e).css("width",17*e+"em"):a.dpDiv.removeClass("ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4").width("");a.dpDiv[(c[0]!=1||c[1]!=1?"add":"remove")+"Class"]("ui-datepicker-multi");a.dpDiv[(this._get(a,"isRTL")?"add":"remove")+"Class"]("ui-datepicker-rtl");
a==d.datepicker._curInst&&d.datepicker._datepickerShowing&&a.input&&a.input.is(":visible")&&!a.input.is(":disabled")&&a.input.focus()},_getBorders:function(a){var b=function(c){return{thin:1,medium:2,thick:3}[c]||c};return[parseFloat(b(a.css("border-left-width"))),parseFloat(b(a.css("border-top-width")))]},_checkOffset:function(a,b,c){var e=a.dpDiv.outerWidth(),f=a.dpDiv.outerHeight(),h=a.input?a.input.outerWidth():0,i=a.input?a.input.outerHeight():0,g=document.documentElement.clientWidth+d(document).scrollLeft(),
k=document.documentElement.clientHeight+d(document).scrollTop();b.left-=this._get(a,"isRTL")?e-h:0;b.left-=c&&b.left==a.input.offset().left?d(document).scrollLeft():0;b.top-=c&&b.top==a.input.offset().top+i?d(document).scrollTop():0;b.left-=Math.min(b.left,b.left+e>g&&g>e?Math.abs(b.left+e-g):0);b.top-=Math.min(b.top,b.top+f>k&&k>f?Math.abs(f+i):0);return b},_findPos:function(a){for(var b=this._get(this._getInst(a),"isRTL");a&&(a.type=="hidden"||a.nodeType!=1);)a=a[b?"previousSibling":"nextSibling"];
a=d(a).offset();return[a.left,a.top]},_hideDatepicker:function(a){var b=this._curInst;if(!(!b||a&&b!=d.data(a,"datepicker")))if(this._datepickerShowing){a=this._get(b,"showAnim");var c=this._get(b,"duration"),e=function(){d.datepicker._tidyDialog(b);this._curInst=null};d.effects&&d.effects[a]?b.dpDiv.hide(a,d.datepicker._get(b,"showOptions"),c,e):b.dpDiv[a=="slideDown"?"slideUp":a=="fadeIn"?"fadeOut":"hide"](a?c:null,e);a||e();if(a=this._get(b,"onClose"))a.apply(b.input?b.input[0]:null,[b.input?b.input.val():
"",b]);this._datepickerShowing=false;this._lastInput=null;if(this._inDialog){this._dialogInput.css({position:"absolute",left:"0",top:"-100px"});if(d.blockUI){d.unblockUI();d("body").append(this.dpDiv)}}this._inDialog=false}},_tidyDialog:function(a){a.dpDiv.removeClass(this._dialogClass).unbind(".ui-datepicker-calendar")},_checkExternalClick:function(a){if(d.datepicker._curInst){a=d(a.target);a[0].id!=d.datepicker._mainDivId&&a.parents("#"+d.datepicker._mainDivId).length==0&&!a.hasClass(d.datepicker.markerClassName)&&
!a.hasClass(d.datepicker._triggerClass)&&d.datepicker._datepickerShowing&&!(d.datepicker._inDialog&&d.blockUI)&&d.datepicker._hideDatepicker()}},_adjustDate:function(a,b,c){a=d(a);var e=this._getInst(a[0]);if(!this._isDisabledDatepicker(a[0])){this._adjustInstDate(e,b+(c=="M"?this._get(e,"showCurrentAtPos"):0),c);this._updateDatepicker(e)}},_gotoToday:function(a){a=d(a);var b=this._getInst(a[0]);if(this._get(b,"gotoCurrent")&&b.currentDay){b.selectedDay=b.currentDay;b.drawMonth=b.selectedMonth=b.currentMonth;
b.drawYear=b.selectedYear=b.currentYear}else{var c=new Date;b.selectedDay=c.getDate();b.drawMonth=b.selectedMonth=c.getMonth();b.drawYear=b.selectedYear=c.getFullYear()}this._notifyChange(b);this._adjustDate(a)},_selectMonthYear:function(a,b,c){a=d(a);var e=this._getInst(a[0]);e._selectingMonthYear=false;e["selected"+(c=="M"?"Month":"Year")]=e["draw"+(c=="M"?"Month":"Year")]=parseInt(b.options[b.selectedIndex].value,10);this._notifyChange(e);this._adjustDate(a)},_clickMonthYear:function(a){var b=
this._getInst(d(a)[0]);b.input&&b._selectingMonthYear&&setTimeout(function(){b.input.focus()},0);b._selectingMonthYear=!b._selectingMonthYear},_selectDay:function(a,b,c,e){var f=d(a);if(!(d(e).hasClass(this._unselectableClass)||this._isDisabledDatepicker(f[0]))){f=this._getInst(f[0]);f.selectedDay=f.currentDay=d("a",e).html();f.selectedMonth=f.currentMonth=b;f.selectedYear=f.currentYear=c;this._selectDate(a,this._formatDate(f,f.currentDay,f.currentMonth,f.currentYear))}},_clearDate:function(a){a=
d(a);this._getInst(a[0]);this._selectDate(a,"")},_selectDate:function(a,b){a=this._getInst(d(a)[0]);b=b!=null?b:this._formatDate(a);a.input&&a.input.val(b);this._updateAlternate(a);var c=this._get(a,"onSelect");if(c)c.apply(a.input?a.input[0]:null,[b,a]);else a.input&&a.input.trigger("change");if(a.inline)this._updateDatepicker(a);else{this._hideDatepicker();this._lastInput=a.input[0];typeof a.input[0]!="object"&&a.input.focus();this._lastInput=null}},_updateAlternate:function(a){var b=this._get(a,
"altField");if(b){var c=this._get(a,"altFormat")||this._get(a,"dateFormat"),e=this._getDate(a),f=this.formatDate(c,e,this._getFormatConfig(a));d(b).each(function(){d(this).val(f)})}},noWeekends:function(a){a=a.getDay();return[a>0&&a<6,""]},iso8601Week:function(a){a=new Date(a.getTime());a.setDate(a.getDate()+4-(a.getDay()||7));var b=a.getTime();a.setMonth(0);a.setDate(1);return Math.floor(Math.round((b-a)/864E5)/7)+1},parseDate:function(a,b,c){if(a==null||b==null)throw"Invalid arguments";b=typeof b==
"object"?b.toString():b+"";if(b=="")return null;for(var e=(c?c.shortYearCutoff:null)||this._defaults.shortYearCutoff,f=(c?c.dayNamesShort:null)||this._defaults.dayNamesShort,h=(c?c.dayNames:null)||this._defaults.dayNames,i=(c?c.monthNamesShort:null)||this._defaults.monthNamesShort,g=(c?c.monthNames:null)||this._defaults.monthNames,k=c=-1,l=-1,u=-1,j=false,o=function(p){(p=z+1<a.length&&a.charAt(z+1)==p)&&z++;return p},m=function(p){o(p);p=new RegExp("^\\d{1,"+(p=="@"?14:p=="!"?20:p=="y"?4:p=="o"?
3:2)+"}");p=b.substring(s).match(p);if(!p)throw"Missing number at position "+s;s+=p[0].length;return parseInt(p[0],10)},n=function(p,w,H){p=o(p)?H:w;for(w=0;w<p.length;w++)if(b.substr(s,p[w].length).toLowerCase()==p[w].toLowerCase()){s+=p[w].length;return w+1}throw"Unknown name at position "+s;},r=function(){if(b.charAt(s)!=a.charAt(z))throw"Unexpected literal at position "+s;s++},s=0,z=0;z<a.length;z++)if(j)if(a.charAt(z)=="'"&&!o("'"))j=false;else r();else switch(a.charAt(z)){case "d":l=m("d");
break;case "D":n("D",f,h);break;case "o":u=m("o");break;case "m":k=m("m");break;case "M":k=n("M",i,g);break;case "y":c=m("y");break;case "@":var v=new Date(m("@"));c=v.getFullYear();k=v.getMonth()+1;l=v.getDate();break;case "!":v=new Date((m("!")-this._ticksTo1970)/1E4);c=v.getFullYear();k=v.getMonth()+1;l=v.getDate();break;case "'":if(o("'"))r();else j=true;break;default:r()}if(c==-1)c=(new Date).getFullYear();else if(c<100)c+=(new Date).getFullYear()-(new Date).getFullYear()%100+(c<=e?0:-100);if(u>
-1){k=1;l=u;do{e=this._getDaysInMonth(c,k-1);if(l<=e)break;k++;l-=e}while(1)}v=this._daylightSavingAdjust(new Date(c,k-1,l));if(v.getFullYear()!=c||v.getMonth()+1!=k||v.getDate()!=l)throw"Invalid date";return v},ATOM:"yy-mm-dd",COOKIE:"D, dd M yy",ISO_8601:"yy-mm-dd",RFC_822:"D, d M y",RFC_850:"DD, dd-M-y",RFC_1036:"D, d M y",RFC_1123:"D, d M yy",RFC_2822:"D, d M yy",RSS:"D, d M y",TICKS:"!",TIMESTAMP:"@",W3C:"yy-mm-dd",_ticksTo1970:(718685+Math.floor(492.5)-Math.floor(19.7)+Math.floor(4.925))*24*
60*60*1E7,formatDate:function(a,b,c){if(!b)return"";var e=(c?c.dayNamesShort:null)||this._defaults.dayNamesShort,f=(c?c.dayNames:null)||this._defaults.dayNames,h=(c?c.monthNamesShort:null)||this._defaults.monthNamesShort;c=(c?c.monthNames:null)||this._defaults.monthNames;var i=function(o){(o=j+1<a.length&&a.charAt(j+1)==o)&&j++;return o},g=function(o,m,n){m=""+m;if(i(o))for(;m.length<n;)m="0"+m;return m},k=function(o,m,n,r){return i(o)?r[m]:n[m]},l="",u=false;if(b)for(var j=0;j<a.length;j++)if(u)if(a.charAt(j)==
"'"&&!i("'"))u=false;else l+=a.charAt(j);else switch(a.charAt(j)){case "d":l+=g("d",b.getDate(),2);break;case "D":l+=k("D",b.getDay(),e,f);break;case "o":l+=g("o",(b.getTime()-(new Date(b.getFullYear(),0,0)).getTime())/864E5,3);break;case "m":l+=g("m",b.getMonth()+1,2);break;case "M":l+=k("M",b.getMonth(),h,c);break;case "y":l+=i("y")?b.getFullYear():(b.getYear()%100<10?"0":"")+b.getYear()%100;break;case "@":l+=b.getTime();break;case "!":l+=b.getTime()*1E4+this._ticksTo1970;break;case "'":if(i("'"))l+=
"'";else u=true;break;default:l+=a.charAt(j)}return l},_possibleChars:function(a){for(var b="",c=false,e=function(h){(h=f+1<a.length&&a.charAt(f+1)==h)&&f++;return h},f=0;f<a.length;f++)if(c)if(a.charAt(f)=="'"&&!e("'"))c=false;else b+=a.charAt(f);else switch(a.charAt(f)){case "d":case "m":case "y":case "@":b+="0123456789";break;case "D":case "M":return null;case "'":if(e("'"))b+="'";else c=true;break;default:b+=a.charAt(f)}return b},_get:function(a,b){return a.settings[b]!==G?a.settings[b]:this._defaults[b]},
_setDateFromField:function(a,b){if(a.input.val()!=a.lastVal){var c=this._get(a,"dateFormat"),e=a.lastVal=a.input?a.input.val():null,f,h;f=h=this._getDefaultDate(a);var i=this._getFormatConfig(a);try{f=this.parseDate(c,e,i)||h}catch(g){this.log(g);e=b?"":e}a.selectedDay=f.getDate();a.drawMonth=a.selectedMonth=f.getMonth();a.drawYear=a.selectedYear=f.getFullYear();a.currentDay=e?f.getDate():0;a.currentMonth=e?f.getMonth():0;a.currentYear=e?f.getFullYear():0;this._adjustInstDate(a)}},_getDefaultDate:function(a){return this._restrictMinMax(a,
this._determineDate(a,this._get(a,"defaultDate"),new Date))},_determineDate:function(a,b,c){var e=function(h){var i=new Date;i.setDate(i.getDate()+h);return i},f=function(h){try{return d.datepicker.parseDate(d.datepicker._get(a,"dateFormat"),h,d.datepicker._getFormatConfig(a))}catch(i){}var g=(h.toLowerCase().match(/^c/)?d.datepicker._getDate(a):null)||new Date,k=g.getFullYear(),l=g.getMonth();g=g.getDate();for(var u=/([+-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g,j=u.exec(h);j;){switch(j[2]||"d"){case "d":case "D":g+=
parseInt(j[1],10);break;case "w":case "W":g+=parseInt(j[1],10)*7;break;case "m":case "M":l+=parseInt(j[1],10);g=Math.min(g,d.datepicker._getDaysInMonth(k,l));break;case "y":case "Y":k+=parseInt(j[1],10);g=Math.min(g,d.datepicker._getDaysInMonth(k,l));break}j=u.exec(h)}return new Date(k,l,g)};if(b=(b=b==null?c:typeof b=="string"?f(b):typeof b=="number"?isNaN(b)?c:e(b):b)&&b.toString()=="Invalid Date"?c:b){b.setHours(0);b.setMinutes(0);b.setSeconds(0);b.setMilliseconds(0)}return this._daylightSavingAdjust(b)},
_daylightSavingAdjust:function(a){if(!a)return null;a.setHours(a.getHours()>12?a.getHours()+2:0);return a},_setDate:function(a,b,c){var e=!b,f=a.selectedMonth,h=a.selectedYear;b=this._restrictMinMax(a,this._determineDate(a,b,new Date));a.selectedDay=a.currentDay=b.getDate();a.drawMonth=a.selectedMonth=a.currentMonth=b.getMonth();a.drawYear=a.selectedYear=a.currentYear=b.getFullYear();if((f!=a.selectedMonth||h!=a.selectedYear)&&!c)this._notifyChange(a);this._adjustInstDate(a);if(a.input)a.input.val(e?
"":this._formatDate(a))},_getDate:function(a){return!a.currentYear||a.input&&a.input.val()==""?null:this._daylightSavingAdjust(new Date(a.currentYear,a.currentMonth,a.currentDay))},_generateHTML:function(a){var b=new Date;b=this._daylightSavingAdjust(new Date(b.getFullYear(),b.getMonth(),b.getDate()));var c=this._get(a,"isRTL"),e=this._get(a,"showButtonPanel"),f=this._get(a,"hideIfNoPrevNext"),h=this._get(a,"navigationAsDateFormat"),i=this._getNumberOfMonths(a),g=this._get(a,"showCurrentAtPos"),k=
this._get(a,"stepMonths"),l=i[0]!=1||i[1]!=1,u=this._daylightSavingAdjust(!a.currentDay?new Date(9999,9,9):new Date(a.currentYear,a.currentMonth,a.currentDay)),j=this._getMinMaxDate(a,"min"),o=this._getMinMaxDate(a,"max");g=a.drawMonth-g;var m=a.drawYear;if(g<0){g+=12;m--}if(o){var n=this._daylightSavingAdjust(new Date(o.getFullYear(),o.getMonth()-i[0]*i[1]+1,o.getDate()));for(n=j&&n<j?j:n;this._daylightSavingAdjust(new Date(m,g,1))>n;){g--;if(g<0){g=11;m--}}}a.drawMonth=g;a.drawYear=m;n=this._get(a,
"prevText");n=!h?n:this.formatDate(n,this._daylightSavingAdjust(new Date(m,g-k,1)),this._getFormatConfig(a));n=this._canAdjustMonth(a,-1,m,g)?'<a class="ui-datepicker-prev ui-corner-all" onclick="DP_jQuery_'+y+".datepicker._adjustDate('#"+a.id+"', -"+k+", 'M');\" title=\""+n+'"><span class="ui-icon ui-icon-circle-triangle-'+(c?"e":"w")+'">'+n+"</span></a>":f?"":'<a class="ui-datepicker-prev ui-corner-all ui-state-disabled" title="'+n+'"><span class="ui-icon ui-icon-circle-triangle-'+(c?"e":"w")+'">'+
n+"</span></a>";var r=this._get(a,"nextText");r=!h?r:this.formatDate(r,this._daylightSavingAdjust(new Date(m,g+k,1)),this._getFormatConfig(a));f=this._canAdjustMonth(a,+1,m,g)?'<a class="ui-datepicker-next ui-corner-all" onclick="DP_jQuery_'+y+".datepicker._adjustDate('#"+a.id+"', +"+k+", 'M');\" title=\""+r+'"><span class="ui-icon ui-icon-circle-triangle-'+(c?"w":"e")+'">'+r+"</span></a>":f?"":'<a class="ui-datepicker-next ui-corner-all ui-state-disabled" title="'+r+'"><span class="ui-icon ui-icon-circle-triangle-'+
(c?"w":"e")+'">'+r+"</span></a>";k=this._get(a,"currentText");r=this._get(a,"gotoCurrent")&&a.currentDay?u:b;k=!h?k:this.formatDate(k,r,this._getFormatConfig(a));h=!a.inline?'<button type="button" class="ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all" onclick="DP_jQuery_'+y+'.datepicker._hideDatepicker();">'+this._get(a,"closeText")+"</button>":"";e=e?'<div class="ui-datepicker-buttonpane ui-widget-content">'+(c?h:"")+(this._isInRange(a,r)?'<button type="button" class="ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all" onclick="DP_jQuery_'+
y+".datepicker._gotoToday('#"+a.id+"');\">"+k+"</button>":"")+(c?"":h)+"</div>":"";h=parseInt(this._get(a,"firstDay"),10);h=isNaN(h)?0:h;k=this._get(a,"showWeek");r=this._get(a,"dayNames");this._get(a,"dayNamesShort");var s=this._get(a,"dayNamesMin"),z=this._get(a,"monthNames"),v=this._get(a,"monthNamesShort"),p=this._get(a,"beforeShowDay"),w=this._get(a,"showOtherMonths"),H=this._get(a,"selectOtherMonths");this._get(a,"calculateWeek");for(var L=this._getDefaultDate(a),I="",C=0;C<i[0];C++){for(var M=
"",D=0;D<i[1];D++){var N=this._daylightSavingAdjust(new Date(m,g,a.selectedDay)),t=" ui-corner-all",x="";if(l){x+='<div class="ui-datepicker-group';if(i[1]>1)switch(D){case 0:x+=" ui-datepicker-group-first";t=" ui-corner-"+(c?"right":"left");break;case i[1]-1:x+=" ui-datepicker-group-last";t=" ui-corner-"+(c?"left":"right");break;default:x+=" ui-datepicker-group-middle";t="";break}x+='">'}x+='<div class="ui-datepicker-header ui-widget-header ui-helper-clearfix'+t+'">'+(/all|left/.test(t)&&C==0?c?
f:n:"")+(/all|right/.test(t)&&C==0?c?n:f:"")+this._generateMonthYearHeader(a,g,m,j,o,C>0||D>0,z,v)+'</div><table class="ui-datepicker-calendar"><thead><tr>';var A=k?'<th class="ui-datepicker-week-col">'+this._get(a,"weekHeader")+"</th>":"";for(t=0;t<7;t++){var q=(t+h)%7;A+="<th"+((t+h+6)%7>=5?' class="ui-datepicker-week-end"':"")+'><span title="'+r[q]+'">'+s[q]+"</span></th>"}x+=A+"</tr></thead><tbody>";A=this._getDaysInMonth(m,g);if(m==a.selectedYear&&g==a.selectedMonth)a.selectedDay=Math.min(a.selectedDay,
A);t=(this._getFirstDayOfMonth(m,g)-h+7)%7;A=l?6:Math.ceil((t+A)/7);q=this._daylightSavingAdjust(new Date(m,g,1-t));for(var O=0;O<A;O++){x+="<tr>";var P=!k?"":'<td class="ui-datepicker-week-col">'+this._get(a,"calculateWeek")(q)+"</td>";for(t=0;t<7;t++){var F=p?p.apply(a.input?a.input[0]:null,[q]):[true,""],B=q.getMonth()!=g,J=B&&!H||!F[0]||j&&q<j||o&&q>o;P+='<td class="'+((t+h+6)%7>=5?" ui-datepicker-week-end":"")+(B?" ui-datepicker-other-month":"")+(q.getTime()==N.getTime()&&g==a.selectedMonth&&
a._keyEvent||L.getTime()==q.getTime()&&L.getTime()==N.getTime()?" "+this._dayOverClass:"")+(J?" "+this._unselectableClass+" ui-state-disabled":"")+(B&&!w?"":" "+F[1]+(q.getTime()==u.getTime()?" "+this._currentClass:"")+(q.getTime()==b.getTime()?" ui-datepicker-today":""))+'"'+((!B||w)&&F[2]?' title="'+F[2]+'"':"")+(J?"":' onclick="DP_jQuery_'+y+".datepicker._selectDay('#"+a.id+"',"+q.getMonth()+","+q.getFullYear()+', this);return false;"')+">"+(B&&!w?"&#xa0;":J?'<span class="ui-state-default">'+q.getDate()+
"</span>":'<a class="ui-state-default'+(q.getTime()==b.getTime()?" ui-state-highlight":"")+(q.getTime()==u.getTime()?" ui-state-active":"")+(B?" ui-priority-secondary":"")+'" href="#">'+q.getDate()+"</a>")+"</td>";q.setDate(q.getDate()+1);q=this._daylightSavingAdjust(q)}x+=P+"</tr>"}g++;if(g>11){g=0;m++}x+="</tbody></table>"+(l?"</div>"+(i[0]>0&&D==i[1]-1?'<div class="ui-datepicker-row-break"></div>':""):"");M+=x}I+=M}I+=e+(d.browser.msie&&parseInt(d.browser.version,10)<7&&!a.inline?'<iframe src="javascript:false;" class="ui-datepicker-cover" frameborder="0"></iframe>':
"");a._keyEvent=false;return I},_generateMonthYearHeader:function(a,b,c,e,f,h,i,g){var k=this._get(a,"changeMonth"),l=this._get(a,"changeYear"),u=this._get(a,"showMonthAfterYear"),j='<div class="ui-datepicker-title">',o="";if(h||!k)o+='<span class="ui-datepicker-month">'+i[b]+"</span>";else{i=e&&e.getFullYear()==c;var m=f&&f.getFullYear()==c;o+='<select class="ui-datepicker-month" onchange="DP_jQuery_'+y+".datepicker._selectMonthYear('#"+a.id+"', this, 'M');\" onclick=\"DP_jQuery_"+y+".datepicker._clickMonthYear('#"+
a.id+"');\">";for(var n=0;n<12;n++)if((!i||n>=e.getMonth())&&(!m||n<=f.getMonth()))o+='<option value="'+n+'"'+(n==b?' selected="selected"':"")+">"+g[n]+"</option>";o+="</select>"}u||(j+=o+(h||!(k&&l)?"&#xa0;":""));if(h||!l)j+='<span class="ui-datepicker-year">'+c+"</span>";else{g=this._get(a,"yearRange").split(":");var r=(new Date).getFullYear();i=function(s){s=s.match(/c[+-].*/)?c+parseInt(s.substring(1),10):s.match(/[+-].*/)?r+parseInt(s,10):parseInt(s,10);return isNaN(s)?r:s};b=i(g[0]);g=Math.max(b,
i(g[1]||""));b=e?Math.max(b,e.getFullYear()):b;g=f?Math.min(g,f.getFullYear()):g;for(j+='<select class="ui-datepicker-year" onchange="DP_jQuery_'+y+".datepicker._selectMonthYear('#"+a.id+"', this, 'Y');\" onclick=\"DP_jQuery_"+y+".datepicker._clickMonthYear('#"+a.id+"');\">";b<=g;b++)j+='<option value="'+b+'"'+(b==c?' selected="selected"':"")+">"+b+"</option>";j+="</select>"}j+=this._get(a,"yearSuffix");if(u)j+=(h||!(k&&l)?"&#xa0;":"")+o;j+="</div>";return j},_adjustInstDate:function(a,b,c){var e=
a.drawYear+(c=="Y"?b:0),f=a.drawMonth+(c=="M"?b:0);b=Math.min(a.selectedDay,this._getDaysInMonth(e,f))+(c=="D"?b:0);e=this._restrictMinMax(a,this._daylightSavingAdjust(new Date(e,f,b)));a.selectedDay=e.getDate();a.drawMonth=a.selectedMonth=e.getMonth();a.drawYear=a.selectedYear=e.getFullYear();if(c=="M"||c=="Y")this._notifyChange(a)},_restrictMinMax:function(a,b){var c=this._getMinMaxDate(a,"min");a=this._getMinMaxDate(a,"max");b=c&&b<c?c:b;return b=a&&b>a?a:b},_notifyChange:function(a){var b=this._get(a,
"onChangeMonthYear");if(b)b.apply(a.input?a.input[0]:null,[a.selectedYear,a.selectedMonth+1,a])},_getNumberOfMonths:function(a){a=this._get(a,"numberOfMonths");return a==null?[1,1]:typeof a=="number"?[1,a]:a},_getMinMaxDate:function(a,b){return this._determineDate(a,this._get(a,b+"Date"),null)},_getDaysInMonth:function(a,b){return 32-(new Date(a,b,32)).getDate()},_getFirstDayOfMonth:function(a,b){return(new Date(a,b,1)).getDay()},_canAdjustMonth:function(a,b,c,e){var f=this._getNumberOfMonths(a);
c=this._daylightSavingAdjust(new Date(c,e+(b<0?b:f[0]*f[1]),1));b<0&&c.setDate(this._getDaysInMonth(c.getFullYear(),c.getMonth()));return this._isInRange(a,c)},_isInRange:function(a,b){var c=this._getMinMaxDate(a,"min");a=this._getMinMaxDate(a,"max");return(!c||b.getTime()>=c.getTime())&&(!a||b.getTime()<=a.getTime())},_getFormatConfig:function(a){var b=this._get(a,"shortYearCutoff");b=typeof b!="string"?b:(new Date).getFullYear()%100+parseInt(b,10);return{shortYearCutoff:b,dayNamesShort:this._get(a,
"dayNamesShort"),dayNames:this._get(a,"dayNames"),monthNamesShort:this._get(a,"monthNamesShort"),monthNames:this._get(a,"monthNames")}},_formatDate:function(a,b,c,e){if(!b){a.currentDay=a.selectedDay;a.currentMonth=a.selectedMonth;a.currentYear=a.selectedYear}b=b?typeof b=="object"?b:this._daylightSavingAdjust(new Date(e,c,b)):this._daylightSavingAdjust(new Date(a.currentYear,a.currentMonth,a.currentDay));return this.formatDate(this._get(a,"dateFormat"),b,this._getFormatConfig(a))}});d.fn.datepicker=
function(a){if(!d.datepicker.initialized){d(document).mousedown(d.datepicker._checkExternalClick).find("body").append(d.datepicker.dpDiv);d.datepicker.initialized=true}var b=Array.prototype.slice.call(arguments,1);if(typeof a=="string"&&(a=="isDisabled"||a=="getDate"||a=="widget"))return d.datepicker["_"+a+"Datepicker"].apply(d.datepicker,[this[0]].concat(b));if(a=="option"&&arguments.length==2&&typeof arguments[1]=="string")return d.datepicker["_"+a+"Datepicker"].apply(d.datepicker,[this[0]].concat(b));
return this.each(function(){typeof a=="string"?d.datepicker["_"+a+"Datepicker"].apply(d.datepicker,[this].concat(b)):d.datepicker._attachDatepicker(this,a)})};d.datepicker=new K;d.datepicker.initialized=false;d.datepicker.uuid=(new Date).getTime();d.datepicker.version="1.8.6";window["DP_jQuery_"+y]=d})(jQuery);
;
function NotificationAlert(parentId, elementId, ajaxPageUrl) {

	// Public variables ----------------------------------------------------------------------------

	// this.updateMessageUrl = ''; 		 // The URL to call when updating the message

	// Private variables ---------------------------------------------------------------------------

	var self         = this;
	var _parent      = $('#' + parentId);
	var _element     = $('#' + elementId);
	var _ajaxPageUrl = ajaxPageUrl;

	// Sets up a flyout menu with the flag options. Recreated each time - may want to create once
	// and store if dynamic creation not needed.
	var setupAlertBox = function () {
		if (!_parent.populated && !_parent.populating) {
			_parent.populating = true;
			_element.load(_ajaxPageUrl, {cache:false}, function () { _parent.populated = true; });
			_parent.populated = true;
			_parent.populating = false;
		}
	}

	// Call service url to update article status.
	this.MarkAsRead = function (notificationId, serviceUrl, linkId, containerId) {

		var link = $('#' + linkId);
		var oldHtml = link.html();
		link.html('<img src="/Images/animated_loading_blue.gif" align="absmiddle" style="border:0" />');

		$.ajax(
		{
			type:		'POST',
			cache:		false,
			url:		serviceUrl,
			data:		'{notificationId: ' + notificationId + '}',
			contentType: 'application/json; charset=utf-8',
			dataType:	'json',
			tryCount:	0,
			retryLimit: 3,
			timeout:	5000,

			success: function () {
				link.remove();
				$('#' +containerId).children().first().removeClass('bold');	
			},
			error: function () {
				link.html(oldHtml);		
			}
		});

		return false;
	}

	// Setup everything.
	this.initialise = function () {
		$(_parent).bind('mouseover', setupAlertBox);
	}
}

/*
var notificationAlert;
$(document).ready(function () {
	notificationAlert = new NotificationAlert(parent, 'elementId', 'http://mydomain.com/ajax');
	notificationAlert.initialise();
});
*/
function AttControl(attrTableId, freeTextId, quickPickId, watermark) {
	this.Watermark = watermark;
	this.FreeTextbox = $('#' + freeTextId);
	this.QuickPick = $('#' + quickPickId);
	this.AttrTable = $('#' + attrTableId);
	this.AttrCheckboxes = this.AttrTable.find('.attr :checkbox, .sub-attr :checkbox');
	this.AttrCheckboxLbls = this.AttrTable.find('.attr label, .sub-attr label');

	this.GetFreeText = function () {
		var freeTextValue = this.FreeTextbox.val();
		if (freeTextValue == this.Watermark)
			return '';

		return freeTextValue;
	};

	this.ClearFreeText = function () {
		if (this.GetFreeText()) {
			this.FreeTextbox.val('');
			UpdateWatermark(this.FreeTextbox[0], this.Watermark);
		}
	}

	this.ToggleChildAttrsVisibility = function (parentId) {
		if (parentId <= 0)
			return;

		var childTags = this.AttrTable.find('div[parent=' + parentId + ']');
		$.each(childTags, function () {
			$(this).toggle();
		});

		return false;
	};

	this.ClearScrollChecks = function () {
		this.AttrCheckboxes.attr('checked', false);
		if (this.FreeTextbox.length > 0) {
			this.FreeTextbox.val('');
			UpdateWatermark(this.FreeTextbox[0], this.Watermark);
		}
	};

	this.IterateCheckboxes = function () {
		this.AttrCheckboxes.attr('checked', false);

		var freeText = this.FreeTextbox.val().replace(/[\s]+/g, " ").toLowerCase();
		var freeTags = freeText.split(',');

		if (freeTags.length <= 0)
			return;

		for (var i = 0; i < freeTags.length; i++)
			freeTags[i] = $.trim(freeTags[i]);

		var matchedLabels = this.AttrCheckboxLbls.filter(function () {
			for (var i = 0; i < freeTags.length; i++) {
				if ($(this).text().toLowerCase() == freeTags[i])
					return true;
			}
		});

		$.each(matchedLabels, function () {
			var checkboxId = $(this).attr('for');
			$('#' + checkboxId).attr('checked', true);
		});
	};

	this.SetListFromFreeText = function () {
		if (this.AttrTable.length > 0)
			this.IterateCheckboxes();
	};

	// Checks/unchecks all checkboxes for versions of this attribute (Scroll View)
	this.OnVersionCheck = function (parentId, versionid, name, checked) {
		if (this.AttrTable.length > 0) {
			if (this.FreeTextbox.length > 0) {
				if (this.FreeTextbox.val() == this.Watermark)
					this.FreeTextbox.val('');
				this.FreeTextbox.val(this.FreeTextbox.val().replace(/[\s]+/g, " "));
				if (checked) {
					if ((', ' + this.FreeTextbox.val() + ',').indexOf(', ' + name + ',') < 0) {
						if (this.FreeTextbox.val())
							this.FreeTextbox.val(this.FreeTextbox.val() + ", " + name);
						else
							this.FreeTextbox.val(name);
					}
				} else {
					var i = (', ' + this.FreeTextbox.val() + ',').indexOf(', ' + name + ',');
					if (i >= 0)
						this.FreeTextbox.val(this.FreeTextbox.val().substr(0, i) + this.FreeTextbox.val().substr(i + 2 + name.length));
				}

				this.FreeTextbox.val(this.FreeTextbox.val().replace(/^[,\s\xA0]+/, "").replace(/[,\s\xA0]+$/, ""));

				UpdateWatermark(this.FreeTextbox[0], this.Watermark);
			}
		}

		this.ToggleChildAttrsVisibility(parentId);
	};

	// Populate the free-text field and tag check-box list from the selected quick-pick.
	this.SetFreeTextForQuickPick = function (selector, url) {
		if (selector && url && this.FreeTextbox.length > 0) {
			$.ajax({
				context: this,
				url: url + selector.value,
				success: function (data) {
					if (data != null)
						this.FreeTextbox.val(data);
				} 
			});

			UpdateWatermark(this.FreeTextbox[0], this.Watermark);
		}
	};

	this.GetSelectedAttrIds = function () {
		var result = "";

		if (this.AttrTable.length > 0) {
			this.AttrTable.find('.attr :checkbox:checked, .sub-attr :checkbox:checked').each(function () {
				result += $(this).val() + ',';
			});
		}

		return result;
	};
}

// Initialize watermark on input element.
function InitWatermark(inputId, label) {
	var inputObj = $('#' + inputId);
	if (!inputObj) return;

	inputObj.blur(function () { UpdateWatermark(this, label); });
	inputObj.focus(function () { UpdateWatermark(this, label); });

	var text = $.trim(inputObj.val());
	if (text == '' || text == label) {
		inputObj.val(label);
		inputObj.addClass('watermark');
	}
	else if (text != '' && text != label)
		inputObj.removeClass('watermark');
}

// Update the watermark as text changes within the input element.
function UpdateWatermark(inputObj, label) {
	if (!inputObj) return;

	var text = $.trim($(inputObj).val());
	if (text == label && $(inputObj).hasClass('watermark')) {
		$(inputObj).val('');
		$(inputObj).removeClass('watermark');
	}
	else if (text == '' && !$(inputObj).hasClass('watermark')) {
		$(inputObj).val(label);
		$(inputObj).addClass('watermark');
	}
	else
		$(inputObj).removeClass('watermark');
}

function ReportMe(objId, objTypeId, reportTypeId, url, directLink, commentsClientId) {
	var canReport = true;
	if (directLink)
		canReport = confirm("Are you sure your want to report this item")
	if (canReport) {
		var idPrefix = "rpt_";
		var reportLink = GetReportLink(idPrefix, objId.toString(), objTypeId.toString(), reportTypeId.toString());
		var reportStatusMsg = GetReportStatusMsgElm(idPrefix, objId.toString(), objTypeId.toString(), reportTypeId.toString(), directLink);

		var comments = $('#' + commentsClientId).val();
		if (ShowReportingMessage(reportLink, reportStatusMsg))
			$(reportStatusMsg).load(url + '&comments=' + escape(comments));
	}
	return false;
}

function GetReportLink(idPrefix, objectId, objectTypeId, reportTypeId) {
	return $("a[name=" + idPrefix + objectId + "_" + objectTypeId + "_" + reportTypeId + "]");
}
function GetReportStatusMsgElm(idPrefix, objectId, objectTypeId, reportTypeId, directLink) {
	var elm = document.getElementsByName(idPrefix + objectId + "_" + objectTypeId + "_" + reportTypeId)[0];
	return directLink? elm.parentNode : elm.parentNode.parentNode.parentNode;
}

function ShowReportingMessage(reportLink, reportStatusMsg) {
	if (!reportLink || !reportStatusMsg) return false;

	$(reportLink).css("display", "none");
	$(reportStatusMsg).html('<img src="/images/animated_loading_blue.gif" width="16px" height="16px" border="0">');
	$(reportStatusMsg).css("display", "");

	return true;
}

function CheckForUndo(elm, memberID) {
	if ($(elm).prop('checkForUndo')) return;

	var undo = $(elm).find(".Undo");

	// TODO:  We need to do two things: (issue #62 Add ability to remove reports)
	// 1. Create an ajax page that will check if the current member (in the javascript var "reportingMemberId")
	//    has reported this object, and if so, show a link that says "remove your report"
	// 2. Add the service to remove reports

	$(elm).prop('checkForUndo', true);
}
// Copyright (c) 2008, The Code Project. All rights reserved.
/// <reference path="../../JS/jquery-1.3.2-vsdoc2.js" />

function getInternetExplorerVersion() {
    var rv = -1; // Return value assumes failure.
    if (navigator.appName == 'Microsoft Internet Explorer') {
        var ua = navigator.userAgent;
        var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null)
            rv = parseFloat(RegExp.$1);
    }
    return rv;
}

function rateItem(objId, objTypeId, objSubtypeId, forceComment, allowAjaxOnLowVote, lowVoteThreshold, displayMode) {
	if (objId > 0 && objTypeId > 0) {
		var value = $("div[name=RateItem_" + objId + "]").find("input[type=radio]:checked").val();

		var comment = $("[name=RateItem_" + objId + "] .RateComment")[0];
		if (comment) comment = comment.value.replace(/^\s+|\s+$/g, ''); else comment = '';

		if (value <= 0)
			ShowErrorMessage("You must select a value to vote", objId);
		else if (value <= lowVoteThreshold && comment == '' && forceComment && allowAjaxOnLowVote)
			ShowErrorMessage("You must provide a comment", objId);
		else if (allowAjaxOnLowVote || value > lowVoteThreshold) {
			PrepElements(objId);
			$.get("/Script/Ratings/Ajax/RateItem.aspx?obid=" + objId + "&obtid=" + objTypeId +
					"&obstid=" + objSubtypeId + "&rvv=" + value + "&rvc=" + escape(comment) +
					(displayMode ? "&rdm=" + displayMode : ""),
					function (data) { ratingAjaxCallback(data, objId); });
		}
	}
	return false;
}

function ratingAjaxCallback(data, objId) {
	if (data.length > 0) {
		var voteRes = $("div[name=RateItem_" + objId + "] .rating-result span")[0];
		if (voteRes) {
			voteRes.innerHTML = data;
			voteRes.style.display = "";
		}
		voteRes = $("[name=CurRat_" + objId + "]")[0];
		if (voteRes) voteRes.style.display = "none";
	}
	var loader = $("div[name=RateItem_" + objId + "] .loaderImg")[0];

	// We may have an ajax tooltip here. Remove it because we'll get a histogram with the return
	// data
	$("div[name=RateItem_" + objId + "] .ajaxHist").remove();
	if (loader && loader.style) loader.style.display = "none";

	$(".rating-comment").remove(); //off("mouseenter mouseleave");
}

function PrepElements(objId) {
	var loader = $("div[name=RateItem_" + objId + "] .loaderImg")[0];
	if (loader && loader.style.display == "none")
		loader.style.display = "";

	loader = $("div[name=RateItem_" + objId + "] .voteTbl")[0];
	if (loader) loader.style.display = "none";

	loader = $("div[name=RateItem_" + objId + "] .rating-result span")[0];
	if (loader) loader.style.display = "none";

	loader = $("div[name=RateItem_" + objId + "] .rating-comment")[0];
	if (loader) loader.style.display = "none";
}

function ShowErrorMessage(msg, objId) {
	var loader = $("div[name=RateItem_" + objId + "] .loaderImg")[0];
	if (loader) loader.style.display = "none";
}

function starRating(selector, ratingCallback, clientID) {
	var initialise = function (selector, ratingCallback) {

	    var ieVersion = getInternetExplorerVersion();
	    var isIE8orBelow = ieVersion > 0 && ieVersion <= 8;

		// loop over every element matching the selector
		$(selector).each(function () {

			// Hide submit button
			$(this).find('input:submit').hide();

			// On hover, hide content currently showing and show rating (only if we have content)
			if ($(".content", this).length > 0) {
				// Initially hide rating control container
				$(this).find(".voting").hide();

				// Toggle between rating control and content during mouseover
				$(this).hover(function () {
					$(".content", this).hide();
					$(".voting", this).show();
				}, function () {
					$(".content", this).show();
					$(".voting", this).hide();
				});
			}

			// Create rating control from radio list. Loop over buttons.
			var $list = $('<div class="rating-star-block"></div>');
			$(this)
				.find('input:radio')
				.each(function (i) {
					// var rating = $(this).parent().text(); - if wrapping in labels
					var rating = "vote " + this.value;
					var $item = $('<a href="#"></a>')
						.attr('rating', this.value)
						.text(rating)
						.addClass("star outline");

					if (!isIE8orBelow)
					    $item.attr('title', rating)

					addHandlers($item, clientID);
					$list.append($item);

					if ($(this).is(':checked'))
						$item.prevAll().andSelf().removeClass('outline').addClass('filled');
				});

			// Hide the original radio buttons
			//$(this).find(".voting").append($list).find('label').hide(); - if wrapping in labels
			$(this).find(".voting").append($list).find('input:radio').hide();
		});
	}

    /*
	var showCommentBox = function (objId, show) {
		var commentBox = $('#' + objId + '_RCD');
		if (show) commentBox.show(); else commentBox.hide();
	}
    */

	var addHandlers = function (item, clientID) {
		// Show comment box on mouse over
		// $(item).mouseenter(function (e) {
		//	showCommentBox(clientID, true);
		//});

		// Actual rating
		$(item).click(function (e) {
			// Handle Star click
			var $star = $(this);
			var $linksParent = $(this).parent();
			var rating = $star.attr('rating');

			// Set the radio button value
			$linksParent
				.parent()
				.find('input:radio[value=' + rating + ']')
				.attr('checked', true);

			// prevent default link click
			e.preventDefault();

			// Execute the callback or find parent form and submit it instead.
			if (ratingCallback) ratingCallback(rating);
			else $(this).closest('form').submit();

		}).hover(function () {
			// Handle star mouse over
			$(this).prevAll().andSelf().removeClass("outline").addClass('filled');
			$(this).nextAll().addClass('outline');
		}, function () {
			// Handle star mouse out
			$(this).siblings().andSelf().removeClass('filled').addClass('outline')
		});
	}

	initialise(selector, ratingCallback);
}
// --------------------------------------------------------------------
// Copyright (c) 2010, The Code Project. All rights reserved.
// --------------------------------------------------------------------

// --------------------------------------------------------------------
// This file contains the jQuery for the Commenting UI.
// --------------------------------------------------------------------
var commentConfig = {
	// REVIEW: [Matthew] (CM 10 Jan) Do not hardcode paths. 
	// Converted to task #2060
	baseUrl:        "/script/comments/webservices/commentServices.aspx/",
	saveMethod:     "SaveComment",
	updateMethod:   "UpdateComment",
	replyMethod:    "ReplyToComment",
	deleteMethod:   "DeleteComment",
	getPageMethod:  "GetPage"
};

function SetCommentConfig(baseUrl, saveMethod, updateMethod, deleteMethod, getPageMethod, replyMethod)
{
	commentConfig.baseUrl       = baseUrl;
	commentConfig.saveMethod    = saveMethod;
	commentConfig.updateMethod  = updateMethod;
	commentConfig.replyMethod   = replyMethod;
	commentConfig.deleteMethod  = deleteMethod;
	commentConfig.getPageMethod = getPageMethod;
}

var replyDialog = '	<div id="CommentReplyForm" class="CommentReplyForm" >' + 
'		<div class="padded-top subdue">' + 
'			Enter your reply below and click the Submit button.' + 
'		</div>' + 
'		<textarea id="ReplyText" cols="50" rows="4"></textarea><br />' + 
'		<input type="button" value="Submit" id="SubmitReply" name="CP-SubmitReply" class="comment-button"  />' +
'		<input type="button" value="Cancel" id="CancelReply" name="CP-CancelReply" class="comment-button"  />' +
'		<br />' +
'	</div> '

var editDialog = '<div id="CommentEditForm" class="CommentEditForm" >' + 
'		<div class="padded-top subdue">' + 
'			Edit your comment below and click the Submit button.' +
'		</div>' +
'		<textarea id="EditText" cols="50" rows="4"></textarea><br />' + 
'		<input type="button" value="Submit" id="SubmitEdit" name="CP-SubmitEdit" class="comment-button"  />' +
'		<input type="button" value="Cancel" id="CancelEdit" name="CP-CancelEdit" class="comment-button"  />' +
'		<br />' + 
'	</div>'

function HideAllDialogs() {
	$("div[id=EditDialogPlaceholder]").html("");
	$("div[id=ReplyDialogPlaceholder]").html("");
}

$(function () {
	// set the speed at which things are hidden or shown.
	var speed = 250;

	// sets up the container-comments around the list.
	$('.container-comments').each(function (index, element) {
		var context = $(this);

		// since javascript is enabled, show the Add Comment button
		// and Modify, Delete, and Flag buttons
		$('.CommentButtonBar', context).show();
		$('.comment-commands, .comment-commands a', context).removeClass('invisible');
		$('a[id$=ShowAllButton]', context).show();

		// set up the click event for the Add Comment button
		$('a[id$=AddCommentButton]', context).click(function (event) {
			var ctx = $(this).parent().parent();
			$('.CommentButtonBar', ctx).hide(speed);
			$('.CommentAddForm', ctx).show(speed, function () {
				$('textarea[id$=CommentText]', $(this)).focus();
			});

			return false;
		});

		// set up the click event for the Cancel button on the add comment form
		$('input[id$=CancelCommentButton]', context).click(function (event) {
			var ctx = $(this).parent().parent();
			$('.CommentButtonBar', ctx).show();
			$('.CommentAddForm', ctx).hide(speed);
			return false;
		});

		// set up the click event for the Submit button on the add comment form
		// calls a webservice and adds the returned html to the bottom of the comment list
		$('input[id$=SubmitCommentButton]', context).click(function (event) {
			var ctx     = $(this).parents('.container-comments');
			var comment = $.trim($("textarea[id$=CommentText]", ctx).val());
			comment     = encodeURIComponent(comment);

			if (comment && comment != "") {
				var showAll  = ctx.find('a[id$=HideUnavailable]:visible').length > 0;

				var postData = "{ \"objectRef\": \"" + ctx.attr('ObjectRef') + "\"," +
								 "\"boldMemberId\": \"" + ctx.attr('BoldMemberId') + "\", " +
								 "\"pageSize\": \"" + ctx.attr('PageSize') + "\", " +
								 "\"showAll\": \"" + ((showAll == true) ? 'true' : 'false') + "\", " +
								 "\"comment\": \"" + comment + "\" }";
				$.ajax(
				{
					type       : 'POST',
					cache      : false,
					url        : commentConfig.baseUrl + commentConfig.saveMethod,
					data       : postData,
					contentType: 'application/json; charset=utf-8',
					dataType   : 'json',
					tryCount   : 0,
					retryLimit : 3,
					timeout    : 5000,
					success    : function (data) {
									if (data.d.status == "OK") {
										HandleCommentReponse(ctx, data);
										$("textarea[id$=CommentText]", ctx).val("");
									}
								},
					error      : function (xhr, textStatus, errorThrown) {
									if (textStatus == 'timeout') {
										this.tryCount++;
										if (this.tryCount <= this.retryLimit) {
											//try again
											$.ajax(this);
											return;
										}
										alert('We have tried to add your comment ' + this.retryLimit +
											  ' times without success. Our servers are just a little overworked. Sorry.');
										return;
									}

									if (xhr.status == 500) {
										alert('Oops! There seems to be a server problem, please try posting your comment later.');
									}
									else {
										alert('Oops! There was a problem adding your comment, sorry.');
									}
								}
				});

			}

			$('.CommentButtonBar', ctx).show();
			$('.CommentAddForm', ctx).hide(speed);
			return false;
		});
	});

	// sets up the click event for the Delete Comment button.
	// this submits the request to a webservice and replaces the comment html
	// with the returned html.  The assumption is the if a person can delete
	// a comment, they can view deleted comments.
	$('.container-comments a[id$=DeleteButton]').live('click', function (event) {
		if (confirm("Are you sure you wish to delete this comment?")) {

			var ctx     = $(this).parents(".container-comments");
			var comment = $(this).parents('.comment-item');

			if (comment != undefined && comment.length > 0) {
				var showAll  = ctx.find('a[id$=HideUnavailable]:visible').length > 0;

				var postData = "{ \"commentId\": \"" + comment.attr('commentId') + "\"," +
								"\"boldMemberId\": \"" + ctx.attr('BoldMemberId') + "\", " +
								"\"showAll\": \"" + ((showAll == true) ? 'true' : 'false') + "\", " +
								"\"pageSize\": \"" + ctx.attr('PageSize') + "\", " +
								"\"pageNumber\": \"" + ctx.attr('PageNumber') + "\" }";

				$.ajax(
				{
					type       : 'POST',
					cache      : false,
					url        : commentConfig.baseUrl + commentConfig.deleteMethod,
					data       : postData,
					contentType: 'application/json; charset=utf-8',
					dataType   : 'json',
					success    : function (data) {
									if (data.d.status == "OK") {
										HandleCommentReponse(ctx, data);
									}
								}
				});
			}
		}
		return false;
	});

	// sets up the click event for the Modify Comment button.
	// this submits the request to a webservice and replaces the comment html
	// with the returned html.  The assumption is the if a person can edit
	// a comment, they can view edit comments.
	$('.container-comments a[name=CP-EditComment]').live('click', function (event) {
		HideAllDialogs();
		var comment      = $(this).parents('.comment-item');
		var container    = $(this).parents('.container-comments');
		var enableStatus = container.attr("ModifyStatus") == 'True';
		var ctx          = $(this).parents('.comment-item');
		var commentText  = $('.comment-content', comment).html();

        // Formatting adds newlines. Remove these so we can go back to Markdown-style editing.
		commentText = commentText.replace(/\n/ig, '');

	    // We replace \n\n with \n&nbsp;\n => <br>&nbsp;<br> to fix an IE8+ error (collapsing lines).
        // So we need to undo this.
		commentText = commentText.replace(/\<br\>\s*&nbsp;\s*\<br\>/ig, "<br><br>");

		commentText = commentText.replace(/\<br\>/ig, "\n");

		var editDialogPlaceholder = ctx.find('div[id=ReplyDialogPlaceholder]');
		editDialogPlaceholder.html(editDialog);

		var reply           = ctx.find('#CommentEditForm');
		var contentTextarea = reply.find('textarea[id=EditText]');
		var statusSelect    = reply.find('select[id=EditStatus]');

		$(contentTextarea).text(commentText);
		contentTextarea.focus();

		$(statusSelect).val($('span[id$=PubStatus]', comment).text())
					   .attr('disabled', enableStatus ? '' : 'disabled');
		return false;
	});

	$('.container-comments a[name=CP-ReplyComment]').live('click', function (event) {
		HideAllDialogs();
		var ctx = $(this).parent().parent();
		var replyDialogPlaceholder = ctx.find('div[id=ReplyDialogPlaceholder]');
		replyDialogPlaceholder.html(replyDialog);
		//var reply = ctx.find('#CommentReplyForm');
		ctx.find("textarea[id=ReplyText]").val("").focus();
		return false;
	});

	// set up the click event for the Cancel button on the reply comment form
	$('.container-comments input[name=CP-CancelEdit]').live('click', function (event) {
		//var ctx = $(this).parent().parent();
		//var reply = ctx.find('#CommentEditForm');
		HideAllDialogs();
		$("textarea[id=EditText]").text("");
		return false;
	});


	// set up the click event for the Cancel button on the reply comment form
	$('.container-comments input[name=CP-CancelReply]').live('click', function (event) {
		var ctx = $(this).parent().parent();
		var reply = ctx.find('#CommentReplyForm');
		HideAllDialogs();
		$("textarea[id=ReplyText]").val("");
		return false;
	});


	$('.container-comments input[name=CP-SubmitEdit]').live('click', function (event) {
		var commentBeingEdited = $(this).parents('.comment-item');
		var ctx                = $(commentBeingEdited).parents('.container-comments');
		var comment            = $('textarea[id=EditText]', commentBeingEdited).val();
		comment                = encodeURIComponent(comment);
		var pubStatus          = $('select[id=EditStatus]', commentBeingEdited).val() || "";
		var showAll            = ctx.find('a[id$=HideUnavailable]:visible').length > 0;

		var postData          = "{ \"commentId\": \"" + commentBeingEdited.attr('commentId') + "\"," +
								"\"comment\": \"" + comment + "\", " +
								"\"pubStatus\": \"" + pubStatus + "\", " +
								"\"boldMemberId\": \"" + ctx.attr('BoldMemberId') + "\", " +
								"\"showAll\": \"" + ((showAll == true) ? 'true' : 'false') + "\", " +
								"\"pageSize\": \"" + ctx.attr('PageSize') + "\", " +
								"\"pageNumber\": \"" + ctx.attr('PageNumber') + "\" }";

		HideAllDialogs();
		$("textarea[id=EditText]").val("");
		$.ajax(
		{
			type        : 'POST',
			cache       : false,
			url         : commentConfig.baseUrl + commentConfig.updateMethod,
			data        : postData,
			contentType : 'application/json; charset=utf-8',
			dataType    : 'json',
			tryCount    : 0,
			retryLimit  : 3,
			timeout     : 5000,
			success     : function (data) {
							if (data.d.status == "OK") {
								HandleCommentReponse(ctx, data);
								commentBeingEdited = null;
							}
			},
			error       : function (xhr, textStatus, errorThrown) {
							if (textStatus == 'timeout') {
								this.tryCount++;
								if (this.tryCount <= this.retryLimit) {
									//try again
									$.ajax(this);
									return;
								}
								alert('We have tried to update your comment ' + this.retryLimit +
									  ' times without success. Our servers are just a little overworked. Sorry.');
								return;
							}

							if (xhr.status == 500)
								alert('Oops! There seems to be a server problem, please try posting your comment later.');
							else
								alert('Oops! There was a problem updating your comment, sorry.');
						}
		});
	});

	$('.container-comments input[name=CP-SubmitReply]').live('click', function (event) {
		var commentBeingEdited = $(this).parents('.comment-item');
		var ctx                = $(commentBeingEdited).parents('.container-comments');
		var comment            = $('textarea[id=ReplyText]', commentBeingEdited).val();
		comment                = encodeURIComponent(comment);
		var showAll            = ctx.find('a[id$=HideUnavailable]:visible').length > 0;

		var postData           = "{ \"parentCommentId\": \"" + commentBeingEdited.attr('commentId') + "\"," +
								 "\"objectRef\": \"" + ctx.attr('ObjectRef') + "\"," +
								 "\"comment\": \"" + comment + "\", " +
								 "\"boldMemberId\": \"" + ctx.attr('BoldMemberId') + "\", " +
								 "\"showAll\": \"" + ((showAll == true) ? 'true' : 'false') + "\", " +
								 "\"pageSize\": \"" + ctx.attr('PageSize') + "\", " +
								 "\"pageNumber\": \"" + ctx.attr('PageNumber') + "\" }";

		HideAllDialogs();
		$("textarea[id=ReplyText]").val("");
		$.ajax(
		{
			type       : 'POST',
			cache      : false,
			url        : commentConfig.baseUrl + commentConfig.replyMethod,
			data       : postData,
			contentType: 'application/json; charset=utf-8',
			dataType   : 'json',
			tryCount   : 0,
			retryLimit : 3,
			timeout    : 5000,
			success    : function (data) {
							if (data.d.status == "OK") {
								HandleCommentReponse(ctx, data);
								commentBeingEdited = null;
							}
						},
			error: function (xhr, textStatus, errorThrown) {
						if (textStatus == 'timeout') {
							this.tryCount++;
							if (this.tryCount <= this.retryLimit) {
								//try again
								$.ajax(this);
								return;
							}
							alert('We have tried to update your comment ' + this.retryLimit +
								  ' times without success. Our servers are just a little overworked. Sorry.');
							return;
						}

						if (xhr.status == 500)
							alert('Oops! There seems to be a server problem, please try posting your comment later.');
						else
							alert('Oops! There was a problem updating your comment, sorry.');
					}
		});
	});

	// Script for Paging
	$(".container-comments .Pager a[PageNumber]").live('click', function (event) {
		var ctx      = $(this).parents(".container-comments");
		var showAll  = ctx.find('a[id$=HideUnavailable]:visible').length > 0;

		var postData = "{ "
					 +	"\"objectRef\": \"" + ctx.attr('ObjectRef') + "\","
					 +	"\"boldMemberId\": \"" + ctx.attr('BoldMemberId') + "\", "
					 +	"\"showAll\": \"" + ((showAll == true) ? 'true' : 'false') + "\", "
					 +	"\"pageSize\": \"" + ctx.attr('PageSize') + "\", "
					 +	"\"pageNumber\": \"" + $(this).attr('PageNumber') + "\","
					 +	"\"pagingAction\": \"Current\""
					 +	" }";

		$.ajax(
		{
			type       : 'POST',
			cache      : false,
			url        : commentConfig.baseUrl + commentConfig.getPageMethod,
			data       : postData,
			contentType: 'application/json; charset=utf-8',
			dataType   : 'json',
			success    : function (data) {
							HandleCommentReponse(ctx, data);
						}
		});
		return false;
	});

	// Show/Hide
	$(".container-comments a[id$=ShowAllButton], .container-comments a[id$=HideUnavailable]")
		.live('click', function (event) {
			var target   = this;
			var ctx      = $(this).parents(".container-comments");
			var showAll  = ctx.find('a[id$=HideUnavailable]:visible').length > 0;

			var postData = "{ " +
								"\"objectRef\": \"" + ctx.attr('ObjectRef') + "\"," +
								"\"boldMemberId\": \"" + ctx.attr('BoldMemberId') + "\", " +
								"\"showAll\": \"" + ((showAll == true) ? 'false' : 'true') + "\", " +
								"\"pageSize\": \"" + ctx.attr('PageSize') + "\", " +
								"\"pageNumber\": \"" + 1 + "\"," +
								"\"pagingAction\": \"Current\"" +
							" }";

			$.ajax(
			{
				type       : 'POST',
				cache      : false,
				url        : commentConfig.baseUrl + commentConfig.getPageMethod,
				data       : postData,
				contentType: 'application/json; charset=utf-8',
				dataType   : 'json',
				success    : function (data) {
								HandleCommentReponse(ctx, data);
								$("a[id$=ShowAllButton], a[id$=HideUnavailable]", ctx).show(speed);
								$(target).hide(speed);
							}
						});

			return false;
		});

	//------------ FUNCTIONS ----------------------------
	function HandleCommentReponse(ctx, data) {
		if (data.d.status == "OK") {
			$("div[name=CP-CommentList]", ctx).html(data.d.html);
			$('.comment-commands, .comment-commands a', ctx).removeClass('invisible');
		}
	}
});
function bookmarkMe(objId, objTypeId, url, imageSize, bookmarkLink, statusMsg) {
	var idPrefix     = "bm_";
	var bmkLink      = bookmarkLink || GetBmkLink(idPrefix, objId.toString(), objTypeId.toString());
	var bmkStatusMsg = statusMsg    || GetBmkStatusMsg(idPrefix, objId.toString(), objTypeId.toString());

	if (LoadWaitMessage(bmkLink, bmkStatusMsg, imageSize))
		$(bmkStatusMsg).load(url);
	return false;
}

function watchMe(objId, objTypeId, url, imageSize, bookmarkLink, statusMsg) {
	var idPrefix     = "bmw_";
	var bmkLink      = bookmarkLink || GetBmkLink(idPrefix, objId.toString(), objTypeId.toString());
	var bmkStatusMsg = statusMsg    || GetBmkStatusMsg(idPrefix, objId.toString(), objTypeId.toString());

	if (LoadWaitMessage(bmkLink, bmkStatusMsg, imageSize))
		$(bmkStatusMsg).load(url);
	return false;
}

function GetBmkLink(idPrefix, objectId, objectTypeId) {
	return $("a[name=" + idPrefix + objectId + "_" + objectTypeId + "]");
}
function GetBmkStatusMsg(idPrefix, objectId, objectTypeId) {
	return document.getElementsByName(idPrefix + objectId + "_" + objectTypeId)[0];
}

function LoadWaitMessage(bmkLink, bmkStatusMsg, imageSize) {
	if (!bmkLink || !bmkStatusMsg) return false;

	$(bmkLink).css("display", "none");
	if (imageSize == "large")
	    $(bmkStatusMsg).html('<img src="/images/animated_loading" width="32px" height="32px" border="0" class="align-top">');
	else if (imageSize == "medium")
	    $(bmkStatusMsg).html('<img src="/images/loading.gif" width="24px" height="24px" border="0" class="align-top">');
	else
		$(bmkStatusMsg).html('<img src="/images/animated_loading_blue.gif" width="16px" height="16px" border="0">');

	$(bmkStatusMsg).css("display", "");

	return true;
}
/*
	This code creates alternative language tabs for code blocks in articles.
	The users have to create the tabs by entering

	<div class="code-samples">
		<pre lang="cs">
		...
		</pre>
		<pre lang="vb.net">
		...
		</pre>
	</div>
*/

$(document).ready(function () {

	$("div.code-samples").each(function (sampleIndex) {
		var mulitBlock = $(this);
		var preBlocks  = mulitBlock.children("pre");
		
		if (preBlocks.length > 1) {

			var divID   = "divTab" + sampleIndex.toString();
			var csDivID = "codesampletab" + sampleIndex.toString();

			var tabSet = $("<div id='" + csDivID + "' class='clearfix'></div>").insertAfter(mulitBlock);
			$("<ul id='codetab" + sampleIndex + "'></ul>").appendTo(tabSet );

			var divInfo = '';
			preBlocks.each(function () {

				var innerThis = $(this);
				var tabID     = divID + innerThis.attr("lang").replace(".", "");

				$("<li><a href='#" + tabID + "'><span>" + ConvertCodeLanguage(innerThis.attr("lang")) +
				  "</span></a></li>").appendTo("#codetab" + sampleIndex);

				divInfo += "<div id='" + tabID + "'><a name='" + tabID + "'></a><pre>" + innerThis.html() + "</pre></div>";
			});

			$(divInfo).insertAfter("#codetab" + sampleIndex);

			mulitBlock.hide();
			tabSet.tabs();	
		}
	});

	// initialize the collapse/expand elements
	InitToggleCollapseExpandPre();
});

// Be very, VERY careful with this file. Compressing using .less and "simple" compression
// is fine, but changing anything, even a variable name, can cause this file to trigger 
// McAfee and AVG into thinking this is the NeoSploit trojan. 

var pOpen = new Image();
var pClose = new Image();
var PreCopy = new Image();
pOpen.src = "/images/plus.gif";
pClose.src = "/images/minus.gif";
PreCopy.src = "/images/copy_16.png";

function togglePre() {
	var id = this.getAttribute("preid");
	var preelm = $("#pre" + id)[0];
	var imgelm = $("#preimg" + id)[0];
	var togelm = $("#precollapse" + id)[0];

	if (preelm.style.display != 'none') {
		if (document.all) togelm.innerText = " Expand";
		else togelm.firstChild.nodeValue = " Expand";
		preelm.style.display = 'none';
		imgelm.setAttribute("src", pOpen.src);
	} else {
		if (document.all) togelm.innerText = " Collapse";
		else togelm.firstChild.nodeValue = " Collapse";
		preelm.style.display = 'block';
		imgelm.setAttribute("src", pClose.src);
	}
}

function CopyCode(name) {

	var id = this.getAttribute("preid");
	if (id < 0) return false;

	var elm = $("#pre" + id.toString())[0];
	if (!elm) return false;

	var text = elm.innerHTML;
	if (!text) return false;
	text = prepareCopyText(text);
	if (!text) return false;

	// window.clipboardData.setData("Text", text);
	var copyWin = window.open("", "_blank", "width=500,height=300,scrollbars=yes");
	copyWin.document.writeln("<html><body><pre>" + text  + "</pre></body></html>");

	return false;
}

function InitToggleCollapseExpandPre() {
	var articleText = $("#contentdiv")[0];
	if (!articleText) return;
	var pres = articleText.getElementsByTagName("pre");

	for (var i = 0; i < pres.length; i++) {
		if (pres[i].decoration && pres[i].decoration.toLowerCase() == 'none')
			continue;

		var parent = pres[i].parentNode;
		var length = pres[i].innerHTML.length;

		var lines = length - pres[i].innerHTML.replace(/\n/ig, '').length +
					(length - pres[i].innerHTML.replace(/\<br/ig, '').length) / 3;

		var main = document.createElement("div");
		main.className = "pre-action-link";
		main.setAttribute("id", "premain" + i.toString());
		main.setAttribute("width", "100%");
		main.setAttribute("style", "display:block");

		var elm = document.createElement("img");
		elm.setAttribute("id", "preimg" + i.toString());
		elm.setAttribute("src", pClose.src);
		elm.style.cursor = "pointer";
		elm.setAttribute("height", 9);
		elm.setAttribute("width", 9);
		elm.setAttribute("preid", i);
		elm.onclick = togglePre;

		main.appendChild(elm);

		elm = document.createElement("span");
		elm.setAttribute("id", "precollapse" + i.toString());
		elm.style.cursor = "pointer";
		elm.style.marginBottom = 0;
		elm.onclick = togglePre;
		elm.setAttribute("preid", i);
		setText(elm, " Collapse");

		main.appendChild(elm);

		elm = document.createElement("span");
		setText(elm, " | ");
		main.appendChild(elm);

		elm = document.createElement("a");
		setText(elm, "Copy Code");

		elm.href = '#';
		elm.setAttribute("preid", i);
		elm.onclick = CopyCode;
		main.appendChild(elm);

		pres[i].setAttribute("id", "pre" + i.toString());
		pres[i].style.marginTop = 0;

		parent = pres[i].parentNode;
		parent.insertBefore(main, pres[i]);
	}
}

function prepareCopyText(input) {
	if (!input) return null;

	if (!$.support.opacity)
		return input;

	// Strip HTML
	var code = $("<div/>").html(input).text().trim();

	// Encode HTML tags
	code = code.replace(/\</gi, "&lt;");

	// Collapse multiple lines
	code = code.replace(/\r\n\r\n\r\n\r\n/, "\r\n\r\n");

	return code;
}

function setText(elm, text) {
	if (typeof elm.innerText != 'undefined') elm.innerText = text; else elm.textContent = text;
}

function ConvertCodeLanguage(code) {

	switch (code.toLowerCase()) {
		case "text":
			return "Plain Text";
			break;
		case "aspnet":
			return "ASP.NET";
			break;
		case "cs":
			return "C#";
			break;
		case "c++":
			return "C++";
			break;
		case "vb.net":
			return "VB.NET";
			break;
		case "mc++":
			return "C++ / CLI";
			break;
		case "css":
			return "CSS";
			break;
		case "delphi":
			return "Delphi";
			break;
		case "F#":
			return "F#";
			break;
		case "html":
			return "HTML";
			break;
		case "java":
			return "Java";
			break;
		case "jscript":
			return "Javascript";
			break;
		case "asm":
			return "MASM / ASM";
			break;
		case "msil":
			return "MSIL";
			break;
		case "midl":
			return "MIDL";
			break;
		case "php":
			return "PHP";
			break;
		case "sql":
			return "SQL";
			break;
		case "vbscript":
			return "VBScript";
			break;
		case "xml":
			return "XML";
			break;

	}

	return code;
}
