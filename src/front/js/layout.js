import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import { Home } from "./pages/Home.jsx";
import { Demo } from "./pages/demo";
import { Single } from "./pages/single";
import injectContext from "./store/appContext";
import { LogIn } from "./pages/LogIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import ListOfContacts from "./pages/Views/ListOfContacts.jsx";
import Groups from "./pages/Views/Groups.jsx";
import SharedObjectives from "./pages/Views/SharedObjectives.jsx";
import Messages from "./pages/Views/Messages.jsx";
import FavouriteContacts from "./pages/Views/FavouriteContacts.jsx";
import Settings from "./pages/Views/Settings.jsx";
import About from "./pages/Views/About.jsx";
import Feedback from "./pages/Views/Feedback.jsx";
import SingleObjective from "./pages/Views/IndividualViews/SingleObjective.jsx";
import SingleContact from "./pages/Views/IndividualViews/SingleContact.jsx";
import SingleGroup from "./pages/Views/IndividualViews/SingleGroup.jsx";
import SingleMessage from "./pages/Views/IndividualViews/SingleMessage.jsx";




import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";

//create your first component
const Layout = () => {
    //the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";

    if(!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL/ >;

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<Demo />} path="/demo" />
                        <Route element={<Single />} path="/single/:theid" />
                        <Route element={<h1>Not found!</h1>} />
                        <Route element={<LogIn/>} path="/login" />
                        <Route element={<SignUp/>} path="/signup" />
                        <Route element={<ListOfContacts/>} path="/listofcontacts" />
                        <Route element={<Dashboard/>} path="/dashboard" />
                        <Route element={<Home/>} path="/home" />
                        <Route element={<Groups/>} path="/group/user/:userid" />
                        <Route element={<SharedObjectives/>} path="/sharedobjectives" />
                        <Route element={<Messages/>} path="/message/user/:userid" />
                        <Route element={<FavouriteContacts/>} path="/favouritecontacts" />
                        <Route element={<Settings/>} path="/settings" />
                        <Route element={<About/>} path="/about" />
                        <Route element={<Feedback/>} path="/feedback" />
                        <Route element={<SingleContact/>} path="/singlecontact/" />
                        <Route element={<SingleGroup/>} path="/singlegroup/:groupid" />
                        <Route element={<SingleMessage/>} path="/message/conversation/:otheruserid" />
                        <Route element={<SingleObjective/>} path="/singleobjective/:objectiveid" />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
