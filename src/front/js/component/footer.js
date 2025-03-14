import React, { Component } from "react";
import { Link } from "react-router-dom";



export const Footer = () => (
	<><footer className="footer mt-auto py-3 text-center">
		<p>My Footer</p>
	</footer>
	<Link to="/dashboard"><button className="btn btn-light px-4 py-2">Dashboard</button></Link>
	</>
);
