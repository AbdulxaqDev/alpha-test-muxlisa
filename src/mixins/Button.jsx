import React from 'react'
import "../style/FirstLook.css"
import {Link} from "react-router-dom"


function Button() {
  return (
    <Link to="/assistant">
    <button className="button fixed" >Sinab ko'rish</button>
  </Link>

  )
}

export default Button