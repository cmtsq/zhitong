<template>
	<div class="site-wrapper" :class="{ 'site-sidebar--fold': sidebarFold }">
		<navBar/>
		<slideBar/>
		<div class="site-content__wrapper" :style="{ 'min-height': documentClientHeight + 'px' }">
			<div id="tags-view-container" class="tags-view-container" v-show="visitedView.length>0&&this.$route.name!=='home'">
				<router-link v-for="i in visitedView" :key="i.path" class="tags-view-item"
					:class="isActive(i) ? 'active' : ''" :to="{ path: i.path, query: i.query }">
					{{ i.meta.title }}
					<span v-if="i.name != 'userdata'" @click.prevent.stop="closeSelectedTag(i)" class="el-icon-close"/>
				</router-link>
			</div>
			<main class="site-content">
				<el-breadcrumb separator-class="el-icon-arrow-right" v-if="bran.length>0">
					<el-breadcrumb-item v-for="(item,index) in bran" :key="index">{{item.title}}
					</el-breadcrumb-item>
				</el-breadcrumb>
				<el-card>
					<router-view></router-view>
				</el-card>
			</main>
		</div>
	</div>
</template>

<script>
	import navBar from '@/views/navBar'
	import slideBar from '@/views/slideBar'
	export default {
		data() {
			return {
				bran: [], //面包屑导航数据
				slideBar: [], //侧边栏数据
				documentClientHeight: 0,//页面可视高度(随窗口改变大小)
			}
		},
		components: {
			navBar,
			slideBar,
		},
		//初始化菜单
		created() {
			this.slideBar = this.$conf.slideBar.list
			this.refresh()
		},
		watch: {
			//监听路由变化，生成标签导航
			$route() {
				let {
					name,
					fullPath,
					path,
					meta,
					query
				} = this.$route
				this.getBran()//监听实时面包屑导航
				let viewObj = {
					name: name,
					fullPath: fullPath,
					path: path,
					meta: meta,
					query: query
				}
				this.$store.commit("addVisitedView", viewObj) //将此路由储存在vuex
				
			}
		},
		computed: {
			sidebarFold: {
				get() {
					return this.$store.state.common.sidebarFold
				},
			},

			//标签
			visitedView: {
				get(){
					return this.$store.state.visitedView
				},
				set(val) {}
			},
			//被关闭的标签下标
			checkIndex(){
				return this.$store.state.checkIndex
			}
		},
		mounted() {
			this.resetDocumentClientHeight()
		},
		methods: {
			// 重置窗口可视高度
			resetDocumentClientHeight() {
				this.documentClientHeight = document.documentElement['clientHeight']
				window.onresize = () => {
					this.documentClientHeight = document.documentElement['clientHeight']
				}
			},
			
			//标签
			isActive(route) {
				return route.path === this.$route.path
			},
			//关闭标签
			closeSelectedTag(view) {
				this.$store.commit("delVisitedView", view)
				if(this.visitedView.length===0){
					
				}
				if (this.isActive(view)) {
					this.toLastView(this.$store.state.visitedView)
				}
			},
			//如果在最后一个标签页则跳转到倒数第二标签
			toLastView(visitedView) {
				const closed = visitedView.slice(this.checkIndex)[0]//跳到后面一个
				const lastTab = visitedView.slice(-1)[0]//跳到最后一个
				if (closed) {
					this.$router.push(closed.fullPath)
				}else if(lastTab){
					this.$router.push(lastTab.fullPath)
				}else{
					this.$router.push({name:'home'})
				}
			},
			//刷新
			refresh(){
				let {
					name,
					fullPath,
					path,
					meta,
					query
				} = this.$route
				let viewObj = {
					name: name,
					fullPath: fullPath,
					path: path,
					meta: meta,
					query: query
				}

				this.getBran()
				this.$store.commit("addVisitedView", viewObj)
			},
			getBran(){
				let route = this.$route.matched.filter(v => v.name)
				let arr = []
				route.forEach((v, k) => {
					if (v.name === 'layout') return
					arr.push({
						title:v.meta.title
					})
					for (var i = 0; i < this.slideBar.length; i++) {
						for (var j = 0; j < this.slideBar[i].submenu.length; j++) {
							if (this.slideBar[i].submenu[j].pathname === v.name) {
								arr.unshift({
									title:this.slideBar[i].name
								})
							}
						}
					}
				})
				this.bran = arr
			},
		},
		//组件内守卫
		beforeRouteLeave(to, from, next) {
			if (to.name === "courseDetail") {
				if (!from.meta.keepAlive) {
					from.meta.keepAlive = true //当我们进入到详情页面时开启列表页面的缓存
				}
				next()
			} else {
				from.meta.keepAlive = false
				this.$destroy() //销毁列表的实例
				next() //当我们前进的不是详情页面时时我们让列表页面刷新
			}
		}
	}
</script>

<style lang="scss" scoped>
	.el-breadcrumb {
		font-size: 16px;
		margin-bottom: 15px;
	}

	.tags-view-container {
		height: 46px;
		width: 100%;
		background: #fff;
		border-bottom: 1px solid #d8dce5;
		box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);

		.tags-view-item {
			display: inline-block;
			position: relative;
			cursor: pointer;
			height: 30px;
			line-height: 30px;
			border: 1px solid #d8dce5;
			color: #495060;
			background: #fff;
			padding: 0 8px;
			font-size: 15px;
			margin-left: 5px;
			margin-top: 10px;
			border-radius: 3px;

			&:first-of-type {
				margin-left: 15px;
				text-decoration: none;
			}

			&:last-of-type {
				margin-right: 15px;
			}

			&.active {
				background-color: #17B3A3;
				color: #fff;
				text-decoration: none;
				
				&::before {
					content: "";
					background: #fff;
					display: inline-block;
					width: 8px;
					height: 8px;
					border-radius: 50%;
					position: relative;
					margin-right: 2px;
					vertical-align: 2px;
				}
			}
			&:hover{
				text-decoration: none;
				background-color: #17b3a369;
				color: #fff;
			}
		}
	}

	.tags-view-item {
		.el-icon-close {
			width: 14px;
			height: 14px;
			border-radius: 50%;
			text-align: center;
			transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
			transform-origin: 100% 50%;
			font-size: 20px;
			vertical-align: -2px;
			position: relative;
			&:before {
				transform: scale(0.6);
				display: inline-block;
				position: absolute;
				left: -3px;
				top: -2px;
			}

			&:hover {
				background-color: #b4bccc;
				color: #fff;
			}
		}
	}
</style>
