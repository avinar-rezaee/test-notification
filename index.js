const publicVapidKey = 'BAaUEZYHqpOmTtWYhLHQdzLbYoTNu4sVq1gGeLSbHrwnda4GideCzwEwNlscd27y0wIowaJAUfr3a7hRcTGSF1c'

if ("serviceWorker" in navigator) {

    document.querySelector('#btn-permission').addEventListener('click', e => {
        window.Notification.requestPermission().then(perm => {
            const notification = new Notification('test')
            send().catch(err => console.error(err));

        }).catch(e => {
            document.querySelector('#logs').append(e)
            document.querySelector('#logs').append(document.createElement('br'))

        })
    })

    window.addEventListener('load', () => {
        navigator.serviceWorker.register("/worker.js", {
            scope: "/"
        })
            .then(registration => console.log('SW registered: ', registration))
            .catch(registrationError => console.log('SW registration failed: ', registrationError));
    });

}

const socket = io("https://u.darbast.app/members", {
    query: {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2ODk3NzI1OTYsIm1lbWJlcl9pbmZvIjp7Il9pZCI6IjY0YjdlMjM0MWYyMTEwNDIxZTk5MmYxNyJ9LCJleHAiOjE3MjEzMDg1OTYsImlzcyI6Imh0dHBzOi8vdS5kYXJiYXN0LmFwcCJ9.HbS3G9QHFbP0aBsHRPlsLG6yBwtyGqUoZtEHdciEoc0"
    },
    transports: ["websocket"]
});

socket.io.on("error", (error) => {
    // ...
    console.log(error);
    document.querySelector('#logs').append(`${error}`)
    document.querySelector('#logs').append(document.createElement('br'))
});

// Register SW, Register Push, Send Push
async function send() {
    // Register Service Worker
    console.log("Registering service worker...");
    document.querySelector('#logs').append("Registering service worker...")
    document.querySelector('#logs').append(document.createElement('br'))

    // const register = await navigator.serviceWorker.register("/worker.js", {
    //     scope: "/"
    // });

    // console.log("Service Worker Registered...");
    // document.querySelector('#logs').append("\nService Worker Registered...")
    // document.querySelector('#logs').append(document.createElement('br'))
    navigator.serviceWorker.ready.then((serviceWorkerRegistration) => {
        console.log("Service Worker Registered...");
        document.querySelector('#logs').append("\nService Worker Registered...")
        document.querySelector('#logs').append(document.createElement('br'))
        const options = {
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
        };
        console.log("Registering Push...");
        document.querySelector('#logs').append("Registering Push...")
        document.querySelector('#logs').append(document.createElement('br'))
        serviceWorkerRegistration.pushManager.subscribe(options).then(
            async (pushSubscription) => {
                console.log(pushSubscription.endpoint);
                console.log("Push Registered...");
                document.querySelector('#logs').append("Push Registered...")
                document.querySelector('#logs').append(document.createElement('br'))
                console.log("Sending Push...");
                document.querySelector('#logs').append("Sending Push...")
                document.querySelector('#logs').append(document.createElement('br'))
                await socket.emit('subscribe_for_push_notifications', pushSubscription)
                console.log("Push Sent...");
                document.querySelector('#logs').append("Push Sent...")
                document.querySelector('#logs').append(document.createElement('br'))
                // The push subscription details needed by the application
                // server are now available, and can be sent to it using,
                // for example, an XMLHttpRequest.
            },
            (error) => {
                // During development it often helps to log errors to the
                // console. In a production environment it might make sense to
                // also report information about errors back to the
                // application server.
                console.error(error);
                document.querySelector('#logs').append(error)
                document.querySelector('#logs').append(document.createElement('br'))
            },
        );
    });
    // Register Push
    // console.log("Registering Push...");
    // document.querySelector('#logs').append("Registering Push...")
    // document.querySelector('#logs').append(document.createElement('br'))
    // const subscription = await register.pushManager.subscribe({
    //     userVisibleOnly: true,
    //     applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
    // });
    // console.log("Push Registered...");
    // document.querySelector('#logs').append("Push Registered...")
    // document.querySelector('#logs').append(document.createElement('br'))

    // Send Push Notification
    // console.log("Sending Push...");
    // document.querySelector('#logs').append("Sending Push...")
    // document.querySelector('#logs').append(document.createElement('br'))
    // await socket.emit('subscribe_for_push_notifications', subscription)
    // console.log("Push Sent...");
    // document.querySelector('#logs').append("Push Sent...")
    // document.querySelector('#logs').append(document.createElement('br'))
}

function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, "+")
        .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}


document.querySelector('#btn').addEventListener('click', e => {
    socket.emit('test_notification', {});
})

let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault(); // Prevent the mini-infobar from appearing on mobile
    deferredPrompt = e; // Save the event so it can be triggered later.
    // Update UI to notify the user they can add to the home screen
});
document.querySelector('#btn-add-to-homescreen').addEventListener('click', (e) => {
    deferredPrompt.prompt(); // Show the install prompt
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }
        deferredPrompt = null;
    });
});