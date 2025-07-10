export const generateMenu = (custodyData: Array<any>) => {
	let menuList = 
		{
			meta: {
				title: '用户管理',
				id: 10001,
				icon: 'icon-editor',
				cache: true
			},
			name: 'P100',
			path: '/p/100',
			children: [] as Array<{
				path: string;
				name: string;
				component: () => Promise<any>;
				children: Array<any>;
				meta: {
					title: string;
					icon: string;
					id: number;
					url: string;
					cache: boolean;
					newOpen: boolean;
					breadcrumb: Array<any>;
				};
			}>
		}
	
  custodyData.forEach((child: any) => {
			menuList.children.push({
        path: `/imUser/index/:${child.userId}`,
        name: 'ImUserIndex',
          component: () => import("@/views/imUser/index.vue"),
					children: [],
					meta: {
						title: '子用户' + child.userId,
						icon: 'icon-editor',
						id: child.userId,
						url: 'imUser/index',
						cache: true,
						newOpen: false,
						breadcrumb: []
					}
      })
  })
	return menuList
}
