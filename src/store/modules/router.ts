import { defineStore } from 'pinia'
import { useMenuCustodyInfo, useMenuNavApi } from '@/api/sys/menu'
import { constantMenu, dashboardMenu, generateRoutes } from '@/router'
import { RouteRecordRaw } from 'vue-router'
import constant from '@/utils/constant'
import { useUserStore } from './user'
export const useRouterStore = defineStore('routerStore', {
	state: () => ({
		menuRoutes: [] as RouteRecordRaw[],
		searchMenu: [] as RouteRecordRaw[],
		routes: [] as RouteRecordRaw[]
	}),
	actions: {
		async getMenuRoutes() {
			const { data } = await useMenuNavApi()
			const routes = generateRoutes(data)

			// 控制台菜单
			const dashboardRoutes = generateRoutes(dashboardMenu)
			this.menuRoutes.push(...dashboardRoutes)

			// 后端菜单
			this.menuRoutes.push(...routes)

			// 常量菜单
			if (constant.env.DEV) {
				const constantRoutes = generateRoutes(constantMenu)
				this.menuRoutes.push(...constantRoutes)
			}

			return this.menuRoutes
		},
		setSearchMenu(routers: RouteRecordRaw[]) {
			this.searchMenu = routers
		},
		setRoutes(routers: RouteRecordRaw[]) {
			this.routes = routers
		}
	}
})
