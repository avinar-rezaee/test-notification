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