import { negateChord } from "./Chords"
import { StaffState, StaffAction, reduceStaff, DO_NOTHING, NONE_SELECTED } from "./StaffState"
import { negateNote } from "./ToneUtils"

export interface AppState{
    positive: StaffState,
    negative: StaffState
}

export const reduceHarmony = ({positive, negative}:AppState, action:StaffAction) => {
    const reduce = (positiveAction:StaffAction, negativeAction:StaffAction) => ({
        positive: reduceStaff(positive, positiveAction),
        negative: reduceStaff(negative, negativeAction)
    })

    switch(action.type){
        case 'addNote':
            const negativeNote = negateNote(action.note, positive.key, negative.key)
            return reduce(action, { ...action, note: negativeNote })
        case 'transpose':
            return reduce(DO_NOTHING, action)
        case 'setChord':
            const staff = positive.selected !== NONE_SELECTED ? positive : negative
            const opposite = staff === positive ? negative : positive
            const negativeChord = negateChord(action.chord, staff.key, opposite.key)
            const selectAction = (object:StaffState) => staff === object ?
                action : { ...action, chord: negativeChord }
            return reduce(selectAction(positive), selectAction(negative))
        default:
            return reduce(action, action)
    }
}
