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
        this.onClickDrawRect = this.onClickDrawRect.bind(this);
        this.onClickDrawCircle = this.onClickDrawCircle.bind(this);
        this.onClickDrawPolygon = this.onClickDrawPolygon.bind(this);
    }
    componentDidMount() {

    }
    onClickDrawRect() {
        console.log("onClickDrawRect");
        this.props.dispatch({ type: 'mapeditor/setDrawMode', payload: "rect" })
    }
    onClickDrawCircle() {
        this.props.dispatch({ type: 'mapeditor/setDrawMode', payload: "circle" })
    }
    onClickDrawPolygon() {
        this.props.dispatch({ type: 'mapeditor/setDrawMode', payload: "polygon" })
    }
    render() {
        const text = `请在界面上选择元素`;
        const { drawMode } = this.props;
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
                                <div onClick={this.onClickDrawRect}
                                    className={[styles.typerect, drawMode == "rect" ? styles.typerect_sel : ''].join(' ')}>
                                </div>
                                <div onClick={this.onClickDrawCircle}
                                    className={[styles.typecircle, drawMode == "circle" ? styles.typecircle_sel : ''].join(' ')}>
                                </div>
                                <div onClick={this.onClickDrawPolygon}
                                    className={[styles.typepolygon, drawMode == "polygon" ? styles.typepolygon_sel : ''].join(' ')}>
                                </div>
                            </div>
                        </div>
                    </Panel>
                </Collapse>
            </div>
        )
    }
}

function MapToStates(states) {
    console.log("MapToStates",states)
    const { drawMode } = states.mapeditor;
    return {
        drawMode
    }
}
export default connect(MapToStates)(Paint)