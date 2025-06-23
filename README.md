# bt-obs-controller

This Node.js project allows you to control OBS Studio scene changes using the SMC Pad Pocket Bluetooth MIDI controller from M-Vave. Each pad on the device can be mapped to a different OBS scene, enabling wireless, hands-on scene switching for live production or streaming.

## Features
- Maps each pad on the SMC Pad Pocket to a specific OBS scene
- Uses MIDI over Bluetooth for wireless control
- Securely connects to OBS via obs-websocket
- Easily configurable via `.env` and mapping tables

## Requirements
- Node.js (v18 or later recommended)
- OBS Studio with the [obs-websocket](https://github.com/obsproject/obs-websocket) plugin enabled (OBS 28+ includes it by default)
- SMC Pad Pocket (M-Vave) connected via Bluetooth

## Setup

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd bt-obs-controller
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure OBS WebSocket:**
   - Ensure obs-websocket is enabled in OBS Studio.
   - Note your WebSocket server address and password (default: ws://localhost:4455).

4. **Create a `.env` file:**
   ```env
   OBS_WS_ADDRESS=ws://localhost:4455
   OBS_WS_PASSWORD=your_password_here
   ```

5. **Connect your SMC Pad Pocket via Bluetooth.**

6. **Edit the script (optional):**
   - Update the MIDI port number if needed (see console output for available ports).
   - Edit the `padToScene` mapping in `obs-scene-changer.js` to match your OBS scene names.

7. **Run the script:**
   ```bash
   node obs-scene-changer.js
   ```

## Usage
- Press a pad on the SMC Pad Pocket to switch to the mapped OBS scene.
- The script will log pad presses and scene changes in the console.

## Security
- Your `.env` file is included in `.gitignore` and will not be committed to version control.

---

For questions or contributions, open an issue or pull request!
