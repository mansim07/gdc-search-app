import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./App.css";



function AppRouter() {

  return (
    <Router>
      <Switch>
        {routes.map((path) => (
          <Route key={path} path={path} exact={true || path === "/"}>
            {React.createElement(require(`./routes${path}`).default)}
          </Route>
        ))}
        <Route path="*">
        </Route>
      </Switch>
    </Router>
  );
}

function App() {
  return (

      <AppRouter />

  );
}

const routes = [
  "/search-results",
  "/"
];

export default App;