<template>
  <div>
    <h4>Precision-Recall By Label</h4>
    <div class="form-inline">
      <div class="form-group">
        <label for="beta">&beta;: </label>
        <input
          id="beta"
          v-model="beta"
          type="text"
          class="form-control input-sm"
        >
        (see <a
          href="https://en.wikipedia.org/wiki/F1_score#Definition"
          target="_blank"
        >definition of F&beta;</a>)
      </div>
    </div>
    <table class="table table-bordered">
      <thead>
        <tr>
          <th class="col-xs-4">
            Label
          </th>
          <th class="col-xs-2">
            Precision
          </th>
          <th class="col-xs-2">
            Recall
          </th>
          <th class="col-xs-2">
            F&beta;
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(label, ix) in labels"
          :key="label"
        >
          <th>{{ label }}</th>
          <td>{{ fmtNum(precision[ix]) }}</td>
          <td>{{ fmtNum(recall[ix]) }}</td>
          <td>{{ fmtNum(fbeta[ix]) }}</td>
        </tr>
        <tr>
          <th>Average</th>
          <td
            v-for="(val, i) in averages"
            :key="i"
          >
            {{ fmtNum(val) }}
          </td>
        </tr>
      </tbody>
    </table>
    <h4>Confusion Matrix</h4>
    <div id="matrix" />
  </div>
</template>
<script>
import Matrix from './matrix';

function vectorSum (v, w) {
  return v.map((x, ix) => x + w[ix]);
}

function matrixSum (a, b) {
  return a.map((v, ix) => vectorSum(v, b[ix]));
}

export default {
  props: {
    stats: Array,
    labels: Array
  },

  data () {
    return {
      beta: 1
    };
  },

  computed: {
    matrix () {
      return this.stats
        .map(c => c.info.matrix)
        .reduce((partial, m) => matrixSum(partial, m));
    },

    numTrueByIndex () {
      return this.matrix
        .map(row => row.reduce((partial, x) => partial + x));
    },

    numPredictedByIndex () {
      return this.matrix
        .reduce((partial, row) => vectorSum(partial, row));
    },

    probabilities () {
      return this.matrix
        .map((row, ix) => row.map(c => c / (this.numTrueByIndex[ix])));
    },

    precision () {
      return this.matrix
        .map((row, ix) => row[ix] / (this.numPredictedByIndex[ix]));
    },

    recall () {
      return this.probabilities
        .map((row, ix) => row[ix]);
    },

    fbeta () {
      return this.precision.map((p, ix) => {
        const r = this.recall[ix];
        const b2 = Math.pow(this.beta, 2);
        return (1 + b2) * (p * r) / ((b2 * p + r) || 1);
      });
    },

    averages () {
      return [this.precision, this.recall, this.fbeta]
        .map(values => (values.reduce((a, b) => a + b)) / values.length);
    }
  },

  watch: {
    probabilities () {
      this.showMatrix();
    }
  },

  mounted () {
    this.showMatrix();
  },

  methods: {
    fmtNum (x) {
      return isNaN(x) ? '-' : x.toFixed(2);
    },

    showMatrix () {
      Matrix({
        container: '#matrix',
        data: this.probabilities,
        labels: this.labels,
        start_color: '#ffffff',
        end_color: '#3498db'
      });
    }
  }
};
</script>
<style>
#beta {
    width: 3em;
    margin-bottom: 0.5em;
}
</style>
