import * as Cesium from 'cesium'
import {dom,ion} from '../config/index'
import CesiumNavigation from "cesium-navigation-es6";



let viewer:Cesium.Viewer
export const initViewer = ()=>{

    Cesium.Ion.defaultAccessToken = ion;
    viewer = new Cesium.Viewer(dom,{
        timeline: false,//是否显示时间轴
        animation: false,//是否创建动画小控件，左下角仪表
        sceneModePicker: false,//是否显示2D，3D选择器
        baseLayerPicker: false,//是否显示图层选择器
        navigationHelpButton: false,//是否显示右上角的帮助按钮
        homeButton: false,//是否显示Home按钮
        geocoder: false,//是否显示geocoder小器件，右上角查询按钮
        fullscreenButton: true,//是否显示全屏按钮
        infoBox: false,//选中实体时所显示的信息框
        //实现对高程的加载，展现出3D图像
    })
}



export class CesiumController {
    viewer: Cesium.Viewer
    constructor (){
        this.viewer = viewer
    }

    /**
     * Viewer实例化
     * @returns 
     */
    // private initViewer = ()=>{
    //     let viewer
    //     Cesium.Ion.defaultAccessToken = ion;
    //     viewer = new Cesium.Viewer(dom,{
    //         timeline: false,//是否显示时间轴
    //         animation: false,//是否创建动画小控件，左下角仪表
    //         sceneModePicker: false,//是否显示2D，3D选择器
    //         baseLayerPicker: false,//是否显示图层选择器
    //         navigationHelpButton: false,//是否显示右上角的帮助按钮
    //         homeButton: false,//是否显示Home按钮
    //         geocoder: false,//是否显示geocoder小器件，右上角查询按钮
    //         fullscreenButton: true,//是否显示全屏按钮
    //         infoBox: false,//选中实体时所显示的信息框
    //         //实现对高程的加载，展现出3D图像
    //     })
    //     return viewer
    // }

    /**
     * 改变viewer的部分panel
     */
    private initCesiumViewer (){
        this.viewer.cesiumWidget.creditContainer.remove()
        this.viewer.selectedEntityChanged.addEventListener(function (this:any,_:any) {
        this.viewer.selectedEntity = undefined;
        });
        this.viewer.scene.globe.depthTestAgainstTerrain = false

    }

    createNavigation() {
        const options: any = {};
    // 用于在使用重置导航重置地图视图时设置默认视图控制。接受的值是Cesium.Cartographic 和 Cesium.Rectangle.
    options.defaultResetView = Cesium.Rectangle.fromDegrees(80, 22, 130, 50);
    // 用于启用或禁用罗盘。true是启用罗盘，false是禁用罗盘。默认值为true。如果将选项设置为false，则罗盘将不会添加到地图中。
    options.enableCompass = true;
    // 用于启用或禁用缩放控件。true是启用，false是禁用。默认值为true。如果将选项设置为false，则缩放控件将不会添加到地图中。
    options.enableZoomControls = true;
    // 用于启用或禁用距离图例。true是启用，false是禁用。默认值为true。如果将选项设置为false，距离图例将不会添加到地图中。
    options.enableDistanceLegend = true;
    // 用于启用或禁用指南针外环。true是启用，false是禁用。默认值为true。如果将选项设置为false，则该环将可见但无效。
    options.enableCompassOuterRing = true;

    //修改重置视图的tooltip
    options.resetTooltip = "重置视图";
    //修改放大按钮的tooltip
    options.zoomInTooltip = "放大";
    //修改缩小按钮的tooltip
    options.zoomOutTooltip = "缩小";

    //如需自定义罗盘控件，请看下面的自定义罗盘控件
    new CesiumNavigation(this.viewer, options);
    }
    async initTerrain() {
        this.viewer.terrainProvider = await Cesium.CesiumTerrainProvider.fromUrl(
            Cesium.IonResource.fromAssetId(1), {
                requestVertexNormals: true
            }
        )
    }

    public initHandler (){
            window.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas)
    }

    public loadMap(){
        this.initCesiumViewer()
        this.initHandler()
        this.createNavigation()
        this.initTerrain()
    }


}