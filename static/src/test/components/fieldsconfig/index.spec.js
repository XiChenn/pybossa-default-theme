import Vuex from 'vuex';
import { mount, createLocalVue } from '@vue/test-utils';
import FieldsConfig from '../../../components/fieldsconfig/index.vue';
import { storeSpecs } from '../../../components/fieldsconfig/store';
import { cloneDeep } from 'lodash';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('fieldsconfig', () => {
  let store;

  beforeEach(() => {
    store = new Vuex.Store(cloneDeep(storeSpecs));
  });

  it('loads', () => {
    const wrapper = mount(FieldsConfig, { store, localVue });
    const p = wrapper.findAll('p').at(2);
    expect(p.text()).toEqual('* No fields currently configured.');
    const fields = wrapper.findAll('.field-config');
    expect(fields.length).toEqual(0);
  });

  it('loads fields', () => {
    store.commit('setData', {
      answerFields: {
        testField: {
          type: 'categorical',
          config: {
            labels: ['A', 'B', 'C']
          }
        }
      }
    });
    const wrapper = mount(FieldsConfig, { store, localVue });
    const fields = wrapper.findAll('.field-config');
    expect(fields.length).toEqual(1);
    const field = fields.at(0);
    expect(field.text()).toContain('Categorical Field - testField');
  });

  it('shows error if name is empty', () => {
    const wrapper = mount(FieldsConfig, { store, localVue });
    wrapper.vm._addField();

    const fields = wrapper.findAll('.field-config');
    expect(fields.length).toEqual(0);
    expect(wrapper.vm.error).toBe('Field Name is Required.');
  });

  it('adds categorical fields', () => {
    const wrapper = mount(FieldsConfig, { store, localVue });
    const button = wrapper.find('button');
    wrapper.setData({ fieldName: 'new_1', fieldType: 'categorical' });
    button.trigger('click');
    const fields = wrapper.findAll('.field-config');
    expect(fields.length).toEqual(1);
    const field = fields.at(0);
    expect(field.text()).toContain('Categorical Field - new_1');
  });

  it('adds freetext fields', () => {
    const wrapper = mount(FieldsConfig, { store, localVue });
    const button = wrapper.find('button');
    wrapper.setData({ fieldName: 'new_2', fieldType: 'freetext' });
    button.trigger('click');
    const fields = wrapper.findAll('.field-config');
    expect(fields.length).toEqual(1);
    const field = fields.at(0);
    expect(field.text()).toContain('Free Text Field - new_2');
  });

  it('deletes fields', () => {
    store.commit('setData', {
      answerFields: {
        testField: {
          type: 'categorical',
          config: {
            labels: ['A', 'B', 'C']
          }
        }
      }
    });
    const wrapper = mount(FieldsConfig, { store, localVue });
    const expandButton = wrapper.find('.fa-angle-up');
    expandButton.trigger('click');
    const deleteButton = wrapper.find('.btn-danger');
    deleteButton.trigger('click');
    const p = wrapper.findAll('p').at(2);
    expect(p.text()).toContain('* No fields currently configured.');
  });

  it('deleting saved field displays warning', () => {
    store.commit('setData', {
      answerFields: {
        testField: {
          type: 'categorical',
          config: {
            labels: ['A', 'B', 'C']
          }
        }
      }
    });
    const wrapper = mount(FieldsConfig, { store, localVue });
    const expandButton = wrapper.find('.fa-angle-up');
    expandButton.trigger('click');
    const deleteButton = wrapper.find('.btn-danger');
    deleteButton.trigger('click');
    const warning = wrapper.find('.alert-danger');
    expect(warning.text().replace(/[\n ]+/g, ' ')).toContain('changing or updating a field configuration will delete the associated performance statistics.');
  });

  it('does not add duplicate fields', () => {
    store.commit('setData', {
      answerFields: {
        testField: {
          type: 'categorical',
          config: {
            labels: ['A', 'B', 'C']
          }
        }

      }
    });
    const wrapper = mount(FieldsConfig, { store, localVue });
    const button = wrapper.find('button');
    wrapper.setData({ fieldName: 'testField', fieldType: 'categorical' });
    button.trigger('click');
    const fields = wrapper.findAll('.field-config');
    expect(fields.length).toEqual(1);
  });

  it('trigger enable retry', () => {
    store.commit('setData', {
      answerFields: {
        testField: {
          type: 'categorical',
          config: {
            labels: ['A', 'B', 'C']
          },
          retryForConsensus: false
        }
      }
    });
    const wrapper = mount(FieldsConfig, { store, localVue });
    expect(wrapper.findAll('.retry').length).toEqual(0);
    const expandButton = wrapper.find('.fa-angle-up');
    expandButton.trigger('click');
    const enableButton = wrapper.find('.btn-success');
    enableButton.trigger('click');
    expect(wrapper.findAll('.retry').length).toEqual(1);
  });

  it('trigger disable retry', () => {
    store.commit('setData', {
      answerFields: {
        testField: {
          type: 'categorical',
          config: {
            labels: ['A', 'B', 'C']
          },
          retry_for_consensus: true
        }
      }
    });
    const wrapper = mount(FieldsConfig, { store, localVue });
    expect(wrapper.findAll('.retry').length).toEqual(1);
    const expandButton = wrapper.find('.fa-angle-up');
    expandButton.trigger('click');
    const disableButton = wrapper.find('.btn-default');
    disableButton.trigger('click');
    expect(wrapper.findAll('.retry').length).toEqual(0);
  });
});
