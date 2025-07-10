<template>
	<div>
		<van-list>
			<van-cell v-for="item in dataList" :key="item.id" @click="selectUser(item.user?.userId)">
				<component :is="config.conversationRender" :data="item" />
			</van-cell>
			<!--  -->
			<div class="default" v-if="dataList?.length == 0">
				<img :src="noDataImg" alt="" />
				<span>{{ '暂无数据' }}</span>
			</div>
		</van-list>
	</div>
</template>

<script lang="ts" setup>
import noDataImg from '@/im-sdk/assets/noData.svg'
import { onMounted } from 'vue'
import config from '../config'
import ImDataCenter from '../ImDataCenter'
import userManager from '@/manager/user'
const emit = defineEmits(['selectedUser'])
const dataList = ImDataCenter.conversations
console.log(dataList, 'dataList')
function selectUser(user?: string) {
  console.log(user, 'user');
  
	if (user) {
		userManager.query(user).then(userId => {
			emit('selectedUser', userId.imUserId)
		})
	}
}

// onMounted(config.onLoadConversationView);
</script>

<style lang="scss" scoped>
.message-list {
	height: 100%;
	display: flex;
	flex-direction: column;

	.message-list-content {
		flex: 1;
		background-color: #fff;
		padding-bottom: 64px;
		display: flex;
		flex-direction: column;
		overflow-y: auto;

		:deep(.van-pull-refresh) {
			flex: 1;
			overflow-y: auto;
		}

		:deep(.van-cell) {
			padding: 10px 20px;

			&::after {
				left: 82px;
			}
		}
	}
}

:deep(.van-cell:after) {
	border: none;
}

/* 占位图 */
.default {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
</style>
