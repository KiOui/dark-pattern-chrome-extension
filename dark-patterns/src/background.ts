import { setBadge } from "@/inc/services";
import MessageSender = chrome.runtime.MessageSender;
import TabInformation from "@/models/tab-information";
import FoundDarkPattern from "@/models/found-dark-pattern";

const tabInformation = new TabInformation();

function getDetectedPatternsHandler(
  message: { tabId: number },
  sender: MessageSender,
  sendResponse: (response: FoundDarkPattern[]) => void
) {
  const tab = tabInformation.getTab(message.tabId);
  if (tab !== null) {
    sendResponse(tab.getDetectedPatterns());
  } else {
    sendResponse([]);
  }
}

function setDetectedPatternsHandler(
  message: { patterns: FoundDarkPattern[] },
  sender: MessageSender,
  sendResponse: (response: boolean) => void
) {
  if (sender.tab !== undefined && sender.tab.id !== undefined) {
    tabInformation.addTab(sender.tab.id).setDetectedPatterns(message.patterns);
    chrome.runtime.sendMessage({
      type: "tab_information_updated",
      tab: tabInformation.getTab(sender.tab.id),
    });
  }

  const amountOfPatternsDetected = message.patterns.length;

  const badgeColor = amountOfPatternsDetected === 0 ? "green" : "red";

  if (sender.tab !== undefined && sender.tab.id !== undefined) {
    setBadge(
      amountOfPatternsDetected.toString(),
      badgeColor,
      sender.tab.id
    ).then((badgeSet) => {
      sendResponse(badgeSet);
    });
  } else {
    setBadge(amountOfPatternsDetected.toString(), badgeColor, null).then(
      (badgeSet) => {
        sendResponse(badgeSet);
      }
    );
  }
}

function getTabIdHandler(
  sender: MessageSender,
  sendResponse: (response: number | null) => void
) {
  if (sender.tab !== undefined && sender.tab.id !== undefined) {
    sendResponse(sender.tab.id);
  }
  sendResponse(null);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type !== undefined) {
    if (message.type === "set_detected_patterns") {
      setDetectedPatternsHandler(message, sender, sendResponse);
    } else if (message.type === "get_tab_id") {
      getTabIdHandler(sender, sendResponse);
    } else if (message.type === "get_detected_patterns") {
      getDetectedPatternsHandler(message, sender, sendResponse);
    }
  }
  sendResponse(false);
});
