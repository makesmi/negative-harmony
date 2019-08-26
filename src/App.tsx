import React, { useState, ChangeEvent, useRef, CSSProperties } from 'react'
import Piano from './Piano'
import Staff from './Staff'

const App: React.FC = () => {
  const [notes, setNotes] = useState<number[]>([])
  const [selected, setSelected] = useState<number>(-1)
  const [chords, setChords] = useState<Record<number, string>>({})
  const [chordText, setChordText] = useState<string>('')
  const input = useRef<HTMLInputElement>(null)

  const pressKey = (key: number) => {
    const note = key - 3
    setNotes([...notes, note])
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

  return (<div>
    <div>
      <Staff {...{notes, chords, selected}} setSelected={selectNote} 
          keyTone={2} height={150} notesMax={15} />
    </div>
    <div>
      <Piano press={pressKey} height={120} keys={20} />
      <button onClick={() => setNotes([])}>clear</button>
      <input value={chordText} onChange={updateChordText} ref={input} style={hiddenInput}/>
    </div>
  </div>)
}

export default App

const hiddenInput: CSSProperties = {
  background: 'transparent',
  border: 'none',
  outline: 'none',
  color: 'transparent',
  cursor: 'default'
}