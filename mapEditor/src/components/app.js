import React from 'react';

import Header from './header/header';
import Main from './main/main';
import DataModal from './main/map/dataModal';
const Example = () => {
  return (
    <div>
      <Header />
      <Main />      
      <DataModal />
    </div>
  );
};

Example.propTypes = {
};

export default Example;
