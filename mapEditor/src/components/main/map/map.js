import React from 'react';
import { connect } from 'dva';
import MapRender from './maprender';
import Paper from 'material-ui/Paper';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import styles from './map.less'

class Map extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showMenu: false,
            menuMouse: { x: 0, y: 0 },
        }
        this.mapContainer = null;
        this.mapCanvas = null;
        this.mapRender = null;
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onContextMenu = this.onContextMenu.bind(this);
    }
    componentDidMount() {
        var mapWidth = this.mapContainer.offsetWidth;
        var mapHeight = this.mapContainer.offsetHeight;
        this.mapCanvas.width = mapWidth;
        this.mapCanvas.height = mapHeight;

        this.mapRender = new MapRender(this.mapCanvas);
        this.mapRender.contextmenucb = this.onContextMenu;
        console.log("componentDidMount", mapWidth, mapHeight);


        document.oncontextmenu = function (e) {
            return false;
        }

        this.mapCanvas.addEventListener("mousedown", this.onMouseDown, false);
    }
    componentWillReceiveProps(nextProps) {
        if (this.drawMode != nextProps.drawMode) {
            this.mapRender.setDrawMode(nextProps.drawMode);
        }
    }
    onMouseDown(e) {
        var leftClick = e.button == 0;
        if (!leftClick) {
            this.props.dispatch({ type: 'mapeditor/setDrawMode', payload: "" });
            return;
        }
        this.setState({
            showMenu: false,
        })
    }
    onContextMenu(bShow, mouse) {
        console.log("onContextMenu", bShow, mouse);
        this.setState({
            showMenu: bShow,
            menuMouse: mouse,
        })
    }
    render() {
        const { showMenu, menuMouse } = this.state;
        var contextmenuStyle = {
            position: 'absolute',
            wdith: '120px',
            left: menuMouse.x,
            top: menuMouse.y,
            display: 'inline-block',
        }
        return <div ref={(c) => { this.mapContainer = c }} className={styles.map}>
            <canvas ref={(c) => { this.mapCanvas = c }} id="mapcanvas"></canvas>
            {showMenu ? <Paper style={contextmenuStyle}>
                <Menu desktop={true}>
                    <MenuItem primaryText="编辑元素" />
                    <MenuItem primaryText="拉伸元素" />
                    <MenuItem primaryText="旋转元素" />
                    <MenuItem primaryText="拆分面" />
                    <Divider />
                    <MenuItem primaryText="查看属性数据" />
                    <MenuItem primaryText="删除元素" />
                </Menu>
            </Paper> : null}

        </div>
    }
}

function MapToStates(states) {
    const { drawMode } = states.mapeditor;
    return {
        drawMode
    }
}
export default connect(MapToStates)(Map)


