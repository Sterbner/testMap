<!--  -->
<template>
  <div id="cesiumContainer">

  </div>
</template>

<script lang='ts' setup>
import {initViewer} from '../class/CesiumController'
import { onMounted } from 'vue';
import { cesiumController } from '../bean/bean';
import {initBean} from '../bean/bean' 

onMounted(()=>{
  initViewer()
  initBean()
  cesiumController.loadMap()
})

</script>

<style scoped>

#cesiumContainer{
  width: 100vw;
  height: 100vh;
}

</style>
