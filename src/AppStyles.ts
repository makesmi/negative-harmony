import { CSSProperties } from "react"

export const appStyle: CSSProperties = {
    marginLeft: '15pt',
    marginTop: '30t'
}

const buttonLayout: CSSProperties = {
    fontSize: '15pt',
    fontFamily: 'Arial, Helvetica, sans-serif',
    border: '#aaa solid',
    cursor: 'pointer'
}

export const buttonStyle: CSSProperties = {
    ...buttonLayout,
    marginLeft: '8pt',
    borderRadius: '4pt'
}

export const transposeButton: CSSProperties = {
    ...buttonLayout,
    marginLeft: '6pt',
    padding: '0pt',
    minWidth: '21pt',
    borderRadius: '11pt'
}

export const hiddenInput: CSSProperties = {
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: 'transparent',
    cursor: 'default',
    position: 'absolute'
}

const infoStyle: CSSProperties = {
    padding: '5pt',
    borderRadius: '0.3em',
    fontWeight: 'bold',
    fontSize: '1.3em',
    fontFamily: 'Arial, Helvetica, sans-serif',
    marginLeft: '0.5em'
}

export const errorStyle: CSSProperties = {
    ...infoStyle,
    background: 'pink',
    color: '#8B0000'
}

export const facebookButton: CSSProperties = {
    borderRadius: '0.6em',
    border: 'solid #bbb',
    background: '#4267B2',
    color: 'white',
    fontWeight: 'bold',
    paddingTop: "0.3em",
    paddingBottom: "0.3em",
    paddingLeft: "0.5em",
    paddingRight: "0.5em",
    cursor: 'pointer',
    pointerEvents: 'auto',
    minWidth: '7em'
}

export const pianoStyle: CSSProperties = {
    border: 'solid #555 2px',
    borderRadius: '5pt'
}

export const songsLabel: CSSProperties = {
    marginLeft: '30pt',
    marginRight: '2pt',
    fontSize: '16pt'
}

export const songsSelector: CSSProperties = {
    minWidth: '100pt',
    fontSize: '14pt',
    marginTop: '15pt',
    marginBottom: '10pt'
}

export const songNameField: CSSProperties = {
    verticalAlign: 'middle',
    lineHeight: 'normal',
    marginRight: '1pt',
    marginBottom: '5pt'
}

export const savingInfo: CSSProperties = {
    ...infoStyle,
    background: '#cec',
    color: '#040',
    display: 'inline-block',
    marginLeft: '25pt'
}

export const savingError: CSSProperties = {
    ...savingInfo,
    background: '#ecc',
    color: '#400'
}