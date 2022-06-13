<template>
	<div class="role">
		<el-form :inline="true" :model="dataForm">
			<el-form-item>
				<el-input v-model="dataForm.roleName" placeholder="角色名称" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-button @click="roleDataList()">查询</el-button>
				<el-button type="primary" @click="addUpdateRole()">新增</el-button>
				<el-button type="danger" @click="deleteRole()" :disabled="dataListSelections.length <= 0">批量删除
				</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="loading" :data="dataList" border @selection-change="selections" style="width: 100%;">
			<el-table-column type="selection" header-align="center" align="center" width="50">
			</el-table-column>
			<el-table-column prop="roleId" header-align="center" align="center" width="80" label="ID">
			</el-table-column>
			<el-table-column prop="roleName" header-align="center" align="center" label="角色名称">
			</el-table-column>
			<el-table-column prop="remark" header-align="center" align="center" label="备注">
			</el-table-column>
			<el-table-column prop="createTime" header-align="center" align="center" width="180" label="创建时间">
			</el-table-column>
			<el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
				<template slot-scope="scope">
					<el-button type="primary" size="small" @click="addUpdateRole(scope.row.roleId)">修改</el-button>
					<el-button type="danger" size="small" @click="deleteRole(scope.row.roleId)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination @size-change="sizeCount" @current-change="currentPage" :current-page="pageIndex"
			:page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage"
			layout="total, sizes, prev, pager, next, jumper">
		</el-pagination>
		<!-- 弹窗, 新增 / 修改 -->
		<addUpdatemodel ref="addUpdate" @dataList="roleDataList"></addUpdatemodel>
	</div>
</template>

<script>
	import addUpdatemodel from '@/components/setting/role-add-update.vue'
	export default {
		data() {
			return {
				dataForm: {
					roleName: ''
				},
				dataList: [],
				pageIndex: 1,
				pageSize: 10,
				totalPage: 0,
				dataListSelections: [],
				loading:true
			}
		},
		components: {
			addUpdatemodel,
		},
		created() {
			this.roleDataList()
		},
		methods: {
			//获取角色列表
			roleDataList() {
				setTimeout(()=>{
					this.loading = false
				},1000)
				this.$http({
					url: `sys/role/list`,
					method: 'get',
					params: {
						'page': this.pageIndex,
						'limit': this.pageSize,
						'sidx': 'roleId',
						'roleName': this.dataForm.roleName
					}
				}).then((res) => {
					if (res.data || res.data.code == 0) {
						// console.log(res.data)
						this.dataList = res.data.page.list
						this.totalPage = res.data.page.totalCount
					}
				})
			},
			// 每页数
			sizeCount(val) {
				this.pageSize = val
				this.pageIndex = 1
				this.roleDataList()
			},
			// 当前页
			currentPage(val) {
				this.pageIndex = val
				this.roleDataList()
			},
			// 多选
			selections(val) {
				this.dataListSelections = val
			},
			// 新增角色/修改角色
			addUpdateRole(id) {
				this.$nextTick(() => {
					this.$refs.addUpdate.open(id)
				})
			},
			// 删除角色
			deleteRole(id) {
				var roleIds = id ? [id] : this.dataListSelections.map(item => {
					return item.roleId
				})
				this.$confirm(roleIds.length === 1 ? '确定删除此角色吗？' : '确定批量删除这些角色吗？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
						this.$http({
							method:'post',
							url: 'sys/role/delete',
							data: roleIds
						}).then((res) => {
							if (res.data.code === 0) {
								this.$message({
									message: '删除成功',
									type: 'success',
									duration: 1000,
									onClose: () => {
										this.roleDataList()
									}
								})
							} else {
								this.$message.error(res.data.msg)
							}
						})
					}).catch(()=>{})
				}
			},
		}
</script>
