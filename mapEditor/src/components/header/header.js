import React from 'react';
import { connect } from 'dva';
import styles from './header.less';


import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import PreviewIcon from 'material-ui/svg-icons/action/explore';
import PublishIcon from 'material-ui/svg-icons/action/launch';
import SaveIcon from 'material-ui/svg-icons/content/save';
import HelpIcon from 'material-ui/svg-icons/action/help-outline';
import ListIcon from 'material-ui/svg-icons/action/list';
import ThemeIcon from 'material-ui/svg-icons/image/color-lens';



import { grey800 } from 'material-ui/styles/colors';

const Header = ({ dispatch }) => {
  return (
    <header className={styles.header}>
      <p>科达云地图编辑器</p>
      <RaisedButton
        label="预览地图"
        icon={<PreviewIcon color={grey800} />}
        className={styles.headerbtn}
      />
      <RaisedButton
        label="保存"
        icon={<SaveIcon color={grey800} />}
        className={styles.headerbtn}
      />
      <RaisedButton
        label="发布"
        icon={<PublishIcon color={grey800} />}
        className={styles.headerbtn}
      />
      <span style={{ flexGrow: 1 }}></span>
      <RaisedButton
        label="主题管理"
        icon={<ThemeIcon color={grey800} />}
        className={styles.headerbtn}
      />
      <RaisedButton
        label="查看数据表"
        icon={<ListIcon color={grey800} />}
        className={styles.headerbtn}
      />
      <IconButton style={{ marginLeft: '100px' }} tooltip="帮助">
        <HelpIcon color={grey800} />
      </IconButton>      
      <div className={styles.logo}></div>
    </header>
  );
};

Header.propTypes = {
};

function MapToStates(state) {
  //const { } = state.mapEditor;
  return {
    
  }
}
export default connect(MapToStates)(Header);
