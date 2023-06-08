## 安装
npm install codemirror-specify-highlight

## 引入
import CodeMirrorSpecifyHighLight from "codemirror-specify-highlight";

## 全局注册
Vue.use(CodeMirrorSpecifyHighLight)

## 使用
<CodeMirrorSpecifyHighLight :resultContent="resultContent"/>

### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| resultContent     | 传入内容           | string | — | — |
| tipTitle | 提示内容 | string | — | 注：不要使用自行输入{}拼接显示名称 |
| cancelText | 重置按钮文本 | string | — | 重置 |
| confirmText | 确定按钮文本 | string | — | 确定 |
| titles | 左右内容块标题 | array  | — | ["标题类", "你可以选择标题类和输入文字来组合生成名称"] |
| showFooter | 是否需要显示底部按钮 | boolean | true/false | true |