<template>
	<div>
		<nav class="site-navbar site-navbar--default">
			<div class="site-navbar__header">
				<h1 class="site-navbar__brand" @click="$router.push({ name: 'home' })">
					<a class="site-navbar__brand-lg" href="javascript:;">智通管理平台系统</a>
					<a class="site-navbar__brand-mini" href="javascript:;">智通</a>
				</h1>
			</div>
			<div class="site-navbar__body clearfix">
				<el-menu class="site-navbar__menu" mode="horizontal">
					<el-menu-item class="site-navbar__switch" index="0" @click="sidebarFold = !sidebarFold">
						<i v-show="!sidebarFold" name="zhedie" class="el-icon-s-fold"></i>
						<i v-show="sidebarFold" name="zhedie" class="el-icon-s-unfold"></i>
					</el-menu-item>
				</el-menu>
				<el-menu class="site-navbar__menu site-navbar__menu--right" mode="horizontal">
					<el-menu-item index="1">
						<template slot="title">
							<el-badge>
								<i name="shezhi" class="el-icon-setting"></i>
							</el-badge>
						</template>
					</el-menu-item>
					<el-menu-item index="2">
						<el-badge>
							<a href="#" target="_blank">官方社区</a>
						</el-badge>
					</el-menu-item>
					<el-submenu index="3">
						<template slot="title">Git源码</template>
						<el-menu-item index="3-1"><a href="#" target="_blank">前端</a></el-menu-item>
						<el-menu-item index="3-2"><a href="#" target="_blank">后台</a></el-menu-item>
						<el-menu-item index="3-3"><a href="#" target="_blank">代码生成器</a></el-menu-item>
					</el-submenu>
					<el-menu-item class="site-navbar__avatar" index="3">
						<el-dropdown :show-timeout="0" placement="bottom">
							<span class="el-dropdown-link">
								<img src="~@/assets/img/avatar.png" :alt="userName">{{ userName }}
							</span>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item @click.native="updatepassword = true">修改密码</el-dropdown-item>
								<el-dropdown-item @click.native="logout">退出</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</el-menu-item>
				</el-menu>
			</div>
		</nav>

		<!-- 修改密码的对话框 -->
		<el-dialog title="修改密码" :visible.sync="updatepassword">
			<el-form :model="ruleForm" status-icon :rules="rules" label-width="100px" class="demo-ruleForm"
				ref="ruleForm">
				<el-form-item label="账号">
					<span>小七</span>
				</el-form-item>
				<el-form-item label="原密码" prop="pass">
					<el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="新密码" prop="newPass">
					<el-input type="password" v-model="ruleForm.newPass" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="确认密码" prop="checkPass">
					<el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="close">取 消</el-button>
				<el-button type="primary" @click="cofirmUpdate">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			var validateCheckPass = (rule, value, callback) => {
				if (value === "") {
					callback(new Error('确认密码不能为空!'));
				}
				if (value !== this.ruleForm.newPass) {
					callback(new Error('两次输入密码不一致!'));
				} else {
					callback();
				}
			};
			return {
				userName: '',
				updatepassword: false,
				ruleForm: {
					pass: '',
					newPass: '',
					checkPass: '',
				},
				rules: {
					pass: [{
						required: true,
						message: '原密码不能为空',
						trigger: 'blur'
					}],
					newPass: [{
						required: true,
						validator: '新密码不能为空',
						trigger: 'blur'
					}],
					checkPass: [{
						required: true,
						validator: validateCheckPass,
						trigger: 'blur'
					}],
				}
			}
		},
		created() {
			//初始化当前登录的信息
			this.showUser()
		},
		computed: {
			sidebarFold: {
				get() {
					return this.$store.state.common.sidebarFold
				},
				set(val) {
					this.$store.commit('common/updateSidebarFold', val)
				}
			},
		},
		methods: {
			//渲染当前管理员信息
			showUser() {
				this.$http({
					method: 'get',
					url: 'sys/user/info'
				}).then((res) => {
					if (res.data && res.data.code === 0) {
						localStorage.setItem('user', JSON.stringify(res.data.user));
						this.userName = JSON.parse(localStorage.getItem('user')).username
					}
				})
			},
			//退出登录
			logout(){
				this.$confirm('确定进行[退出]操作?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$http({
						url: 'sys/logout',
						method: 'post'
					}).then((res)=>{
						if (res.data && res.data.code === 0) {
							this.$router.push({name: 'login'})
						}
					})
				})
			},
			//取消
			close() {
				this.updatepassword = false,
					this.ruleForm = {
						pass: '',
						newPass: '',
						checkPass: '',
					}
			},
			//确认修改
			cofirmUpdate() {
				this.$http({
					url: 'sys/user/password',
					method: 'post',
					data: {
						'password': this.ruleForm.pass,
						'newPassword': this.ruleForm.newPass
					}
				}).then((res) => {
					console.log(res.data)
					if (res.data && res.data.code === 0) {
						this.$message({
							message: '修改成功',
							type: 'success',
							duration: 1500,
							onClose: () => {
								this.updatepassword = false
								this.$nextTick(() => {
									this.$router.replace({
										name: 'login'
									})
								})
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
