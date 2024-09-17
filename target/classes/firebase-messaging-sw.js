if ('function' === typeof importScripts) {
  importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
  importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js");

  const firebaseConfig = {
    apiKey: "AIzaSyByZj-mJl2fORRsG9sRD0klIcVw7pbZU4o",
    authDomain: "cabinet-ac14a.firebaseapp.com",
    projectId: "cabinet-ac14a",
    storageBucket: "cabinet-ac14a.appspot.com",
    messagingSenderId: "525580633716",
    appId: "1:525580633716:web:ed02b0e284f0ca51cdb321",
    measurementId: "G-7TWJTQ3G7F"
  };

  // Initialize Firebase
  const app = firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();

  let bgHandler = function (payload) {
    console.log('[firebase-messaging-sw.js] Received background message');
    console.log(JSON.stringify(payload));
    if (payload.notification) {
      const notificationTitle = payload.notification.title || 'title';
      let notificationOptions = {
        body: payload.notification.body || 'body',
        icon: '/assets/img/favicon_io/favicon-32x32.png',
        actions: [
          {
            action: 'url-action',
            type: 'button',
            title: "Харах"
          }
        ]
      };
      if (payload.notification.image) {
        notificationOptions.image = payload.notification.image;
      }

      self.registration.showNotification(notificationTitle, notificationOptions);
    } else {
      console.log("payload is empty. Ignoring.");
    }
  };

  messaging.onBackgroundMessage((payload) => {
    bgHandler(payload.data ? JSON.parse(payload.data) : {});
  });

  messaging.bgMessageHandler((payload) => {
    bgHandler(payload.data ? JSON.parse(payload.data) : {});
  });

  let onNotifclick = function (event) {
    console.log(event);
    console.log('[Service Worker] Notification click received.');

    event.notification.close();

    event.waitUntil(
      clients.openWindow('https://example.com')
    );
    if (!event.action) {
      event.waitUntil(
        clients.matchAll({ type: "window" }).then((clientsArr) => {
          // If a Window tab matching the targeted URL already exists, focus that;
          const hadWindowToFocus = clientsArr.some((windowClient) =>
            windowClient.url === e.notification.data.url
              ? (windowClient.focus(), true)
              : false
          );
          // Otherwise, open a new tab to the applicable URL and focus it.
          if (!hadWindowToFocus)
            clients
              .openWindow(e.notification.data.url)
              .then((windowClient) => (windowClient ? windowClient.focus() : null));
        })
      );
      return;
    }

    switch (event.action) {
      case 'url-action':
        $state.href(event.notification.data.stateUrl, { id: event.notification.data.stateParamId });
        break;
      default:
        console.log(`Unknown action clicked: '${event.action}'`);
        break;
    }
  };

  self.addEventListener('notificationclick', (event) => {
    onNotifclick(event);
  });
  addEventListener('notificationclick', (event) => {
    onNotifclick(event);
  });
  self.onnotificationclick = function(event) {
    onNotifclick(event);
  };
}
