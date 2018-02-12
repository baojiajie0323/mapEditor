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
        console.log("MapData", MapData.instance().data);
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
                <Subheader>地图图层</Subheader>
                <div className={styles.layerList}>
                    <List>
                        <ListItem primaryText="Sent mail" leftIcon={<ContentSend />} />
                        <ListItem primaryText="Drafts" leftIcon={<ContentDrafts />} />
                        <ListItem
                            primaryText="Inbox"
                            leftIcon={<ContentInbox />}
                            initiallyOpen={true}
                            primaryTogglesNestedList={true}
                            nestedItems={[
                                <ListItem
                                    key={1}
                                    primaryText="Starred"
                                    leftIcon={<ActionGrade />}
                                />,
                                <ListItem
                                    key={2}
                                    primaryText="Sent Mail"
                                    leftIcon={<ContentSend />}
                                    disabled={true}
                                    nestedItems={[
                                        <ListItem key={1} primaryText="Drafts" leftIcon={<ContentDrafts />} />,
                                    ]}
                                />,
                                <ListItem
                                    key={3}
                                    primaryText="Inbox"
                                    leftIcon={<ContentInbox />}
                                    open={this.state.open}
                                    onNestedListToggle={this.handleNestedListToggle}
                                    nestedItems={[
                                        <ListItem key={1} primaryText="Drafts" leftIcon={<ContentDrafts />} />,
                                    ]}
                                />,
                            ]}
                        />
                    </List>
                </div>

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


