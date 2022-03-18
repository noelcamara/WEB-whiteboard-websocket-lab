import "./index.css";
import nameGenerator from "./name-generator";
import isDef from "./is-def";

// Store/retrieve the name in/from a cookie.
const cookies = document.cookie.split(";");
console.log(cookies);
let wsname = cookies.find(function (c) {
  if (c.match(/wsname/) !== null) return true;
  return false;
});
if (isDef(wsname)) {
  wsname = wsname.split("=")[1];
} else {
  wsname = nameGenerator();
  document.cookie = "wsname=" + encodeURIComponent(wsname);
}

let color = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';

// Set the name in the header
document.querySelector("header>p").textContent = decodeURIComponent(wsname);

// Create a WebSocket connection to the server
const ws = new WebSocket("ws://" + window.location.host + "/socket");

// We get notified once connected to the server
ws.onopen = event => {
  console.log("We are connected.");
};

// Listen to messages coming from the server. When it happens, create a new <li> and append it to the DOM.
const messages = document.querySelector("#messages");
const aside = document.querySelector("#aside");
let line;
let idCanvas;
ws.onmessage = event => {
  if (event.data.includes("RLfPPLof;NQo$S4@D[N")) {
    var parsedDrawing = JSON.parse(
      event.data.substring(event.data.indexOf("{"))
    );
    draw(parsedDrawing);
  } else if (event.data.includes("F-HDR};R`oTayx=8Hs4")) {
    let id = JSON.parse(event.data.substring(event.data.indexOf("{")));

    let zoneDessin = document.createElement("canvas");
    zoneDessin.setAttribute("id", "canvas" + id.idCanvas);
    zoneDessin.setAttribute("width", 1000);
    zoneDessin.setAttribute("height", 1000);
    zoneDessin.className = "classcanvas";
    zoneDessin.addEventListener("mousedown", e => mousedownEvent(e));
    zoneDessin.addEventListener("mousemove", e => mousemoveEvent(e));

    document.getElementById("section").appendChild(zoneDessin);

   // idCanvas = id.idCanvas++;
  } else {
    line = document.createElement("li");
    line.textContent = event.data;
    messages.appendChild(line);
    aside.scrollTop = aside.scrollHeight;
  }
};

// Retrieve the input element. Add listeners in order to send the content of the input when the "return" key is pressed.
/* function sendMessage(event) {
  event.preventDefault();
  event.stopPropagation();
  if (sendInput.value !== "") {
    // Send data through the WebSocket
    ws.send(sendInput.value);
    sendInput.value = "";
  }
} */

// isDrawing indique si la souri produit un dessin sur le canvas ou non
let isDrawing = false;
let x = 0;
let y = 0;


const mousedownEvent = e => {
  x =
    e.offsetX *
    (1000 / document.getElementById(e.target.id).getBoundingClientRect().width);
  y =
    e.offsetY *
    (1000 /
      document.getElementById(e.target.id).getBoundingClientRect().height);
  isDrawing = true;
};

const mousemoveEvent = e => {
  if (isDrawing === true) {
    var drawing = {
      oldX: x,
      oldY: y,
      x:
        e.offsetX *
        (1000 /
          document.getElementById(e.target.id).getBoundingClientRect().width),
      y:
        e.offsetY *
        (1000 /
          document.getElementById(e.target.id).getBoundingClientRect().height),
      color: color,
      id: document.getElementById(e.target.id).id,
      key: "RLfPPLof;NQo$S4@D[N"
    };

    x =
      e.offsetX *
      (1000 /
        document.getElementById(e.target.id).getBoundingClientRect().width);
    y =
      e.offsetY *
      (1000 /
        document.getElementById(e.target.id).getBoundingClientRect().height);

    ws.send(JSON.stringify(drawing));
  }
};

const mouseupEvent = e => {
  if (isDrawing === true) {
    x = 0;
    y = 0;
    isDrawing = false;
  }
};

// Gestionnaires d'évènements
canvas.addEventListener("mousedown", e => mousedownEvent(e));

canvas.addEventListener("mousemove", e => mousemoveEvent(e));

window.addEventListener("mouseup", e => mouseupEvent(e));

function drawLine(context, x1, y1, x2, y2, color) {
  context.beginPath();
  context.strokeStyle = color;
  context.lineWidth = 2;
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
  context.closePath();
}

function draw(drawing) {
  drawLine(
    document.getElementById(drawing.id).getContext("2d"),
    drawing.oldX,
    drawing.oldY,
    drawing.x,
    drawing.y,
    drawing.color
  );
}

/* const sendForm = document.querySelector("form");
const sendInput = document.querySelector("form input");
sendForm.addEventListener("submit", sendMessage, true);
sendForm.addEventListener("blur", sendMessage, true);
 */