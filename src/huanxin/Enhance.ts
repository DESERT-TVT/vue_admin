import { userinfo } from '@/api/userinfo';
import dataCenter from '@/dataCenter';
import type { App, Component } from 'vue';
import type { Enhance, UserDetail } from '@/im-sdk/widget/callBubble/type';
import { ImUserData } from '@/im-sdk/types';

export function enhanceComponent<T extends Component>(Comp: T): T & Enhance {
  const Enhanced = Comp as T & Enhance;

  Enhanced.install = (app: App) => {
    app.component(Comp.name || 'AnonymousComp', Enhanced);
  };

  Enhanced.getUserDetail = async (user?: ImUserData) => {
    if (user) {
      const res = await userinfo(user?.imId);
      if (!res?.data.data) throw new Error('User not found');
      return res.data.data;
    }
    return dataCenter.user.value as UserDetail;
  };

  return Enhanced;
}
