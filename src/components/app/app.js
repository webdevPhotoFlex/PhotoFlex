import React from 'react';
import MainPage from './../pages/main-page/main-page';
import { BrowserRouter as Router } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import PersonalAccount from '../pages/personal-account/personal-account';
import { ProtectedRouteElement } from '../protected-element/protected-route-element';
import { GoogleOAuthProvider } from '@react-oauth/google';
const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
function App() {
  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
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
    </GoogleOAuthProvider>
  );
}

export default App;
