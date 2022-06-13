<template>
	<div class="mod-menu">
		<el-form>
			<el-form-item>
				<el-button type="primary" @click="addUpdateMenu()">新增</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="loading" :data="menuData" style="width: 100%" row-key="menuId" border lazy
			:tree-props="{children: 'children'}">
			<el-table-column fixed prop="name" label="名称" min-width="150">
			</el-table-column>
			<el-table-column prop="parentName" label="上级菜单" min-width="130" header-align="center" align="center">
			</el-table-column>
			<el-table-column prop="icon" label="图标" width="120" header-align="center" align="center">
			</el-table-column>
			<el-table-column prop="type" label="类型" width="120" header-align="center" align="center">
				<template slot-scope="scope">
					<el-tag v-if="scope.row.type === 0">目录</el-tag>
					<el-tag v-else-if="scope.row.type === 1" type="success">菜单</el-tag>
					<el-tag v-else-if="scope.row.type === 2" type="info">按钮</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="orderNum" label="排序号" width="150" header-align="center" align="center">
			</el-table-column>
			<el-table-column prop="url" label="菜单URL" width="150" header-align="center" align="center">
			</el-table-column>
			<el-table-column prop="perms" label="授权标识" width="150" header-align="center" align="center">
			</el-table-column>
			<el-table-column label="操作" width="150" header-align="center" align="center">
				<template slot-scope="scope">
					<el-button size="mini" type="primary" @click="addUpdateMenu(scope.row.menuId)">编辑</el-button>
					<el-button size="mini" type="danger" @click="delMenu(scope.row.menuId)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!-- 对话框 修改|新增 -->
		<addUpdatemodel ref="addUpdate" @dataList="menuDatalist"></addUpdatemodel>
	</div>
</template>

<script>
	import {
		getTree
	} from '@/API/tree'
	import addUpdatemodel from '@/components/setting/menu-add-update.vue'
	export default {
		data() {
			return {
				menuData: [],
				loading:true
			}
		},
		components: {
			addUpdatemodel
		},
		created() {
			this.menuDatalist()
		},
		methods: {
			// 菜单数据列表渲染
			menuDatalist() {
				setTimeout(()=>{
					this.loading = false
				},1000)
				this.menuData=[]
				this.$http.get('sys/menu/list').then((res) => {
					getTree(res.data, 0, this.menuData)
				})
			},
			//提交表单
			addUpdateMenu(id){
				this.$nextTick(() => {
					this.$refs.addUpdate.open(id)
				})
			},
			//删除菜单
			delMenu(id) {
				this.$confirm(`是否对id=[${id}]进行删除`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$http.post(`sys/menu/delete/${id}`).then((res) => {
						if (res.data.code === 0) {
							this.$message({
								message: '删除成功',
								type: 'susscess',
								duration: 1000,
								onClose: () => {
									this.menuDatalist()
								}
							});
						} else {
							this.$message.error(res.data.msg)
						}
					})
				}).catch(() => {})
			}
		},
	}
</script>
