import React from "react"
import "./simulation_popup.css"

const SimulationPopup = props => {

  return props.trigger ? (
    <div className="popup">
      <div className="popup-inner">
        <button className="ui-icon-button" onClick={() => props.setTrigger(false)}><i class="close icon"></i></button>        
        {props.children}
      </div>
    </div>
  ) : null
 
}

export default SimulationPopup