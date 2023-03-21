import React, { Fragment } from "react";
import { ThemeProvider } from "styled-components";
// Redux store provider
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";
// Style Root for making media queries to inline css
import { StyleRoot } from "radium";
import themes from "./settings/themes";
import { themeConfig } from "./settings";
import { PersistGate } from "redux-persist/integration/react";
import "./assets/scss/app.scss";
import "pretty-checkbox/src/pretty-checkbox.scss";
import Routes from "route";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = props => {
  return (
    <Fragment>
      <ThemeProvider theme={themes[themeConfig.theme]}>
        <StyleRoot>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              {/*Start layout routes */}
              <BrowserRouter>
                <Routes />
              </BrowserRouter>
              {/*End layout routes */}
              <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
              />
            </PersistGate>
          </Provider>
        </StyleRoot>
      </ThemeProvider>
    </Fragment>
  );
};

export default App;

// If you want to choose different color schema go to settings/index.jsx and set your theme and language.

// If you want to change sidebar nav list then go to util/data/sidebar.jsx
