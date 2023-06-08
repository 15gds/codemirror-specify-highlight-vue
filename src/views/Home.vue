<template>
  <div class="home">
    <el-button @click="openDialogVisible">设置</el-button>

    <el-dialog title="dialogTitle" :visible.sync="dialogVisible">
          <CodeMirrorSpecifyHighLight />
    </el-dialog>

    <CodeMirrorSpecifyHighLight />
  </div>
</template>

<script lang="ts">
import CodeMirrorSpecifyHighLight from "@/package/codemirror-specify-highlight.vue";
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {
    CodeMirrorSpecifyHighLight,
  },
})
export default class Home extends Vue {
  private dialogVisible: boolean = false;
  private openDialogVisible():void{
    this.dialogVisible = true
  }
}
</script>
