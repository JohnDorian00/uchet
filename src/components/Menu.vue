<template>
  <smart-tree
      id="menu"
      class="animation"
      filterable
      filter-mode="containsIgnoreCase"
      scroll-mode="scrollButtons"
      toggle-mode='click'
      @click="menuClick"
      selected-indexes='[ "8" ]'
  >

    <smart-tree-item>Плановые цифры нагрузки учебного года</smart-tree-item>

    <smart-tree-items-group>
      План
      <smart-tree-items-group>
        Индивидуальный учебный план
        <smart-tree-item>Почасовая УУ</smart-tree-item>
        <smart-tree-item>Почасовая (институт)</smart-tree-item>
        <smart-tree-item>Штатная нагрузка</smart-tree-item>
      </smart-tree-items-group>
      <smart-tree-item>Сводный план работы кафедры</smart-tree-item>
      <smart-tree-item>Штатное расписание</smart-tree-item>
      <smart-tree-item>План распределения штатной нагрузки Учебного управления</smart-tree-item>
      <smart-tree-item>План распределения почасовой нагрузки Учебного управления</smart-tree-item>
      <smart-tree-item>План распределения нагрузки института</smart-tree-item>
      <smart-tree-items-group>
        Распределение нагрузки Учебного управления
        <smart-tree-item>I семестр</smart-tree-item>
        <smart-tree-item>II семестр</smart-tree-item>
      </smart-tree-items-group>
      <smart-tree-items-group>
        Распределение нагрузки института
        <smart-tree-item>I семестр</smart-tree-item>
        <smart-tree-item>II семестр</smart-tree-item>
      </smart-tree-items-group>
    </smart-tree-items-group>


    <smart-tree-items-group>
      Учёт
      <smart-tree-items-group>
        Учёт выполнения нагрузки института
        <smart-tree-items-group>
          I семестр
          <smart-tree-item>Сентябрь</smart-tree-item>
          <smart-tree-item>Октябрь</smart-tree-item>
          <smart-tree-item>Ноябрь</smart-tree-item>
          <smart-tree-item>Декабрь</smart-tree-item>
          <smart-tree-item>Январь</smart-tree-item>
        </smart-tree-items-group>
        <smart-tree-items-group>
          II семестр
          <smart-tree-item>Февраль</smart-tree-item>
          <smart-tree-item>Март</smart-tree-item>
          <smart-tree-item>Апрель</smart-tree-item>
          <smart-tree-item>Май</smart-tree-item>
          <smart-tree-item>Июнь</smart-tree-item>
        </smart-tree-items-group>
        <smart-tree-item>Факт выполнения</smart-tree-item>
      </smart-tree-items-group>

      <smart-tree-items-group>
        Учёт выполнения почасовой нагрузки Учебного управления
        <smart-tree-items-group>
          I семестр
          <smart-tree-item>Сентябрь</smart-tree-item>
          <smart-tree-item>Октябрь</smart-tree-item>
          <smart-tree-item>Ноябрь</smart-tree-item>
          <smart-tree-item>Декабрь</smart-tree-item>
          <smart-tree-item>Январь</smart-tree-item>
        </smart-tree-items-group>
        <smart-tree-items-group>
          II семестр
          <smart-tree-item>Февраль</smart-tree-item>
          <smart-tree-item>Март</smart-tree-item>
          <smart-tree-item>Апрель</smart-tree-item>
          <smart-tree-item>Май</smart-tree-item>
          <smart-tree-item>Июнь</smart-tree-item>
        </smart-tree-items-group>
        <smart-tree-item>Факт выполнения</smart-tree-item>
      </smart-tree-items-group>
    </smart-tree-items-group>

    <smart-tree-item>Преподаватели</smart-tree-item>
    <smart-tree-item>Дисциплины</smart-tree-item>
    <smart-tree-item>Учебные потоки</smart-tree-item>
    <smart-tree-item>Виды учебной работы</smart-tree-item>
    <smart-tree-item>Должности</smart-tree-item>
    <smart-tree-item>Настройки</smart-tree-item>

    <!--        <smart-tree-items-group>-->
    <!--          Products-->
    <!--          <smart-tree-item>PC products</smart-tree-item>-->
    <!--          <smart-tree-item>Mobile products</smart-tree-item>-->
    <!--          <smart-tree-item>All products</smart-tree-item>-->
    <!--        </smart-tree-items-group>-->
  </smart-tree>
</template>

<script>


import "smart-webcomponents/source/modules/smart.tree.js";
import "smart-webcomponents/source/styles/smart.default.css";

export default {
  name: 'Menu',
  props: {},
  data() {
    return {
      componentsAssoc: {
        'Плановые цифры нагрузки учебного года': 'testComp',
        'Должности': 'Doljnosti',
        'Настройки': 'Settings'
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

smart-tree {
  height: 100%;
  width: 300px;
  font-size: 13px;

}
</style>
