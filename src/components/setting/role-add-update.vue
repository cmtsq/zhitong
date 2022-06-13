<template>
	<el-dialog :title="form.roleId ?'修改信息':'添加角色'" :visible.sync="visible">
		<el-form :model="form" :rules="formRule" ref="form" label-width="80px">
			<el-form-item label="角色名称" prop="roleName">
				<el-input v-model="form.roleName" autocomplete="off" placeholder="角色名称"></el-input>
			</el-form-item>
			<el-form-item label="备注" prop="remark">
				<el-input v-model="form.remark" autocomplete="off" placeholder="备注"></el-input>
			</el-form-item>
			<el-form-item size="mini" label="授权">
				<el-tree :data="menuData" show-checkbox node-key="menuId" :props="menuProps" :default-expand-all="true"
					:highlight-current="true" ref="treeData">

				</el-tree>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="visible = false">取 消</el-button>
			<el-button type="primary" @click="addUpdateTo">确 定</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import {
		getTree
	} from '@/API/tree'
	export default {
		data() {
			return {
				visible: false,
				form: {
					roleId: 0,
					roleName: '',
					remark: '',
					menuIdList: []
				},
				formRule: {
					roleName: [{
						required: true,
						message: '角色名称不能为空',
						trigger: 'blur'
					}],
				},
				menuData: [],
				menuProps: {
					children: 'children',
					label: 'name'
				}
			}
		},
		methods: {
			// 打开模态框
			open(id) {
				console.log(id)
				this.menuData = []; //清空菜单数据
				this.form.roleId = id || 0
				this.$http.get('sys/menu/list').then((res) => {
					getTree(res.data, 0, this.menuData)
					this.visible = true
					this.$nextTick(() => {
						this.$refs['form'].resetFields()
						this.$refs.treeData.setCheckedKeys([])
					})
					//修改的数据渲染
					if (this.form.roleId) {
						this.$http.get(`sys/role/info/${this.form.roleId}`).then((res) => {
							// console.log(res.data)
							if (res.data.code === 0) {
								this.form.roleName = res.data.role.roleName;
								this.form.remark = res.data.role.remark
								var index = res.data.role.menuIdList.indexOf(-6666)
								// console.log(index)
								if (index !== -1) {
									rea.data.role.menuIdList.splice(index, res.data.role.menuIdList.length -index)
								}
								//setCheckedKeys设置设置目前勾选的节点，使用此方法必须设置 node-key 属性
								//getCheckedKeys若节点可被选择（即 show-checkbox 为 true），则返回目前被选中的节点的 key 所组成的数组
								this.$refs.treeData.setCheckedKeys(res.data.role.menuIdList)
								// console.log(this.$refs.treeData.getCheckedKeys())
							}
						})

					}
				})
			},
			//提交表单
			addUpdateTo() {
				this.$http({
					method:'post',
					url: `sys/role/${this.form.roleId?'update':'save'}`,
					data: {
						'roleId': this.form.roleId || undefined,
						'roleName': this.form.roleName,
						'remark': this.form.remark,
						'menuIdList':this.$refs.treeData.getCheckedKeys()
					}
				}).then((res) => {
					if (res.data.code === 0) {
						this.$message({
							message: '操作成功',
							type: 'success',
							duration: 1000,
							onClose: () => {
								this.visible = false
								this.$emit('dataList')
							}
						})
					}else{
						this.$message.error(res.data.msg)
					}
				})
			},
		},
	}
</script>

<style>
</style>
