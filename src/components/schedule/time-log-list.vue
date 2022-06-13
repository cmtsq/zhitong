<template>
	<el-dialog title="日志列表" :visible.sync="visible" width="71.15%" :close-on-click-modal="true">
		<el-form :inline="true" :model="dataForm">
			<el-form-item>
				<el-input v-model="dataForm.jobId" placeholder="任务ID" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-button @click="getLogList()">查询</el-button>
			</el-form-item>
		</el-form>
		<el-table :data="logData" height="500" border style="width:100%">
			<el-table-column prop="logId" header-align="center" align="center" label="日志ID" width="80">
			</el-table-column>
			<el-table-column prop="jobId" header-align="center" align="center" label="任务ID" width="80">
			</el-table-column>
			<el-table-column prop="beanName" header-align="center" align="center" label="bean名称" width="120">
			</el-table-column>
			<el-table-column prop="params" header-align="center" align="center" label="参数" width="120">
			</el-table-column>
			<el-table-column prop="status" header-align="center" align="center" label="状态" width="120">
				<template slot-scope="scope">
					<el-tag v-if="scope.row.status === 0">成功</el-tag>
					<el-tag v-else type="danger">失败</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="times" header-align="center" align="center" label="耗时(单位:毫秒)" width="140">
			</el-table-column>
			<el-table-column prop="createTime" header-align="center" align="center" label="执行时间" width="180">
			</el-table-column>
		</el-table>
		<el-pagination @size-change="sizeCount" @current-change="currentPage" :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPageCount" layout="total, sizes, prev, pager, next, jumper" width="100%">
		</el-pagination>
	</el-dialog>
</template>

<script>
	export default {
		data() {
			return {
				visible: false,
				logData:[],
				dataForm:{
					jobId:""
				},
				page:1,
				pageSize:10,
				totalPageCount:0
			}
		},
		created(){
			this.getLogList()
		},
		methods: {
			open(){
				this.visible = true
				this.getLogList()
			},
			getLogList() {
				this.$http({
					url:'sys/scheduleLog/list',
					method:'get',
					params:{
						'page':this.page,
						'limit':this.pageSize,
						'jobId':this.dataForm.jobId
					}
				}).then((res)=>{
					this.logData=res.data.page.list
					this.totalPageCount=res.data.page.totalCount
				})
			},
			// 每页数
			sizeCount(val) {
				this.pageSize = val
				this.page = 1
				this.getLogList()
			},
			// 当前页
			currentPage(val) {
				this.page = val
				this.getLogList()
			},
		}
	}
</script>

<style>
</style>
