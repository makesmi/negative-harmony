import React, { useState, useRef, ChangeEvent } from 'react'
import { StaffState, StaffAction, NONE_SELECTED } from './StaffState'
import { constructChord, printChord } from './Chords'
import { hiddenInput, errorStyle } from './AppStyles'

const ChordEditor:React.FC<ChordEditorProps> = ({ positive, negative, dispatch }) => {
  const [chordText, setChordText] = useState('')
  const [error, setError] = useState('')
  const input = useRef<HTMLInputElement>(null)
 
  const staff = (positive.selected !== NONE_SELECTED && positive)
      || (negative.selected !== NONE_SELECTED && negative)

  if(staff){
    const chord = staff.chords[staff.selected]
    let text = (chord && printChord(chord, staff.key)) || ''
    if(text === '?'){ text = '' }
    if(text !== chordText){ setChordText(text) }
    input.current && input.current.focus()
  }

  const showError = (text:string) => {
    setError(text)
    setTimeout(() => setError(''), 3000)
  }

  const updateChordText = ({ target }:ChangeEvent<HTMLInputElement>) => {
    let text = target.value.substring(0, 8)
    const chord = constructChord(text)
    const staff = positive.selected !== NONE_SELECTED ? positive : negative
    if(chord){
      dispatch({ type: 'setChord', note: staff.selected, chord })
    }else{
      dispatch({ type: 'deleteChord', note: staff.selected })
      if(text){ showError('not recognized: ' + text) }
    }
  }
  
  return (
    <span>
      <input value={chordText} onChange={updateChordText} ref={input} style={hiddenInput}/>
      {error && <span style={errorStyle}>{error}</span>}
    </span>
  )
}

export default ChordEditor

type ChordEditorProps = {
  positive:StaffState,
  negative:StaffState,
  dispatch:React.Dispatch<StaffAction>
}