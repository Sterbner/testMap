import * as Cesium from 'cesium'
import {dom,ion} from '../config/index'
import CesiumNavigation from "cesium-navigation-es6";
import noiseImage from '/noise.jpg'


let viewer:Cesium.Viewer

/**
 * Viewer实例化
 * @returns 
 */
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

    public getViewer () {
        return this.viewer
    }

    /**
     * 改变viewer的部分panel
     */
    private async initCesiumViewer (){
        viewer.scene.camera.setView({
            destination: new Cesium.Cartesian3(
              1216356.033078094,
              -4736402.278325668,
              4081270.375520902
            ),
            orientation: new Cesium.HeadingPitchRoll(
              0.08033365594766728,
              -0.29519015695063455,
              0.00027759141518046704
            ),
            // endTransform: Cesium.Matrix4.IDENTITY,
          })
        this.viewer.cesiumWidget.creditContainer.remove()
        this.viewer.selectedEntityChanged.addEventListener(function (this:any,_:any) {
        this.viewer.selectedEntity = undefined;
        });
        this.viewer.scene.globe.depthTestAgainstTerrain = false
        const tileset = this.viewer.scene.primitives.add(
            await Cesium.Cesium3DTileset.fromIonAssetId(2275207),
          );

    }   

    // initPostProcessing(){
    //     const fragmentShaderSource = `
    //     float getDistance(sampler2D depthTexture, vec2 texCoords) 
    //     { 
    //         float depth = czm_unpackDepth(texture(depthTexture, texCoords)); 
    //         if (depth == 0.0) { 
    //             return czm_infinity; 
    //         } 
    //         vec4 eyeCoordinate = czm_windowToEyeCoordinates(gl_FragCoord.xy, depth); 
    //         return -eyeCoordinate.z / eyeCoordinate.w; 
    //     } 
    //     float interpolateByDistance(vec4 nearFarScalar, float distance) 
    //     { 
    //         float startDistance = nearFarScalar.x; 
    //         float startValue = nearFarScalar.y; 
    //         float endDistance = nearFarScalar.z; 
    //         float endValue = nearFarScalar.w; 
    //         float t = clamp((distance - startDistance) / (endDistance - startDistance), 0.0, 1.0); 
    //         return mix(startValue, endValue, t); 
    //     } 
    //     vec4 alphaBlend(vec4 sourceColor, vec4 destinationColor) 
    //     { 
    //         return sourceColor * vec4(sourceColor.aaa, 1.0) + destinationColor * (1.0 - sourceColor.a); 
    //     } 
    //     uniform sampler2D colorTexture; 
    //     uniform sampler2D depthTexture; 
    //     uniform vec4 fogByDistance; 
    //     uniform vec4 fogColor; 
    //     in vec2 v_textureCoordinates; 
    //     void main(void) 
    //     { 
    //         float distance = getDistance(depthTexture, v_textureCoordinates); 
    //         vec4 sceneColor = texture(colorTexture, v_textureCoordinates); 
    //         float blendAmount = interpolateByDistance(fogByDistance, distance); 
    //         vec4 finalFogColor = vec4(fogColor.rgb, fogColor.a * blendAmount); 
    //         out_FragColor = alphaBlend(finalFogColor, sceneColor); 
    //     }
    //     `;
    //     const postProcessStage = this.viewer.scene.postProcessStages.add(
    //         new Cesium.PostProcessStage({
    //           fragmentShader: fragmentShaderSource,
    //           uniforms: {
    //             fogByDistance: new Cesium.Cartesian4(10, 0.0, 400, 1.0),
    //             fogColor: Cesium.Color.WHITE,
    //           },
    //         })
    //       );

    // }


    initPostProcessing(){
        const fragmentShaderSource = 
        `float getDistance(sampler2D depthTexture, vec2 texCoords) 
        { 
            float depth = czm_unpackDepth(texture(depthTexture, texCoords)); 
            if (depth == 0.0) { 
                return czm_infinity; 
            } 
            vec4 eyeCoordinate = czm_windowToEyeCoordinates(gl_FragCoord.xy, depth); 
            return -eyeCoordinate.z / eyeCoordinate.w; 
        } 
        float interpolateByDistance(vec4 nearFarScalar, float distance) 
        { 
            float startDistance = nearFarScalar.x; 
            float startValue = nearFarScalar.y; 
            float endDistance = nearFarScalar.z; 
            float endValue = nearFarScalar.w; 
            float t = clamp((distance - startDistance) / (endDistance - startDistance), 0.0, 1.0); 
            return mix(startValue, endValue, t); 
        } 
        vec4 alphaBlend(vec4 sourceColor, vec4 destinationColor) 
        { 
            return sourceColor * vec4(sourceColor.aaa, 1.0) + destinationColor * (1.0 - sourceColor.a); 
        } 
        uniform sampler2D noiseTexture;
        uniform sampler2D colorTexture; 
        uniform sampler2D depthTexture; 
        uniform vec4 fogByDistance; 
        uniform vec4 fogColor; 
        // uniform float czm_frameNumber;
        in vec2 v_textureCoordinates; 
        void main(void) 
        { 
            vec2 noiseCoord = v_textureCoordinates * 0.1;
            vec4 noise = texture(noiseTexture, noiseCoord);
            float noiseFloat = (noise.r + noise.g + noise.b) / 3.0 ;

            float distance = getDistance(depthTexture, v_textureCoordinates); 
            vec4 sceneColor = texture(colorTexture, v_textureCoordinates); 
            
            float blendAmount = interpolateByDistance(fogByDistance, distance); 

        //  vec2 noiseCoord = v_textureCoordinates * 0.2;
        //  vec4 noise = texture(noiseTexture, noiseCoord);
        //  float noiseFloat = (noise.r + noise.g + noise.b) / 3.0 ;
        //  vec4 mixedFogColor = noise * fogColor;
            
             float aphaValue = clamp(fogColor.a * (blendAmount - noiseFloat*0.1), 0.0, 1.0);

            // vec4 finalFogColor = vec4(fogColor.rgb, fogColor.a * blendAmount );

            vec4 finalFogColor = vec4(fogColor.rgb, aphaValue );
    
        // vec4 mixColor = mix( noise , finalFogColor, 0.95) ;
            out_FragColor = alphaBlend(finalFogColor, sceneColor);

        }
        `;
        
        // const noiseTexture = new Cesium.TextureUniform({
        //     url:'/noise.jpg'
        //     // url: noiseImage
        // })
        this.viewer.scene.postProcessStages.add(
            new Cesium.PostProcessStage({
              fragmentShader: fragmentShaderSource,
              uniforms: {
                noiseTexture: '/noise.jpg',
                fogByDistance: new Cesium.Cartesian4(1, 0.0, 300, 1.0),
                fogColor: Cesium.Color.WHITE,
                },
            })
          );

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