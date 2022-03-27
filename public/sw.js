self.addEventListener('push', function (e) {
    if (!(self.Notification && self.Notification.permission === 'granted')) {
        return;
    }

    if (e.data) {
        const msg = e.data.json();
        console.log(msg);

        e.waitUntil(self.registration.showNotification(msg.title, {
            body: msg.body,
            data: msg.data
        }))
    }
});

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

self.addEventListener('notificationclick', (ev) => {
    console.log(ev);
    ev.notification.close();

    const endpoint = (ev.notification.data || ev.data || {}).endpoint;

    ev.waitUntil(clients.matchAll({
        type: 'window'
    }).then(function (clientList) {
        for (let i = 0; i < clientList.length; i++) {
            const client = clientList[i];

            if (client.url === endpoint && 'focus' in client) {
                return client.focus();
            }
        }

        if (clients.openWindow) {
            return clients.openWindow(endpoint || '/');
        }
    }));
})