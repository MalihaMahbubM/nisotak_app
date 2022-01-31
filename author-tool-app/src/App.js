import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Navbar from "./components/navbar.component";
import HomePage from "./components/Home/home-page.component";
import Lesson from "./components/Lesson/lesson.component";
import ContentPage from "./components/ContentPage/content-page.component";
import MCQuestion from "./components/MultipleChoiceQuestion/mcQuestion.component";
import TextContent from "./components/ContentPage/Text/content-text.component";
import PhraseContent from "./components/ContentPage/Phrase/content-phrase.component";
import Login from "./components/Login/login.component";
import Registration from "./components/Registration/registration.component";
import RequestsManagement from "./components/UserManagementPages/ManageRequests/requestsManagement.component";
import UsersManagement from "./components/UserManagementPages/ManageUsers/usersManagement.component";
import LanguageManagement from "./components/UserManagementPages/LanguageManagement/LanguageManagement";
import LanguageDefinition from "./components/UserManagementPages/LanguageManagement/LanguageDefinition";

function App() {
  return (
    <Router>
      <Navbar isAuthenticated={localStorage.getItem("access_token")} role={localStorage.getItem("user_role")}/>
        <br/>
      <Route path="/login" exact component={Login} />
      <Route path="/register" exact component={Registration} />
      <Route path="/requestsManagement" exact component={RequestsManagement} />
      <Route path="/languageManagement" exact component={LanguageManagement} />
      <Route path="/languageManagement/:id" exact component={LanguageDefinition} />
      <Route path="/usersManagement" exact component={UsersManagement} />
      <Route path="/" exact component={HomePage} />
      <Route path="/lesson/:id" exact component={Lesson} />
      <Route
        path="/lesson/:idLesson/contentPage/:idCP"
        exact
        component={ContentPage}
      />
      <Route
        path="/lesson/:idLesson/mcQuestion/:idQ"
        exact
        component={MCQuestion}
      />
      <Route
        path="/lesson/:idLesson/contentPage/:idCP/text/:idText"
        exact
        component={TextContent}
      />
      <Route
        path="/lesson/:idLesson/contentPage/:idCP/phrase/:idPhrase"
        exact
        component={PhraseContent}
      />
    </Router>
  );
}

export default App;
