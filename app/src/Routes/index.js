import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from "react-router-dom";

//import Pages
import PlayerList from "../pages/PlayerList";
import Error404 from "../pages/Error404"

//import Pages Backoffice
import Backoffice from "../backoffice/Backoffice"
import BackofficePlayerList from "../backoffice/PlayerList"
import BackofficeSkillList from "../backoffice/SkillList"
import BackofficeTechniqueList from "../backoffice/TechniqueList"

const index = () => {
    return (
        <Router>
            <Switch>
                <Route path="/" exact component={PlayerList} />
                <Route path="/error404" exact component={Error404} />
                <Route path="/backoffice" exact component={Backoffice} />
                <Route path="/backoffice/playerlist" exact component={BackofficePlayerList} />
                <Route path="/backoffice/skilllist" exact component={BackofficeSkillList} />
                <Route path="/backoffice/techniquelist" exact component={BackofficeTechniqueList} />
                <Redirect to="/error404" />
            </Switch>
        </Router>
    )
}

export default index;
