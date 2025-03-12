import React, { useContext } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";
import { Link } from "react-router-dom";


export const Home = () => {
	const { store, actions } = useContext(Context);

	return (
		<div className="d-flex flex-column vh-100 justify-content-center align-items-center bg-dark text-white">
      <h1 className="display-3 ">
        <span className="text-white fw-bold">S </span>PLI <br />
        <span className="text-white ms-3">TTR</span>
      </h1>
      <div className="mt-3">
        <Link to="/login"> <button className="btn btn-dark me-3 px-4 py-2">Log in</button> </Link>
        <Link to="/signup"><button className="btn btn-light px-4 py-2">Sign up</button></Link>
        <Link to="/dashboard"><button className="btn btn-light px-4 py-2">Dashboard</button></Link>
        <Link to="/singlecontact"><button className="btn btn-light px-4 py-2">Single Contact</button></Link>
        <Link to="/singlegroup"><button className="btn btn-light px-4 py-2">Single Group</button></Link>
        <Link to="/singleobjective"><button className="btn btn-light px-4 py-2">Single Objective</button></Link>
      </div>
    </div>
	);
};
