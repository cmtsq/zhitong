<template>
	<div class="site-wrapper site-page--login">
		<div class="site-content__wrapper">
			<div class="site-content">
				<div class="brand-info">
					<el-form ref="ruleForm" :rules="rules" :model="form">
						<h3 class="text-center">ZT-admin</h3>
						<el-form-item prop="username">
							<el-input type="text" v-model="form.username" placeholder="请输入用户名" size='medium'></el-input>
						</el-form-item>
						<el-form-item prop="password">
							<el-input type="password" v-model="form.password" placeholder="请输入密码" size='medium'>
							</el-input>
						</el-form-item>
						<el-form-item prop="captcha">
							<el-row :gutter="20">
								<el-col :span="14">
									<el-input v-model="form.captcha" placeholder="验证码">
									</el-input>
								</el-col>
								<el-col :span="10" class="login-captcha">
									<img :src="captchaPath" @click="getCaptcha" alt="" width="100%">
								</el-col>
							</el-row>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" class="w-100" size="medium" @click="toSubmit">
								立即登录
							</el-button>
						</el-form-item>
						<p class="text-center" ref="tip" style="color: red;font-size: 20px;margin-bottom: 0;"></p>
					</el-form>

				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				form: {
					uuid:"",
					username: "",
					password: "",
					captcha: "",
				},
				rules: {
					username: [{
						required: true,
						message: '请输入用户名',
						trigger: 'blur'
					}],
					password: [{
						required: true,
						message: '请输入密码',
						trigger: 'blur'
					}]
				},
				captchaPath: ''
			}
		},
		created() {
			this.getCaptcha()
		},
		methods: {
			//获取验证码
			getCaptcha(){
				this.form.uuid = String(Math.floor(Math.random()*100000))
				this.$http({
					url:`captcha.jpg?uuid=${this.form.uuid}`,
					responseType: 'blob',
					method:"get"
				}).then((res)=>{
					let blob = new Blob([res.data]);// 返回的文件流数据
					let url = window.URL.createObjectURL(blob);// 将他转化为路径
					this.captchaPath = url // 将转换出来的路径赋值给变量，其实和上步结合就可以
				})
			},
			//提交表单
			toSubmit(){
				this.$http({
					method:"post",
					url:"sys/login",
					data:this.form
				}).then((res)=>{
					if(res.data && res.data.code===0){
						localStorage.setItem('token',res.data.token)
						this.$router.replace({ name: 'home' })
					}else{
						this.getCaptcha()
						this.$message.error(res.data.msg)
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.site-wrapper.site-page--login {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background-color: rgba(38, 50, 56, .6);
		overflow: hidden;

		&:before {
			position: fixed;
			top: 0;
			left: 0;
			z-index: -1;
			width: 100%;
			height: 100%;
			content: "";
			background-image: url(~@/assets/img/login_bg.jpg);
			background-size: cover;
		}

		.site-content__wrapper {
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			padding: 0;
			margin: 0;
			overflow-x: hidden;
			overflow-y: auto;
			background-color: transparent;
		}

		.site-content {
			min-height: 100%;
			min-width: 100%;
			position: relative;
		}

		.brand-info {
			border-radius: 3px;
			padding: 25px;
			width: 400px;
			position: absolute;
			left: 50%;
			top: 50%;
			margin-left: -200px;
			margin-top: -200px;
			background-color: #eceee2b8;
		}




	}
</style>
