// script.js

const container = document.getElementById('grid-container');
const statusMessage = document.getElementById('status-message');
const resetButton = document.getElementById('reset-button');
const numRows = 3;
const numCols = 3;
const totalButtons = numRows * numCols;

// The Secret Code (Button indices are 1-based, matching the button numbers)
const SECRET_CODE = [1, 5, 9]; // Example: Button 2, 5, 8, then 3

let currentSequence = [];
let isLocked = false;

// 
const message = {
  TaskName: "Keypad01",
  TaskTargetState: "SetNotActiveToCompleted"
};

// --- Keypad Functions ---

function updateStatus(message, className = '') {
    // Clear existing status classes
    statusMessage.className = '';
    
    // Set the new message and class
    statusMessage.textContent = message;
    if (className) {
        statusMessage.classList.add(className);
    }
}

function checkCode() {
    const sequenceStr = currentSequence.join('');
    const codeStr = SECRET_CODE.join('');
    
    // Compare the entered sequence to the secret code
    if (sequenceStr === codeStr) {
        updateStatus("ACCESS GRANTED! Keypad Locked.", 'status-success');
        PortalsSdk.sendMessageToUnity(JSON.stringify(message));
        isLocked = true;
        // Optionally, disable all buttons permanently here
    } else {
        updateStatus("INCORRECT CODE. Try again.", 'status-failure');
        // Clear the sequence after a short delay to allow visual feedback
        setTimeout(resetKeypad, 1000); 
    }
}

function resetKeypad() {
    currentSequence = [];
    isLocked = false;
    updateStatus(`Enter the ${SECRET_CODE.length}-digit code.`);
    
    // Clear the pressed state from all buttons
    document.querySelectorAll('.button-grid button').forEach(button => {
        button.classList.remove('button-pressed');
    });
}

// --- Event Handlers ---

function handleButtonClick(event, buttonIndex) {
    if (isLocked) {
        // Ignore presses if the keypad is locked after success
        updateStatus("Keypad is locked. Press Reset.", 'status-failure');
        return;
    }

    // 1. Add the pressed index to the sequence
    currentSequence.push(buttonIndex);
    
    // 2. Toggle the visual pressed state (stays on until reset)
    event.target.classList.add('button-pressed');
    
    // 3. Update status to show current progress
    updateStatus(`Entered: ${currentSequence.length} of ${SECRET_CODE.length} digits.`);

    // 4. Check if the sequence is complete
    if (currentSequence.length === SECRET_CODE.length) {
        checkCode();
    }
}

// --- Initialization ---

    for (let i = 1; i <= totalButtons; i++) {
        const button = document.createElement('button');
        
        // Use the index (1 to 9) as the display text (like a phone keypad)
        button.textContent = i; 

        // Attach the click handler, passing the button's index
        button.addEventListener('click', (event) => handleButtonClick(event, i));

        container.appendChild(button);
    }

// Attach reset listener
resetButton.addEventListener('click', resetKeypad);

// Build the grid and initialize the status
ceateButtonGrid();
updateStatus(`Enter the ${SECRET_CODE.length}-digit code.`);
