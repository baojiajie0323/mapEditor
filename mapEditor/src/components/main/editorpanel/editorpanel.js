import React from 'react';
import { connect } from 'dva';
import { Tabs, Tab } from 'material-ui/Tabs';
import Paint from './paint/paint';
import styles from './editorpanel.less'


import SettingIcon from 'material-ui/svg-icons/action/settings';
import PathIcon from 'material-ui/svg-icons/action/timeline';
import EditIcon from 'material-ui/svg-icons/image/edit';

class EditorPanel extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {

    }
    render() {
        return <div className={styles.editorpanel}>
            <Tabs
                contentContainerStyle={{position:'absolute',top:'72px',bottom:0,width:'100%'}}
                tabTemplateStyle={{position:'absolute',height:'100%',width:'100%'}}
                tabItemContainerStyle={{ backgroundColor: 'rgb(32, 144, 241)' }}
                >
                <Tab
                    icon={<EditIcon />}
                    label="绘制"
                >
                    <Paint />
                </Tab>
                <Tab
                    icon={<PathIcon />}
                    label="路径"
                />
                <Tab
                    icon={<SettingIcon />}
                    label="设置"
                />
            </Tabs>
        </div>
    }
}

function MapToStates(states) {
    return {

    }
}
export default connect(MapToStates)(EditorPanel)