<template>
	<div>
		<el-form :inline="true" :model="dataForm">
			<el-form-item>
				<el-input v-model="dataForm.beanName" placeholder="bean名称" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-button @click="taskDataList()">查询</el-button>
				<el-button type="primary" @click="addUpdateHandle()">新增</el-button>
				<el-button type="danger" @click="handle('','delete')" :disabled="dataListSelections.length <= 0">批量删除
				</el-button>
				<el-button type="danger" @click="handle('','pause')" :disabled="dataListSelections.length <= 0">批量暂停
				</el-button>
				<el-button type="danger" @click="handle('','resume')" :disabled="dataListSelections.length <= 0">批量恢复
				</el-button>
				<el-button type="danger" @click="handle('','run')" :disabled="dataListSelections.length <= 0">批量立即执行
				</el-button>
				<el-button type="success" @click="openLogList">日志列表</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="loading" :data="dataList" border @selection-change="selections" style="width: 100%;">
			<el-table-column type="selection" header-align="center" align="center" width="50">
			</el-table-column>
			<el-table-column prop="jobId" header-align="center" align="center" width="80" label="ID">
			</el-table-column>
			<el-table-column prop="beanName" header-align="center" align="center" label="bean名称">
			</el-table-column>
			<el-table-column prop="params" header-align="center" align="center" label="参数">
			</el-table-column>
			<el-table-column prop="cronExpression" header-align="center" align="center" label="cron表达式">
			</el-table-column>
			<el-table-column prop="remark" header-align="center" align="center" label="备注">
			</el-table-column>
			<el-table-column prop="status" header-align="center" align="center" label="状态" width="140">
				<template slot-scope="scope">
					<el-tag v-if="scope.row.status === 0">正常</el-tag>
					<el-tag v-else  type="danger">暂停</el-tag>
				</template>
			</el-table-column>
			<el-table-column fixed="right" header-align="center" align="center" width="180" label="操作">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="addUpdateHandle(scope.row.jobId)">修改</el-button>
					<el-button type="text" size="small" @click="handle(scope.row.jobId,'delete')">删除</el-button>
					<el-button type="text" size="small" @click="handle(scope.row.jobId,'pause')">暂停</el-button>
					<el-button type="text" size="small" @click="handle(scope.row.jobId,'resume')">恢复</el-button>
					<el-button type="text" size="small" @click="handle(scope.row.jobId,'run')">立即执行</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination @size-change="sizeCount" @current-change="currentPage" :current-page="pageIndex"
			:page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage"
			layout="total, sizes, prev, pager, next, jumper">
		</el-pagination>
		<!-- 弹窗, 新增 / 修改 -->
		<addUpdatemodel ref="addUpdate" @refreshDataList="taskDataList"></addUpdatemodel>
		<!-- 日志列表 -->
		<timeLogList ref="logList"></timeLogList>
	</div>
</template>

<script>
	import addUpdatemodel from '@/components/schedule/time-add-update.vue'
	import timeLogList from '@/components/schedule/time-log-list.vue'
	export default {
		data() {
			return {
				dataForm: {
					beanName: ''
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
			timeLogList
		},
		created() {
			this.taskDataList()
		},
		methods: {
			// 获取数据列表
			taskDataList() {
				setTimeout(()=>{
					this.loading = false
				},1000)
				this.$http({
					url: 'sys/schedule/list',
					method: 'get',
					params: {
						'page': this.pageIndex,
						'limit': this.pageSize,
						'beanName': this.dataForm.beanName
					}
				}).then((res) => {
					if (res.data.code === 0) {
						this.dataList = res.data.page.list
						this.totalPage = res.data.page.totalCount
					}
				})
			},
			// 新增/修改
			addUpdateHandle(id) {
				this.$nextTick(() => {
					this.$refs.addUpdate.open(id)
				})
			},
			// 删除||暂停||恢复||立即执行
			handle(id,param) {
				//map对数组进行遍历，返回一个一个处理后的数组
				var jobId = id ? [id] : this.dataListSelections.map(item => {
					return item.jobId
				})
				//console.log(jobId)
				var text = ''
				var texts = ''
				if(param=="delete"){
					text = '确定删除此用户吗？'
					texts = '确定批量删除这些用户吗？'
				}else if(param=="pause"){
					text = '确定暂停此用户吗？'
					texts = '确定批量暂停这些用户吗？'
				}else if(param=="resume"){
					text = '确定恢复此用户吗？'
					texts = '确定批量恢复这些用户吗？'
				}else{
					text = '确定立即执行此用户吗？'
					texts = '确定批量执行这些用户吗？'
				}
				this.$confirm(jobId.length === 1 ? text : texts, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$http({
						url: "sys/schedule/"+param,
						method: 'post',
						data: jobId
					}).then((res) => {
						if (res.data.code === 0) {
							this.$message({
								message: '操作成功',
								type: 'success',
								duration: 1000,
								onClose:()=>{
									this.taskDataList()
								}
							})
						} else {
							this.$message.error(res.data.msg)
						}
					})
				}).catch(()=>{})
			},
			//打开日志列表
			openLogList(){
				this.$nextTick(()=>{
					this.$refs.logList.open()
				})
			},
			// 每页数
			sizeCount(val) {
				this.pageSize = val
				this.pageIndex = 1
				this.taskDataList()
			},
			// 当前页
			currentPage(val) {
				this.pageIndex = val
				this.taskDataList()
			},
			// 多选
			selections(val) {
				this.dataListSelections = val
			}
		}
	}
</script>