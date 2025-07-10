import { UserBriefData, UserData } from '@/api/protocol';
import { fetchUserInfoByNames, userinfo } from '@/api/sys/user';

interface CacheEntity {
  resolved: boolean;
  finish: boolean;
  data: Promise<UserData>;
}
interface DelayEntity {
  resolve: (data: UserBriefData) => void;
  reject: (err: Error) => void;
  name: string;
}
class UserManager {
  idCache: Record<string, CacheEntity | undefined> = {};
  userId: Record<number, CacheEntity | null> = {};
  nameCache: Record<string, UserBriefData | undefined> = {};

  /**
   * 查询用户信息
   * @param userId 用户id
   * @param refresh 是否需要刷新数据
   */
  query(userId: string, refresh = false) {
    const user = this.idCache[userId];
    if (refresh) {
      if (user && !user.finish) {
        // 如果创建了但是还没返回数据，就复用
        return user.data;
      } else {
        // 如果没有创建，或者已经决议，则重新发起
      }
    } else {
      if (user && user.resolved) {
        // 如果有缓存且成功了，则直接使用缓存
        return user.data;
      } else {
        // 如果没有缓存，则使用下面的缓存
      }
    }
    const data = userinfo(userId).then((resp) => {
      if (resp?.data) {
        return resp?.data;
      }
      return Promise.reject(new Error('not find'));
    });
    const entity: CacheEntity = { data, resolved: false, finish: false };
    this.idCache[userId] = entity;
    data
      .then((user) => {
        user.imUserId = (user.imUserId || user.username)?.toLowerCase();
        entity.resolved = true;
        this.nameCache[user.username.toLowerCase()] = user;
      })
      .finally(() => (entity.finish = true));
    return data;
  }
  queryList(userIds: string[], refresh = false) {}

  async queryByName(userName: string) {
    userName = userName.toLocaleLowerCase();
    if (this.nameCache[userName]) {
      return this.nameCache[userName];
    }
    return fetchUserInfoByNames([userName]).then((resp) => {
      if (resp) {
        resp.data.data.forEach((user) => {
          user.imUserId = (user.imUserId || user.username)?.toLowerCase();
          this.nameCache[user.username?.toLowerCase()] = user;
        });
      }
      return this.nameCache[userName];
    });
  }

  getBriefByName(name: string) {
    return this.nameCache[name.toLowerCase()];
  }

  async queryByNames(userNames: string[]) {
    userNames = userNames.map((name) => name.toLowerCase());
    const waits = userNames.filter((name) => !this.nameCache[name]);
    if (waits.length < 1) {
      return userNames.map((name) => this.nameCache[name]);
    }
    return fetchUserInfoByNames(waits).then((resp) => {
      if (resp) {
        resp.data.forEach((user) => {
          user.imUserId = (user.imUserId || user.username)?.toLowerCase();
          this.nameCache[user.username?.toLowerCase()] = user;
        });
        const ret = userNames.map((name) => this.nameCache[name]);
        return ret;
      } else {
        return [];
      }
    });
  }

  private delayQueue: DelayEntity[] = [];
  private delayTimer: NodeJS.Timeout | number = 0;
  /**
   * 延迟1秒，批量请求
   * @param name 名字
   * @returns
   */
  async queryByNameDelay(name: string) {
    name = name.toLowerCase();
    const user = this.nameCache[name];
    if (user) {
      return user;
    }
    const ret = new Promise<UserBriefData>((resolve, reject) => {
      this.delayQueue.push({ resolve, reject, name });
    });
    if (!this.delayTimer) {
      this.delayTimer = setTimeout(this.delayBatchQuery, 100);
    }
    return ret;
  }
  delayBatchQuery = () => {
    this.delayTimer = 0;
    const list = this.delayQueue;
    console.log("delay query", list);
    
    this.delayQueue = [];
    this.queryByNames(list.map((item) => item.name)).then((users) => {
      console.log("delay query result", users);
      
      users.forEach((user, index) => {
        if (user) {
          console.log('delayBatchQuery', user);
          
          list[index].resolve(user);
        } else {
          list[index].reject(new Error('not find'));
        }
      });
    });
  };
}

const userManager = new UserManager();
export default userManager;
