<template>
  <div class="main">

    <div style="display: flex; flex-direction: column; justify-content: center; align-items: baseline">

      <div class="menuItem">
        <div class="labels">
          Название института:
        </div>
        <div style="flex: 1 1 1px; width: 100%">
          <smart-combo-box style="width: 100%">
            <smart-list-item>АБП</smart-list-item>
            <smart-list-item>АВТ</smart-list-item>
            <smart-list-item>ИМТК</smart-list-item>
            <smart-list-item>ИПСС</smart-list-item>
            <smart-list-item>ИТТСУ</smart-list-item>
            <smart-list-item>ИУЦТ</smart-list-item>
            <smart-list-item>ИЭФ</smart-list-item>
            <smart-list-item>НИИ ТТС</smart-list-item>
            <smart-list-item>РАПС</smart-list-item>
            <smart-list-item>РОАТ</smart-list-item>
            <smart-list-item>ЮИ</smart-list-item>
          </smart-combo-box>
        </div>
      </div>

      <div class="menuItem">
        <div class="labels">
          Директор института:
        </div>
        <div style="flex: 0 0 1px;">
          <smart-text-box select-all-on-focus></smart-text-box>
        </div>
      </div>


      <button id="toggle-dark-mode">Toggle Dark Mode</button>
      <button id="reset-to-system">Reset to System Theme</button>

    </div>
    <a href="http://localhost:8081/" target="_blank">132131233</a>

    <!--    <div style="flex: 1 1 1px; margin-right: 10px;">-->
    <!--      Название каф. (сокр):-->
    <!--    </div>-->
    <!--    <div style="flex: 1 1 1px">-->
    <!--      <smart-text-box placeholder=""></smart-text-box>-->
    <!--    </div>-->

    <!--    <div style="flex: 1 1 1px; margin-right: 10px;">-->
    <!--      Зав. кафедрой:-->
    <!--    </div>-->
    <!--    <div style="flex: 1 1 1px">-->
    <!--      <smart-text-box placeholder=""></smart-text-box>-->
    <!--    </div>-->

    <!--    <div style="flex: 1 1 1px; margin-right: 10px;">-->
    <!--      Ставка:-->
    <!--    </div>-->
    <!--    <div style="flex: 1 1 1px">-->
    <!--      <smart-text-box placeholder=""></smart-text-box>-->
    <!--    </div>-->


    <!--    <div style="flex: 1 1 1px">-->
    <!--      <div class="inputText">-->
    <!--        Название института: <br/>-->
    <!--      </div>-->

    <!--      Директор института: <br/>-->
    <!--      Название кафедры: <br/>-->
    <!--      Название каф. (сокр): <br/>-->
    <!--      Зав. кафедрой: <br/>-->
    <!--      Ставка: <br/>-->
    <!--    </div>-->
    <!--    <div style="flex: 1 1 1px; display: flex; flex-direction: column; justify-content: left">-->
    <!--      <smart-combo-box class="input">-->
    <!--        <smart-list-item>АБП</smart-list-item>-->
    <!--        <smart-list-item>АВТ</smart-list-item>-->
    <!--        <smart-list-item>ИМТК</smart-list-item>-->
    <!--        <smart-list-item>ИПСС</smart-list-item>-->
    <!--        <smart-list-item>ИТТСУ</smart-list-item>-->
    <!--        <smart-list-item>ИУЦТ</smart-list-item>-->
    <!--        <smart-list-item>ИЭФ</smart-list-item>-->
    <!--        <smart-list-item>НИИ ТТС</smart-list-item>-->
    <!--        <smart-list-item>РАПС</smart-list-item>-->
    <!--        <smart-list-item>РОАТ</smart-list-item>-->
    <!--        <smart-list-item>ЮИ</smart-list-item>-->
    <!--      </smart-combo-box>-->
    <!--      <smart-text-box class="input" placeholder=""></smart-text-box>-->
    <!--      <smart-text-box class="input" placeholder=""></smart-text-box>-->
    <!--      <smart-text-box class="input" placeholder=""></smart-text-box>-->
    <!--      <smart-text-box class="input" placeholder=""></smart-text-box>-->
    <!--      <smart-text-box class="input" placeholder=""></smart-text-box>-->
    <!--      <smart-text-box class="input" placeholder=""></smart-text-box>-->
    <!--    </div>-->


  </div>
</template>

<script>

import "smart-webcomponents/source/styles/smart.default.css";
import "smart-webcomponents/source/modules/smart.combobox.js";
import "smart-webcomponents/source/modules/smart.textbox.js";

// const {ipcRenderer} = require('electron');

export default {
  name: "Settings",
  data() {
    return {
      mainClass: true,
    }
  },
  props: {
    bus: Object
  },

  mounted() {
    // document.getElementById('toggle-dark-mode').addEventListener('click', async () => {
    //   const isDarkMode = await ipcRenderer.invoke('dark-mode:toggle')
    //   document.getElementById('theme-source').innerHTML = isDarkMode ? 'Dark' : 'Light'
    // })
    //
    // document.getElementById('reset-to-system').addEventListener('click', async () => {
    //   await ipcRenderer.invoke('dark-mode:system')
    //   document.getElementById('theme-source').innerHTML = 'System'
    // })
  },

  methods: {}
}
</script>

<style scoped>

.main {
  width: calc(100% - 20px);
  height: calc(100% - 40px);
  margin: 20px;
  /*margin: 20px -40px -40px 20px;*/
}

.menuItem {
  margin-bottom: 10px;
  flex: 0 0 30px;
  display: flex;
  justify-content: left;
  /*align-items: center;*/
  width: 100%;
  text-align: end;
}

.labels {
  flex: 0 0 160px;
  margin-right: 20px;
  margin-top: 5px;
}

</style>
