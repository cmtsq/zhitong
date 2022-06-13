<template>
  <div id="app">
      <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'app',
}
</script>

<style>
/*滚动条的宽度*/
    ::-webkit-scrollbar {
        width:5px;
        height:5px;
    }
/*外层轨道。可以用display:none让其不显示，也可以添加背景图片，颜色改变显示效果*/
    ::-webkit-scrollbar-track {
        background-color: rgba(0,0,0,0.1);
        border-radius:2em;
    }
/*滚动条的设置*/
    ::-webkit-scrollbar-thumb {
        cursor: pointer;
        border-radius:2em;
		background-color: rgba(0,0,0,0.25);
		transition: color .2s ease;
    }
</style>
