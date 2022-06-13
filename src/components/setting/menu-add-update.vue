<template>
	<el-dialog :title="this.menuForm.menuId?'编辑菜单':'新增菜单'" :visible.sync="visible" :before-close="handleClose">
		<el-form :model="menuForm" :rules="menuRule" ref="menuForm" label-width="80px">
			<el-form-item label="类型:">
				<el-radio-group v-model="radio">
					<el-radio :label="0">目录</el-radio>
					<el-radio :label="1">菜单</el-radio>
					<el-radio :label="2">按钮</el-radio>
				</el-radio-group>
			</el-form-item>
			<template v-if="radio === 0">
				<el-form-item label="目录名称" prop="name">
					<el-input v-model="menuForm.name" autocomplete="off" placeholder="目录名称"></el-input>
				</el-form-item>
			</template>
			<template v-else-if="radio === 1">
				<el-form-item label="菜单名称" prop="name">
					<el-input v-model="menuForm.name" autocomplete="off" placeholder="菜单名称"></el-input>
				</el-form-item>
			</template>
			<template v-else-if=" radio===2 ">
				<el-form-item label="按钮名称" prop="name">
					<el-input v-model="menuForm.name" autocomplete="off" placeholder="按钮名称"></el-input>
				</el-form-item>
			</template>
			<el-form-item label="上级菜单" prop="parentName">
				<el-popover ref="menuPopover" placement="bottom-start" trigger="click">
					<el-tree :data="menuList" :props="menuListProps" node-key="menuId" ref="menuTree"
						@current-change="treeChange" :default-expand-all="true" :highlight-current="true"
						:expand-on-click-node="false">
					</el-tree>
				</el-popover>
				<el-input v-model="menuForm.parentName" v-popover:menuPopover :readonly="true" placeholder="点击选择上级菜单"
					class="menu-list__input"></el-input>
			</el-form-item>
			<el-form-item v-if="radio===1" label="菜单路由" prop="url">
				<el-input v-model="menuForm.url" placeholder="菜单路由"></el-input>
			</el-form-item>
			<el-form-item v-if="radio!==0" label="授权标识" prop="perms">
				<el-input v-model="menuForm.perms" placeholder="多个用逗号分隔, 如: user:list,user:create"></el-input>
			</el-form-item>
			<el-form-item v-if="radio!==2" label="排序号">
				<el-input-number width="120" :min="0" v-model="menuForm.orderNum"></el-input-number>
			</el-form-item>
			<el-form-item v-if="radio!==2" label="菜单图标" prop="icon">
				<el-row>
					<el-col :span="22">
						<el-popover ref="iconPopover" placement="bottom-start" trigger="click">
							<div>
								<el-button v-for="(item, index) in iconList" :key="index" @click="iconCheck(item)">
								</el-button>
							</div>
						</el-popover>
						<el-input v-model="menuForm.icon" v-popover:iconPopover :readonly="true" placeholder="菜单图标名称">
						</el-input>
					</el-col>
					<el-col :span="2" style="padding-left: 10px;">
						<el-tooltip placement="top" effect="light">
							<div slot="content" style="width: ;">全站推荐使用SVG Sprite, 详细请参考:<a
									href="//github.com/daxiongYang/renren-fast-vue/blob/master/src/icons/index.js"
									target="_blank">icons/index.js</a>描述</div>
							<i class="el-icon-warning"></i>
						</el-tooltip>
					</el-col>
				</el-row>
			</el-form-item>
		</el-form>
		<span slot="footer" class="dialog-footer">
			<el-button @click="visible = false">取 消</el-button>
			<el-button type="primary" @click="toMenuAddUpdate">确 定</el-button>
		</span>
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
				menuForm: {
					menuId: "",
					name: '',
					parentId: 0,
					parentName: '',
					url: '',
					perms: '',
					orderNum: 0,
					icon: '',
				},
				radio: 0,
				iconList: [],
				menuRule: {
					name: [{
						required: true,
						message: '名称不能为空',
						trigger: 'blur'
					}],
					parentName: [{
						required: true,
						message: '上级菜单不能为空',
						trigger: 'change'
					}]
				},
				//菜单列表
				menuList: [],
				menuListProps: {
					label: 'name',
					children: 'children'
				}
			};
		},
		methods: {
			handleClose(done) {
				this.$confirm('确认关闭？')
					.then(_ => {
						done();
					})
					.catch(_ => {});
			},
			open(id) {
				this.menuList = []
				this.menuForm.menuId = id || 0
				this.$http.get('sys/menu/select').then((res) => {
					this.visible = true
					getTree(res.data.menuList, -1, this.menuList)
					this.$nextTick(() => {
						this.$refs['menuForm'].resetFields() //对整个表单进行重置
					})
					//新增||修改
					if (this.menuForm.menuId) {
						this.$http(`sys/menu/info/${this.menuForm.menuId}`).then((res) => {
							this.radio = res.data.menu.type
							this.menuForm.menuId = res.data.menu.menuId
							this.menuForm.name = res.data.menu.name
							this.menuForm.parentId = res.data.menu.parentId
							this.menuForm.url = res.data.menu.url
							this.menuForm.perms = res.data.menu.perms
							this.menuForm.orderNum = res.data.menu.orderNum
							this.menuForm.icon = res.data.menu.icon
							// 菜单设置当前选中节点
							this.$refs.menuTree.setCurrentKey(this.menuForm.parentId)
							this.menuForm.parentName = this.$refs.menuTree.getCurrentNode()['name'] || {} [
								'name'
							]
						})
					} else {
						this.menuForm.orderNum= 0
						this.menuForm.icon = ""
					}
				})
			},
			//提交表单
			toMenuAddUpdate() {
				this.$http({
					url: `sys/menu/${this.menuForm.menuId?'update':'save'}`,
					method: 'post',
					data: {
						'menuId': this.menuForm.menuId || undefined,
						'type': this.radio,
						'name': this.menuForm.name,
						'parentId': this.menuForm.parentId,
						'url': this.menuForm.url,
						'perms': this.menuForm.perms,
						'orderNum': this.menuForm.orderNum,
						'icon': this.menuForm.icon
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
					} else {
						this.$message.error(res.data.msg)
					}
				})
			},
			// 菜单树选中
			treeChange(data, node) {
				this.menuForm.parentId = data.menuId
				this.menuForm.parentName = data.name
			},
			//图标选择
			iconCheck(item) {
				this.icon = item.iconName
			}
		}
	};
</script>

<style>
</style>
