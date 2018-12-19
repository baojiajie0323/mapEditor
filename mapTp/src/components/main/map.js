import React from 'react';
import { connect } from 'dva';
import MapRender from './mapRender';
import MapData from './mapData';
import Paper from 'material-ui/Paper';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import DataModal from './dataModal';
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
        this.onItemTouchTap = this.onItemTouchTap.bind(this);
    }
    componentDidMount() {
        var mapWidth = this.mapContainer.offsetWidth;
        var mapHeight = this.mapContainer.offsetHeight;
        this.mapCanvas.width = mapWidth;
        this.mapCanvas.height = mapHeight;

        this.mapData = MapData.instance().init();
        this.mapRender = new MapRender(this.mapCanvas, this.mapData);
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
    onContextMenu(bShow, menu, mouse) {
        console.log("onContextMenu", bShow, menu, mouse);
        this.setState({
            showMenu: bShow,
            menu: menu,
            menuMouse: mouse,
        })
    }
    onItemTouchTap(e, menuItem, number) {
        //if (menuItem.props.value == "编辑元素") {
        //  alert(11);
        menuItem.props.value();
        //}

        this.setState({
            showMenu: false
        })
    }
    render() {
        const { showMenu, menuMouse, menu } = this.state;
        var contextmenuStyle = {
            position: 'absolute',
            wdith: '120px',
            left: menuMouse.x,
            top: menuMouse.y,
            display: 'inline-block',
            transition: 'all 0s ease'
        }
        return (
            <div ref={(c) => { this.mapContainer = c }} className={styles.map}>
                <canvas ref={(c) => { this.mapCanvas = c }} id="mapcanvas"></canvas>
                {showMenu ? <Paper style={contextmenuStyle}>
                    <Menu onItemTouchTap={this.onItemTouchTap} >
                        {menu.map((m) => {
                            if (m.title) {
                                return <MenuItem value={m.onClick} primaryText={m.title} />
                            } else {
                                return <Divider />
                            }
                        })}
                    </Menu>
                </Paper> : null}
                <DataModal />
            </div>
        )
    }
}

function MapToStates(states) {
    const { drawMode } = states.mapeditor;
    return {
        drawMode
    }
}
export default connect(MapToStates)(Map)


