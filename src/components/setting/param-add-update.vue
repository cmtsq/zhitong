<template>
	<el-dialog :title="!dataForm.id ? '新增参数' : '修改参数'" :close-on-click-modal="true" :visible.sync="visible">
		<el-form :model="dataForm" :rules="rule" ref="dataForm" @keyup.enter.native="confirm()"
			label-width="80px">
			<el-form-item label="参数名" prop="paramKey">
				<el-input v-model="dataForm.paramKey" placeholder="参数名"></el-input>
			</el-form-item>
			<el-form-item label="参数值" prop="paramValue">
				<el-input v-model="dataForm.paramValue" placeholder="参数名"></el-input>
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
					id: 0,
					paramKey: '',
					paramValue: '',
					remark: ''
				},
				rule: {
					paramKey: [{
						required: true,
						message: '参数名不能为空',
						trigger: 'blur'
					}],
					paramValue: [{
						required: true,
						message: '参数值不能为空',
						trigger: 'blur'
					}]
				}
			}
		},
		methods: {
			//修改参数信息渲染||创建
			open(id) {
				this.dataForm.id = id || 0
				this.visible = true
				this.$nextTick(() => {
					// 重置表单到初始值
					this.$refs['dataForm'].resetFields()
				})
				if (this.dataForm.id) {
					this.$http.get(`sys/config/info/${this.dataForm.id}`,).then((res) => {
						if (res.data.code === 0) {
							this.dataForm.paramKey = res.data.config.paramKey
							this.dataForm.paramValue = res.data.config.paramValue
							this.dataForm.remark = res.data.config.remark
						}
					})
				}
			},
			// 表单提交
			confirm() {
				this.$http({
					url: `sys/config/${!this.dataForm.id ? 'save' : 'update'}`,
					method: 'post',
					data: {
						'id': this.dataForm.id || undefined,
						'paramKey': this.dataForm.paramKey,
						'paramValue': this.dataForm.paramValue,
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
