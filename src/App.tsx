import React, { useState, ChangeEvent, useRef, CSSProperties } from 'react'
import Piano from './Piano'
import Staff from './Staff'
import { bestKey } from './StaffFunctions';

const App: React.FC = () => {
  const [notes, setNotes] = useState<number[]>([])
  const [key, setKey] = useState<number>(0)
  const [selected, setSelected] = useState<number>(-1)
  const [chords, setChords] = useState<Record<number, string>>({})
  const [chordText, setChordText] = useState<string>('')
  const input = useRef<HTMLInputElement>(null)

  const pressKey = (key: number) => {
    const note = key - 3    //first key in the piano is A
    const newNotes = [...notes, note]
    setKey(bestKey(newNotes))
    setNotes(newNotes)
  }

  const updateChordText = (event:ChangeEvent<HTMLInputElement>) => {
    if(!notes[selected]){ return }
    const text = event.target.value.substring(0, 8)
    setChordText(text)
    setChords({...chords, [selected]: text})
  }

  const selectNote = (index:number) => {
    setSelected(index)
    setChordText(chords[index] || '')
    if(!input.current){ return }
    input.current.focus()
  }

  const clearNotes = () => {
    setNotes([])
    setSelected(-1)
    setChords({})
    setKey(0)
  }

  return (
    <div style={appStyle}>
      <div>
        <Staff {...{notes, chords, selected}} setSelected={selectNote} 
            keyTone={key} height={150} notesMax={15} />
      </div>
      <div>
        <Piano press={pressKey} height={120} keys={20} />
        <button onClick={clearNotes} style={buttonStyle}>clear</button>
        <input value={chordText} onChange={updateChordText} ref={input} style={hiddenInput}/>
      </div>
    </div>
  )
}

export default App

const appStyle: CSSProperties = {
  marginLeft: '15pt',
  marginTop: '30t'
}

const buttonStyle: CSSProperties = {
  marginLeft: '8pt',
  fontSize: '1.5em',
  verticalAlign: 'top'
}

const hiddenInput: CSSProperties = {
  background: 'transparent',
  border: 'none',
  outline: 'none',
  color: 'transparent',
  cursor: 'default'
}