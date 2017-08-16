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
        const text = `请在界面上选择元素`;
        return (
            <div className={styles.paint}>
                <Collapse accordion bordered={false} defaultActiveKey={['1']}>
                    <Panel header={<div className={[styles.title, styles.pointer].join(' ')}>选择元素</div>} key="1">
                        <p>{text}</p>
                    </Panel>
                    <Panel header={<div className={[styles.title, styles.icon].join(' ')}>图标</div>} key="2">
                        <p>{text}</p>
                    </Panel>
                    <Panel header={<div className={[styles.title, styles.painter].join(' ')}>绘制元素</div>} key="3">
                        <div className={styles.itemcontent}>
                            <p>形状</p>
                            <div className={styles.painttype}>
                                <div className={styles.typerect}></div>
                                <div className={styles.typecircle}></div>
                                <div className={styles.typepolygon}></div>
                            </div>
                        </div>
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