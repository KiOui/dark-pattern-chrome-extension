import { setBadge } from "@/inc/services";
import MessageSender = chrome.runtime.MessageSender;

function setBadgeHandler(
  message: { params: { text: string; color: string } },
  sender: MessageSender,
  sendResponse: (response: boolean) => void
) {
  if (sender.tab !== undefined && sender.tab.id !== undefined) {
    setBadge(message.params.text, message.params.color, sender.tab.id).then(
      (badgeSet) => {
        sendResponse(badgeSet);
      }
    );
  } else {
    setBadge(message.params.text, message.params.color, null).then(
      (badgeSet) => {
        sendResponse(badgeSet);
      }
    );
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type !== undefined) {
    if (message.type === "set_badge") {
      setBadgeHandler(message, sender, sendResponse);
    }
  }
  sendResponse(false);
});
