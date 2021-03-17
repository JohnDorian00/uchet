<template>
  <div class="main" style="width: 100%; height: 100%">


<!--    ag-theme-alpine-dark-->
    <Grid
        :winName="'Doljnosti'"
        :settings="settings"
    ></Grid>


  </div>
</template>

<script>




import Grid from "@/components/Grid";


import "smart-webcomponents/source/modules/smart.window.js";
import "smart-webcomponents/source/styles/smart.default.css";
import "smart-webcomponents/source/modules/smart.grid.js";



export default {
  components: {
    Grid
  },
  name: "Doljnosti",
  data() {
    return {
      settings: {
        columnDefs: [
          { field: 'fullName', headerName: 'Название'},
          { field: 'name', headerName: 'Сокращение'}
        ],
        rowData: [
          {
            fullName: 'ассистент', name: 'асс'
          }
        ]

      }
    }
  },
  props: {
    bus: Object
  },

  beforeMount() {

  },

  mounted() {

  },

  methods: {

  }
}
</script>



<style scoped>



.main {
  width: 100%;
  height: 100%;
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
