import React, { useReducer, useState } from 'react'
import Piano from './Piano'
import Staff from './Staff'
import defaultHarmony from './DefaultHarmony'
import Instructions from './Instructions'
import Save from './Save'
import { reduceHarmony } from './AppState'
import { StaffState } from './StaffState'
import ChordEditor from './ChordEditor'
import './styles/App.css'
import Login from './Login'
  

const App: React.FC = () => {
  const [{ positive, negative }, dispatch] = useReducer(reduceHarmony, defaultHarmony)
  const [user, setUser] = useState('')

  const pressKey = (key: number) => {
    const note = key - 3    //first key in the piano is A instead of C
    dispatch({ type: 'addNote', note })
  }

  const selectNote = (staff:StaffState) => (note:number) => {
    dispatch({ type: 'select', staff, note })
  }

  const deleteNote = () => dispatch({ type: 'deleteNote' })
  const clear = () => dispatch({ type: 'clear' })
  const transpose = (direction:number) => () => {
    dispatch({ type: 'transpose', direction })
  }

  return (
    <div className="app">
      <div>
        <Staff state={positive} setSelected={selectNote(positive)} height={120} notesMax={25} />
      </div>
      <div>
        <Piano press={pressKey} height={120} keys={20} />
        <button onClick={deleteNote} className="button">delete</button>
        <button onClick={clear} className="button">clear</button>
        <ChordEditor {...{ positive, negative, dispatch }} />
      </div>
      <div>
        <h2>Negative Harmony:{'\u00A0'}
          <button className="transposeButton" onClick={transpose(-1)}>-</button>
          <button className="transposeButton" onClick={transpose(1)}>+</button>
        </h2>
        <Staff state={negative} setSelected={selectNote(negative)} height={120} notesMax={25} />
      </div>
      <div style={{ margin: '0.3em' }}>
        <Login {...{ user, setUser }}/>
      </div>
      { user && <Save state={{ positive, negative }} {...{ dispatch, user }}/> }
      <Instructions />
    </div>
  )
}

export default App
