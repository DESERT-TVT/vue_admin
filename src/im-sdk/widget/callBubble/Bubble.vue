<template>
  <Teleport to="body">
    <div class="bubble">
      <div class="content">
        <div class="top">
          <CacheImg :src="targetUser?.avatar" class="avatar" />
          <div class="user">
            <div class="name_balance">
              <div class="name">
                {{ targetUser?.nickname }}
              </div>
              <div class="balance" v-if="!targetUser?.online">
                <img :src="GoldImg" alt="img" />
                <span>{{ $t('call.balance') + targetUser?.goldCoins }}</span>
              </div>
            </div>
            <div class="info">
              {{
                callState.type === 'video'
                  ? $t('call.invitedTypeVideo')
                  : $t('call.invitedTypeVoice')
              }}
            </div>
          </div>
        </div>
        <div class="content_btn">
          <div class="price">
            {{
              (targetUser?.online ? $t('call.consume') : $t('call.earn')) +
              targetUser?.voiceChatPrice +
              $t('call.gold/min')
            }}
          </div>
          <div class="btns">
            <div class="btn btn_refuse" @click="handleReject">
              <img :src="refuseImg" />
            </div>
            <div class="btn btn_accept" @click="handleAccept">
              <img
                :src="callState.type === 'video' ? acceptVideoImg : acceptImg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import acceptImg from '@/im-sdk/assets/accept.svg';
import acceptVideoImg from '@/im-sdk/assets/acceptVideo.svg';
import GoldImg from '@/im-sdk/assets/gold.svg';
import refuseImg from '@/im-sdk/assets/refuse.svg';
import callDataCenter from '@/im-sdk/callDataCenter';
import CacheImg from '@/im-sdk/components/CacheImg.vue';
import { getCurrentInstance, onMounted, ref, watch } from 'vue';
import { Enhance, UserDetail } from './type';
const callState = callDataCenter.data;

function handleAccept() {
  callDataCenter.accept();
}

function handleReject() {
  callDataCenter.refuse();
}

// 用户消息
const targetUser = ref<UserDetail>();
const instance = getCurrentInstance();

watch(() => callState.target, loadUserDetail, {
  immediate: true,
});
async function loadUserDetail() {
  const target = callDataCenter.data.target;
  if (!target) return;
  if (instance) {
    const Comp = instance.type as typeof instance.type & Enhance;
    const res = await Comp.getUserDetail?.(target);
    targetUser.value = res;
  }
}
onMounted(loadUserDetail);
</script>
<style lang="scss" scoped>
.bubble {
  position: fixed;
  top: .1rem;
  width: 100%;
  z-index: 9999;
  padding: 0 0.12rem;
  .content {
    width: 100%;
    background: rgba(0, 0, 0, 0.7);
    border-radius: 0.16rem;
    backdrop-filter: blur(150px); /* 关键：模糊背景 */
    -webkit-backdrop-filter: blur(150px); /* Safari 支持 */
    padding: 0.12rem;
    .top {
      display: flex;
      gap: 0.08rem;
      .avatar {
        width: 0.44rem;
        height: 0.44rem;
        border-radius: 50%;
      }
      .user {
        flex: 1;
        .name_balance {
          display: flex;
          align-items: center;
          justify-content: space-between;
          .name {
            font-weight: 500;
            font-size: 0.14rem;
            color: #ffffff;
          }
          .balance {
            display: flex;
            align-items: center;
            font-weight: 500;
            font-size: 0.12rem;
            color: #ebebeb;
            line-height: 0.18rem;
            gap: 0.04rem;
          }
        }
        .info {
          font-weight: 400;
          font-size: 0.12rem;
          color: #b1b1b1;
        }
      }
    }
    .content_btn {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 0.15rem;
      .price {
        font-weight: 500;
        font-size: 0.14rem;
        color: #ebebeb;
        line-height: 0.2rem;
        margin-left: 0.05rem;
      }
      .btns {
        display: flex;
        gap: 0.08rem;
        .btn {
          width: 0.72rem;
          height: 0.38rem;
          border-radius: 0.46rem;
          display: flex;
          justify-content: center;
        }
        .btn_refuse {
          background: #f44649;
        }
        .btn_accept {
          background: #0fc86c;
        }
      }
    }
  }
}
</style>
