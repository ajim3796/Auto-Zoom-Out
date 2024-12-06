const url = location.href;
const host = location.host;
let width;
let urlWidth;
let hostWidth;
let wHeight;
let cHeight;
let cWidth;
let sWidth;
let sLeft;
let type;
let size;

const fit = () => {
  if (type === "zoom") {
    document.body.style.zoom = size + "%";
  } else if (type === "width") {
    document.body.style.width = size + "%";
  }
};

const getItems = async () => {
  width = window.innerWidth;
  urlWidth = url + " " + width;
  hostWidth = host + " " + width;
  const localData = await chrome.storage.local.get().catch((e) => {});
  if (localData[url]) {
    type = localData[url][0];
    size = localData[url][1];
  } else if (localData[host]) {
    type = localData[host][0];
    size = localData[host][1];
  } else if (localData[urlWidth]) {
    type = localData[urlWidth][0];
    size = localData[urlWidth][1];
  } else if (localData[hostWidth]) {
    type = localData[hostWidth][0];
    size = localData[hostWidth][1];
  } else {
    document.body.style.zoom = "";
    document.body.style.width = "";
    return false;
  }
  return true;
};

const scrollCheck = () => {
  wHeight = window.innerHeight;
  cHeight = document.documentElement.clientHeight;
  if (wHeight === cHeight) {
    type = "zoom";
    size = "100";
    return false;
  }
  return true;
};

const sizeCheck = () => {
  cWidth = document.documentElement.clientWidth;
  sWidth = document.documentElement.scrollWidth;
  if (document.body.scrollLeft != 0) {
    sLeft = document.body.scrollLeft;
  } else if (document.documentElement.scrollLeft != 0) {
    sLeft = document.documentElement.scrollLeft;
  }
  if (cWidth === sWidth) {
    size = Math.floor((1 - sLeft / cWidth) * 100 - 1).toString();
  } else {
    size = Math.floor((cWidth / sWidth) * 100 - 1).toString();
  }
  document.body.style.zoom = size + "%";
  wHeight = window.innerHeight;
  cHeight = document.documentElement.clientHeight;
  if (wHeight === cHeight) {
    document.body.style.zoom = "";
    type = "zoom";
    setHost();
    return false;
  }
  document.body.style.zoom = "";
  return true;
};

const widthFit = () => {
  document.body.style.width = size + "%";
  wHeight = window.innerHeight;
  cHeight = document.documentElement.clientHeight;
  if (wHeight === cHeight) {
    document.body.style.zoom = "";
    type = "width";
    setHost();
    return false;
  }
  document.body.style.width = "";
  type = "zoom";
  size = "100";
  document.body.style.overflowX = "hidden";
  document.documentElement.style.overflowX = "hidden";
  return true;
};

const setHost = () => {
  empty = {};
  empty[hostWidth] = [type, size];
  chrome.storage.local.set(empty);
};

const setUrl = () => {
  empty = {};
  empty[urlWidth] = [type, size];
  chrome.storage.local.set(empty);
};

const setNoChange = (key) => {
  reset();
  type = "zoom";
  size = "100";
  empty = {};
  empty[key] = [type, size];
  chrome.storage.local.set(empty);
};

const reset = () => {
  document.body.style.zoom = "";
  document.body.style.width = "";
  chrome.storage.local.remove(url).catch((e) => {});
  chrome.storage.local.remove(host).catch((e) => {});
  chrome.storage.local.remove(urlWidth).catch((e) => {});
  chrome.storage.local.remove(hostWidth).catch((e) => {});
};

(async () => {
  const items = await getItems().catch((e) => {});
  const toggleCheck = await chrome.storage.local.get("toggle").catch((e) => {});
  if (!toggleCheck.toggle) {
    console.log("never");
    chrome.storage.local.set({ toggle: 1 });
    toggleCheck.toggle = 1;
  }
  if (!items) {
    if (scrollCheck()) {
      if (sizeCheck()) {
        widthFit();
      }
    }
  }
  if (toggleCheck.toggle === 1) {
    fit();
  }
})();

let timer;
window.addEventListener("resize", () => {
  clearTimeout(timer);
  timer = setTimeout(async () => {
    const items = await getItems().catch((e) => {});
    const toggleCheck = await chrome.storage.local
      .get("toggle")
      .catch((e) => {});
    if (!items) {
      if (scrollCheck()) {
        if (sizeCheck()) {
          widthFit();
        }
      }
    }
    if (toggleCheck.toggle === 1) {
      fit();
    }
  }, 500);
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.msg === "popup") {
    sendResponse([type, size]);
  } else if (request.msg === "check") {
    type = request.type;
    size = request.size;
    fit();
    sendResponse([type, size]);
  } else if (request.msg === "save_host") {
    setNoChange(hostWidth);
  } else if (request.msg === "save_url") {
    setNoChange(urlWidth);
  } else if (request.msg === "reset") {
    type = "zoom";
    size = "100";
    reset();
  }
  return true;
});
