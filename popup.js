const typeSelect = document.getElementById("type-select");
const sizeInput = document.getElementById("size-input");
const checkButton = document.getElementById("check");
const saveHostButton = document.getElementById("save-host");
const saveUrlButton = document.getElementById("save-url");
const resetButton = document.getElementById("reset");
let type;
let size;

async function sendMessageToActiveTab(message) {
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true }).catch(e => { });
  const response = await chrome.tabs.sendMessage(tab.id, message).catch(e => { });
  return response;
}

(async () => {
  const popup = await sendMessageToActiveTab({ msg: "popup", type: "", size: "" });
  if (popup === void 0) {
    typeSelect.disabled = true;
    sizeInput.disabled = true;
    checkButton.disabled = true;
    saveHostButton.disabled = true;
    saveUrlButton.disabled = true;
    resetButton.disabled = true;
  } else {
    if (popup[0] === "zoom") {
      typeSelect.options[0].selected = true;
    } else if (popup[0] === "width") {
      typeSelect.options[1].selected = true;
    }
    sizeInput.value = popup[1];
  }
})();

checkButton.onclick = async () => {
  const checked = await sendMessageToActiveTab({ msg: "check", type: "", size: "" });
  if (checked[0] === "zoom") {
    typeSelect.options[0].selected = true;
  } else if (checked[0] === "width") {
    typeSelect.options[1].selected = true;
  }
  sizeInput.value = checked[1];
}

saveHostButton.onclick = () => {
  type = typeSelect.value;
  size = sizeInput.value;
  sendMessageToActiveTab({ msg: "save_host", type: type, size: size });
};

saveUrlButton.onclick = () => {
  type = typeSelect.value;
  size = sizeInput.value;
  sendMessageToActiveTab({ msg: "save_url", type: type, size: size });
};

resetButton.onclick = () => {
  typeSelect.options[0].selected = true;
  sizeInput.value = "100";
  sendMessageToActiveTab({ msg: "reset", type: "", size: "" });
};
