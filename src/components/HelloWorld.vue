<!--  -->
<template>
  <div style="width: 100%;height:100%">
    <TestMap/>
  </div>
  <!-- <canvas id="canvas" style="width: 300px;height:300px">

  </canvas>
  <div id="cesiumContainer">

  </div> -->
</template>

<script lang='ts' setup>
import * as Cesium from 'cesium'
// import { initViewer } from '../class/CesiumController'
import { onMounted } from 'vue';
// import { cesiumController } from '../bean/bean';
// import { initBean } from '../bean/bean'
import {dom,ion} from '../config/index'
import TestMap from '../TEST/index.vue'
Cesium.Ion.defaultAccessToken = ion
// onMounted(() => {

//   // initViewer()
//   // initBean()
//   // cesiumController.loadMap()
//   // cesiumController.initPostProcessing()
//   // cesiumController.initRain()


//   var viewer = new Cesium.Viewer(dom,{
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
//     let framebuffer: any
//     function createResources(context: any) {
//       console.log(context,'context');
//       var width = context.drawingBufferWidth;
//       var height = context.drawingBufferHeight;
//       framebuffer = new Cesium.Framebuffer({
//         context: context,
//         colorTextures: [
//           new Cesium.Texture({
//             context: context,
//             width: width,
//             height: height,
//             pixelFormat: Cesium.PixelFormat.RGBA,
//           }),
//         ],
//         depthTexture: new Cesium.Texture({
//           context: context,
//           width: width,
//           height: height,
//           pixelFormat: Cesium.PixelFormat.DEPTH_COMPONENT,
//           pixelDatatype: Cesium.PixelDatatype.UNSIGNED_SHORT,
//         }),
//       });
//     }


//     function update(frameState) {

//       let scene = viewer.scene;

//       var frameState = scene._frameState;

//       var context = scene.context;
//       var us = context.uniformState;

//       var view = scene._defaultView;
//       scene._view = view;

//       scene.updateFrameState();
//       frameState.passes.render = true;
//       frameState.passes.postProcess = scene.postProcessStages.hasSelected;

//       scene.fog.update(frameState);

//       us.update(frameState);

//       var shadowMap = scene.shadowMap;
//       if (Cesium.defined(shadowMap) && shadowMap.enabled) {

//         frameState.shadowMaps.push(shadowMap);
//       }

//       scene._computeCommandList.length = 0;
//       scene._overlayCommandList.length = 0;

//       var viewport = view.viewport;
//       viewport.x = 0;
//       viewport.y = 0;
//       viewport.width = context.drawingBufferWidth;
//       viewport.height = context.drawingBufferHeight;

//       var passState = view.passState;
//       // passState.framebuffer = undefined;
//       passState.framebuffer = framebuffer;
//       passState.blendingEnabled = undefined;
//       passState.scissorTest = undefined;

//       passState.viewport = Cesium.BoundingRectangle.clone(viewport, passState.viewport);

//       // var primitives = viewer.scene.primitives;
//       // primitives.update(frameState);
//       if (Cesium.defined(scene.globe)) {
//         scene.globe.beginFrame(frameState);
//       }

//       scene.updateEnvironment();
//       // // console.log(width,height)
//       scene.updateAndExecuteCommands(passState, scene.backgroundColor);
//       var commands = frameState.commandList;
//       var length = commands.length;

//       scene.resolveFramebuffers(passState);

//       if (Cesium.defined(scene.globe)) {
//         scene.globe.endFrame(frameState);

//         if (!scene.globe.tilesLoaded) {
//           scene._renderRequested = true;
//         }
//       }
//       context.endFrame();
//     }


//     setTimeout(() => {
//       createResources(viewer.scene.context);
//       viewer.scene.preRender.addEventListener((scene, time) => {
//         update(viewer.scene.frameState);
//         var cavs = document.getElementById("canvas");
//         let width = viewer.scene.context.drawingBufferWidth;
//         let height = viewer.scene.context.drawingBufferHeight;
//         cavs.width = width;
//         cavs.height = height;
//         var pixels = viewer.scene.context.readPixels({
//           x: 0,
//           y: 0,
//           width: width,
//           height: height,
//           framebuffer: framebuffer,
//         });
//         var ctx = cavs.getContext("2d");
//         let imgData = new ImageData(new Uint8ClampedArray(pixels), width, height);
//         ctx.putImageData(imgData, 0, 0, 0, 0, width, height)
//         console.log(framebuffer,'framebuffer');
//       });
//     }, 2000)
// })


