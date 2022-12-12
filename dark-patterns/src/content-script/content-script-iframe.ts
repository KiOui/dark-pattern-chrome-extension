window.addEventListener("load", () => {
  if (window.self === window.top) {
    return;
  }
  chrome.runtime.sendMessage({
    type: "send_iframe_content",
    content: window.document.body.innerText,
    referrer: document.location.href,
  });
});
