<template>
  <div>
    <div class="packaged_transfer">
      <div class="box_panel left_panel">
        <el-table
          :data="templeteList"
          style="width: 100%"
          height="400px"
          @row-click="insert"
          ref="allSelList"
        >
          <el-table-column prop="name" :label="titles[0]"> </el-table-column>
        </el-table>
      </div>
      <div class="box_panel right_panel">
        <div class="header">
          <div
            class="title"
            v-if="titles && titles.length && titles.length === 2"
          >
            {{ titles[1] }}
          </div>
        </div>
        <div class="content-box" style="height: 329px">
          <codemirror
            ref="codemirrorRef"
            :options="cmOptions"
            @changes="changeContent"
            class="codemirror-area"
          ></codemirror>
        </div>
      </div>
    </div>

    <div v-if="showFooter" class="footer">
      <div class="Danger">
        {{ tipTitle }}
      </div>
      <div class="dialog-footer">
        <el-button
          type="info"
          @click.stop="clearSetFormName"
          id="btn-cancel-addoredit-org"
          >{{ cancelText }}</el-button
        >
        <el-button
          type="primary"
          @click.stop="submitSetFormName"
          id="btn-save-addoredit-org"
          >{{ confirmText }}</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { codemirror } from "vue-codemirror";
import "codemirror/lib/codemirror.css";

import "codemirror/theme/base16-light.css"; // 这里引入的是主题样式
import "codemirror/mode/javascript/javascript.js"; // 这里引入的模式的js

export default {
  name: "CodeMirrorSpecifyHighLight",
  components: {
    codemirror,
  },
  props: {
    resultContent: {
      type: String,
      default: "",
    },
    tipTitle: {
      type: String,
      default: "注：不要使用自行输入{}拼接显示名称",
    },
    cancelText: {
      type: String,
      default: "重置",
    },
    confirmText: {
      type: String,
      default: "确定",
    },
    titles: {
      type: Array,
      default: () => ["标题类", "你可以选择标题类和输入文字来组合生成名称"],
    },
    showFooter: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      result: "",
      templeteList: [
        { id: "1", name: "测试", code: "test" },
        { id: "2", name: "测试2", code: "test2" },
      ],

      cmOptions: {
        lineWrapping: true,
        tabSize: 4, // Tab键空格数
        mode: "text/javascript", // 模式
        theme: "base16-light", // 主题
        line: true,
      },

      content: "",
    };
  },
  methods: {
    compare(prop, order) {
      return (a, b) => {
        let v1 = a[prop].length;
        let v2 = b[prop].length;
        if (order === true) {
          return v1 - v2;
        } else {
          return v2 - v1;
        }
      };
    },
    findStr(item, start, i) {
      const index = this.result.indexOf(item.name, start);
      if (index > -1) {
        const spl = this.result.split(item.name);
        const str1 = spl[i]
          .split("")
          .reverse()
          .find((item) => {
            return item === "{" || item === "}";
          });
        const str2 = spl[i + 1].split("").find((item) => {
          return item === "{" || item === "}";
        });
        if (str1 !== "{" && str2 !== "}") {
          let resArr = this.result.split("");
          resArr.splice(index, item.name.length, `{${item.code}}`);
          this.result = resArr.join("");
          this.findStr(item, index + item.code.length + 2, i);
        } else {
          this.findStr(item, index + item.code.length, i);
        }
      }
    },
    changeValue(val) {
      if (val) {
        this.result = val;
        if (val) {
          this.templeteList.sort(this.compare("name", false));
          this.templeteList.forEach((item) => {
            this.findStr(item, 0, 0);
          });
        }
      }
    },
    // 确认操作
    submitSetFormName() {
      this.changeValue(this.content);
      let val = this.result;
      alert("值：" + val);
      this.content = "";
    },
    // 重置操作
    clearSetFormName() {
      this.content = "";
    },
    async insert(row) {
      const pos1 = this.$refs.codemirrorRef.codemirror.getCursor();
      const pos2 = {};
      pos2.line = pos1.line;
      pos2.ch = pos1.ch;
      var dom = document.createElement("span");
      dom.className = "cm-field";
      dom.innerHTML = row.name;
      const bookMark = row.name;
      const endPos = { line: pos2.line, ch: pos2.ch + bookMark.length };
      this.$refs.codemirrorRef.codemirror.focus();
      this.$refs.codemirrorRef.codemirror.replaceRange(bookMark, pos2);
      this.$refs.codemirrorRef.codemirror.markText(pos2, endPos, {
        replacedWith: dom,
      });
      this.content = this.$refs.codemirrorRef.codemirror.getValue();
    },
    changeContent() {
      this.content = this.$refs.codemirrorRef.codemirror.getValue();
    },
    change(allText) {
      let res = allText.match(/\{.*?\}/g);
      if (res) {
        let search_startPoint = 0;
        for (let i = 0; i < res.length; i++) {
          let item = res[i];
          let index_fromStartPoint = allText
            .slice(search_startPoint)
            .indexOf(item);
          if (index_fromStartPoint > -1) {
            search_startPoint += index_fromStartPoint;

            let dom = document.createElement("span");

            dom.className = "cm-field";

            let field_match = this.templeteList.find(
              (item2) => "{" + item2.code + "}" == item
            );

            let text = document.createTextNode(
              field_match ? field_match.name : ""
            );

            dom.appendChild(text);

            const pos1 = this.$refs.codemirrorRef.codemirror.getCursor();
            const pos2 = {};
            pos2.line = pos1.line;
            pos2.ch = pos1.ch + text.length + 1;
            this.$refs.codemirrorRef.codemirror.setCursor(pos2);

            let from = { ch: 0, line: 0 };
            this.$refs.codemirrorRef.codemirror.markText(
              {
                line: from.line,
                ch: from.ch + search_startPoint,
              },
              {
                line: from.line,
                ch: from.ch + search_startPoint + item.length,
              },
              {
                replacedWith: dom,
                handleMouseEvents: true,
                atomic: true,
              }
            );
            search_startPoint += item.length;
          }
        }

        this.content = this.$refs.codemirrorRef.codemirror.getValue();
      }
    },
    setCodeMirror(val) {
      if (val == "" || val == null) {
        this.$refs.codemirrorRef.codemirror.setValue("");
      } else {
        this.$refs.codemirrorRef.codemirror.setValue(val);
      }
      setTimeout(() => {
        this.$refs.codemirrorRef.codemirror.refresh();
      }, 100);

      this.change(this.$refs.codemirrorRef.codemirror.getValue());
    },
  },
  watch: {
    content: {
      handler(v) {
        if (v == "") {
          this.$refs.codemirrorRef.codemirror.setValue("");
        }
      },
    },
  },
  created() {},
  mounted() {
    setTimeout(() => {
      this.setCodeMirror(this.resultContent);
    }, 200);
  },
};
</script>

