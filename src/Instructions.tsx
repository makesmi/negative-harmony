import React from 'react'

const Instructions: React.FC = () => {
  return (
    <div>  
      <p>
      With this tool you can apply interesting music theory concept "negative harmony" to any song. All notes and chords will get mirrored so that major becomes minor and minor becomes major. 
      </p>
      <ul>
          <li>Add notes by clicking piano keys</li>
          <li>To add chords, select note by clicking it in the staff, then type with keyboard</li>
          <li>You can also edit negative chords</li>
          <li>Login with Facebook to save songs</li>
          <li>If you have development ideas, please contact makesmidev@gmail.com</li>
          <li>Source code in <a href="https://github.com/makesmi/negative-harmony">GitHub</a></li>
      </ul>
    </div>  
  )
}

export default Instructions