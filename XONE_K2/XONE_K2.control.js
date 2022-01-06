loadAPI(15);
load("XONE_K2.hardware.js")
load("XONE_K2.transport.js")
load("XONE_K2.track.js")

// Remove this if you want to be able to use deprecated methods without causing script to stop.
// This is useful during development.
host.setShouldFailOnDeprecatedUse(true);

host.defineController("No Such Device", "XONE:K2", "0.1", "14a19c35-4b56-42e7-bdf2-8f66330df844", "thorinside");

host.defineMidiPorts(1, 1);

var hardware = null;
var trackBank = null;
var sceneBank = null;

var transportHandler = null;
var trackHandler = null;

if (host.platformIsWindows()) {
   // TODO: Set the correct names of the ports for auto detection on Windows platform here
   // and uncomment this when port names are correct.
   // host.addDeviceNameBasedDiscoveryPair(["Input Port 0"], ["Output Port 0"]);
}
else if (host.platformIsMac()) {
   // TODO: Set the correct names of the ports for auto detection on Mac OSX platform here
   // and uncomment this when port names are correct.
   host.addDeviceNameBasedDiscoveryPair(["XONE:K2"], ["XONE:K2"]);
}
else if (host.platformIsLinux()) {
   // TODO: Set the correct names of the ports for auto detection on Linux platform here
   // and uncomment this when port names are correct.
   // host.addDeviceNameBasedDiscoveryPair(["Input Port 0"], ["Output Port 0"]);
}

function init() {

   hardware = new XONEHardware(host.getMidiOutPort(0), host.getMidiInPort(0), handleMidi)

   transportHandler = new TransportHandler(host.createTransport());
   trackHandler = new TrackHandler(host.createMainTrackBank(4,0,4), host.createCursorTrack("XONE_CURSOR_TRACK", "Cursor Track", 0, 4, true));

   // TODO: Perform further initialization here.
   println("XONE:K2 7 initialized!");
}

function handleMidi(status, note, vel) {
   // TODO: Implement your MIDI input handling code here.
   printMidi(status, note, vel)

   if (transportHandler.handleMidi(status, note, vel)) return
   if (trackHandler.handleMidi(status, note, vel)) return

   printMidi(status, note, vel)
}

function flush() {
   transportHandler.updateLEDs()
   trackHandler.updateLEDs()
}

function exit() {
}