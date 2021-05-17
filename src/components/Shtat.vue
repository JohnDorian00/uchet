<template>
  <div style="display: flex; flex-direction: column">
    <!--    ag-theme-alpine-dark-->

    <!--    Грид -->
    <div class="borderWhite" style="flex: 1 1 1px; margin: 5px 0 0; display: flex; flex-direction: column">
      <div style="flex: 1 1 1px;">
        <Grid
            ref="grid1"
            :winName="'grid1'"
            :columnsGrid="columns"
            :datafieldsGrid="datafields"
        ></Grid>
      </div>
    </div>

    <div class="borderWhite" style="flex: 1 1 1px; margin: 5px 0 0; display: flex; flex-direction: column;">
      <div style="flex: 1 1 1px;">
        <Grid
            ref="grid2"
            :winName="'grid2'"
            :columnsGrid="columns2"
            :datafieldsGrid="datafields2"
        ></Grid>
      </div>
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

  name: "Shtat",

  data() {
    return {
      windowName: this.$options._componentTag,

      columns: [
        {datafield: 'ID', hidden: true},
        {text: 'Должность', datafield: 'DisciplinesName'},
        {text: 'План', datafield: 'StreamsName'},
        {text: 'Факт', datafield: 'JobsName'},
        {text: 'ВАК', datafield: 'Pochas'}
      ],

      datafields: [
        {name: 'ID', type: 'int'},
        {name: 'DisciplinesName', type: 'string'},
        {name: 'StreamsName', type: 'string'},
        {name: 'JobsName', type: 'string'},
        {name: 'Pochas', type: 'int'}
      ],

      columns2: [
        {datafield: 'ID', hidden: true},
        {text: 'Должность', datafield: 'Doljnost'},
        {text: 'ФИО', datafield: 'FIO'},
        {text: 'Ставка', datafield: 'Stavka'}
      ],

      datafields2: [
        {name: 'ID', type: 'int'},
        {name: 'Doljnost', type: 'string'},
        {name: 'FIO', type: 'string'},
        {name: 'Stavka', type: 'int'}
      ]
    }
  },

  props: {
    bus: Object,
    busVue: Object,
    settings: Object
  },

  async mounted() {
    // await this.updateGrid(1);
    // await this.updateGrid(2);
    // this.busVue.$on('delRow', this.removeRow);
  },

  beforeDestroy() {
    // this.busVue.$off('delRow');
  },

  methods: {
    // Обновить параметры грида
    async updateGrid(gridNum) {
      if (!this.selectedTeacher || !gridNum) return

      let err = await db.all("SELECT IndividualPlan_1.*, Disciplines.Name as DisciplinesName, Streams.Name as StreamsName, " +
          "Jobs.Name as JobsName FROM IndividualPlan_1 " +
          "INNER JOIN Disciplines ON Disciplines.ID = IndividualPlan_1.Discipl_ID " +
          "INNER JOIN Streams ON Streams.ID = IndividualPlan_1.Group_ID " +
          "INNER JOIN Jobs ON Jobs.Job_ID = IndividualPlan_1.Job_ID " +
          "WHERE Semestr = " + (gridNum) + " AND Prep_ID = " + this.selectedTeacher + ";");


      if (err && !Array.isArray(err)) {
        console.error(err)
        // this.bus.notify('Ошибка обновления', 'e');
      } else {
        // this.resetAllInputs();
        this.$refs["grid" + gridNum].setAll(err);
      }
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
