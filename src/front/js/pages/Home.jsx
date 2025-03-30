import React, { useContext } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";
import { Link } from "react-router-dom";


export const Home = () => {
	const { store, actions } = useContext(Context);

	return (
		<div className="d-flex flex-column vh-100 justify-content-center align-items-center bg-dark text-white">
      <div className="d-flex flex-column justify-content-center align-items-center bg-dark text-white">
  <div style={{
    display: 'flex',
    alignItems: 'center',
    fontFamily: "'Roboto', sans-serif",
    fontWeight: 700,
    letterSpacing: 1,
    fontSize: '4rem'
  }}>
    <span style={{ fontSize: '5rem', marginRight: '2px' }}>S</span>
    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 0.9 }}>
      <span>PLI</span>
      <span>TTR</span>
    </div>
  </div>
</div>
      <div className="mt-3">
        <Link to="/login"> <button className="btn btn-dark me-3 px-4 py-2">Log in</button> </Link>
        <Link to="/signup"><button className="btn btn-light px-4 py-2">Sign up</button></Link>
        </div>
        
    </div>
	);
};
