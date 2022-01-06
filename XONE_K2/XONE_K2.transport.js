function TransportHandler(transport) {

    this.transport = transport

    this.transport.isPlaying().markInterested()
}

TransportHandler.prototype.handleMidi = function (status, data1, data2) {
    if (isNoteOn(status)) {

        switch (data1) {
            case BUTTON_SETUP:
                if (this.transport.isPlaying().get()) {
                    this.transport.stop()
                } else {
                    this.transport.play()
                }
                return true
            default:
                return false
        }
    }
}

TransportHandler.prototype.updateLEDs = function () {
    const isPlaying = this.transport.isPlaying().get()
    hardware.updateLED(BUTTON_SETUP, isPlaying ? YELLOW : OFF)
}