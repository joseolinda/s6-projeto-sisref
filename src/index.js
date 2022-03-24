import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import api from './services/api';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();

initSW();

function initSW() {
    if (!("serviceWorker" in navigator) || !("PushManager" in window) || Notification.permission === 'denied') {
        //push isn't supported
        return;
    }

    //register the service worker
    navigator.serviceWorker.register(`${process.env.PUBLIC_URL}/sw.js`, { scope: '/' })
        .then(() => {
            console.log('serviceWorker installed!')
            initPush();
        })
        .catch((err) => {
            console.log(err)
        });
}

function initPush() {
    if (!navigator.serviceWorker.ready) {
        return;
    }

    Notification.requestPermission()
        .then((permissionResult) => {
            if (permissionResult !== 'granted') {
                throw new Error('We weren\'t granted permission.');
            }
            subscribeUser();
        });
}

function subscribeUser() {
    navigator.serviceWorker.ready
    .then(registration => {
        registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker == null) {
                return;
            }
            installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed') {
                    if (navigator.serviceWorker.controller) {
                        // At this point, the updated precached content has been fetched,
                        // but the previous service worker will still serve the older
                        // content until all client tabs are closed.
                        console.log(
                        'New content is available and will be used when all ' +
                            'tabs for this page are closed. See https://bit.ly/CRA-PWA.'
                        );
                    } else {
                        // At this point, everything has been precached.
                        // It's the perfect time to display a
                        // "Content is cached for offline use." message.
                        console.log('Content is cached for offline use.');
                    }
                }
            };
        };

        if (registration.active) {
            const subscribeOptions = {
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(
                    process.env.REACT_APP_VAPID_PUBLIC_KEY
                )
            };

            return (registration.pushManager.subscribe(subscribeOptions));
        } else {
            return Promise.reject(registration);
        }
      })
        .then((pushSubscription) => {
            console.log('Received PushSubscription: ', pushSubscription);
            if (pushSubscription) storePushSubscription(pushSubscription);
        });
}

function urlBase64ToUint8Array(base64String) {
    console.log(base64String);

    var padding = '='.repeat((4 - base64String.length % 4) % 4);
    var base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');


    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);

    for (var i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

function storePushSubscription(pushSubscription) {
    // const token = document.querySelector('meta[name=csrf-token]').getAttribute('content');

    // console.log(token);

    api.post('/push', pushSubscription)
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err));
}