<template>
	<div class="admin">
		<el-form :inline="true" :model="dataForm">
			<el-form-item>
				<el-input v-model="dataForm.userName" placeholder="用户名" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-button @click="adminDataList()">查询</el-button>
				<el-button type="primary" @click="addUpdateHandle()">新增</el-button>
				<el-button type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除
				</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="loading" :data="dataList" border @selection-change="selections" style="width: 100%;">
			<el-table-column type="selection" header-align="center" align="center" width="50">
			</el-table-column>
			<el-table-column prop="userId" header-align="center" align="center" width="80" label="ID">
			</el-table-column>
			<el-table-column prop="username" header-align="center" align="center" label="用户名">
			</el-table-column>
			<el-table-column prop="email" header-align="center" align="center" label="邮箱">
			</el-table-column>
			<el-table-column prop="mobile" header-align="center" align="center" label="手机号">
			</el-table-column>
			<el-table-column prop="status" header-align="center" align="center" label="状态">
				<template slot-scope="scope">
					<el-tag v-if="scope.row.status === 0" size="small" type="danger">禁用</el-tag>
					<el-tag v-else size="small">正常</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="createTime" header-align="center" align="center" width="180" label="创建时间">
			</el-table-column>
			<el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
				<template slot-scope="scope">
					<el-button type="primary" size="small" @click="addUpdateHandle(scope.row.userId)">修改</el-button>
					<el-button type="danger" size="small" @click="deleteHandle(scope.row.userId)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination @size-change="sizeCount" @current-change="currentPage" :current-page="pageIndex"
			:page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage"
			layout="total, sizes, prev, pager, next, jumper">
		</el-pagination>
		<!-- 弹窗, 新增 / 修改 -->
		<addUpdatemodel ref="addUpdate" @refreshDataList="adminDataList"></addUpdatemodel>
	</div>
</template>

<script>
	import addUpdatemodel from '@/components/setting/admin-add-update.vue'
	export default {
		data() {
			return {
				dataForm: {
					userName: ''
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
			addUpdatemodel
		},
		created() {
			this.adminDataList()
		},
		methods: {
			// 获取数据列表
			adminDataList() {
				setTimeout(()=>{
					this.loading = false
				},1000)
				this.$http({
					url: `sys/user/list`,
					method: 'get',
					params: {
						'page': this.pageIndex,
						'limit': this.pageSize,
						'sidx': 'userId',
						'username': this.dataForm.userName
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
				this.adminDataList()
			},
			// 当前页
			currentPage(val) {
				this.pageIndex = val
				this.adminDataList()
			},
			// 多选
			selections(val) {
				this.dataListSelections = val
			},
			// 新增/修改
			addUpdateHandle(id) {
				this.$nextTick(() => {
					this.$refs.addUpdate.init(id)
				})
			},
			// 删除
			deleteHandle(id) {
				//map对数组进行遍历，返回一个一个处理后的数组
				var userIds = id ? [id] : this.dataListSelections.map(item => {
					return item.userId
				})
				this.$confirm(userIds.length === 1 ? '确定删除此用户吗？' : '确定批量删除这些用户吗？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$http({
						url: "sys/user/delete",
						method: 'post',
						data: userIds
					}).then((res) => {
						if (res.data && res.data.code === 0) {
							this.$message({
								message: '删除成功',
								type: 'success',
								duration: 1000,
								onClose:()=>{
									this.adminDataList()
								}
							})
						} else {
							this.$message.error(res.data.msg)
						}
					})
				}).catch(()=>{})
			}
		}
	}
</script>
