var calendar;

function fetch_ics_feed(url) {
  calendar.removeAllEventSources()
  calendar.addEventSource(
    {
      url: url,
      format: 'ics',
      failure: function(err) {
        if (err.xhr.readyState === 4 && err.xhr.status === 0) {
          document.getElementById('popup-title').textContent = "Error loading calendar";
          document.getElementById('popup-time').hidden = true;
          document.getElementById('popup-location').hidden = true;
          document.getElementById('popup-download').hidden = true;
          document.getElementById('popup-description').textContent = "The calendar could not be loaded.";
          document.getElementById('popup-description').hidden = false;
          document.getElementById('popup').hidden = false;
        }
      }
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
      },
      eventClick: function(info) {
        info.jsEvent.preventDefault(); // Prevent the browser navigating to the url

        clicked_event = info.event;

        debug_event = info;
        document.getElementById('popup-title').textContent = info.event.title;

        if (info.event.allDay) {
          if (info.event.end.getHours() === 0 && info.event.end.getMinutes() === 0 && info.event.end.getSeconds === 0) {
            end = info.event.end - 1;
          } else {
            end = info.event.end;
          }
          docuement.getElementById('popup-time').textContent = FullCalendar.formatRange(
            info.event.start,
            end,
            {
              year: 'numeric',
              month: 'long',
              day: '2-digit',
              timeZond: 'local',
              locale: 'en-GB'
            }
          );
        } else {
          document.getElementById('popup-time').textContent = FullCalendar.formatRange(
            info.event.start,
            info.event.end,
            {
              year: 'numeric',
              month: 'long',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
              timeZone: 'local',
              locale: 'en-GB'
            }
          );
        }

        if (info.event.extendedProps.location === null) {
          document.getElementById('popup-location').hidden = true;
        } else {
          document.getElementById('popup-location').hidden = false;
          document.getElementById('popup-location').textContent = "Location: " + info.event.extendedProps.location;
        }

        if (info.event.extendedProps.description === null) {
          document.getElementById('popup-description').hidden = true;
        } else {
          document.getElementById('popup-description').hidden = false;
          document.getElementById('popup-description').textContent = info.event.extendedProps.description;
        }

        if (info.event.url === null) {
          document.getElementById('popup-url').hidden = true;
        } else {
          document.getElementById('popup-url').hidden = false;
          document.getElementById('popup-url').textContent = info.event.url;
          document.getElementById('popup-url').setAttribute('href', info.event.url);
        }

        document.getElementById('popup-download').hidden = false;
        document.getElementById('popup').hidden = false;
      }
    }
  );

  calendar.render();

  url_feed = URIHash.get("feed");
  url_title = URIHash.get("title");

  // overwrite URI parsed values
  url_feed = 'https://s3.eu-central-1.amazonaws.com/onefid.content.assets/8394454/4b861893-cd6d-4d47-a5b2-a63ac6fe9e8e/Connecteam_DCW_Kft__433b5291_c46a_4f94_99ca_9d49148fa34a.ics';
  url_title = 'Karesz kávézó beosztás';
  document.getElementById('urlForm').style.display = 'none';

  console.log({
    url_feed,
    url_title,
  });
  if (url_title) {
    document.getElementsByTagName("h1")[0].textContent = url_title;
    document.title = url_title;
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
  }

  document.getElementById('popup-close').onclick = function () {
    document.getElementById('popup').hidden = true;
  }

  document.getElementById('popup-download').onclick = function() {
    var cal = ics();
    cal.addEvent(
      clicked_event.title,
      clicked_event.extendedProps.description,
      clicked_event.extendedProps.location,
      clicked_event.start,
      clicked_event.end
    );
    cal.download('event');
  };

  document.getElementById('popup').addEventListener("click", function() {
    document.getElementById('popup').hidden = true;
  });

  document.getElementById('popup-content').addEventListener("click", function(e) {
    e.stopPropagation();
  });
});

document.addEventListener("keypress", function(e) {
  if (e.key === "Escape") {
    document.getElementById('popup').hidden = true;
  }
});
