<template>
	<el-dialog :title="!dataForm.jobId ? '新增任务' : '修改信息'" :close-on-click-modal="true" :visible.sync="visible">
		<el-form :model="dataForm" :rules="rule" ref="dataForm" @keyup.enter.native="confirm()"
			label-width="100px">
			<el-form-item label="bean名称" prop="beanName">
				<el-input v-model="dataForm.beanName" placeholder="spring bean名称,如:testTask"></el-input>
			</el-form-item>
			<el-form-item label="参数" prop="params">
				<el-input v-model="dataForm.params" placeholder="参数"></el-input>
			</el-form-item>
			<el-form-item label="cron表达式" prop="cronExpression">
				<el-input v-model="dataForm.cronExpression" placeholder="如:0 0 12 * *?"></el-input>
			</el-form-item>
			<el-form-item label="备注" prop="remark">
				<el-input v-model="dataForm.remark" placeholder="备注"></el-input>
			</el-form-item>
		</el-form>
		<span slot="footer" class="dialog-footer">
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" @click="confirm">确定</el-button>
		</span>
	</el-dialog>
</template>

<script>
	export default {
		data() {
			return {
				visible: false,
				dataForm: {
					jobId: 0,
					beanName: '',
					params: '',
					cronExpression:'',
					remark: '',
					status:0,
				},
				rule: {
					beanName: [{
						required: true,
						message: '名称不能为空',
						trigger: 'blur'
					}],
					cronExpression: [{
						required: true,
						message: 'cron表达式不能为空',
						trigger: 'blur'
					}]
				}
			}
		},
		methods: {
			//修改任务信息渲||创建
			open(id) {
				this.dataForm.jobId = id || 0
				this.visible = true
				this.$nextTick(() => {
					// 重置表单到初始值
					this.$refs['dataForm'].resetFields()
				})
				if (this.dataForm.jobId) {
					this.$http.get(`sys/schedule/info/${this.dataForm.jobId}`,).then((res) => {
						if (res.data.code === 0) {
							this.dataForm.beanName = res.data.schedule.beanName
							this.dataForm.params = res.data.schedule.params
							this.dataForm.cronExpression = res.data.schedule.cronExpression
							this.dataForm.remark = res.data.schedule.remark
						}
					})
				}
			},
			// 表单提交
			confirm() {
				this.$http({
					url: `sys/schedule/${!this.dataForm.jobId ? 'save' : 'update'}`,
					method: 'post',
					data: {
						'jobId': this.dataForm.jobId || undefined,
						'beanName': this.dataForm.beanName,
						'params': this.dataForm.params,
						'cronExpression': this.dataForm.cronExpression,
						'status':0,
						'remark': this.dataForm.remark,
					}
				}).then((res) => {
					if (res.data.code === 0) {
						this.$message({
							message: '操作成功',
							type: 'success',
							duration: 1000,
							onClose: () => {
								this.visible = false
								this.$emit('refreshDataList')
							}
						})
					} else {
						this.$message.error(res.data.msg)
					}
				})
			}
		}
	}
</script>

<style>
</style>
