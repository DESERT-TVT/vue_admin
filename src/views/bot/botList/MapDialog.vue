<template>
  <div>
    <!-- 地图弹窗 -->
    <el-dialog
        title="高德地图"
        v-model="visible"
        width="60%"
        @opened="loadMap"
    >
      <div id="map-container" class="map"></div>
      <div class="input-card">
        <h4>点击地图获取经纬度：</h4>
        <div class="input-item">
          <el-input v-model="coordinates" readonly></el-input>
        </div>
      </div>
      <template #footer>
        <el-button @click="confirm">确认</el-button>
        <el-button @click="closeDialog">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";

// 控制弹窗的显示与隐藏
const visible = ref(false);
// 存储点击地图的经纬度
const coordinates = ref("");
// 地图实例
let map: AMap.Map | null = null;

// 打开弹窗
const openDialog = () => {
  visible.value = true;

};

// 关闭弹窗
const closeDialog = () => {
  visible.value = false;
};
const emit = defineEmits(["close"]);
const confirm = () => {
  emit("close", coordinates.value.replace(/\s+/g, ""));
  visible.value = false;
};


// 加载地图
const loadMap = async () => {
  if (!map) {
    try {
      const AMap = await AMapLoader.load({
        key: "78e8ffa64b153486f40ac4d4539cef93", // 替换为你的高德地图 API Key
        version: "2.0", // 高德地图版本
      });

      // 初始化地图
      map = new AMap.Map("map-container", {
        zoom: 11, // 缩放级别
        center: [116.397428, 39.90923], // 北京坐标为默认中心点
      });

      // 添加点击事件
      map.on("click", (e: AMap.MapsEvent) => {
        coordinates.value = `${e.lnglat.getLng()}, ${e.lnglat.getLat()}`;
      });
    } catch (error) {
      console.error("加载高德地图失败", error);
    }
  }
};
defineExpose({openDialog})
</script>

<style scoped>
.map {
  height: 400px; /* 地图高度 */
  width: 100%;
}
.input-card {
  margin-top: 10px;
}
.input-item {
  margin-top: 10px;
}
</style>
