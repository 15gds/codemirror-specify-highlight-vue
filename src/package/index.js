import CodeMirrorSpecifyHighLight from "@/package/codemirror-specify-highlight.vue";
const components = [CodeMirrorSpecifyHighLight];

// 定义install方法
const install = function (Vue) {
    // 遍历注册所有的组件
    components.map(com=>{
      Vue.component(com.name,com)
    })
  }
// 引入
if(typeof window !== 'undefined' && window.Vue){
    install(window.Vue)
  }
  
  export default {
    install,
    // 组件列表
    ...components,
  }