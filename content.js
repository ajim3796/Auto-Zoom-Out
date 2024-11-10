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

const getItems = () => {
  width = window.innerWidth;
  urlWidth = url + "_" + width;
  hostWidth = host + "_" + width;
  chrome.storage.local.get()
    .then((items) => {
      if (items[url]) {
        type = items[url][0];
        size = items[url][1];
      } else if (items[host]) {
        type = items[host][0];
        size = items[host][1];
      } else if (items[urlWidth]) {
        type = items[urlWidth][0];
        size = items[urlWidth][1];
      } else if (items[hostWidth]) {
        type = items[hostWidth][0];
        size = items[hostWidth][1];
      } else {
        type = "zoom";
        size = "100";
      }
    })
    .then(fit)
    .catch(e => { console.error(e); });
}

const scrollCheck = () => {
  wHeight = window.innerHeight;
  cHeight = document.documentElement.clientHeight;
  if (wHeight === cHeight) {
    type = "zoom";
    size = "100";
  } else {
    sizeCheck();
  }
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
  zoomFit();
};

const zoomFit = () => {
  document.body.style.zoom = size + "%";
  wHeight = window.innerHeight;
  cHeight = document.documentElement.clientHeight;
  if (wHeight === cHeight) {
    type = "zoom";
    setHost();
  } else {
    document.body.style.zoom = "";
    widthFit();
  }
};

const widthFit = () => {
  document.body.style.width = size + "%";
  wHeight = window.innerHeight;
  cHeight = document.documentElement.clientHeight;
  if (wHeight === cHeight) {
    type = "width";
    setHost();
  } else {
    document.body.style.width = "";
    type = "zoom";
    size = "100";
    document.body.style.overflowX = "hidden";
    document.documentElement.style.overflowX = "hidden";
  }
};

const setHost = () => {
  reset();
  empty = {};
  empty[hostWidth] = [type, size];
  chrome.storage.local.set(empty);
};

const setUrl = () => {
  reset();
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
  chrome.storage.local.remove(url).catch(e => { console.error(e); });
  chrome.storage.local.remove(host).catch(e => { console.error(e); });
  chrome.storage.local.remove(urlWidth).catch(e => { console.error(e); });
  chrome.storage.local.remove(hostWidth).catch(e => { console.error(e); });
};

getItems();

window.addEventListener('resize', getItems);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.msg === "popup") {
    sendResponse([type, size]);
  } else if (request.msg === "check") {
    scrollCheck();
    sendResponse([type, size]);
  } else if (request.msg === "save_host") {
    type = request.type;
    size = request.size;
    setHost();
    fit();
  } else if (request.msg === "save_url") {
    type = request.type;
    size = request.size;
    setUrl();
    fit();
  } else if (request.msg === "reset") {
    type = "zoom";
    size = "100";
    reset();
  }
  return true;
});
