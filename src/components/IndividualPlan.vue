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
              :bus="bus"
              :busVue="busVue"
              :columnsGrid="columns"
              :datafieldsGrid="datafields"
              :columngroupsGrid="columngroups"
              :context="true"
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
              :bus="bus"
              :busVue="busVue"
              :columnsGrid="columns2"
              :datafieldsGrid="datafields2"
              :columngroupsGrid="columngroups2"
              :context="true"
          ></Grid>
        </div>
      </div>


      <!--    Пробел с рамкой -->
      <div style="flex: 0 0 10px;"/>

      <!--    Кнопки и инпуты -->
      <div class="borderWhite" style=" display: flex; margin: 0; flex-direction: column;">
        <div class="menuItem marginInput" style="display: flex; flex-direction: column; margin: 0">
          <div style="display: flex; flex-direction: row">

            <div style="flex: 0 0 auto; margin-right: 5px">
              <b-button style="width: 85px" @click="addRow" variant="outline-primary">Добавить</b-button>
            </div>

            <div style="flex: 1 1 1px; margin-right: 5px">
              <b-input-group prepend="Дисциплина">
                <b-form-select v-model="selectedDisciplines" :options="optionsDisciplines"></b-form-select>
              </b-input-group>
            </div>

            <div style="flex: 1 1 1px; display: flex;">
              <b-input-group prepend="Поток">
                <b-form-select v-model="selectedStream" :options="optionsStreams"></b-form-select>
              </b-input-group>
            </div>

          </div>

          <div style="height: 10px"></div>

          <div style="display: flex; flex-direction: row">
            <div style="flex: 0 0 auto; margin-right: 5px">
              <b-button style="width: 85px" @click="removeRow" variant="outline-primary">Удалить</b-button>
            </div>

            <div style="flex: 1 1 1px; margin-right: 5px">
              <b-input-group prepend="Вид учебной работы">
                <b-form-select v-model="selectedJobs" :options="optionsJobs"></b-form-select>
              </b-input-group>
            </div>

            <div style="flex: 1 1 1px; display: flex;">
              <b-input-group prepend="Семестр">
                <b-form-select v-model="selectedSemestr" :options="optionsSemestr"></b-form-select>
              </b-input-group>
            </div>
          </div>

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

const tableName = "IndividualPlan_1";