<style lang="less" scoped>
.footer {
  text-align: center;
}
.Danger {
  padding: 20px 0;
  color: #f56c6c;
}
::v-deep {
  .cm-field {
    background-image: linear-gradient(-117deg, #90dcd4, #7cdfc2);
  }
  .cm-current-field,
  .cm-field {
    display: inline-block;
    height: 22px;
    line-height: 22px;
    color: #fff;
    margin: 0 3px;
    border-radius: 3px;
    padding: 0 8px;
    font-size: 13px;
  }
  .cm-delField {
    display: inline-block;
    height: 22px;
    line-height: 22px;
    background: #f26245;
    color: #fff;
    margin: 0 3px;
    border-radius: 3px;
    padding: 0 8px;
    font-size: 13px;
  }
  .CodeMirror-widget {
    height: 28px;
    line-height: 28px;
  }
}
.packaged_transfer {
  display: flex;
  border-radius: 4px;
  width: 684px;
  word-break: break-all;
  box-sizing: border-box;
  margin: auto;
  &:after {
    content: "";
    display: table;
    clear: both;
  }
  .header {
    padding: 0 15px;
    background: #f5f7fa;
    height: 46.22px;
    line-height: 46.22px;
    font-weight: 400;
    display: flex;
    &:after {
      content: "";
      clear: both;
      display: block;
    }
    .title {
      font-size: 14px;
      // width: 200px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      flex: 1;
      text-align: left;
    }
    .cancelChoose {
      color: #b0b0b0;
      cursor: pointer;
      text-align: right;
      font-size: 12px;
      &:hover {
        color: #1890ff;
      }
    }
  }
  .option-container {
    width: 19%;
    height: 371px;
    float: left;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .option_item {
      display: block;
      border-radius: 50%;
      color: #fff;
      background-color: #409eff;
      width: 36px;
      height: 36px;
      line-height: 36px;
      text-align: center;
      cursor: pointer;
      margin-bottom: 10px;
      i {
        font-size: 14px;
      }
    }
    .option_item.disabled {
      cursor: not-allowed;
      border: 1px solid #dcdfe6;
      background-color: #f5f7fa;
      color: #c0c4cc;
    }
  }
  .box_panel {
    border-radius: 4px;
    float: left;
    border: 1px solid #dcdfe6;
    .content-box {
      padding: 10px;
      text-align: left;
      color: #909399;
    }
  }
  .left_panel {
    width: 320px;
  }
  .right_panel {
    width: 360px;
    height: 400px;
  }
  .packaged_transfer_checkbox {
    .el-radio {
      display: block;
      margin-right: 0;
      margin-bottom: 10px;
      &:first-child {
        margin-top: 10px;
      }
    }
    .el-radio.id-checked {
      color: #409eff;
    }
  }
}
</style>