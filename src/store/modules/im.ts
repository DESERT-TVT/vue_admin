import { defineStore } from 'pinia'
import { useAccountLoginApi, useMobileLoginApi, useThirdLoginApi } from '@/api/auth'
import { useUserInfoApi } from '@/api/sys/user'
import cache from '@/utils/cache'
import { useAuthorityListApi } from '@/api/sys/menu'
import { set } from 'nprogress'

export const useImStore = defineStore('ImStore', {
  state: () => ({
    // imAppKey 
    imAppKey: '',
    // imRef
    imRef: [],
  }),
  actions: {
    setAppKey(val: string) {
      this.imAppKey = val
    },
  }
})
