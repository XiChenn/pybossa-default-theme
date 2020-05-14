<template>
  <div class="row">
    <div class="form-group row">
      <div class="col-md-8">
        <label>Input data classification</label>
      </div>
      <div class="col-md-8">
        <v-select
          v-model="inputData"
          label="classification"
          :options="options"
          :selectable="option => option.enabled"
        >
          <template #search="{attributes, events}">
            <input
              class="vs__search"
              :required="!inputData"
              v-bind="attributes"
              v-on="events"
            >
          </template>
        </v-select>
      </div>
    </div>
    <div class="form-group row">
      <div class="col-md-8">
        <label>Output data classification</label>
      </div>
      <div class="col-md-8">
        <v-select
          v-model="outputData"
          label="classification"
          :options="options"
          :selectable="option => option.enabled"
        >
          <template #search="{attributes, events}">
            <input
              class="vs__search"
              :required="!outputData"
              v-bind="attributes"
              v-on="events"
            >
          </template>
        </v-select>
      </div>
    </div>
    <div class="form-group row">
      <div class="col-md-8">
        <button
          class="btn btn-primary"
          @click="save"
        >
          Save data classification
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';

Vue.component('v-select', vSelect);

export default {
    components: {
        'v-select': vSelect
    },
    data () {
        return {
            inputData: '',
            outputData: '',
            // dcoptions: [],
            csrfToken: '',
            options: []
        };
    },

    created () {
        this.getData();
    },

    methods: {
        initialize (data) {
            this.inputData = data.input_data;
            this.outputData = data.output_data;
            this.csrfToken = data.csrf;
            this.options = data.options;
        },

        getURL () {
            let path = window.location.pathname;
            let res = path.split('/');
            res[res.length - 1] = 'dataclassification';
            return res.join('/');
        },

    async getData () {
      try {
        const res = await fetch(this.getURL(), {
          method: 'GET',
          headers: {
            'content-type': 'application/json'
          },
          credentials: 'same-origin'
        });
        const response = await res.json();
        this.initialize(response);
      } catch (error) {
        window.pybossaNotify('An error occurred.', true, 'error');
      }
    },

        async save () {
            let data = {
                input_data: this.inputData.classification,
                output_data: this.outputData.classification
            };
            try {
                const res = await fetch(this.getURL(), {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                        'X-CSRFToken': this.csrfToken
                    },
                    credentials: 'same-origin',
                    body: JSON.stringify(data)
                });
                if (res.ok) {
                    const data = await res.json();
                    window.pybossaNotify(data['flash'], true, data['status']);
                } else {
                    window.pybossaNotify('An error occurred saving data classification.', true, 'error');
                }
            } catch (error) {
                window.pybossaNotify('An error occurred saving data classification.', true, 'error');
            }
        }
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
