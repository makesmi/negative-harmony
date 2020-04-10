import { negativeMelody} from './ChordFunctions'
import { StaffHarmony, negateChords } from './StaffHook'

const createDefaultHarmony = () => {
    const positive: StaffHarmony = {
        notes: [5, 5, 4, 2, 2, 0, -1, 0, 2, 0],
        chords: { 0: 'F', 3: 'Dm', 6: 'G7', 9: 'C' },
        key: 0
    }
    const negativeKey = (positive.key + 7) % 12

    const negative: StaffHarmony = {
        notes: negativeMelody(positive.notes, positive.key, negativeKey),
        chords: negateChords(positive.chords, positive.key, negativeKey),
        key: negativeKey
    }

    return { positive, negative }
}

export default (createDefaultHarmony())
