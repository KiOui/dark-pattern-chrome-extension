function getTextContentForElement(element: HTMLElement) {
  console.log("bla");
}

window.addEventListener("load", () => {
  chrome.runtime.sendMessage({
    type: "send_iframe_content",
    content: document.body.getElementsByTagName("div")[1].innerText,
    referrer: document.location.href,
  });
  console.log(document.body);
});
