import { getChargeInfo } from '@/api/IMchat/Charge';
import callDataCenter from '@/im-sdk/callDataCenter';
import config from '@/im-sdk/config';
import {
  ChatMenus,
  ConversationItemRender,
  MessageItemRender,
} from '@/im-sdk/config/default';
import ImDataCenter from '@/im-sdk/ImDataCenter';
import { CallState, ImUserData, MessageTempData } from '@/im-sdk/types';
import { generateBrief } from '@/im-sdk/utils/message';
import { $t } from '@/locales';
import router, { preloadPage } from '@/router';
import message from '@/utils/message';
import imAdapter from './Adapter';
import dataCenter from '@/dataCenter';
import Bubble from '@/im-sdk/widget/callBubble/Bubble.vue';
import AudioView from '@/im-sdk/widget/callBubble/AudioView.vue';
import VideoView from '@/im-sdk/widget/callBubble/VideoView.vue';
import { Enhance } from '@/im-sdk/widget/callBubble/type';
import userManager from '@/manager/user';
import { watch } from 'vue';
import CallEvent from './CallEvent';

/**支持从系统用户id跳转到聊天 */
export function chatWithUserId(userId: string) {
  userManager.query(userId).then((user) => {
    config.onChatWith?.(user.imUserId);
  });
}
export function initIm() {
  ImDataCenter.setAdapter(imAdapter);
  callDataCenter.setAdapter(imAdapter);

  config.conversationRender = ConversationItemRender;
  config.messageItemRender = MessageItemRender;

  config.chatMenus = ChatMenus;

  config.onChatWith = (user?: string) => {
    if (user) {
      router.push({
        name: 'ChatView',
        query: { id: user.toLocaleLowerCase() },
      });
    }
  };
  /**预加载聊天界面 */
  config.onLoadConversationView = () => {
    preloadPage('ChatView');
  };

  // 发消息前判断
  config.onBeforeSendMessage = async (messageTemp: MessageTempData) => {
    const controller = ImDataCenter.getConversation(messageTemp.message.target);
    const conversation = controller?.conversation;

    // 若无用户信息，默认允许发送（如系统会话等）
    const toUserId = conversation?.user?.userId;
    if (!toUserId) return true;

    // 当前登录用户 ID
    const fromUserId = ImDataCenter.data.mine?.userId;
    if (!fromUserId) {
      message.error($t('common.userInfoMissing'));
      return false;
    }

    // 不能自己给自己发送消息
    if (toUserId === fromUserId) {
      message.error($t('common.oneByOne'));
      return false;
    }

    // 获取消息简要内容
    const brief = generateBrief(messageTemp.message).brief;
    if (dataCenter.user.value?.online) return true;
    try {
      const res = await getChargeInfo({
        fromUser: Number(fromUserId),
        toUser: Number(toUserId),
        chatContent: brief,
      });

      if (res?.data?.code === 0) {
        messageTemp.message.ext = Object.assign(
          {},
          messageTemp.message.ext,
          res.data.data
        );
        return true;
      } else {
        return false;
      }
    } catch (error) {
      message.error($t('common.failSend'));
      return false;
    }
  };

  // 获取用户信息
  config.onViewUser = async (user?: ImUserData) => {
    router.push({
      path: '/mineinfo',
      query: {
        userId: user?.userId,
      },
    });
  };

  (Bubble as typeof Bubble & Enhance).getUserDetail = getUserDetail;
  (AudioView as typeof AudioView & Enhance).getUserDetail = getUserDetail;
  (VideoView as typeof VideoView & Enhance).getUserDetail = getUserDetail;

  watch(
    () => callDataCenter.data.state,
    (state) => {
      if (state === CallState.calling) {
        // TODO
      } else if (state === CallState.alerting) {
        // TODO
      } else if (state === CallState.talking) {
        if (callDataCenter.data.isCallOut) CallEvent.onHeartbeat();
      } else if (state === CallState.idle) {
        CallEvent.onFinished(
          callDataCenter.data.target?.imId!,
          callDataCenter.userId,
          callDataCenter.data.type
        );
      }
    }
  );
}

async function getUserDetail(user?: ImUserData) {
  if (!user) {
    return dataCenter.user.value;
  }
  return userManager.query(user.userId.toString());
}
