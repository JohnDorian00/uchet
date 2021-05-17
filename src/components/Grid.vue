<template>
  <div :id="winName" style="width: 100%; height: 100%;">

    <div style="width: 100%; height: 100%;">
      <JqxGrid
          ref="grid"
          :theme="theme"
          :width="'100%'"
          :height="'100%'"
          :source="dataAdapter"
          :columns="columns"
          :columngroups="columngroups"
          :sortable="false"
          :altrows="false"
          :enabletooltip="false"
          :editable="true"
          :selectionmode="'singlerow'"
          :editmode="'dblclick'"
          :localization="localization"
          :columnsresize="false"
          :columnsreorder="false"
          @rowselect="gridOnRowSelect($event)"
          :enablekeyboarddelete="false"
          :auto-create="autocreate"
          @contextmenu="context ? GridOnContextMenu() : null"
          @rowclick="context ? GridOnRowClick($event) : null">
      </JqxGrid>

      <!--      CONTEXT MENU-->
      <JqxWindow ref="myWindow" :theme="theme"
                 :width="270" :height="130" :modalOpacity="'0.9'"
                 :resizable="false" :isModal="true" :autoOpen="false">
        <div>Перенос индивидуального плана</div>
        <div style="overflow: hidden">
          <div style="width: 100%; height: 100%; display: flex; flex-direction: column">
            <div style="flex: 1 1 1px">
              <b-input-group prepend="Преподаватель">
                <b-form-select v-model="selectedTeacher" :options="optionsTeachers"></b-form-select>
              </b-input-group>
            </div>
            <div style="flex: 1 1 1px; display: flex; align-items: center">
              <div style="flex: 1 1 1px; text-align: center;">
                <b-button style="width: 85px" @click="transfer" variant="outline-primary">Перенести</b-button>
              </div>
              <div style="flex: 1 1 1px; text-align: center;">
                <b-button style="width: 85px" @click="cancel" variant="outline-primary">Отменить</b-button>
              </div>
            </div>
          </div>

        </div>
      </JqxWindow>

      <JqxMenu ref="myMenu" @itemclick="MenuOnItemClick($event)" :theme="theme"
               :width="105" :height="32" :mode="'popup'" :autoOpenPopup="false">
        <ul>
          <li>Перенести</li>
        </ul>
      </JqxMenu>

    </div>
  </div>
</template>


<script>

import JqxGrid from "jqwidgets-scripts/jqwidgets-vue/vue_jqxgrid.vue";
import JqxWindow from "jqwidgets-scripts/jqwidgets-vue/vue_jqxwindow.vue";
import JqxMenu from "jqwidgets-scripts/jqwidgets-vue/vue_jqxmenu.vue";

import $ from "jquery";


import "smart-webcomponents/source/modules/smart.window.js";
import "smart-webcomponents/source/styles/smart.default.css";
import "smart-webcomponents/source/modules/smart.grid.js";
import * as db from "./db";

