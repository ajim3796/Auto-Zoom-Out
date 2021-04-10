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
let tmp;

const scrollCheck = () => {
  wHeight = window.innerHeight;
  cHeight = document.documentElement.clientHeight;
  document.body.style.zoom = "";
  document.body.style.width = "";
  if (wHeight - cHeight === 0) {
    type = "no";
    size = "100";
  } else {
    sizeCheck();
  }
};

const fit = (type, size) => {
  if (type == "zoom") {
    document.body.style.zoom = size + "%";
  } else if (type == "width") {
    document.body.style.width = size + "%";
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
  if (cWidth / sWidth === 1) {
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
  if (wHeight - cHeight === 0) {
    type = "zoom";
    setHost(type, size);
  } else {
    document.body.style.zoom = "";
    widthFit();
  }
};

const widthFit = () => {
  document.body.style.width = size + "%";
  wHeight = window.innerHeight;
  cHeight = document.documentElement.clientHeight;
  if (wHeight - cHeight === 0) {
    type = "width";
    setHost(type, size);
  } else {
    document.body.style.width = "";
    type = "no";
    size = "100";
    document.body.style.overflowX = "hidden";
    document.documentElement.style.overflowX = "hidden";
  }
};

const setHost = (type, size) => {
  reset();
  empty = {};
  empty[hostWidth] = [type, size];
  chrome.storage.local.set(empty);
};

const setNoChange = (key) => {
  reset();
  type = "no";
  size = "100";
  empty = {};
  empty[key] = [type, size];
  chrome.storage.local.set(empty);
  document.body.style.zoom = "";
  document.body.style.width = "";
};

const reset = () => {
  chrome.storage.local.remove(url);
  chrome.storage.local.remove(host);
  chrome.storage.local.remove(urlWidth);
  chrome.storage.local.remove(hostWidth);
};

const noScrollbar = () => {
  var newStyle = document.createElement("style");
  newStyle.type = "text/css";
  newStyle.innerText = "::-webkit-scrollbar {display: none;}";
  document.getElementsByTagName("HEAD").item(0).appendChild(newStyle);
};

(function () {
  width = window.innerWidth;
  urlWidth = url + " " + width;
  hostWidth = host + " " + width;
  chrome.storage.local.get(function (items) {
    if (items[url]) {
      type = items[url][0];
      size = items[url][1];
      tmp = "exist";
    } else if (items[host]) {
      type = items[host][0];
      size = items[host][1];
      tmp = "exist";
    } else if (items[urlWidth]) {
      type = items[urlWidth][0];
      size = items[urlWidth][1];
      tmp = "exist";
    } else if (items[hostWidth]) {
      type = items[hostWidth][0];
      size = items[hostWidth][1];
      tmp = "exist";
    } else {
      tmp = "not exist";
    }
    if (tmp === "exist") {
      window.addEventListener("DOMContentLoaded", function () {
        fit(type, size);
      });
    } else {
      window.addEventListener("load", scrollCheck);
    }
  });
})();

window.addEventListener(
  "resize",
  function () {
    width = window.innerWidth;
    urlWidth = url + " " + width;
    hostWidth = host + " " + width;
    chrome.storage.local.get(function (items) {
      if (items[url]) {
        type = items[url][0];
        size = items[url][1];
        tmp = "exist";
      } else if (items[host]) {
        type = items[host][0];
        size = items[host][1];
        tmp = "exist";
      } else if (items[urlWidth]) {
        type = items[urlWidth][0];
        size = items[urlWidth][1];
        tmp = "exist";
      } else if (items[hostWidth]) {
        type = items[hostWidth][0];
        size = items[hostWidth][1];
        tmp = "exist";
      } else {
        tmp = "not exist";
      }
      if (tmp === "exist") {
        fit(type, size);
      } else {
        scrollCheck();
      }
    });
  },
  false
);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request === "popup") {
    sendResponse([type, size]);
  } else if (request === "save_domain") {
    setNoChange(host);
  } else if (request === "save_url") {
    setNoChange(url);
  } else if (request === "reset") {
    reset();
    location.reload();
  } else if (request === "no scrollbar") {
    noScrollbar();
  } else if (request === "no change") {
    setNoChange(hostWidth);
  } else if (Array.isArray(request)) {
    type = request[0];
    size = request[1];
    if (type === "zoom") {
      document.body.style.zoom = size + "%";
      document.body.style.width = "";
      setHost(type, size);
    } else if (type === "width") {
      document.body.style.width = size + "%";
      document.body.style.zoom = "";
      setHost(type, size);
    }
  }
  return true;
});
