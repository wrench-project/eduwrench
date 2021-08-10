function load(url) {
  return new Promise((resolve, reject) => {
    if (typeof window !== "undefined") {
      let script = document.createElement("script")
      script.type = "text/javascript"
      script.async = true
      script.src = url
      script.onload = resolve
      script.onerror = reject
      document.head.appendChild(script)
    }
  })
}

load("https://www.googletagmanager.com/gtag/js?id=G-3PDXMXJKMC")
  .then(() => {
    window.dataLayer = window.dataLayer || []

    function gtag() {
      window.dataLayer.push(arguments)
    }

    gtag("js", new Date())

    gtag("config", "G-3PDXMXJKMC")
  })
  .catch((err) => {
    console.error("Something went wrong!", err)
  })
