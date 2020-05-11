<template>
  <div>
    <h1>Public GIGwork data classifications</h1>
    <v-select
      label="dataClassification"
      :options="publicOptions"
      :selectable="option => option.valid"
    >
      <template #search="{attributes, events}">
        <input
          class="vs__search"
          :required="!selected"
          v-bind="attributes"
          v-on="events"
        >
      </template>
    </v-select>
    <h1>Private GIGwork data classifications</h1>
    <v-select
      label="dataClassification"
      :options="privateOptions"
      :selectable="option => option.valid"
    >
      <template #search="{attributes, events}">
        <input
          class="vs__search"
          :required="!selected"
          v-bind="attributes"
          v-on="events"
        >
      </template>
    </v-select>
  </div>
</template>

<script>
import Vue from 'vue';
import vSelect from 'vue-select';
// import 'vue-select/dist/vue-select.css';
Vue.component('v-select', vSelect);

export default {
    components: {
        'v-select': vSelect
    },
    data () {
      return {
        publicOptions: [{
            dataClassification: 'L1 Restricted',
            valid: false
        }, {
            dataClassification: 'L2 Limited Access',
            valid: false
        }, {
            dataClassification: 'L3 Community-Wide',
            valid: false
        }, {
            dataClassification: 'L4 Public data',
            valid: true
        }],
        privateOptions: [{
            dataClassification: 'L1 Restricted',
            valid: true
        }, {
            dataClassification: 'L2 Limited Access',
            valid: true
        }, {
            dataClassification: 'L3 Community-Wide',
            valid: true
        }, {
            dataClassification: 'L4 Public data',
            valid: true
        }]
      };
  }
};
</script>

<style scoped>
body {
  font-family: 'Source Sans Pro', 'Helvetica Neue', Arial, sans-serif;
  text-rendering: optimizelegibility;
  -moz-osx-font-smoothing: grayscale;
  -moz-text-size-adjust: none;
}

h1,.muted {
  color: #2c3e5099;
}

h1 {
  font-size: 20px;
  font-weight: 600;
}

#app {
  max-width: 30em;
  margin: 1em auto;
}
</style>
