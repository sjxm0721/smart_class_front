<template>
  <div ref="editor"></div>
</template>

<script>
import WangEditor from 'wangeditor'

export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      editor: null
    }
  },
  mounted() {
    this.initEditor()
  },
  methods: {
    initEditor() {
      this.editor = new WangEditor(this.$refs.editor)
      this.editor.config.onchange = (html) => {
        this.$emit('input', html)
      }
      this.editor.create()
      this.editor.txt.html(this.value)
    }
  },
  watch: {
    value(newVal) {
      this.editor.txt.html(newVal)
    }
  },
  destroyed() {
    this.editor.destroy()
    this.editor = null
  }
}
</script>

<style scoped>
.w-e-text-container {
  height: 300px !important;
}
</style>
