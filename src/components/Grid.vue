<template>
  <div style="width: 100%; height: 100%">
    <!--    ag-theme-alpine-dark-->
    <!--    style="width: calc(100% - 10px); height: calc(100% - 10px); margin: 5px;"-->
    <!--    <div v-show="isLoad" style="width: 100%; height: 100%">-->
    <!--      <GridPreloader></GridPreloader>-->
    <!--    </div>-->

    <div style="width: 100%; height: 100%">
      <ag-grid-vue
          style="width: 100%; height: 100%"
          class="ag-theme-alpine"
          :id="id"
          :gridOptions="gridOptions"
          :rowData="rowData"
          :columnDefs="columnDefs"
          :pinnedTopRowData="pinnedTopRowData"
          :pinnedBottomRowData="pinnedBottomRowData"
          :suppressDragLeaveHidesColumns="true"
          :animateRows="true"
          :rowSelection="rowSelection || 'multiple'"
          :overlayNoRowsTemplate="overlayNoRowsTemplate"
          @grid-ready="onGridReady"
      >
      </ag-grid-vue>
    </div>

  </div>
</template>


<script>

const timeOffPreloader = 300;

import {AgGridVue} from "ag-grid-vue";
// import GridPreloader from "@/components/GridPreloader";

import "smart-webcomponents/source/modules/smart.window.js";
import "smart-webcomponents/source/styles/smart.default.css";
import "smart-webcomponents/source/modules/smart.grid.js";
import $ from "jquery";


export default {
  components: {
    AgGridVue,
    // GridPreloader
  },
  name: "Grid",
  data() {
    return {
      id: this.winName ? 'grid' + this.winName : 'grid',
      gridOptions: null,
      gridApi: null,
      columnApi: null,
      rowData: null,
      columnDefs: null,
      defaultColDef: null,
      pinnedTopRowData: null,
      pinnedBottomRowData: null,

      overlayNoRowsTemplate: "<div>Нет данных</div>",

      isLoad: true
    }
  },
  props: {
    bus: Object,
    winName: String,
    settings: Object,
    columns: Array,
    data: Array,
    defColDef: Object,
    rowSelection: String
  },

  beforeMount() {
    this.gridOptions = {
      suppressHorizontalScroll: true,
      suppressCellSelection: true
    };

    this.columnDefs = [
      {field: 'fullName', headerName: 'ФИО', minWidth: 150}
    ];
    // for (let i = 0; i < 18; i++) {
    //   this.columnDefs.push({field: 'field' + i, headerName: 'ЛКР'});
    // }

    this.rowData = [
      {
        fullName: 'Абрамов А.В.'
      }
    ];
    this.defaultColDef = {
      flex: 1,
      minWidth: 20,
      editable: true,
      resizable: true,
    };


    this.init();
  },

  mounted() {
    // for (let i = 0; i<50;i++) {
    //   let obj = {
    //     fullName: 'Абрамов А.В.'
    //   }
    //
    //   for (let i=0; i<18; i++) {
    //     obj['field'+i] = 0;
    //   }
    //
    //   this.rowData.push(obj);
    // }
    //
    // console.info(this.rowData);

    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;
  },

  beforeDestroy() {
    $(window).off('resize');
  },

  methods: {
    setLoad(isLoad) {
      if (isLoad) {
        this.isLoad = true;
      } else {
        setTimeout(() => {
          this.isLoad = false;
        }, timeOffPreloader)
      }
    },

    // Заполнение всего грида
    setAll(rowData) {
      this.rowData = rowData;
      // setTimeout(() => {
      //   this.isLoad = false;
      // }, timeOffPreloader)
    },

    // Вывод всего грида
    getAll() {
      // let rowsData = [];
      // this.gridApi.forEachNode(function (node) {
      //   console.info(node);
      //   rowsData.push(node.data);
      // });
      return this.rowData
    },

    // Вернуть выбранные строки
    getSelected() {
      let selectedNodes = this.gridApi.getSelectedNodes(),
          selectedRows = selectedNodes.map(node => node.data);
      return selectedRows
    },

    // Добавить строчку
    addRow(rowArr, index) {
      let row = {}, isNull = true;

      this.columnDefs.forEach((item, index) => {
        row[item.field] = rowArr[index];

        if (rowArr[index] !== null) isNull = false;
      })

      if (isNull) return

      this.gridOptions.api.applyTransaction({
        add: [row],
        addIndex: index,
      });
    },

    // Удалить строчку
    removeRow() {
      let selectedRows = this.gridApi.getSelectedRows();
      if (selectedRows) {
        return this.gridApi.applyTransaction({remove: selectedRows});
      }
    },

    // Применение настроек
    init() {
      for (let key in this.settings) {
        if (this[key] !== undefined && this.settings[key] !== undefined) {
          this[key] = this.settings[key];
        }
      }
    },

    // Авторесайз
    onGridReady(params) {
      params.api.sizeColumnsToFit();
      $(window).on('resize', () => {
        setTimeout(function () {
          params.api.sizeColumnsToFit();
        });
      })
      params.api.sizeColumnsToFit();
    },

    // refreshTable() {
    //   if (this.gridColumnApi.columnController && this.gridColumnApi.columnController.bodyWidthDirty) {
    //     this.gridApi.sizeColumnsToFit();
    //     if (this.refreshAttempts) {
    //       this.refreshAttempts--;
    //       setTimeout(() => {
    //         this.refreshTable();
    //       }, 100);
    //     }
    //   } else {
    //     this.refreshAttempts = 0;
    //   }
    // }
  }
}
</script>


<style scoped>

/* Анимация смены прелоадера */
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

.ag-header-cell-label {
  justify-content: center;
}

</style>
