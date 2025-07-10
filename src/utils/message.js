/*
 * @Name: Desert
 * @Date: 2025-02-19 18:04:04
 * @Creator: gods
 * @Description: you're the better!!
 */
import { showToast } from "vant";
import successUrl from "@/assets/svg/successIcon.svg";
import failUrl from "@/assets/svg/failIcon.svg";
const formatMessage = msg => {
  // 如果 msg 是一个 Error 对象，返回其 message 属性，否则直接返回 msg
  return msg instanceof Error ? msg.message : msg;
};

const message = {
  error: msg => {
    showToast({
      message: formatMessage(msg),
      icon: failUrl,
    });
  },
  success: msg => {
    showToast({
      message: formatMessage(msg),
      icon: successUrl,
    });
  },
  warning: msg => {
    showToast(formatMessage(msg));
  }
};

export default message;
