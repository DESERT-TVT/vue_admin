<template>
  <div class="last_style">
    <!-- <img :src="BackImg" class="left" @click="$router.go(-1)" /> -->
    <div class="inform_box">
      <!-- <UserHead class="box_avatar" :img="conversation.user?.avatar" />
      <div class="nickname">{{ conversation.user?.name }}</div> -->
    </div>
    <!-- <div class="right">
      <van-popover
        v-model:show="showMore"
        :actions="actions"
        placement="bottom-end"
        style="--van-popover-action-width: 100%"
        @select="handleSelect"
      >
        <template #reference>
          <div class="more">
            <img :src="moreUrl" alt="" />
          </div>
        </template>
      </van-popover>
    </div> -->
  </div>
</template>

<script lang="ts" setup>
import BackImg from '@/im-sdk/assets/backImg.svg';
import { PopoverAction } from 'vant';
import moreUrl from '@/im-sdk/assets/More.svg';
import remarkImg from '@/im-sdk/assets/remark.svg';
import reportImg from '@/im-sdk/assets/report.svg';
import blockImg from '@/im-sdk/assets/blockImg.svg';
import { ref } from 'vue';
import ImDataCenter from '@/im-sdk/ImDataCenter';
import { useRoute } from 'vue-router';
const route = useRoute();
// 对方信息
const controller = ImDataCenter.getConversation(String(route.query.id), true);
const conversation = controller!.conversation;

// 更多操作
const showMore = ref(false);

// 弹出层
const actions = ref([

]);
const handleSelect = (action: PopoverAction) => {
  console.log(action.type);
  switch (action.type) {
    case 'remark':
      // memoName.value = userData.value?.nickname || '';
      showRemark.value = true;
      break;
    case 'report':
      // 跳转匿名举报
      // report();
      break;
    case 'block':
      // 跳转拉黑
      // showBlack.value = true;
      break;
  }
};

// 设置备注
const showRemark = ref(false);
const memoName = ref('');
</script>

<style lang="scss" scoped>
.last_style {
  width: 100%;
  height: 68px;
  padding: 0 16px;
  background-color: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 4px;
  .left {
    width: 24px;
    height: 24px;
  }
  .inform_box {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 8px;
    .box_avatar {
      width: 34px;
      height: 34px;
    }
    .nickname {
      font-weight: 600;
      font-size: 16px;
      color: #000000;
    }
  }
  .right {
    width: 20px;
    height: 20px;
  }
}
</style>
