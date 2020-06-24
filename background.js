// chrome.tabs.onActivated.addListener(function () {
//     chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {
//         chrome.tabs.sendMessage(tab[0].id, "badge", function (response) {
//             if (isNaN(response) == false) {
//                 chrome.browserAction.setBadgeText({ text: String(response) });
//             } else {
//                 chrome.browserAction.setBadgeText({ text: "off" });
//             }
//         });
//     });
// });
// "background": {
//     "scripts": [
//         "background.js"
//     ],
//     "presistent": false
// },