// // var viewer = new Cesium.Viewer(dom,{
// //         timeline: false,//是否显示时间轴
// //         animation: false,//是否创建动画小控件，左下角仪表
// //         sceneModePicker: false,//是否显示2D，3D选择器
// //         baseLayerPicker: false,//是否显示图层选择器
// //         navigationHelpButton: false,//是否显示右上角的帮助按钮
// //         homeButton: false,//是否显示Home按钮
// //         geocoder: false,//是否显示geocoder小器件，右上角查询按钮
// //         fullscreenButton: true,//是否显示全屏按钮
// //         infoBox: false,//选中实体时所显示的信息框
// //         //实现对高程的加载，展现出3D图像
// //     })
// //     let framebuffer: any
// //     function createResources(context) {
// //       var width = context.drawingBufferWidth;
// //       var height = context.drawingBufferHeight;
// //       framebuffer = new Cesium.Framebuffer({
// //         context: context,
// //         colorTextures: [
// //           new Cesium.Texture({
// //             context: context,
// //             width: width,
// //             height: height,
// //             pixelFormat: Cesium.PixelFormat.RGBA,
// //           }),
// //         ],
// //         depthTexture: new Cesium.Texture({
// //           context: context,
// //           width: width,
// //           height: height,
// //           pixelFormat: Cesium.PixelFormat.DEPTH_COMPONENT,
// //           pixelDatatype: Cesium.PixelDatatype.UNSIGNED_SHORT,
// //         }),
// //       });
// //     }


// //     function update(frameState) {

// //       let scene = viewer.scene;

// //       var frameState = scene._frameState;

// //       var context = scene.context;
// //       var us = context.uniformState;

// //       var view = scene._defaultView;
// //       scene._view = view;

// //       scene.updateFrameState();
// //       frameState.passes.render = true;
// //       frameState.passes.postProcess = scene.postProcessStages.hasSelected;

// //       scene.fog.update(frameState);

// //       us.update(frameState);

// //       var shadowMap = scene.shadowMap;
// //       if (Cesium.defined(shadowMap) && shadowMap.enabled) {

// //         frameState.shadowMaps.push(shadowMap);
// //       }

// //       scene._computeCommandList.length = 0;
// //       scene._overlayCommandList.length = 0;

// //       var viewport = view.viewport;
// //       viewport.x = 0;
// //       viewport.y = 0;
// //       viewport.width = context.drawingBufferWidth;
// //       viewport.height = context.drawingBufferHeight;

// //       var passState = view.passState;
// //       // passState.framebuffer = undefined;
// //       passState.framebuffer = framebuffer;
// //       passState.blendingEnabled = undefined;
// //       passState.scissorTest = undefined;

// //       passState.viewport = Cesium.BoundingRectangle.clone(viewport, passState.viewport);

// //       // var primitives = viewer.scene.primitives;
// //       // primitives.update(frameState);
// //       if (Cesium.defined(scene.globe)) {
// //         scene.globe.beginFrame(frameState);
// //       }

// //       scene.updateEnvironment();
// //       // // console.log(width,height)
// //       scene.updateAndExecuteCommands(passState, scene.backgroundColor);
// //       var commands = frameState.commandList;
// //       var length = commands.length;

// //       scene.resolveFramebuffers(passState);

// //       if (Cesium.defined(scene.globe)) {
// //         scene.globe.endFrame(frameState);

// //         if (!scene.globe.tilesLoaded) {
// //           scene._renderRequested = true;
// //         }
// //       }
// //       context.endFrame();
// //     }


// //     setTimeout(() => {
// //       createResources(viewer.scene.context);
// //       viewer.scene.preRender.addEventListener((scene, time) => {
// //         update(viewer.scene.frameState);
// //         var cavs = document.getElementById("canvas");
// //         let width = viewer.scene.context.drawingBufferWidth;
// //         let height = viewer.scene.context.drawingBufferHeight;
// //         cavs.width = width;
// //         cavs.height = height;
// //         var pixels = viewer.scene.context.readPixels({
// //           x: 0,
// //           y: 0,
// //           width: width,
// //           height: height,
// //           framebuffer: framebuffer,
// //         });
// //         var ctx = cavs.getContext("2d");
// //         let imgData = new ImageData(new Uint8ClampedArray(pixels), width, height);
// //         ctx.putImageData(imgData, 0, 0, 0, 0, width, height)

// //       });
// //     }, 2000)

</script>

<style scoped>
#cesiumContainer {
  width: 100vw;
  height: 100vh;
}
</style>
