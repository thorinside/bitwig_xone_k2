const REL_0_CLICK = 0x34
const REL_1_CLICK = 0x35
const REL_2_CLICK = 0x36
const REL_3_CLICK = 0x37

const FADER_0 = 0x10
const FADER_1 = 0x11
const FADER_2 = 0x12
const FADER_3 = 0x13

const BUTTON_A = 0x24
const BUTTON_B = 0x25
const BUTTON_C = 0x26
const BUTTON_D = 0x27

const BUTTON_E = 0x20
const BUTTON_F = 0x21
const BUTTON_G = 0x22
const BUTTON_H = 0x23

const BUTTON_I = 0x1c
const BUTTON_J = 0x1d
const BUTTON_K = 0x1e
const BUTTON_L = 0x1f

const BUTTON_M = 0x18
const BUTTON_N = 0x19
const BUTTON_O = 0x1a
const BUTTON_P = 0x1b

const REL_0 = 0x00
const REL_1 = 0x01
const REL_2 = 0x02
const REL_3 = 0x03
const REL_4 = 0x14
const REL_5 = 0x15

const RED = 1
const YELLOW = 2
const GREEN = 3
const OFF = 0

const GRID = [
    [BUTTON_A, BUTTON_B, BUTTON_C, BUTTON_D],
    [BUTTON_E, BUTTON_F, BUTTON_G, BUTTON_H],
    [BUTTON_I, BUTTON_J, BUTTON_K, BUTTON_L],
    [BUTTON_M, BUTTON_N, BUTTON_O, BUTTON_P],
]

const LETTER_BUTTON_COORDINATES = new Map()
LETTER_BUTTON_COORDINATES.set(BUTTON_A, [0,0])
LETTER_BUTTON_COORDINATES.set(BUTTON_B, [0,1])
LETTER_BUTTON_COORDINATES.set(BUTTON_C, [0,2])
LETTER_BUTTON_COORDINATES.set(BUTTON_D, [0,3])
LETTER_BUTTON_COORDINATES.set(BUTTON_E, [1,0])
LETTER_BUTTON_COORDINATES.set(BUTTON_F, [1,1])
LETTER_BUTTON_COORDINATES.set(BUTTON_G, [1,2])
LETTER_BUTTON_COORDINATES.set(BUTTON_H, [1,3])
LETTER_BUTTON_COORDINATES.set(BUTTON_I, [2,0])
LETTER_BUTTON_COORDINATES.set(BUTTON_J, [2,1])
LETTER_BUTTON_COORDINATES.set(BUTTON_K, [2,2])
LETTER_BUTTON_COORDINATES.set(BUTTON_L, [2,3])
LETTER_BUTTON_COORDINATES.set(BUTTON_M, [3,0])
LETTER_BUTTON_COORDINATES.set(BUTTON_N, [3,1])
LETTER_BUTTON_COORDINATES.set(BUTTON_O, [3,2])
LETTER_BUTTON_COORDINATES.set(BUTTON_P, [3,3])


function XONEHardware(outputPort, inputPort, inputCallback) {
    this.portOut = outputPort;
    this.portIn = inputPort;

    this.ledCache = initArray(-1, 128)

    this.portIn.setMidiCallback(inputCallback)
}

XONEHardware.prototype.isLetterButton = function (note) {
    return LETTER_BUTTON_COORDINATES.has(note)
}

XONEHardware.prototype.coordinatesFromButton = function (note) {
    return LETTER_BUTTON_COORDINATES.get(note)
}

XONEHardware.prototype.getLEDFor = function (i, j) {
    return GRID[i][j]
}

XONEHardware.prototype.updateLED = function (note, colour) {

    const noteOffset = note == 0xf || note == 0xc ? 4 : 36

    if (this.ledCache[note] != colour) {
        this.ledCache[note] = colour
        switch (colour) {
            case OFF:
                this.portOut.sendMidi(0x90, note, 0)
                break
            case RED:
                this.portOut.sendMidi(0x90, note, 127)
                break
            case GREEN:
                this.portOut.sendMidi(0x90, note + noteOffset * 2, 127)
                break
            case YELLOW:
                this.portOut.sendMidi(0x90, note + noteOffset, 127)
                break
        }
    }
}