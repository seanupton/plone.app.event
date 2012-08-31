// common date/time functionality in the plone.datetime namespace:
(function ($) {
    "use strict";

    // Namespaces:
    $.plone = $.plone || {};
    $.plone.datetime = $.plone.datetime || {};

    // zero-pad 1-2 digit integers to two-digit strings
    $.plone.datetime._pad2 = function (v) {
        v = parseInt(v);
        return (v < 10) ? ('0' + v) : ('' + v);
    }

    // UTC offset string (ISO 8601 mimic) from Date object:
    $.plone.datetime.iso_offset = function (dt) {
        var tzoffset = 'Z', offset=dt.getTimezoneOffset(),
            _pad2 = $.plone.datetime._pad2;
        if (offset != 0) {
            tzoffset = (offset < 0) ? '+' : '-';
            offset = Math.abs(offset);
            tzoffset += _pad2(Math.floor(offset/60)) + ':' + _pad2(offset%60);
        }
        return tzoffset;
    }

    // Parse ISO 8601; attempt native, fallback for MSIE<9, older Webkit.
    $.plone.datetime.dt_parse = function (stamp) {
        var dt;
        var dt = new Date(stamp);
        if (dt == NaN) {
            /** https://github.com/csnover/js-iso8601 */(function(n,f){var u=n.parse,c=[1,4,5,6,7,10,11];n.parse=function(t){var i,o,a=0;if(o=/^(\d{4}|[+\-]\d{6})(?:-(\d{2})(?:-(\d{2}))?)?(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3}))?)?(?:(Z)|([+\-])(\d{2})(?::(\d{2}))?)?)?$/.exec(t)){for(var v=0,r;r=c[v];++v)o[r]=+o[r]||0;o[2]=(+o[2]||1)-1,o[3]=+o[3]||1,o[8]!=="Z"&&o[9]!==f&&(a=o[10]*60+o[11],o[9]==="+"&&(a=0-a)),i=n.UTC(o[1],o[2],o[3],o[4],o[5]+a,o[6],o[7])}else i=u?u(t):NaN;return i}})(Date)
            dt = new Date(Date.parse(stamp));
        }
        return dt;
    }

    // Get offset display label
    $.plone.datetime.offset_label = function (dt) {
        var offset = $.plone.datetime.iso_offset(dt);
        if (offset == 'Z') return ' (UTC)';
        return ' (UTC'+offset+')';
    }

    // 24h or 12h label for time only, given Date object, optional ampm flag
    $.plone.datetime.time_label = function (dt, ampm) {
        var hour = dt.getHours(),
            m = dt.getMinutes(),
            _pad2 = $.plone.datetime._pad2;
        if (!ampm) return ''+_pad2(hour)+':'+_pad2(m);      // 24h
        ampm = (hour >= 12) ? ' PM' : ' AM';                // get am/pm label
        hour = (hour > 12) ? hour-12 : hour;                // recalc pm times
        hour = (hour==0) ? 12 : hour;                       // midnight hour
        return '' + _pad2(hour) + ':' + _pad2(m) + ampm;    // 12h am/pm
    }

    // Given a string label for a time detect if it displays AM/PM times
    $.plone.datetime.is_ampm = function (timelabel) {
        var p = new RegExp('[AP][.]?M[.]?', 'i');
        return Boolean(p.exec(timelabel));
    }
}(window));


var end_start_delta;

function wholeDayHandler(e) {
    if (e.target.checked) {
        jQuery('.datetimewidget-time').fadeOut();
    } else {
        jQuery('.datetimewidget-time').fadeIn();
    }
}

function updateEndDate() {
    var start_date = jQuery('#startDate').data('dateinput').getValue();
//    var start_date = getDateTime('#archetypes-fieldname-startDate');
    var new_end_date = new Date(start_date);
    new_end_date.setDate(start_date.getDate() + end_start_delta);
    jQuery('#endDate').data('dateinput').setValue(new_end_date);
//    var end = jQuery('#archetypes-fieldname-endDate');
//    jQuery(end).find(".hour").val(new_end_date.getHours());
//    jQuery(end).find(".min").val(new_end_date.getMinutes());
}

function getDateTime(datetimewidget_id) {
    var datetimewidget = jQuery(datetimewidget_id);
    var fields = ['year', 'month', 'day', 'hour', 'min'];
    var parts = {};
    jQuery.each(fields, function(){
        parts[this] = parseInt(jQuery(datetimewidget).find("."+this).val());
    });
    var date = new Date(parts.year, parts.month - 1, parts.day,
                        parts.hour, parts.min);
    return date;
}

function validateEndDate() {
    var start_datetime = getDateTime('#archetypes-fieldname-startDate');
    var end_datetime = getDateTime('#archetypes-fieldname-endDate');

    if(end_datetime < start_datetime) {
        jQuery('#archetypes-fieldname-endDate').addClass("error");
    } else {
        jQuery('#archetypes-fieldname-endDate').removeClass("error");
    }
}

function initDelta(e) {
    var start_datetime = getDateTime('#archetypes-fieldname-startDate');
    var end_datetime = getDateTime('#archetypes-fieldname-endDate');
    // delta in days
    end_start_delta = (end_datetime - start_datetime) / 1000 / (3600 * 24);
}

function portletCalendarTooltips() {
    jQuery('.portletCalendar dd a[title]').tooltip({
        offset: [-10,0]
    });
}


jQuery(document).ready(function() {
    portletCalendarTooltips();

    jQuery('#wholeDay').bind('change', wholeDayHandler);
    /*jQuery('[id^=startDate]').bind('focus', initDelta);
    jQuery('[id^=endDate]').bind('focus', initDelta);
    jQuery('#startDate').each(function(){
        jQuery(this).data('dateinput').onShow(initDelta);
    });
    jQuery('#endDate').each(function(){
        jQuery(this).data('dateinput').onShow(initDelta);
    });
    jQuery('[id^=startDate]').change(updateEndDate);
    jQuery('[id^=endDate]').change(validateEndDate);*/

});
