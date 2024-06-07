<template>
    <div ref="dragContainer" class="drag-container" style="left: 0px; top: 100px;">
      <div class="drag-header" @mousedown="startDrag">
        拖拽我
      </div>
      <div class="content">
        这里是内容...
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const dragContainer = ref(null);
  const pos = ref({ x: 0, y: 0 });
  const offset = ref({ x: 0, y: 0 });
  
  const startDrag = (event) => {
    // 初始化鼠标相对于元素的位置
    offset.value = {
      x: event.clientX - pos.value.x,
      y: event.clientY - pos.value.y,
    };
  
    document.addEventListener('mousemove', doDrag);
    document.addEventListener('mouseup', stopDrag);
  };
  
  const doDrag = (event) => {
    // 新的位置计算
    let newX = event.clientX - offset.value.x;
    let newY = event.clientY - offset.value.y;
  
    // 获取视口尺寸
    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = document.documentElement.clientHeight;
  
    // 确保元素不会移出视口
    const rect = dragContainer.value.getBoundingClientRect();
    console.log(rect,'rect');
    if (newX < 0) newX = 0;
    if (newY < 0) newY = 0;
    if (newX + rect.width > viewportWidth) newX = viewportWidth - rect.width;
    if (newY + rect.height > viewportHeight -600) newY = viewportHeight - rect.height;
  
    pos.value.x = newX;
    pos.value.y = newY;
    dragContainer.value.style.transform = `translate(${newX}px, ${newY}px)`;
  };
  
  const stopDrag = () => {
    document.removeEventListener('mousemove', doDrag);
    document.removeEventListener('mouseup', stopDrag);
  };
  </script>
  
  <style scoped>
  .drag-container {
    width: 200px;
    height: 100px;
    position: absolute;
    cursor: move;
    border: 1px solid #ccc;
    background-color: #fff;
  }
  
  .drag-header {
    background-color: #eee;
    padding: 10px;
    cursor: grab;
  }
  
  .content {
    padding: 10px;
  }
  </style>