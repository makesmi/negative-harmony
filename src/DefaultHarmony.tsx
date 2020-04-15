import { mapChords, negateChord, constructChord} from './Chords'
import { NONE_SELECTED, StaffState } from './StaffState'
import { negativeMelody } from './ToneUtils'

const createDefaultHarmony = () => {
    const chord = (text:string) => constructChord(text) || { root: 0, bass: 0, type: '' }

    const positive:StaffState = {
        notes: [5, 5, 4, 2, 2, 0, -1, 0, 2, 0],
        chords: { 
            0: chord('F'), 
            3: chord('Dm'), 
            6: chord('G7'), 
            9: chord('C') 
        },
        key: 0,
        selected: NONE_SELECTED
    }
    const negativeKey = (positive.key + 7) % 12

    const negative:StaffState = {
        notes: negativeMelody(positive.notes, positive.key, negativeKey),
        chords: mapChords(positive.chords, chord => negateChord(chord, positive.key, negativeKey)),
        key: negativeKey,
        selected: NONE_SELECTED
    }

    return { positive, negative }
}

export default (createDefaultHarmony())
