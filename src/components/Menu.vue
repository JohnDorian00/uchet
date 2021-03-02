<template>
  <div class="vue-root" style="width:100%; height:100%;">

    <smart-menu id="menu" mode="tree" @click="menuClick">

      <smart-menu-item>Плановые цифры нагрузки учебного года</smart-menu-item>
      <smart-menu-items-group expanded>
        Планы
        <smart-menu-item>тест2</smart-menu-item>
      </smart-menu-items-group>
      <smart-menu-item>Плановые цифры нагрузки учебного года</smart-menu-item>
      <smart-menu-item>Плановые цифры нагрузки учебного года</smart-menu-item>
      <smart-menu-item>Плановые цифры нагрузки учебного года</smart-menu-item>
      <smart-menu-item>Плановые цифры нагрузки учебного года</smart-menu-item>
      <smart-menu-item>Плановые цифры нагрузки учебного года</smart-menu-item>
      <smart-menu-item>Плановые цифры нагрузки учебного года</smart-menu-item>
      <smart-menu-item>Плановые цифры нагрузки учебного года</smart-menu-item>


    </smart-menu>

  </div>
</template>

<script>

import "smart-webcomponents/source/styles/smart.default.css";
import "smart-webcomponents/source/modules/smart.menu.js";

export default {
  name: 'Menu',
  props: {},
  data() {
    return {
      componentsAssoc: {
        'Плановые цифры нагрузки учебного года': 'testComp',
        'тест2': 'testComp2'
      }
    }
  },
  methods: {
    menuClick(e) {
      let menuItem = e.target.innerText,
          componentName = this.componentsAssoc[menuItem];

      if (componentName) {
        this.$emit('changeComponent', componentName);
      }
    }
  },
  mounted() {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#menu {
  width: 300px;
  height: auto;
}
</style>