export default {
  components: {
    Grid
  },

  name: "IndividualPlan",

  data() {
    return {
      windowName: this.$options._componentTag,

      columns: [
        {datafield: 'ID', hidden: true},
        {text: 'Дисциплина', datafield: 'DisciplinesName'},
        {text: 'Поток', datafield: 'StreamsName'},
        {text: 'Вид занятия', datafield: 'JobsName'},
        {text: 'штатн', datafield: 'Shtatn', columngroup: 'nagruzka'},
        {text: 'почас', datafield: 'Pochas', columngroup: 'nagruzka'},
        {text: 'Почас в семестр', datafield: 'SUM'},
        {datafield: 'DisciplinesID', hidden: true},
        {datafield: 'StreamsID', hidden: true},
        {datafield: 'JobsID', hidden: true}
      ],

      datafields: [
        {name: 'ID', type: 'int'},
        {name: 'DisciplinesName', type: 'string'},
        {name: 'StreamsName', type: 'string'},
        {name: 'JobsName', type: 'string'},
        {name: 'Shtatn', type: 'int'},
        {name: 'Pochas', type: 'int'},
        {name: 'SUM', type: 'int'},
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
        {text: 'штатн', datafield: 'Shtatn', columngroup: 'nagruzka2'},
        {text: 'почас', datafield: 'Pochas', columngroup: 'nagruzka2'},
        {text: 'Почас в семестр', datafield: 'SUM'},
        {datafield: 'DisciplinesID', hidden: true},
        {datafield: 'StreamsID', hidden: true},
        {datafield: 'JobsID', hidden: true}
      ],

      datafields2: [
        {name: 'ID', type: 'int'},
        {name: 'DisciplinesName', type: 'string'},
        {name: 'StreamsName', type: 'string'},
        {name: 'JobsName', type: 'string'},
        {name: 'Shtatn', type: 'int'},
        {name: 'Pochas', type: 'int'},
        {name: 'SUM', type: 'int'},
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
      ],

      selectedDisciplines: null,
      optionsDisciplines: [
        {text: '-', value: null}
      ],

      selectedStream: null,
      optionsStreams: [
        {text: '-', value: null}
      ],

      selectedJobs: null,
      optionsJobs: [
        {text: '-', value: null}
      ],

      selectedSemestr: 1,
      optionsSemestr: [
        {text: 'I', value: 1},
        {text: 'II', value: 2}
      ]


    }
  },

  props: {
    bus: Object,
    busVue: Object,
    settings: Object
  },

  async mounted() {
    this.busVue.$on('updateGrid', this.teacherChanged);
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

    // Дисциплины
    data = null;
    data = await db.getTable('Disciplines');
    if (data && data.data) {
      this.disciplines = data.data;

      if (this.disciplines && Array.isArray(this.disciplines) && this.disciplines.length > 0) {
        this.optionsDisciplines = [];
        this.disciplines.forEach((item) => {
          this.optionsDisciplines.push({text: item.Name, value: item.ID})
        })
        this.selectedDisciplines = this.disciplines[0].ID;
      } else {
        this.optionsDisciplines = [
          {text: '-', value: null}
        ]
      }
    } else {
      console.error(data)
      this.bus.notify('Ошибка обновления данных', 'e');
    }

    // Потоки
    data = null;
    data = await db.getTable('Streams');
    if (data && data.data) {
      this.streams = data.data;

      if (this.streams && Array.isArray(this.streams) && this.streams.length > 0) {
        this.optionsStreams = [];
        this.streams.forEach((item) => {
          this.optionsStreams.push({text: item.Name, value: item.ID})
        })
        this.selectedStream = this.streams[0].ID;
      } else {
        this.optionsStreams = [
          {text: '-', value: null}
        ]
      }
    } else {
      console.error(data)
      this.bus.notify('Ошибка обновления данных', 'e');
    }

    // Дисциплины
    data = null;
    data = await db.getTable('Jobs');
    if (data && data.data) {
      this.jobs = data.data;

      if (this.jobs && Array.isArray(this.jobs) && this.jobs.length > 0) {
        this.optionsJobs = [];
        this.jobs.forEach((item) => {
          this.optionsJobs.push({text: item.Name, value: item.Job_ID})
        })
        this.selectedJobs = this.jobs[0].Job_ID;
      } else {
        this.optionsJobs = [
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
    this.busVue.$off('updateGrid');
    // this.busVue.$off('delRow');
  },

  methods: {
    teacherChanged() {
      this.updateGrid(1);
      this.updateGrid(2);
    },

    resetAllInputs() {
      this.selectedDisciplines = null;
      this.selectedStream = null;
      this.selectedJobs = null;
    },

    // Добавить строку
    async addRow() {
      if (!this.selectedTeacher) return

      let err = await db.run("INSERT INTO " + tableName + "(Prep_ID, Discipl_ID, Group_ID, Job_ID, Shtatn, Pochas, Semestr, SUM) VALUES(" + "'" + this.selectedTeacher + "','" + this.selectedDisciplines + "','" + this.selectedStream + "','" + this.selectedJobs + "', 0, 0, '" + this.selectedSemestr + "','" + 0 + "');")
      if (err) {
        console.error(err)
        this.bus.notify('Ошибка добавления записи', 'e');
      } else {
        await this.updateGrid(this.selectedSemestr);
        // this.resetAllInputs();
        this.bus.notify('Данные добавлены', 's');
      }
    },

    // Удалить строку
    async removeRow() {
      let gridNum = 1, row = this.$refs.grid1.getSelected();

      if (!row) {
        row = this.$refs.grid2.getSelected();
        gridNum = 2;
      }

      if (!row) {
        return
      }

      let err = await db.run("DELETE FROM " + tableName + " WHERE ID = ( " + row.ID + " )")

      if (err) {
        console.error(err)
        this.bus.notify('Ошибка удаления записи', 'e');
      } else {
        await this.updateGrid(gridNum);
        // this.bus.notify('Данные удалены', 's');
      }
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
        console.info(err);
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
