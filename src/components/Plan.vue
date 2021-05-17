<template>
  <div class="borderWhite" style="display: flex; flex-direction: column">

    <!--    Грид -->
    <div style="flex: 1 1 1px;">
      <Grid
          ref="grid"
          :winName="'Plan'"
          :columnsGrid="columns"
          :datafieldsGrid="datafields"
          :columngroupsGrid="columngroups"
      ></Grid>
    </div>


  </div>
</template>

<script>
import Grid from "@/components/Grid";
import * as db from "./db.js";

const tableName = "Streams";

export default {
  components: {
    Grid
  },

  name: "Plan",

  data() {
    return {
      windowName: this.$options._componentTag,

      columns: [
        {datafield: 'ID', hidden: true},
        {text: 'ФИО', datafield: 'Name', width: '20%'},
        {text: 'Всего', datafield: 'Institut', columngroup: 'pochas'},
        {text: 'Штатная', datafield: 'StQuantity', columngroup: 'pochas'},
        {text: 'Всего', datafield: 'BudjetSt', columngroup: 'nagr'},
        {text: '1 сем', datafield: 'UnBudgetSt', columngroup: 'nagr'},
        {text: '2 сем', datafield: 'UnBudgetSt1', columngroup: 'nagr'},
        {text: 'Итого за год', datafield: 'UnBudgetSt2'},
        {text: 'Почас за год', datafield: 'UnBudgetSt3'},


        {datafield: 'YearID', hidden: true},
        {datafield: 'Note', hidden: true}
      ],

      datafields: [
        {name: 'ID', type: 'int'},
        {name: 'Name', type: 'string'},
        {name: 'Institut', type: 'string'},
        {name: 'StQuantity', type: 'int'},
        {name: 'BudjetSt', type: 'int'},
        {name: 'UnBudgetSt', type: 'int'},
        {name: 'YearID', type: 'int'},
        {name: 'Note', type: 'string'}
      ],

      columngroups: [
        {text: 'Почасовая', align: 'center', name: 'pochas', parentgroup: 'nagr',},
        {text: 'Нагрузка учебного управления', align: 'center', name: 'nagr'}
      ],

    }
  },

  props: {
    bus: Object,
    busVue: Object,
    settings: Object
  },

  mounted() {
    // Обновление данных
    // this.updateGrid();
  },

  beforeDestroy() {

  },

  methods: {
    // Обновить параметры грида
    async updateGrid() {
      let data = await db.getTable(tableName);
      if (data && data.data) {
        data = data.data
      } else {
        console.error(data)
        this.bus.notify('Ошибка обновления данных', 'e');
        return
      }
      this.$refs.grid.setAll(data);
    }
  }
}
</script>


<style scoped>

.marginInput {
  /*margin: 5px;*/
  /*width: calc(100% - 10px);*/
  /*height: calc(100% - 10px);*/
  width: 100%;
  height: 100%;
}


.main {
  width: 100%;
  height: 100%;
}


.labels {
  flex: 0 0 160px;
  margin-right: 20px;
  margin-top: 5px;
}

</style>
