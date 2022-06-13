<template>
	<aside class="site-sidebar site-sidebar--dark">
		<div class="site-sidebar__inner">
			<el-menu :default-active="this.$route.name" :collapse="sidebarFold" :collapseTransition="false"
				:unique-opened="true" class="site-sidebar__menu" :router="true">
				<el-submenu :index="item.menuActive" v-for="(item,index) in slideBar" :key="index">
					<template slot="title">
						<i :class="item.icons"></i>
						<span>{{item.name}}</span>
					</template>
					<el-menu-item v-for="(val,i) in item.submenu" :key="i" :index="val.pathname"
						@click="routerPush(val)">
						<i :class="val.icon"></i>
						<span slot="title">{{val.name}}</span>
					</el-menu-item>
				</el-submenu>
			</el-menu>
		</div>
	</aside>
</template>

<script>
	export default {
		name: 'slideBar',
		data() {
			return {
				slideBar: [],
			}
		},
		created() {
			// 初始化数据
			this.slideBar = this.$conf.slideBar.list
		},
		computed: {
			sidebarFold: {
				get() {
					return this.$store.state.common.sidebarFold
				}
			},
		},
		methods: {
			//路由跳转
			routerPush(val) {
				// console.log(val)
				this.$router.push({
					name: val.pathname
				})
			}
		}
	}
</script>

<style scoped>
	.el-menu-item.is-active {
		color: #fff !important;
		background-color: #6bbab396 !important;
	}
</style>
