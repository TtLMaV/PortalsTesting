
// Wire Game From Among Us Sort Of Thing

// Create Colour Refs
const colors = ["red", "green", "blue", "yellow", "#7d522e"];
const leftCol = document.getElementById("leftCol");
const rightCol = document.getElementById("rightCol");
const canvas = document.getElementById("wireCanvas");
const ctx = canvas.getContext("2d");


// Keep Track Of Wires
let wires = [];
let draggingWire = null;


// Shuffle colors for the right side
function shuffleUntilDifferent(original) {
    let arr = [...original];
    let shuffled;

    do {
        shuffled = [...arr].sort(() => Math.random() - 0.5);
    } while (shuffled.some((color, index) => color === arr[index]));

    return shuffled;
}

let rightColors = shuffleUntilDifferent([...colors]);


// 
function createWires() {
  for (let i = 0; i < colors.length; i++) {
    
    // Make Left Side Nodes
    let left = document.createElement("div");
    left.className = "wire-end wire-left";
    left.style.background = colors[i];
    left.dataset.color = colors[i];
    leftCol.appendChild(left);
    
    // Make Right Side Nodes
    let right = document.createElement("div");
    right.className = "wire-end wire-right";
    right.style.background = rightColors[i];
    right.dataset.color = rightColors[i];
    rightCol.appendChild(right);

    wires.push({
      left: left,
      right: right,
      connected: false
    });
  }
}

createWires();


// Dragging Colours
let offsetX = canvas.getBoundingClientRect().left;
let offsetY = canvas.getBoundingClientRect().top;


leftCol.addEventListener("mousedown", (e) => {
    if (e.target.classList.contains("wire-left")) {
        draggingWire = wires.find(w => w.left === e.target);
    }
});


document.addEventListener("mouseup", (e) => {
  if (!draggingWire) return;
  
  let target = document.elementFromPoint(e.clientX, e.clientY);
  
  if (target && target.classList.contains("wire-right")) {
    let color = target.dataset.color;
    
    // Check match
    if (draggingWire.left.dataset.color === color) {
      draggingWire.connected = true;
    }
  }
  
  draggingWire = null;
  drawWires();
  checkWin();
});


document.addEventListener("mousemove", (e) => {
    if (!draggingWire) return;
    drawWires(e.clientX - offsetX, e.clientY - offsetY);
});

// Prevent browser from treating canvas like an image
document.addEventListener("dragstart", e => e.preventDefault());


/* -------------------------
   Drawing wires
--------------------------- */
function getCenter(el)
{
    let rect = el.getBoundingClientRect();
    return {
        x: rect.left - offsetX + rect.width / 2,
        y: rect.top - offsetY + rect.height / 2
    };
}

function getRightByColor(color) {
    return wires.find(w => w.right.dataset.color === color)?.right || null;
}

function drawWires(mouseX = null, mouseY = null)
{
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // --- Draw Title Text ---
  ctx.fillStyle = "white";
  ctx.font = "28px Arial";
  ctx.textAlign = "right";
  ctx.fillText("Connect The Wires", canvas.width / 2, 40);
  
  wires.forEach(w => {
    const start = getCenter(w.left);
    const wireColor = w.left.dataset.color;

    if (w.connected) {
      // Define things used in the variable
      const matchRight = getRightByColor(wireColor);
      const end = getCenter(matchRight);
      const cx = (start.x + end.x) / 2;
      const cy = (start.y + end.y) / 2 - 80;
      
      // Draw using CTX
      ctx.strokeStyle = w.left.dataset.color;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.quadraticCurveTo(cx, cy, end.x, end.y);
      ctx.stroke();
    } else if (w === draggingWire && mouseX !== null) {
      // Define things used in the variable
      const cx = (start.x + mouseX) / 2;
      const cy = (start.y + mouseY) / 2 - 80;
      
      // Draw using CTX
      ctx.strokeStyle = w.left.dataset.color;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.quadraticCurveTo(cx, cy, mouseX, mouseY);
      ctx.stroke();
    }
  });
}

drawWires();

/* -------------------------
   Win Check
--------------------------- */

const message = {
  TaskName: "Keypad02",
  TaskTargetState: "SetNotActiveToCompleted"
};

function checkWin() {
    if (wires.every(w => w.connected)) {
        setTimeout(() => {
          PortalsSdk.sendMessageToUnity(JSON.stringify(message));
          PortalsSdk.closeIframe();
          // alert("Task Complete!");
        }, 100);
    }
}