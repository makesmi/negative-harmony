import { negativeChord, negativeMelody} from './ChordFunctions'
import { StaffHarmony } from './StaffHook'

const createDefaultHarmony = () => {
    const positive: StaffHarmony = {
        notes: [5, 5, 4, 2, 2, 0, -1, 0, 2, 0],
        chords: { 0: 'F', 3: 'D', 6: 'G7', 9: 'C' },
        key: 0
    }
    const negativeKey = (positive.key + 7) % 12
    const negativeChords = Object.entries(positive.chords).map(k => parseInt(k[0]))
        .reduce((prev, note) => ({
            ...prev, [note]: negativeChord(positive.chords[note], positive.key, negativeKey)
        }), {})

    const negative: StaffHarmony = {
        notes: negativeMelody(positive.notes, positive.key, negativeKey),
        chords: negativeChords,
        key: negativeKey
    }

    return { positive, negative }
}

export default (createDefaultHarmony())
