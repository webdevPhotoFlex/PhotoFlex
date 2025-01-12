import React from 'react';
import MainPage from './../pages/main-page/main-page';
import { BrowserRouter as Router } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import PersonalAccount from '../pages/personal-account/personal-account';
import { ProtectedRouteElement } from '../protected-element/protected-route-element';

function App() {
  return (
    <Router basename="/PhotoFlex">
      <div className="App">
        <Routes>
          <Route path="/" element={<MainPage />} />

          <Route
            path="/personal-account"
            element={
              <ProtectedRouteElement>
                <PersonalAccount />
              </ProtectedRouteElement>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
