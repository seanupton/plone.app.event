
// event_view: localize start/end times, date, timezone offset note
//  requires plone.datetime namespaced functions in event.js
jq(document).ready(function () {
    var details = jq('.eventDetails');
    if (!details) return;
    var initial = jq('.vevent', details).first(),
        datedisplay = jq('.datedisplay', initial),
        timerange = jq('.timerange'),
        ampm = plone.datetime.is_ampm(jq('.dtstart', timerange).text()),
        dtstart = jq('.dtstart', timerange).attr('title'), 
        dtend = jq('.dtend', timerange).attr('title'),
        start = plone.datetime.dt_parse(dtstart),
        end = plone.datetime.dt_parse(dtend),
        start_label = plone.datetime.time_label(start, ampm),
        end_label = plone.datetime.time_label(end, ampm),
        of_label = plone.datetime.offset_label(start),
        msg;
    if ((start != NaN) && (end != NaN)) {
        jq('.dtstart', timerange).empty().text(start_label);
        jq('.dtend', timerange).empty().text(end_label);
        msg = jq('<em>Times displayed are adjusted to your local time.  '+of_label+'</em>');
        jq('span.timezone', initial).empty().append(msg);
        // in small minority of cases, date change across timezones:
        if (datedisplay.text().indexOf(''+start.getDate()+',') == -1) {
            datedisplay.text(start.toDateString());
        }
    }
});

