<template>
  <div id="app">
    <G6Editor mode="edit">

    </G6Editor>
  </div>
</template>

<script>
import G6Editor from './components/G6Editor'
export default {
  name: 'app',
  components:{G6Editor}
}
</script>

<style>
html, body {
    overflow: hidden;
    margin: 0;
    font-size: 12px;
}
#app{
  margin: 0;
  padding: 0;
}
</style>
