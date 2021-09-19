var calendar;

function fetch_ics_feed(url) {
  calendar.removeAllEventSources()
  calendar.addEventSource(
    {
      url: url,
      format: 'ics'
    }
  );
}

document.addEventListener('DOMContentLoaded', function () {
  calendar = new FullCalendar.Calendar(
    document.getElementById('calendar'),
    {
      initialView: 'dayGridMonth',
      headerToolbar: {
        start: "prev,next today",
        center: "title",
        end: "dayGridMonth,timeGridWeek,timeGridDay,listMonth"
      },
      navLinks: true,
      editable: false,
      slotMinTime: "0:00:00",
      slotMaxTime: "24:00:00",
      firstDay: 1,
      nowIndicator: true,
      slotLabelFormat: {
        hour: "numeric",
        minute: "2-digit",
        omitZeroMinute: false,
        meridiem: false,
        hour12: false
      },
      eventTimeFormat: {
        hour: "numeric",
        minute: "2-digit",
        omitZeroMinute: false,
        meridiem: false,
        hour12: false
      }
    }
  );

  calendar.render();

  const url_feed = URIHash.get("feed");
  const url_title = URIHash.get("title");
  console.log({
    url_feed,
    url_title,
  });
  if (url_title) {
    document.getElementsByTagName("h1")[0].textContent = url_title;
  }
  if (url_feed) {
    url = url_feed;
    console.log(`Load ${url}`);
    document.getElementsByTagName("input")[1].checked = true;
    fetch_ics_feed(url);
    document.getElementById("eventsource").value = url;
  }

  document.getElementById("fetch").onclick = function () {
    const url = document.getElementById("eventsource").value;
    fetch_ics_feed(url);
  };
});
