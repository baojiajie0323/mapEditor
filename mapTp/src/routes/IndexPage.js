import React from 'react';
import { connect } from 'dva';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import App from '../components/app';

injectTapEventPlugin();

function IndexPage() {
  return (
    <MuiThemeProvider>
      <App />
    </MuiThemeProvider>
  );
}

IndexPage.propTypes = {
};

export default connect()(IndexPage);
