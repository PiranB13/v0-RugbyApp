// Service Worker Version: 1.0.0
// This is the service worker that will handle push notifications
self.addEventListener("push", (event) => {
  const data = event.data.json()

  const options = {
    body: data.body,
    icon: data.icon || "/logo.png",
    badge: data.badge || "/badge.png",
    data: {
      url: data.url || "/messages",
    },
    actions: data.actions || [],
  }

  event.waitUntil(self.registration.showNotification(data.title, options))
})

// When the user clicks on the notification, open the relevant page
self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  // This looks to see if the current is already open and focuses if it is
  event.waitUntil(
    clients
      .matchAll({
        type: "window",
      })
      .then((clientList) => {
        const url = event.notification.data.url

        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i]
          if (client.url === url && "focus" in client) return client.focus()
        }

        if (clients.openWindow) return clients.openWindow(url)
      }),
  )
})

// Log when the service worker is installed
self.addEventListener("install", (event) => {
  console.log("Service Worker installed")
  self.skipWaiting()
})

// Log when the service worker is activated
self.addEventListener("activate", (event) => {
  console.log("Service Worker activated")
  return self.clients.claim()
})
