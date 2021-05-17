<template>
  <div class="borderWhite" style="display: flex; flex-direction: column">

    <!--    Грид -->
    <div style="flex: 1 1 1px;">
      <Grid
          ref="grid"
          :winName="'NagrPochas'"
          :columnsGrid="columns"
          :datafieldsGrid="datafields"
          :noAutoCreate="true"
      ></Grid>
    </div>


  </div>
</template>

<script>
import Grid from "@/components/Grid";
import * as db from "./db.js";


export default {
  components: {
    Grid
  },

  name: "NagrPochas",

  data() {
    return {
      windowName: this.$options._componentTag,

      columns: [
        {datafield: 'ID', hidden: true},
        {text: 'ФИО', datafield: 'Name', width: '20%'},
        {text: 'Должность', datafield: 'Institut'},
        {text: 'Ставка', datafield: 'StQuantity'}

      ],

      datafields: [
        {name: 'ID', type: 'int'},
        {name: 'Name', type: 'string'},
        {name: 'Institut', type: 'string'},
        {name: 'StQuantity', type: 'int'}
      ]
    }
  },

  props: {
    bus: Object,
    busVue: Object,
    settings: Object
  },

  async mounted() {
    let data = await db.getTable('Jobs');
    if (data && data.data) {
      data = data.data

      if (data && Array.isArray(data) && data.length > 0) {
        data.forEach((item) => {
          this.columns.push({text: item.Name, datafield: 'col' + item.Job_ID, cellsalign: "center", align: "center"});
          this.datafields.push({name: 'col' + item.Job_ID, type: 'int'});
        })
        this.columns.push({text: 'Всего', datafield: 'all', cellsalign: "center", align: "center"});
        this.datafields.push({name: 'all', type: 'int'});
        this.columns.push({text: 'Итого', datafield: 'itog', cellsalign: "center", align: "center"});
        this.datafields.push({name: 'itog', type: 'int'});
      }
      this.$refs.grid.createGrid();
    } else {
      console.error(data)
      this.bus.notify('Ошибка обновления данных', 'e');
    }
  },

  beforeDestroy() {

  },

  methods: {
    // Обновить параметры грида
    async updateGrid() {
      let data = await db.getTable('Jobs');
      console.info(data);
      if (data && data.data) {
        data = data.data;
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
