<template>
  <div id="app" style="display: flex; margin-top: 0;">
    <div style="flex: 0 0 300px">
      <Menu @changeComponent="changeComponent"></Menu>
    </div>
    <div style="flex: 1 1 1px; margin-left: 10px">
      <component v-bind:is="currentComponent"></component>
    </div>
  </div>
</template>

<script>

import Menu from "@/components/Menu";
import testComp from "@/components/testComp";
import testComp2 from "@/components/testComp2";

export default {
  name: 'App',
  components: {
    Menu,
    testComp,
    testComp2
  },
  data() {
    return {
      currentComponent: 'testComp'
    }
  },
  methods: {
    changeComponent(componentName) {
      this.currentComponent = componentName;
    }
  }

}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
