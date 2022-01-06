

function TrackHandler(trackBank, cursorTrack) {
    this.trackBank = trackBank
    this.cursorTrack = cursorTrack

    for (i = 0; i < this.trackBank.getSizeOfBank(); i++) {
        var track = this.trackBank.getItemAt(i)
        const trackIndex = i

        for (j = 0; j < track.clipLauncherSlotBank().getSizeOfBank(); j++) {
            const clip = track.clipLauncherSlotBank().getItemAt(j)
            clip.isPlaying().markInterested()
            clip.isRecording().markInterested()
            clip.hasContent().markInterested()
        }

        var p = track.pan()
        p.markInterested()
        p.setIndication(true)

        p = track.volume()
        p.markInterested()
        p.setIndication(true)
    }

    this.trackBank.followCursorTrack(this.cursorTrack)

    this.cursorTrack.solo().markInterested()
    this.cursorTrack.mute().markInterested()
}

TrackHandler.prototype.updateLEDs = function () {

    for (i = 0; i < this.trackBank.getSizeOfBank(); i++) {
        for (j = 0; j < this.trackBank.getItemAt(i).clipLauncherSlotBank().getSizeOfBank(); j++) {
            const clip = this.trackBank.getItemAt(i).clipLauncherSlotBank().getItemAt(j)
            const isPlaying = clip.isPlaying().get()
            const isRecording = clip.isRecording().get()
            const hasContent = clip.hasContent().get()

            hardware.updateLED(hardware.getLEDFor(i, j),
                isPlaying || isRecording ? (isRecording ? RED : GREEN)
                    : (hasContent ? YELLOW : OFF)
            )
        }
    }

    hardware.updateLED(0x0f, RED)
}

TrackHandler.prototype.handleMidi = function (status, data1, data2) {
    if (isNoteOn(status)) {

        if (hardware.isLetterButton(data1)) {
            const coordinates = hardware.coordinatesFromButton(data1)
            const track = this.trackBank.getItemAt(coordinates[0])
            const clip = track.clipLauncherSlotBank().getItemAt(coordinates[1])
            if (clip.isPlaying().get() || clip.isRecording().get()) {
                track.stop()
            } else {
                clip.launch()
            }
            return true
        }

        switch (data1) {
            case REL_0_CLICK:
                this.trackBank.getItemAt(0).pan().reset()
                return true
            case REL_1_CLICK:
                this.trackBank.getItemAt(1).pan().reset()
                return true
            case REL_2_CLICK:
                this.trackBank.getItemAt(2).pan().reset()
                return true
            case REL_3_CLICK:
                this.trackBank.getItemAt(3).pan().reset()
                return true

            case BUTTON_A:
                this.trackBank.getItemAt(0).select()
                return true
            case BUTTON_B:
                this.trackBank.getItemAt(1).select()
                return true
            case BUTTON_C:
                this.trackBank.getItemAt(2).select()
                return true
            case BUTTON_D:
                this.trackBank.getItemAt(3).select()
                return true

            default:
                return false
        }
    }

    if (isChannelController(status)) {
        switch (data1) {
            case REL_0:
                this.trackBank.getItemAt(0).pan().inc(data2 == 127 ? -1 : 1, 64)
                return true
            case REL_1:
                this.trackBank.getItemAt(1).pan().inc(data2 == 127 ? -1 : 1, 64)
                return true
            case REL_2:
                this.trackBank.getItemAt(2).pan().inc(data2 == 127 ? -1 : 1, 64)
                return true
            case REL_3:
                this.trackBank.getItemAt(3).pan().inc(data2 == 127 ? -1 : 1, 64)
                return true

            case FADER_0:
                this.trackBank.getItemAt(0).volume().set(data2, 128)
                return true
            case FADER_1:
                this.trackBank.getItemAt(1).volume().set(data2, 128)
                return true
            case FADER_2:
                this.trackBank.getItemAt(2).volume().set(data2, 128)
                return true
            case FADER_3:
                this.trackBank.getItemAt(3).volume().set(data2, 128)
                return true

            default:
                return false
        }
    }
}