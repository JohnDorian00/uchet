<template>
  <div style="display: flex; flex-direction: row">
    <div style="flex: 1 1 1px; display: flex; flex-direction: column">
      <!--    ag-theme-alpine-dark-->

      <div class="borderWhite" style="flex: 0 0 1px; margin: 0; display: flex; flex-direction: column">
        <div style="flex: 0 0 10px;">
          <b-input-group prepend="Преподаватель">
            <b-form-select v-model="selectedTeacher" :options="optionsTeachers"
                           @change="teacherChanged"></b-form-select>
          </b-input-group>
        </div>
      </div>
      <!--    Грид -->
      <div class="borderWhite" style="flex: 1 1 1px; margin: 5px 0 0; display: flex; flex-direction: column">
        <div class="borderWhite" style="margin: 0 0 5px;">
          I семестр
        </div>
        <div style="flex: 1 1 1px;">
          <Grid
              ref="grid1"
              :winName="'grid1'"
              :columnsGrid="columns"
              :datafieldsGrid="datafields"
              :columngroupsGrid="columngroups"
          ></Grid>
        </div>
      </div>

      <div class="borderWhite" style="flex: 1 1 1px; margin: 5px 0 0; display: flex; flex-direction: column;">
        <div class="borderWhite" style="margin: 0 0 5px;">
          II семестр
        </div>
        <div style="flex: 1 1 1px;">
          <Grid
              ref="grid2"
              :winName="'grid2'"
              :columnsGrid="columns2"
              :datafieldsGrid="datafields2"
              :columngroupsGrid="columngroups2"
          ></Grid>
        </div>
      </div>

    </div>
    <div style="flex: 0 0 150px; ">
      Фото
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

  name: "IndividualPlanHours",

  data() {
    return {
      windowName: this.$options._componentTag,

      columns: [
        {datafield: 'ID', hidden: true},
        {text: 'Дисциплина', datafield: 'DisciplinesName'},
        {text: 'Поток', datafield: 'StreamsName'},
        {text: 'Вид занятия', datafield: 'JobsName'},
        {text: 'почас', datafield: 'Pochas', columngroup: 'nagruzka'},
        {datafield: 'DisciplinesID', hidden: true},
        {datafield: 'StreamsID', hidden: true},
        {datafield: 'JobsID', hidden: true}
      ],

      datafields: [
        {name: 'ID', type: 'int'},
        {name: 'DisciplinesName', type: 'string'},
        {name: 'StreamsName', type: 'string'},
        {name: 'JobsName', type: 'string'},
        {name: 'Pochas', type: 'int'},
        {name: 'DisciplinesID', type: 'int'},
        {name: 'StreamsID', type: 'int'},
        {name: 'JobsID', type: 'int'}
      ],

      columngroups: [
        {text: 'Нагрузка УУ', align: 'center', name: 'nagruzka'}
      ],

      columns2: [
        {datafield: 'ID', hidden: true},
        {text: 'Дисциплина', datafield: 'DisciplinesName'},
        {text: 'Поток', datafield: 'StreamsName'},
        {text: 'Вид занятия', datafield: 'JobsName'},
        {text: 'почас', datafield: 'Pochas', columngroup: 'nagruzka2'},
        {datafield: 'DisciplinesID', hidden: true},
        {datafield: 'StreamsID', hidden: true},
        {datafield: 'JobsID', hidden: true}
      ],

      datafields2: [
        {name: 'ID', type: 'int'},
        {name: 'DisciplinesName', type: 'string'},
        {name: 'StreamsName', type: 'string'},
        {name: 'JobsName', type: 'string'},
        {name: 'Pochas', type: 'int'},
        {name: 'DisciplinesID', type: 'int'},
        {name: 'StreamsID', type: 'int'},
        {name: 'JobsID', type: 'int'}
      ],

      columngroups2: [
        {text: 'Нагрузка УУ', align: 'center', name: 'nagruzka2'}
      ],

      selectedTeacher: null,
      optionsTeachers: [
        {text: '-', value: null}
      ]
    }
  },

  props: {
    bus: Object,
    busVue: Object,
    settings: Object
  },

  async mounted() {
    // Список преподавателей
    let data = await db.getTable('Teachers');
    if (data && data.data) {
      this.teachers = data.data;

      if (this.teachers && Array.isArray(this.teachers) && this.teachers.length > 0) {
        this.optionsTeachers = [];
        this.teachers.forEach((item) => {
          this.optionsTeachers.push({text: item.FIO, value: item.ID})
        })
        console.info(this.teachers);
        this.selectedTeacher = this.teachers[0].ID;
      } else {
        this.optionsTeachers = [
          {text: '-', value: null}
        ]
      }
    } else {
      console.error(data)
      this.bus.notify('Ошибка обновления данных', 'e');
    }

    await this.updateGrid(1);
    await this.updateGrid(2);

    // this.busVue.$on('delRow', this.removeRow);
  },

  beforeDestroy() {
    // this.busVue.$off('delRow');
  },

  methods: {
    teacherChanged() {
      this.updateGrid(1);
      this.updateGrid(2);
    },

    // Обновить параметры грида
    async updateGrid(gridNum) {
      if (!this.selectedTeacher || !gridNum) return

      let err = await db.all("SELECT IndividualPlan_1.*, Disciplines.Name as DisciplinesName, Streams.Name as StreamsName, " +
          "Jobs.Name as JobsName FROM IndividualPlan_1 " +
          "LEFT JOIN Disciplines ON Disciplines.ID = IndividualPlan_1.Discipl_ID " +
          "LEFT JOIN Streams ON Streams.ID = IndividualPlan_1.Group_ID " +
          "LEFT JOIN Jobs ON Jobs.Job_ID = IndividualPlan_1.Job_ID " +
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
