<template>
	<el-dialog :title="!dataForm.id ? '新增用户' : '修改信息'" :close-on-click-modal="true" :visible.sync="visible">
		<el-form :model="dataForm" :rules="rule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
			label-width="80px">
			<el-form-item label="用户名" prop="userName">
				<el-input v-model="dataForm.userName" placeholder="登录帐号"></el-input>
			</el-form-item>
			<el-form-item label="密码" prop="password" :class="{ 'is-required': !dataForm.id }">
				<el-input v-model="dataForm.password" type="password" placeholder="密码"></el-input>
			</el-form-item>
			<el-form-item label="确认密码" prop="comfirmPassword" :class="{ 'is-required': !dataForm.id }">
				<el-input v-model="dataForm.comfirmPassword" type="password" placeholder="确认密码"></el-input>
			</el-form-item>
			<el-form-item label="邮箱" prop="email">
				<el-input v-model="dataForm.email" placeholder="邮箱"></el-input>
			</el-form-item>
			<el-form-item label="手机号" prop="mobile">
				<el-input v-model="dataForm.mobile" placeholder="手机号"></el-input>
			</el-form-item>
			<el-form-item label="角色" size="mini" prop="roleIdList">
				<el-checkbox-group v-model="dataForm.roleIdList">
					<el-checkbox v-for="role in roleList" :key="role.roleId" :label="role.roleId">{{ role.roleName }}
					</el-checkbox>
				</el-checkbox-group>
			</el-form-item>
			<el-form-item label="状态" size="mini" prop="status">
				<el-radio-group v-model="dataForm.status">
					<el-radio :label="0">禁用</el-radio>
					<el-radio :label="1">正常</el-radio>
				</el-radio-group>
			</el-form-item>
		</el-form>
		<span slot="footer" class="dialog-footer">
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" @click="dataFormSubmit">确定</el-button>
		</span>
	</el-dialog>
</template>

<script>
	import {
		isEmail,
		isMobile
	} from '@/API/validate'
	export default {
		data() {
			//验证密码
			var validatePassword = (rule, value, callback) => {
				if (!this.dataForm.id && !/\S/.test(value)) {
					callback(new Error('密码不能为空'))
				} else {
					callback()
				}
			}
			//验证确认密码
			var validateComfirmPassword = (rule, value, callback) => {
				if (!this.dataForm.id && !/\S/.test(value)) {
					callback(new Error('确认密码不能为空'))
				} else if (this.dataForm.password !== value) {
					callback(new Error('确认密码与密码输入不一致'))
				} else {
					callback()
				}
			}
			//验证邮箱
			var validateEmail = (rule, value, callback) => {
				if (!isEmail(value)) {
					callback(new Error('邮箱格式错误'))
				} else {
					callback()
				}
			}
			//验证手机号
			var validateMobile = (rule, value, callback) => {
				if (!isMobile(value)) {
					callback(new Error('手机号格式错误'))
				} else {
					callback()
				}
			}
			return {
				visible: false,
				roleList: [],
				dataForm: {
					id: 0,
					userName: '',
					password: '',
					comfirmPassword: '',
					email: '',
					mobile: '',
					roleIdList: [],
					status: 1
				},
				rule: {
					userName: [{
						required: true,
						message: '用户名不能为空',
						trigger: 'blur'
					}],
					password: [{
						validator: validatePassword,
						trigger: 'blur'
					}],
					comfirmPassword: [{
						validator: validateComfirmPassword,
						trigger: 'blur'
					}],
					email: [{
							required: true,
							message: '邮箱不能为空',
							trigger: 'blur'
						},
						{
							validator: validateEmail,
							trigger: 'blur'
						}
					],
					mobile: [{
							required: true,
							message: '手机号不能为空',
							trigger: 'blur'
						},
						{
							validator: validateMobile,
							trigger: 'blur'
						}
					]
				}
			}
		},
		methods: {
			//当前修改的用户信息渲染||创建
			init(id) {
				this.dataForm.id = id || 0
				this.$http({
					url: 'sys/role/select',
					method: 'get',
				}).then((res) => {
					console.log(res.data)
					this.roleList = res.data && res.data.code === 0 ? res.data.list : [],
					this.visible = true
					this.$nextTick(() => {
						// 重置表单到初始值
						this.$refs['dataForm'].resetFields()
					})
					if (this.dataForm.id) {
						this.$http({
							url: `sys/user/info/${this.dataForm.id}`,
							method: 'get',
						}).then((res) => {
							console.log(res.data)
							if (res.data && res.data.code === 0) {
								this.dataForm.userName = res.data.user.username
								this.dataForm.email = res.data.user.email
								this.dataForm.mobile = res.data.user.mobile
								this.dataForm.roleIdList = res.data.user.roleIdList
								this.dataForm.status = res.data.user.status
							}
						})
					}
				})
			},
			// 表单提交
			dataFormSubmit() {
				this.$http({
					url: `sys/user/${!this.dataForm.id ? 'save' : 'update'}`,
					method: 'post',
					data: {
						'userId': this.dataForm.id || undefined,
						'username': this.dataForm.userName,
						'password': this.dataForm.password,
						'email': this.dataForm.email,
						'mobile': this.dataForm.mobile,
						'status': this.dataForm.status,
						'roleIdList': this.dataForm.roleIdList
					}
				}).then((res) => {
					if (res.data && res.data.code === 0) {
						console.log(res)
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
