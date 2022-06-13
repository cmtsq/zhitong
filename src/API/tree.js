export function getTree(res,id,list){
    for(let i of res){
      if(i.parentId==id){
        list.push(i)
      }
    }
    for(let j of list){
      j.children=[]
      getTree(res,j.menuId,j.children)
      if(j.children.length==0){
        delete j.children
      }
    }
    return list
}