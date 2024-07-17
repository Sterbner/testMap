<script setup>
import ParticlesRendering from './render.js'
import * as Cesium from 'cesium';
import {onMounted} from "vue";

onMounted(async () => {
  Cesium.Ion.defaultAccessToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwZWFkMmZlNC03ZTQ3LTQxY2MtYjZlMy1mY2Y0NDI3YzYwMDUiLCJpZCI6NjIwMTIsImlhdCI6MTYyNjY2MTMxNH0.7FhqtggR5gFfLX0joCeZIcxw4QHz_q3Wej7YA25y2BE";

  const viewer = new Cesium.Viewer('map', {
    animation: false, //是否显示动画控件，左下角仪表
    baseLayerPicker: false, //是否显示图层选择控件,是否显示geocoder小器件，右上角查询按钮
    geocoder: false, //是否显示地名查找控件
    // timeline: false, //是否显示时间线控件
    sceneModePicker: false, //是否显示投影方式控件,//是否显示3D/2D选择器
    navigationHelpButton: false, //是否显示帮助信息控件
    infoBox: false, //是否显示点击要素之后显示的信息
    fullscreenButton: false, //是否显示全屏按钮
    selectionIndicator: false, //是否显示选中指示框
    homeButton: false, //是否显示Home按钮
    contextOptions: {
      requestWebgl2: true
    },
    // terrainProvider: new Cesium.ArcGISTiledElevationTerrainProvider({
    //   url: "https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer",
    // }),
  })

  // viewer.terrainProvider = Cesium.createWorldTerrain({
  //   requestWaterMask: true,
  //   requestVertexNormals: true,
  // });

  const dim = new Cesium.Cartesian3(5,5,5);

  const entity = viewer.entities.add({

    name: "Yellow box outline",

    position: Cesium.Cartesian3.fromDegrees(109.1, 21.785, 0.0),

    box: {

      dimensions: dim,

      fill: false,

      outline: true,

      outlineColor: Cesium.Color.YELLOW,

    },

  });

  const scene = viewer.scene

  const context = viewer.scene.context

  viewer.flyTo(entity)

  const primivites = new ParticlesRendering(context, [], {}, {})

  // 原文链接： https://www.shadertoy.com/view/7tSSDD

  scene.primitives.add(primivites.primitives.bufferA);
  scene.primitives.add(primivites.primitives.bufferB);
  scene.primitives.add(primivites.primitives.bufferC);
  scene.primitives.add(primivites.primitives.bufferD);

  scene.primitives.add(primivites.primitives.main);

})
</script>

<template>
  <div id="map"></div>
</template>

<style scoped>
#map {
  height: 100%;
  width: 100%;
  position: relative;
}
</style>
