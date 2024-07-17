import * as Cesium from 'cesium'
import {dom,ion} from '../config/index'
import CesiumNavigation from "cesium-navigation-es6";
import noiseImage from '/noise.jpg'
import rainImage from '/rainy.png'

let _viewer:Cesium.Viewer

/**
 * Viewer实例化
 * @returns 
 */
export const initViewer = ()=>{

    Cesium.Ion.defaultAccessToken = ion;
    _viewer = new Cesium.Viewer(dom,{
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
    entities: any[]
    constructor (){
        this.viewer = _viewer
        this.entities = []
    }

    public getViewer () {
        return this.viewer
    }

    initRain (){
        for (var lon = -74.0; lon < -73.9; lon += 0.01) {
            for (var lat = 40.0; lat < 40.1; lat += 0.01) {
                this.entities.push(this.viewer.entities.add({
                    position: Cesium.Cartesian3.fromDegrees((lon + lon + 0.01) / 2, (lat + lat + 0.01) / 2, 100),
                    point: {
                        pixelSize: 5,
                        color: Cesium.Color.RED,
                        outlineColor: Cesium.Color.WHITE,
                        outlineWidth: 2,
                        show: false
                    }
                }));
            }
        }
        for (var i = 0; i < this.entities.length; i++) {
            console.log('adding particle');
            
            this.viewer.scene.primitives.add(new Cesium.ParticleSystem({
                image: rainImage,
                startColor: Cesium.Color.GHOSTWHITE,
                endColor: Cesium.Color.GHOSTWHITE,
                startScale: 5,
                endScale: 5,
                // time: 20,
                speed: Math.floor(Math.random() * 20 + 1),//随机速度
                // width: 10,  // 设置以像素为单位的粒子的最小和最大宽度
                // height: 10, //设置粒子的最小和最大高度（以像素为单位）。
                imageSize:new Cesium.Cartesian2(10.0,10.0),
                emissionRate: 5, //每秒发射的粒子数量
                lifetime: 16, //多长时间的粒子系统将以秒为单位发射粒子
                loop: true, //是否粒子系统应该在完成时循环它的爆发
                emitter: new Cesium.CircleEmitter(0.5), //此系统的粒子发射器  共有 BoxEmitter,CircleEmitter,ConeEmitter,SphereEmitter 几类
                emitterModelMatrix: this.computeEmitterModelMatrix(), // 4x4转换矩阵，用于在粒子系统本地坐标系中转换粒子系统发射器
                modelMatrix: this.computeModelMatrix(this.entities[i], Cesium.JulianDate.now()), // 4x4转换矩阵，可将粒子系统从模型转换为世界坐标
                updateCallback: this.applyGravity // 强制回调函数--例子：这是添加重力效果
            }))
        }

    }

    computeModelMatrix(entity:any, time:any){
        return entity.computeModelMatrix(time, new Cesium.Matrix4())
    }

    // computeModelMatrix(entity : any, time: any) {
    //     var position = Cesium.Property.getValueOrUndefined(time, new Cesium.Cartesian3());
    //     if (!Cesium.defined(position)) {
    //         return undefined;
    //     }
    //     var orientation = Cesium.Property.getValueOrUndefined(time, new Cesium.Quaternion());
    //     var modelMatrix = null;
    //     if (!Cesium.defined(orientation)) {
    //         modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(position, undefined, new Cesium.Matrix4());
    //     } else {
    //         modelMatrix = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromQuaternion(orientation, new Cesium.Matrix3()), position, modelMatrix);
    //     }
    //     return modelMatrix;
    // }

    // computeEmitterModelMatrix() {
    //     var hpr = Cesium.HeadingPitchRoll.fromDegrees(0, 0, 0, new Cesium.HeadingPitchRoll());
    //     var trs = new Cesium.TranslationRotationScale();
    //     trs.translation = Cesium.Cartesian3.fromElements(0, 0, 0, new Cesium.Cartesian3());
    //     trs.rotation = Cesium.Quaternion.fromHeadingPitchRoll(hpr, new Cesium.Quaternion());
    //     return Cesium.Matrix4.fromTranslationRotationScale(trs, new Cesium.Matrix4());
    // }

    computeEmitterModelMatrix() {
        const emitterModelMatrix = new Cesium.Matrix4()
        const translation = new Cesium.Cartesian3();
        let hpr = new Cesium.HeadingPitchRoll();
        const trs = new Cesium.TranslationRotationScale();
        const rotation = new Cesium.Quaternion()
        hpr = Cesium.HeadingPitchRoll.fromDegrees(0.0, 0.0, 0.0, hpr);
        trs.translation = Cesium.Cartesian3.fromElements(
          -4.0,
          0.0,
          1.4,
          translation
        );
        trs.rotation = Cesium.Quaternion.fromHeadingPitchRoll(hpr, rotation);
      
        return Cesium.Matrix4.fromTranslationRotationScale(
          trs,
          emitterModelMatrix
        );
      }

    applyGravity(particle: any, dt:any) {
        var position = particle.position;
        var gravityVector = Cesium.Cartesian3.normalize(position, new Cesium.Cartesian3());
        Cesium.Cartesian3.multiplyByScalar(gravityVector, -100 * dt, gravityVector);
        particle.velocity = Cesium.Cartesian3.add(particle.velocity, gravityVector, particle.velocity);
    }


    /**
     * 改变viewer的部分panel
     */
    private async initCesiumViewer (){
        const newYorkPosition = Cesium.Cartesian3.fromDegrees( -74.0060 , 40.7128 , 200)
        this.viewer.scene.camera.setView({
            // destination: new Cesium.Cartesian3(
            //   1216356.033078094,
            //   -4736402.278325668,
            //   4081270.375520902
            // ),
            destination:newYorkPosition,
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
        this.viewer.scene.debugShowFramesPerSecond = true;
    }   


    /* 初始版 */
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



    /* 添加噪音和流动效果的深度雾版本 */
    // initPostProcessing(){
    //     const fragmentShaderSource = 
    //     `float getDistance(sampler2D depthTexture, vec2 texCoords) 
    //     { 
    //         float depth = czm_unpackDepth(texture(depthTexture, texCoords)); 
    //         // if (depth == 0.0) { 
    //         //     return czm_infinity; 
    //         // } 
    //         vec4 eyeCoordinate = czm_windowToEyeCoordinates(gl_FragCoord.xy, depth);
    //         vec4 worldPosition = czm_inverseView * eyeposition;
    //         return -eyeCoordinate.z / eyeCoordinate.w; 
    //     } 

    //     // float interpolateByDistance(vec4 nearFarScalar, float distance) 
    //     // { 
    //     //     float startDistance = nearFarScalar.x; 
    //     //     float startValue = nearFarScalar.y; 
    //     //     float endDistance = nearFarScalar.z; 
    //     //     float endValue = nearFarScalar.w; 
    //     //     float t = clamp((distance - startDistance) / (endDistance - startDistance), 0.0, 1.0); 
    //     //     return mix(startValue, endValue, t); 
    //     // } 

    //     float interpolateByDistance(vec4 nearFarScalar, float distance) 
    //     { 
    //         float startDistance = nearFarScalar.x; 
    //         float startValue = nearFarScalar.y; 
    //         float endDistance = nearFarScalar.z; 
    //         float endValue = nearFarScalar.w; 
    //         // float t = abs((distance - startDistance) / (endDistance - startDistance));
    //         float t = clamp((distance - startDistance) / (endDistance - startDistance), 0.0, 1.2);
    //         return t; 
    //     } 

    //     vec4 alphaBlend(vec4 sourceColor, vec4 destinationColor) 
    //     { 
    //         return sourceColor * vec4(sourceColor.aaa, 1.0) + destinationColor * (1.0 - sourceColor.a); 
    //     } 
    //     uniform sampler2D noiseTexture;
    //     uniform sampler2D colorTexture; 
    //     uniform sampler2D depthTexture; 
    //     uniform vec4 fogByDistance; 
    //     uniform vec4 fogColor;
    //     uniform float speed; 
    //     // uniform float czm_frameNumber;
    //     in vec2 v_textureCoordinates; 
    //     void main(void) 
    //     { 
    //         vec2 noiseCoord = v_textureCoordinates * 0.05;
    //         // vec4 noise = texture(noiseTexture, noiseCoord);
    //         vec4 noise = texture(noiseTexture, vec2(fract((noiseCoord.x - speed * czm_frameNumber * 0.0001)),noiseCoord.y)) ;
    //         float noiseFloat = ((noise.r + noise.g + noise.b) / 3.0) - 0.5 ;
    //         float distance = getDistance(depthTexture, v_textureCoordinates); 
    //         vec4 sceneColor = texture(colorTexture, v_textureCoordinates); 
    //         float blendAmount = interpolateByDistance(fogByDistance, distance); 

    //     //  vec2 noiseCoord = v_textureCoordinates * 0.2;
    //     //  vec4 noise = texture(noiseTexture, noiseCoord);
    //     //  float noiseFloat = (noise.r + noise.g + noise.b) / 3.0 ;
    //     //  vec4 mixedFogColor = noise * fogColor;
            
    //          float aphaValue = clamp(fogColor.a * (blendAmount - noiseFloat * 0.2 * blendAmount), 0.0, 1.0);

    //         // vec4 finalFogColor = vec4(fogColor.rgb, fogColor.a * blendAmount );

    //         vec4 finalFogColor = vec4(fogColor.rgb, aphaValue );
    
    //     // vec4 mixColor = mix( noise , finalFogColor, 0.95) ;
    //         out_FragColor = alphaBlend(finalFogColor, sceneColor);

    //     }
    //     `;


    initPostProcessing(){
        const fragmentShaderSource = 
        `vec2 getDistance(sampler2D depthTexture, vec2 texCoords) 
        { 
            float depth = czm_unpackDepth(texture(depthTexture, texCoords)); 
            // if (depth == 0.0) { 
            //     return czm_infinity; 
            // } 
            vec4 eyeCoordinate = czm_windowToEyeCoordinates(gl_FragCoord.xy, depth);
            vec4 worldPosition = czm_inverseView * eyeCoordinate;
            // return -eyeCoordinate.z / eyeCoordinate.w;
             
            return vec2(-eyeCoordinate.z / eyeCoordinate.w, worldPosition.z / worldPosition.w);
        } 

        // float interpolateByDistance(vec4 nearFarScalar, float distance) 
        // { 
        //     float startDistance = nearFarScalar.x; 
        //     float startValue = nearFarScalar.y; 
        //     float endDistance = nearFarScalar.z; 
        //     float endValue = nearFarScalar.w; 
        //     float t = clamp((distance - startDistance) / (endDistance - startDistance), 0.0, 1.0); 
        //     return mix(startValue, endValue, t); 
        // }

        float interpolateByHeight(float height, float maxHeight)
        {
            float result = clamp ( height / maxHeight , 0.0, 1.0);
            return result;
        }

        float interpolateByDistance(vec4 nearFarScalar, float distance) 
        { 
            float startDistance = nearFarScalar.x; 
            float startValue = nearFarScalar.y; 
            float endDistance = nearFarScalar.z; 
            float endValue = nearFarScalar.w; 
            // float t = abs((distance - startDistance) / (endDistance - startDistance));
            float t = clamp((distance - startDistance) / (endDistance - startDistance), 0.0, 1.2);
            return t; 
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
        uniform float speed; 
        // uniform float czm_frameNumber;
        in vec2 v_textureCoordinates; 
        void main(void) 
        { 
            vec2 noiseCoord = v_textureCoordinates * 0.05;
      
            vec4 noise = texture(noiseTexture, vec2(fract((noiseCoord.x - speed * czm_frameNumber * 0.0001)),noiseCoord.y)) ;
            float noiseFloat = ((noise.r + noise.g + noise.b) / 3.0) - 0.5 ;
            // float distance = getDistance(depthTexture, v_textureCoordinates);
            vec2 distance = getDistance(depthTexture, v_textureCoordinates); 
            vec4 sceneColor = texture(colorTexture, v_textureCoordinates); 
            float blendAmount = interpolateByDistance(fogByDistance, distance.x); 
            // float heightBlendAmount = interpolateByDistance(distance.y, 100.0);
            float heightBlendAmount = clamp(distance.y / 100000.0, 0.0, 1.0);
            float aphaValue = clamp(fogColor.a * (blendAmount - noiseFloat * 0.2 * blendAmount), 0.0, 1.0);

            vec4 finalFogColor = vec4(fogColor.rgb, aphaValue );
    
        // vec4 mixColor = mix( noise , finalFogColor, 0.95) ;
            out_FragColor = alphaBlend(finalFogColor, sceneColor);

        }
        `;
        
        // this.viewer.scene.postProcessStages.add(
        //     new Cesium.PostProcessStage({
        //       fragmentShader: fragmentShaderSource,
        //       uniforms: {
        //         noiseTexture: '/noise.jpg',
        //         fogByDistance: new Cesium.Cartesian4(1, 0.0, 1000, 1.0),
        //         fogColor: Cesium.Color.WHITE,
        //         speed:1
        //         },
        //     })
        //   );

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