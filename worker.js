console.log("Service Worker Loaded...");
self.addEventListener("push", e => {
    const data = e.data.json();
    console.log("Push Recieved...");
    // document.querySelector('#logs').append("Push Recieved...")
    // document.querySelector('#logs').append(document.createElement('br'))
    self.registration.showNotification(data.title, {
        body: "Notified for TEST!",
        icon: "http://image.ibb.co/frYOFd/tmlogo.png"
    });
});

let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault(); // Prevent the mini-infobar from appearing on mobile
    deferredPrompt = e; // Save the event so it can be triggered later.
    // Update UI to notify the user they can add to the home screen
});