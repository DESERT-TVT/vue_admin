<template>
  <div class="message-list-item">
    <!-- 头像 -->
    <div class="item-avatar">
      <CacheImg :src="data.user?.avatar" class="item-avatar"></CacheImg>
      <span v-if="data.isPinned" class="isOnline"></span>
    </div>
    <!-- 内容 -->
    <div class="item-content">
      <!-- 用户信息 -->
      <div class="item-title">
        <div class="item-title-name">
          <div class="item-title-nickname">
            {{ data.user?.name }}
          </div>
          <!-- 未读 -->
          <div class="item-title-unread" v-if="data.unReadCount">
            {{ data.unReadCount }}
          </div>
        </div>

        <div class="item-brief-time">
          {{ renderTimeToYear(data.time) }}
        </div>
      </div>
      <!-- 消息内容 -->
      <div class="item-brief">
        <div class="item-brief-text">{{ data.last?.brief }}</div>
        <!-- <span class="item-title-price" v-if="item.userData?.textChatPrice != 0">
          <span class="daostrip">{{ item.userData?.textChatPrice }}</span>
          <span class="daostrip-text">{{
            $t('message.messagelist.daostrip')
          }}</span>
        </span> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { renderTimeToYear } from '@/im-sdk/utils/timestamp';
import { ConversationData } from '../types';
import CacheImg from '@/im-sdk/components/CacheImg.vue';
const { data } = defineProps<{
  data: ConversationData;
}>();

</script>

<style lang="scss" scoped>
.message-list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: left;

  .item-avatar {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    overflow: hidden;
    position: relative;

    .isOnline {
      position: absolute;
      bottom: 2px;
      right: 2px;
      width: 10px;
      height: 10px;
      background-color: #0ce1c1;
      border: 1px solid #ffffff;
      border-radius: 50%;
    }
  }

  .item-content {
    flex: 1;
    height: 48px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    margin-left: 10px;

    .item-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .item-brief-time {
        font-size: 12px;
        line-height: 18px;
        color: #999999;
      }

      .item-title-name {
        display: flex;
        align-items: center;
        font-size: 16px;
        line-height: 25px;
        font-weight: 600;
        color: #1d1b20;

        .item-title-nickname {
          max-width: 167px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .item-title-unread {
          font-size: 12px;
          line-height: 12px;
          color: #ffffff;
          font-weight: 600;
          background-color: #fb3344;
          border-radius: 20px;
          padding: 2px 6px;
          margin-left: 6px;
        }
      }
    }

    .item-brief {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .item-brief-text {
        display: inline-block;
        align-items: center;
        line-height: 20px;
        font-size: 14px;
        max-width: 181px;
        color: #999999;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .item-title-price {
        height: 20px;
        line-height: 20px;
        color: #1d1b20;
        margin-left: auto;
        font-weight: 600;
        font-size: 12px;
        color: #666666;
      }
    }
  }
}
</style>
