import React from 'react'

const Input = (props) => {
    return (
        <>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px", width:"100%", marginBottom:"15px"}}>
                {props.label && <label>{props.label}</label>}
                <input
                    type={props.type}
                    name={props.name}
                    placeholder={props?.placeholder}
                    className={props.className}
                    value={props.value}
                    onChange={(e) => props.handleChange(e)}
                />
                {props.errors && <p className={props.errorClass}>{props.errors}</p>}
            </div>
        </>
    )
}

export default Input