import "https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js";
import "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js";

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
//const analytics = firebase.getAnalytics(app);
const messaging2 = firebase.messaging();

function requestPermission() {
  console.debug('Requesting permission...');
  window.Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      requestToken();
    }
  });
}

function requestToken() {
  console.debug('Notification permission granted.');
  const fcm_token = localStorage.getItem("fcm_token");
  if (fcm_token === null) {
    messaging2.getToken({ vapidKey: 'BHmqOItNaCDBMrFy1SBjCYlBEzvDsjnFHo65Mq2ks1BoJGXgZw3aR39aVj9rZQnf6DXL35F9q5X-rtgyEK-Fi5w' }).then((currentToken) => {
      if (currentToken) {
        // console.debug(currentToken);
        localStorage.setItem("fcm_token", currentToken);
        postToken();
      } else {
        console.debug('No registration token available. Request permission to generate one.');
        localStorage.removeItem("fcm_token");
        requestToken();
      }
    }).catch((err) => {
      console.debug('An error occurred while retrieving token. ', err);
    });
  } else {
    postToken();
  }
}

function postToken() {
  console.debug("ready to listen foreground with token: " + localStorage.getItem("fcm_token"));
  registerServiceWorker();
  messaging2.onMessage((payload) => {
    console.debug('[firebase-messaging-sw.js] Received foreground message ', payload);
    let element = angular.element($("#header_main"));
    let scope = element.scope();
    scope.$root.$broadcast("on-foreground-notification", { payload: payload });
  });
}

window.onload = function () {
  requestPermission();
};

function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/firebase-messaging-sw.js', {
        scope: '.',
        //    type: 'module'
      }).then(function (reg) {
        if (reg.installing) {
          console.debug('Service worker installing');
        } else if (reg.waiting) {
          console.debug('Service worker installed');
        } else if (reg.active) {
          console.debug('Service worker active');
        }
        navigator.serviceWorker.getRegistrations().then(registrations => {
            console.debug(registrations);
        });

      }).catch(function (error) {
        console.debug('Registration failed with ');
        console.error(error);
      });
    } else {
      console.debug("Service worker not in navigator");
    }
}