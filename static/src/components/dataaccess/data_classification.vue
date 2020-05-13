<template>
  <div class="row">
    <div class="form-group row">
      <div class="col-md-8">
        <label>Input data classification</label>
      </div>
      <div class="col-md-8">
        <v-select
          v-model="inputData"
          label="dataClassification"
          :options="options"
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
    </div>
    <div class="form-group row">
      <div class="col-md-8">
        <label>Output data classification</label>
      </div>
      <div class="col-md-8">
        <v-select
          label="dataClassification"
          :options="options"
          :selectable="option => option.valid"
        >
          <template #search="{attributes, events}">
            <input
              v-model="outputData"
              class="vs__search"
              :required="!selected"
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
// import { mapGetters } from 'vuex';

Vue.component('v-select', vSelect);

export default {
    components: {
        'v-select': vSelect
    },
    props: {
        inputData: { type: String, default: null },
        outputData: { type: String, default: null },
        dcoptions: { type: Object },
        csrfToken: { type: String }
    },
    data () {
        var dataClassificationOptions = this.dcoptions.map(
            function (item) {
                return {
                    dataClassification: item.name,
                    valid: item.enabled
                };
            });
        return {
            options: dataClassificationOptions
        };
    },

    created () {
        this.getData();
    },

    // computed: {
    // ...mapGetters(['csrfToken'])
    // },

    methods: {
        initialize (data) {
            let jdata = JSON.parse(data);
            // this.inputData = jdata.input_data;
            // this.outputData = jdata.output_data;
            // this.csrfToken = jdata.csrf;
            this.setData({ csrfToken: jdata.csrf });

            // this.consensusThreshold = config.consensus_threshold;
            // this.redundancyConfig = config.redundancy_config;
            // this.maxRetries = config.max_retries;
            // this.setData({
            //     csrf: data.csrf,
            //     answerFields: JSON.parse(data.answer_fields),
            //     consensus: config
            // });
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
        const data = await res.json();
        this.initialize(data);
      } catch (error) {
        window.pybossaNotify('An error occurred.', true, 'error');
      }
    },

        async save () {
            // let data = { answer_fields: this.answerFields };
            var csrftoken = '{{ csrf_token() }}';
            let data = {
                input_data_classification: this.inputData,
                output_data_classification: this.outputData
            };
            try {
                const res = await fetch(this.getURL(), {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                        'X-CSRFToken': csrftoken
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
