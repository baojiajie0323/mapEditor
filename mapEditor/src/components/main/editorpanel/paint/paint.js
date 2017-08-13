import React from 'react';
import { connect } from 'dva';
import styles from '../editorpanel.less'
import { Collapse } from 'antd';
const Panel = Collapse.Panel;

import SettingIcon from 'material-ui/svg-icons/action/touch-app';
import PathIcon from 'material-ui/svg-icons/action/timeline';
import EditIcon from 'material-ui/svg-icons/image/edit';

class Paint extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {

    }
    render() {
        const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;
        return (
            <div className={styles.paint}>
                <Collapse accordion bordered={false} defaultActiveKey={['1']}>
                    <Panel header={<div className={[styles.title,styles.pointer].join(' ')}>选择元素</div>} key="1">
                        <p>{text}</p>
                    </Panel>
                    <Panel header={<div className={[styles.title,styles.icon].join(' ')}>图标</div>} key="2">
                        <p>{text}</p>
                    </Panel>
                    <Panel header={<div className={[styles.title,styles.painter].join(' ')}>绘制元素</div>} key="3">
                        <p>{text}</p>
                    </Panel>
                </Collapse>
            </div>
        )
    }
}

function MapToStates(states) {
    return {

    }
}
export default connect(MapToStates)(Paint)