<template>
  <!-- <div style="width: 100%;height:100%">
    <TestMap/>
  </div> -->
  <!-- <canvas id="canvas" style="width: 300px;height:300px">

  </canvas> -->
  <div id="cesiumContainer">

  </div>
</template>

<script lang='ts' setup>
import * as Cesium from 'cesium'
import { initViewer } from '../class/CesiumController'
import { onMounted } from 'vue';
import { cesiumController } from '../bean/bean';
import { initBean } from '../bean/bean'
import {dom,ion} from '../config/index'
import TestMap from '../TEST/index.vue'
Cesium.Ion.defaultAccessToken = ion
onMounted(() => {

  initViewer()
  initBean()
  cesiumController.loadMap()
  cesiumController.initPostProcessing()
  // cesiumController.initRain()

})


</script>

<style scoped>
#cesiumContainer {
  width: 100vw;
  height: 100vh;
}
</style>