export default {
  components: {
    JqxGrid,
    JqxWindow,
    JqxMenu
  },
  name: "Grid",
  data() {
    return {
      id: this.winName ? 'grid' + this.winName : 'grid',
      columns: [],
      columngroups: [],
      // eslint-disable-next-line no-undef
      localization: this.getLocalization('ru'),
      autocreate: true,
      theme: 'material',
      selectedTeacher: null,
      optionsTeachers: [
        {text: '-', value: null}
      ]
    }
  },
  props: {
    bus: Object,
    busVue: Object,
    winName: String,
    datafieldsGrid: Array,
    columnsGrid: Array,
    columngroupsGrid: Array,
    noAutoCreate: Boolean,
    context: Boolean
  },

  created() {
    if (this.noAutoCreate) this.autocreate = false;
    this.source = {
      localdata: [],
      datafields: this.datafields,
      datatype: 'array'
    };

    this.columnsGrid.forEach((item) => {
      item.cellsalign = 'center';
      item.align = 'center';
    })

    this.columns = this.columnsGrid;

    if (this.columngroupsGrid) {
      this.columngroups = this.columngroupsGrid;
    } else {
      this.columngroups = [{}];
    }

    // eslint-disable-next-line no-undef
    this.dataAdapter = new jqx.dataAdapter(this.source);
    this.selectedRow = null;
  },

  async mounted() {
    // eslint-disable-next-line no-undef
    try {
      $("#" + this.winName).on("focusout", (e) => {
        if (e.relatedTarget && e.relatedTarget.innerText !== "Удалить") {
          try {
            this.$refs.grid.clearselection();
            // eslint-disable-next-line no-empty
          } catch (e) {
          }
        }
      });
      // eslint-disable-next-line no-empty
    } catch (e) {
    }

    if (this.context) {
      // Список преподавателей
      let data = await db.getTable('Teachers');
      if (data && data.data) {
        this.teachers = data.data;

        if (this.teachers && Array.isArray(this.teachers) && this.teachers.length > 0) {
          this.optionsTeachers = [];
          this.teachers.forEach((item) => {
            this.optionsTeachers.push({text: item.FIO, value: item.ID})
          })
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
    }
  },

  beforeDestroy() {

  },

  methods: {
    // Заполнение всего грида
    setAll(rowData) {
      this.$refs.grid.clear();
      this.source.localdata = rowData;
      // eslint-disable-next-line no-undef
      this.dataAdapter = new jqx.dataAdapter(this.source);
      this.$refs.grid._source(this.dataAdapter);
      this.$refs.grid.clearselection();
    },

    // Вернуть выбранные строки
    getSelected() {
      return this.$refs.grid.getrowdata(this.$refs.grid.getselectedrowindex())
    },

    gridOnRowSelect(event) {
      this.selectedRow = event.args.row;
    },

    // Вывод всего грида
    getAll() {
      return this.source.localdata
    },

    createGrid() {
      this.$refs.grid.createComponent();
    },

    getLocalization() {
      return {
        // separator of parts of a date (e.g. '/' in 11/05/1955)
        '/': '/',
        // separator of parts of a time (e.g. ':' in 05:44 PM)
        ':': ':',
        // the first day of the week (0 = Sunday, 1 = Monday, etc)
        firstDay: 0,
        days: {
          // full day names
          names: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          // abbreviated day names
          namesAbbr: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          // shortest day names
          namesShort: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
        },
        months: {
          // full month names (13 months for lunar calendards -- 13th month should be '' if not lunar)
          names: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', ''],
          // abbreviated month names
          namesAbbr: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', '']
        },
        // AM and PM designators in one of these forms:
        // The usual view, and the upper and lower case versions
        //      [standard,lowercase,uppercase]
        // The culture does not use AM or PM (likely all standard date formats use 24 hour time)
        //      null
        AM: ['AM', 'am', 'AM'],
        PM: ['PM', 'pm', 'PM'],
        eras: [
          // eras in reverse chronological order.
          // name: the name of the era in this culture (e.g. A.D., C.E.)
          // start: when the era starts in ticks (gregorian, gmt), null if it is the earliest supported era.
          // offset: offset in years from gregorian calendar
          {'name': 'A.D.', 'start': null, 'offset': 0}
        ],
        twoDigitYearMax: 2029,
        patterns: {
          // short date pattern
          d: 'M/d/yyyy',
          // long date pattern
          D: 'dddd, MMMM dd, yyyy',
          // short time pattern
          t: 'h:mm tt',
          // long time pattern
          T: 'h:mm:ss tt',
          // long date, short time pattern
          f: 'dddd, MMMM dd, yyyy h:mm tt',
          // long date, long time pattern
          F: 'dddd, MMMM dd, yyyy h:mm:ss tt',
          // month/day pattern
          M: 'MMMM dd',
          // month/year pattern
          Y: 'yyyy MMMM',
          // S is a sortable format that does not vary by culture
          S: 'yyyy\u0027-\u0027MM\u0027-\u0027dd\u0027T\u0027HH\u0027:\u0027mm\u0027:\u0027ss',
          // formatting of dates in MySQL DataBases
          ISO: 'yyyy-MM-dd hh:mm:ss',
          ISO2: 'yyyy-MM-dd HH:mm:ss',
          d1: 'dd.MM.yyyy',
          d2: 'dd-MM-yyyy',
          d3: 'dd-MMMM-yyyy',
          d4: 'dd-MM-yy',
          d5: 'H:mm',
          d6: 'HH:mm',
          d7: 'HH:mm tt',
          d8: 'dd/MMMM/yyyy',
          d9: 'MMMM-dd',
          d10: 'MM-dd',
          d11: 'MM-dd-yyyy'
        },
        percentsymbol: '%',
        currencysymbol: '$',
        currencysymbolposition: 'before',
        decimalseparator: '.',
        thousandsseparator: ',',
        pagergotopagestring: 'Go to page:',
        pagershowrowsstring: 'Show rows:',
        pagerrangestring: ' of ',
        pagerpreviousbuttonstring: 'previous',
        pagernextbuttonstring: 'next',
        pagerfirstbuttonstring: 'first',
        pagerlastbuttonstring: 'last',
        groupsheaderstring: 'Drag a column and drop it here to group by that column',
        sortascendingstring: 'Sort Ascending',
        sortdescendingstring: 'Sort Descending',
        sortremovestring: 'Remove Sort',
        groupbystring: 'Group By this column',
        groupremovestring: 'Remove from groups',
        filterclearstring: 'Clear',
        filterstring: 'Filter',
        filtershowrowstring: 'Show rows where:',
        filterorconditionstring: 'Or',
        filterandconditionstring: 'And',
        filterselectallstring: '(Select All)',
        filterchoosestring: 'Please Choose:',
        filterstringcomparisonoperators: ['empty', 'not empty', 'enthalten', 'enthalten(match case)',
          'does not contain', 'does not contain(match case)', 'starts with', 'starts with(match case)',
          'ends with', 'ends with(match case)', 'equal', 'equal(match case)', 'null', 'not null'],
        filternumericcomparisonoperators: ['equal', 'not equal', 'less than', 'less than or equal', 'greater than', 'greater than or equal', 'null', 'not null'],
        filterdatecomparisonoperators: ['equal', 'not equal', 'less than', 'less than or equal', 'greater than', 'greater than or equal', 'null', 'not null'],
        filterbooleancomparisonoperators: ['equal', 'not equal'],
        validationstring: 'Entered value is not valid',
        emptydatastring: 'Нет данных',
        filterselectstring: 'Select Filter',
        loadtext: 'Загрузка...',
        clearstring: 'Clear',
        todaystring: 'Today'
      };
    },

    // context menu
    GridOnContextMenu() {
      return false;
    },

    GridOnRowClick: function (event) {
      if (event.args.rightclick) {
        this.$refs.grid.selectrow(event.args.rowindex);
        let scrollTop = window.scrollY;
        let scrollLeft = window.scrollX;
        this.$refs.myMenu.open(parseInt(event.args.originalEvent.clientX) + 5 + scrollLeft, parseInt(event.args.originalEvent.clientY) + 5 + scrollTop);
        return false;
      }
    },

    MenuOnItemClick: function (event) {
      let args = event.args;

      if (args.innerHTML == 'Перенести') {
        this.$refs.myWindow.position = 'center';
        this.$refs.myWindow.open();
      }
    },

    async transfer() {
      let ID = this.selectedRow.ID;

      let err = await db.run("UPDATE IndividualPlan_1 SET Prep_ID = " + this.selectedTeacher + " WHERE ID = " + ID + ";")
      if (err) {
        console.error(err)
        this.bus.notify('Ошибка обновления записи', 'e');
      } else {
        this.busVue.$emit('updateGrid');
        this.$refs.myWindow.close();
        this.bus.notify('Данные обновлены', 's');
      }
    },

    cancel() {
      this.$refs.myWindow.close();
    }

  }
}
</script>


<style scoped>


/*Анимация смены прелоадера */
.fade-enter-active, .fade-leave-active {
  transition: opacity 1s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */
{
  opacity: 0;
}

.labels {
  flex: 0 0 160px;
  margin-right: 20px;
  margin-top: 5px;
}

</style>
