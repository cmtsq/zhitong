<template>
	<div class='systemLg'>
		<el-form :inline="true" :model="dataForm">
			<el-form-item>
				<el-input v-model="dataForm.searchKey" placeholder="角色名 / 用户操作" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-button @click="getData()">查询</el-button>
			</el-form-item>
		</el-form>
		<el-table  v-loading="loading" :data="systemLgData" border style="width: 100%">
			<el-table-column prop="id" header-align="center" align="center" width="120" label="ID">
			</el-table-column>
			<el-table-column prop="username" header-align="center" align="center" label="用户名">
			</el-table-column>
			<el-table-column prop="operation" header-align="center" align="center" label="用户操作">
			</el-table-column>
			<el-table-column :show-overflow-tooltip="true" prop="method" header-align="center" align="center" label="请求方法">
			</el-table-column>
			<el-table-column :show-overflow-tooltip="true" prop="params" header-align="center" align="center" label="请求参数">
			</el-table-column>
			<el-table-column prop="time" header-align="center" align="center" label="执行时长(毫秒)">
			</el-table-column>
			<el-table-column prop="ip" header-align="center" align="center" label="IP地址">
			</el-table-column>
			<el-table-column prop="createDate" header-align="center" align="center" label="创建时间">
			</el-table-column>
		</el-table>
		<el-pagination @size-change="sizeCount" @current-change="currentPage" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
		</el-pagination>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				dataForm: {
					searchKey: ""
				},
				systemLgData: [],
				pageIndex: 1,
				pageSize: 10,
				totalPage: 0,
				loading:true
			}
		},
		//初始化数据
		created(){
			this.getData()
		},
		methods:{
			//渲染数据
			getData(){
				this.$http({
					url: 'sys/log/list',
					method: 'get',
					params: {
						'page': this.pageIndex,
						'limit': this.pageSize,
						'key': this.dataForm.searchKey
					}
				}).then((res) => {
					setTimeout(()=>{
						this.loading = false
					},1500)
					if (res.data || res.data.code == 0) {
						this.systemLgData = res.data.page.list
						this.totalPage = res.data.page.totalCount
					}
				})
			},
			// 每页数
			sizeCount(val) {
				this.pageSize = val
				this.pageIndex = 1
				this.getData()
			},
			// 当前页
			currentPage(val) {
				this.pageIndex = val
				this.getData()
			}
		}
	}
</script>

<style>
</style>
