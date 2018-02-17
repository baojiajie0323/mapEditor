import React from 'react';
import { connect } from 'dva';
import MapData from './mapData';
import styles from './map.less';

import Dialog from 'material-ui/Dialog';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import ContentInbox from 'material-ui/svg-icons/content/inbox';
import ContentDrafts from 'material-ui/svg-icons/content/drafts';
import ContentSend from 'material-ui/svg-icons/content/send';

class DataModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }

    }
    componentDidMount() {

    }
    componentWillReceiveProps(nextProps) {

    }
    handleClose = () => {
        this.props.dispatch({ type: 'mapeditor/setDataModalShow', payload: false })
    };
    renderMapData() {
        var mapData = MapData.instance().getJsonData();
        if (!mapData) return null;
        console.log("MapData", mapData);
        return mapData.map((m) => {
            return (
                <div>
                    <p>{m.name}</p>
                    <Subheader>区域</Subheader>
                    {m.area.map((a,i)=> {
                        return <p className={styles.dataString}>{JSON.stringify(a)}</p>
                    })}
                    
                    <Subheader>图元</Subheader>
                    <p className={styles.dataString}>{JSON.stringify(m.sprite)}</p>
                </div>
            )
        })
    }
    render() {
        var { dataModalShow } = this.props;

        // const actions = [
        //     <FlatButton
        //         label="Cancel"
        //         primary={true}
        //         onClick={this.handleClose}
        //     />,
        //     <FlatButton
        //         label="Submit"
        //         primary={true}
        //         keyboardFocused={true}
        //         onClick={this.handleClose}
        //     />,
        // ];
        //var mapDataJson = JSON.stringify(MapData.instance().data);
        var mapDataJson = "";
        return <Dialog
            title="地图数据"
            actions={null}
            modal={false}
            open={dataModalShow}
            onRequestClose={this.handleClose}
            contentClassName={styles.dataModal}
            bodyClassName={styles.content}
        >
            <div className={styles.mapLayer}>
                {this.renderMapData()}
            </div>

        </Dialog>
    }
}

function MapToStates(states) {
    const { dataModalShow } = states.mapeditor;
    return {
        dataModalShow
    }
}
export default connect(MapToStates)(DataModal)


