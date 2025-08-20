// Node.js script to detect and log input from a Bluetooth MIDI controller (e.g., M-Vave)
// Requires: npm install midi obs-websocket-js dotenv

const midi = require('midi');
require('dotenv').config();
const { OBSWebSocket } = require('obs-websocket-js');

// Set up a new input.
const input = new midi.Input();

// OBS WebSocket connection
const obs = new OBSWebSocket();
const OBS_WS_ADDRESS = process.env.OBS_WS_ADDRESS;
const OBS_WS_PASSWORD = process.env.OBS_WS_PASSWORD;

// List available MIDI input ports
console.log('Available MIDI input ports:');
for (let i = 0; i < input.getPortCount(); i++) {
  console.log(`${i}: ${input.getPortName(i)}`);
}

// Change this to the correct port number for your M-Vave controller
const PORT = 1; // <-- Update this after running once

if (input.getPortCount() === 0) {
  console.log('No MIDI input devices found.');
  process.exit(1);
}

console.log(`\nOpening MIDI port ${PORT}: ${input.getPortName(PORT)}`);
input.openPort(PORT);

// Pad mapping: 4x4 grid, top-left is pad 1
// Each entry is the MIDI note number for that pad
const padNoteMap = [
  [48, 49, 50, 51], // Row 1 (top): pads 1-4
  [44, 45, 46, 47], // Row 2: pads 5-8
  [40, 41, 42, 43], // Row 3: pads 9-12
  [36, 37, 38, 39], // Row 4 (bottom): pads 13-16
];

// Reverse lookup: note number to pad label (e.g., 'Pad 1')
const noteToPad = {};
padNoteMap.flat().forEach((note, idx) => {
  noteToPad[note] = `Pad ${idx + 1}`;
});

async function connectOBS() {
  try {
    await obs.connect(OBS_WS_ADDRESS, OBS_WS_PASSWORD);
    console.log('Connected to OBS WebSocket!');
  } catch (err) {
    console.error('Failed to connect to OBS:', err);
    process.exit(1);
  }
}

connectOBS();

// map pad numbers to OBS scene selections
const padToScene = {
  48: 'LIVE VIEW - Main', 
  49: 'LCD LOOP', 
  50: 'EPAPER LOOP',
  51: 'OC Drone', 
  44: 'BACK BAY NIGHT TL',
  45: 'HUNTINGTON LONG TL',
  46: 'PIER TL',
  47: 'Back Bay Drive TL',
  40: 'ANGELES CREST TL',
  41: 'GO PLAY WITH DASH 2',
  42: 'HYPE TRAIN BUMPER',
  43: 'NIGHT WAVES BUMPER',
  36: 'SUNSET WAVES',
  37: 'WEATHER STAR',
  38: 'TRIANGLE ANIMATION',
  39: 'THANK YOU 2'  
};

input.on('message', async (deltaTime, message) => {
  // message[0]: 153 = note on, 137 = note off
  // message[1]: note number
  // message[2]: velocity
  if (message[0] === 153) { // note on
    const pad = noteToPad[message[1]] || `Unknown (${message[1]})`;
    console.log(`Pad pressed: ${pad} (note ${message[1]})`);
    console.log('------------------------------');
    // if pad is mapped to a scene, trigger the scene change
    if (padToScene[message[1]]) {
      try {
        await obs.call('SetCurrentProgramScene', { sceneName: padToScene[message[1]] });
        console.log(`Switched to OBS scene: ${padToScene[message[1]]}`);
      } catch (err) {
        console.error('Failed to switch scene:', err);
      }
    }
  }
  // handle note-off events here if necessary
});

console.log('Listening for MIDI messages. Press Ctrl+C to exit.');
console.log("--------------------------------------------------")

