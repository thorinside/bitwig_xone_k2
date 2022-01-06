function TransportHandler(transport) {

    this.transport = transport

    this.transport.isPlaying().addValueObserver(function (value) {
        println("Playing " + value)
        hardware.updateLED(0x19, value ? YELLOW : OFF)
     })
}

TransportHandler.prototype.handleMidi = function (status, data1, data2) {
}