const widgetID = "8c2d5b6221684d4f84ff109bc9d1294c";

let cacheTarget = null;
let cacheTargetOutline = null;

console.log("content.js loaded");

function callbackFn(event) {
  const target = event.target || event.srcElement;
  if(target.id === widgetID) return;
  const style = window.getComputedStyle(target);
  const originOutline = style.getPropertyValue("outline");

  cacheTarget = target;
  cacheTargetOutline = originOutline;

  unregisterListener(target, originOutline);
  target.style.outline = "2px dashed red";
  const cacheWidget = document.getElementById(widgetID);

  if(cacheWidget) {
    cacheWidget.style.top = `${event.clientY}px`;
    cacheWidget.style.left = `${event.clientX}px`;
    cacheWidget.style.opacity = cacheWidget.style.opacity == 0 ? 1 : 0;
    const code = cacheWidget.querySelector("code");
    code.innerText = getRequiredStyles(style, originOutline);
    return;
  };

  const widget = createWidget(event, getRequiredStyles(style, originOutline));
  widget.style.opacity = 1;
  document.body.appendChild(widget);
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  const type = request.type;
  switch(type) {
    case "start":
      registerListener();
      console.log("add mouseover listener");
      sendResponse({ type: "start", message: "add mouseover listener" })
      break;
    case "stop":
      console.log("remove mouseover listener");
      document.removeEventListener("mouseover", callbackFn, false);
      if(cacheTarget) {
        cacheTarget.style.outline = cacheTargetOutline;
      }
      const widget = document.getElementById(widgetID);
      if(widget) {
        widget.remove();
      }
      sendResponse({
        type: "stop",
        message: "remove mouseover listener"
      })
      break;
    default:
      break;
  }
});

function registerListener() {
  document.addEventListener("mouseover", callbackFn, false);
}

function unregisterListener(target, originOutline) {
  target.addEventListener("mouseout", function() {
    target.style.outline = originOutline;
    const widget = document.getElementById(widgetID);
    if(widget) {
      widget.style.opacity = 0;
    }
  }, false)
}

function getRequiredStyles(computedStyle, originOutline) {
  const requiredStyles = {
    background: computedStyle.getPropertyValue("background"),
    // backgroundColor: computedStyle.getPropertyValue("background-color"),
    // backgroundImage: computedStyle.getPropertyValue("background-image"),
    // backgroundPosition: computedStyle.getPropertyValue("background-position"),
    // backgroundRepeat: computedStyle.getPropertyValue("background-repeat"),
    // backgroundSize: computedStyle.getPropertyValue("background-size"),

    border: computedStyle.getPropertyValue("border"),
    borderRadius: computedStyle.getPropertyValue("border-radius"),
    outline: originOutline,

    margin: computedStyle.getPropertyValue("margin"),
    padding: computedStyle.getPropertyValue("padding"),
    width: computedStyle.getPropertyValue("width"),
    height: computedStyle.getPropertyValue("height"),

    color: computedStyle.getPropertyValue("color"),
    fontSize: computedStyle.getPropertyValue("font-size"),
    fontFamily: computedStyle.getPropertyValue("font-family"),
    fontWeight: computedStyle.getPropertyValue("font-weight"),
    lineHeight: computedStyle.getPropertyValue("line-height"),
    letterSpacing: computedStyle.getPropertyValue("letter-spacing"),
    textAlign: computedStyle.getPropertyValue("text-align"),
    textDecoration: computedStyle.getPropertyValue("text-decoration"),
    textTransform: computedStyle.getPropertyValue("text-transform"),
    whiteSpace: computedStyle.getPropertyValue("white-space"),
    wordSpacing: computedStyle.getPropertyValue("word-spacing"),

    display: computedStyle.getPropertyValue("display"),
    flex: computedStyle.getPropertyValue("flex"),
    flexDirection: computedStyle.getPropertyValue("flex-direction"),
    justifyContent: computedStyle.getPropertyValue("justify-content"),
    alignItems: computedStyle.getPropertyValue("align-items"),
    flexWrap: computedStyle.getPropertyValue("flex-wrap"),
    // flexFlow: computedStyle.getPropertyValue("flex-flow"),
    // alignContent: computedStyle.getPropertyValue("align-content"),
    // order: computedStyle.getPropertyValue("order"),
    // flexGrow: computedStyle.getPropertyValue("flex-grow"),
    // flexShrink: computedStyle.getPropertyValue("flex-shrink"),
    // flexBasis: computedStyle.getPropertyValue("flex-basis"),
    // alignSelf: computedStyle.getPropertyValue("align-self"),
  };

  return JSON.stringify(requiredStyles, null, 2);
}

function createWidget(event, innerText) {
  const widget = document.createElement("div");
  widget.id = widgetID;

  widget.style.position = "fixed";
  widget.style.top = `${event.clientY}px`;
  widget.style.left = `${event.clientX}px`;
  widget.style.width = "380px";
  // widget.style.padding = "10px";
  widget.style.backgroundColor = "white";
  widget.style.border = "1px solid black";
  widget.style.borderRadius = "5px";
  widget.style.zIndex = "9999";
  widget.style.boxShadow = "0 0 4px rgba(0, 0, 0, 0.08)";
  widget.style.opacity = 0;
  widget.style.transition = "opacity 0.36s ease";

  const pre = document.createElement("pre");
  pre.style.margin = "0";
  pre.style.padding = "10px";

  const code = document.createElement("code");
  code.style.margin = "0";
  code.style.padding = "0";
  code.style.fontFamily = "monospace";
  code.style.fontSize = "11px";
  code.style.lineHeight = "1.26";
  code.style.whiteSpace = "pre-wrap";
  code.style.wordWrap = "break-word";
  code.innerText = innerText;

  pre.appendChild(code);
  widget.appendChild(pre);
  return widget;
}
