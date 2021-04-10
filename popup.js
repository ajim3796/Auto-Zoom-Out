chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {
  chrome.tabs.sendMessage(tab[0].id, "popup", function (response) {
    if (response[0] === "zoom") {
      document.getElementById("type-select").options[0].selected = true;
    } else if (response[0] === "width") {
      document.getElementById("type-select").options[1].selected = true;
    } else {
      document.getElementById("type-select").options[2].selected = true;
    }
    document.getElementById("size-input").setAttribute("value", response[1]);
  });

  document.getElementById("type-select").onchange = function () {
    var index = document.getElementById("type-select").selectedIndex;
    var value = document.getElementById("size-input").value;
    if (index === 0) {
      chrome.tabs.sendMessage(tab[0].id, ["zoom", value]);
    } else if (index === 1) {
      chrome.tabs.sendMessage(tab[0].id, ["width", value]);
    } else {
      document.getElementById("size-input").setAttribute("value", "100");
      chrome.tabs.sendMessage(tab[0].id, "no change");
    }
  };

  document.getElementById("size-input").onchange = function () {
    var index = document.getElementById("type-select").selectedIndex;
    var value = document.getElementById("size-input").value;
    if (index === 1) {
      chrome.tabs.sendMessage(tab[0].id, ["width", value]);
    } else {
      chrome.tabs.sendMessage(tab[0].id, ["zoom", value]);
    }
  };

  document.getElementById("save_domain").onclick = function () {
    chrome.tabs.sendMessage(tab[0].id, "save_domain");
    document.getElementById("type-select").options[2].selected = true;
    document.getElementById("size-input").setAttribute("value", "100");
  };

  document.getElementById("save_url").onclick = function () {
    chrome.tabs.sendMessage(tab[0].id, "save_url");
    document.getElementById("type-select").options[2].selected = true;
    document.getElementById("size-input").setAttribute("value", "100");
  };

  document.getElementById("reset").onclick = function () {
    chrome.tabs.sendMessage(tab[0].id, "reset");
  };

  document.getElementById("no-scrollbar").onclick = function () {
    chrome.tabs.sendMessage(tab[0].id, "no scrollbar");
  };
});
