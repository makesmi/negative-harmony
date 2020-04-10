import React, { useState, ChangeEvent, useRef } from 'react'
import Piano from './Piano'
import Staff from './Staff'
import defaultHarmony from './DefaultHarmony'
import { bestKey } from './StaffFunctions'
import { negativeChord, negativeMelody } from './ChordFunctions'
import { buttonStyle, hiddenInput, appStyle } from './AppStyles'
import useStaff, { negateChords } from './StaffHook'
import { capitalizeFirstLetter } from './StringUtils'
import Instructions from './Instructions'

const App: React.FC = () => {
  const positive = useStaff(defaultHarmony.positive)
  const negative = useStaff(defaultHarmony.negative)
  const [chordText, setChordText] = useState<string>('')
  const input = useRef<HTMLInputElement>(null)
  
  const changeNotes = (newNotes: number[]) => {
    const newKey = bestKey(newNotes)
    const negativeKey = (newKey + 7) % 12
    positive.setKey(newKey)
    negative.setKey(negativeKey)
    positive.setNotes(newNotes)
    negative.setNotes(negativeMelody(newNotes, newKey, negativeKey))
    negative.setChords(negateChords(positive.chords, newKey, negativeKey))
  }

  const pressKey = (key: number) => {
    const note = key - 3    //first key in the piano is A instead of C
    const newNotes = [...positive.notes, note]
    changeNotes(newNotes)
  }

  const changeChord = (text:string, staff:any) => {
    const opposite = staff === positive ? negative : positive
    staff.setChord(staff.selected, text)
    const oppositeText = negativeChord(text, staff.key, opposite.key)
    opposite.setChord(staff.selected, oppositeText)
  }

  const updateChordText = (event:ChangeEvent<HTMLInputElement>) => {
    let text = event.target.value.substring(0, 8)
    text = capitalizeFirstLetter(text)
    setChordText(text)
    if(positive.noteSelected()){
      changeChord(text, positive)
    }else if(negative.noteSelected()){
      changeChord(text, negative)
    }
  }

  const selectNote = (staff:any) => (index:number) => {
    const opposite = staff === positive ? negative : positive
    staff.setSelected(index)
    opposite.setSelected(-1)
    setChordText(staff.chords[index] || '')
    if(!input.current){ return }
    input.current.focus()
  }

  const clearNotes = () => {
    positive.clear()
    negative.clear()
  }

  const deleteNote = () => {
    const sliced = positive.deleteNote()
    negative.deleteNote()
    changeNotes(sliced)
  }

  return (
    <div style={appStyle}>
      <div>
        <input value={chordText} onChange={updateChordText} ref={input} style={hiddenInput}/>
        <Staff {...positive.props} setSelected={selectNote(positive)} height={120} notesMax={25} />
      </div>
      <div>
        <Piano press={pressKey} height={120} keys={20} />
        <button onClick={deleteNote} style={buttonStyle}>delete</button>
        <button onClick={clearNotes} style={buttonStyle}>clear</button>
      </div>
      <div>
        <h2>Negative Harmony:</h2>
        <Staff {...negative.props} setSelected={selectNote(negative)} height={120} notesMax={25} />
      </div>
      <div>
        <button style={buttonStyle} onClick={negative.incrementKey(-1)}>-</button>
        <button style={buttonStyle} onClick={negative.incrementKey(1)}>+</button>
      </div>
      <Instructions />
    </div>
  )
}

export default App
