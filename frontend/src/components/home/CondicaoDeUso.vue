<template>
  <div class="condicao-de-uso">
    <PageTitle icon="fa fa-puzzle-piece" main="Condição de Uso" sub="Cadastro de Condição de Uso" />
    <div class="condicao-de-uso-tab">
      <b-card no-body>
        <b-tabs v-model="tabIndex" card>
          <b-tab title="Lista" active>
            <div class="list">
              <div class="useCondition-filter">
                <i class="fa fa-search fa-lg"></i>
                <input type="text" placeholder="Digite para filtrar..." v-model="useConditionFilter"
                  class="filter-field">
              </div> 
              <b-form>
                <input id="useCondition-id" type="hidden" v-model="useCondition.id" />
              </b-form>
              <b-table hover striped :items="useConditions" :fields="fields" :filter="useConditionFilter">
                <template slot="actions" slot-scope="data">
                  <b-button variant="warning" v-if="user.admin" @click="loadUseCondition(data.item), tabIndex++" class="mr-2">
                    <i class="fa fa-pencil" />
                  </b-button>
                  <b-button variant="danger" v-if="user.email === 'leandro@evspatrimonio.com.br' || user.email === 'everaldo@evspatrimonio.com.br' && user.admin" @click="loadUseCondition(data.item, 'remove'), tabIndex++">
                    <i class="fa fa-trash" />
                  </b-button>
                </template>
              </b-table>
            </div>
          </b-tab>
          <b-tab title="Incluir" v-if="user.admin">
            <div class="include">
              <b-form>
                <input id="useCondition-id" type="hidden" v-model="useCondition.id" />
                <b-row>
                  <b-col md="6" sm="12">
                    <b-form-group label="Código: *" label-for="useCondition-codigo">
                      <b-form-input id="useCondition-codigo" type="text"
                        v-model="useCondition.codigo" required
                        :readonly="mode === 'remove'"
                        placeholder="Informe o Código da Condição de Uso..."/>
                    </b-form-group>
                  </b-col>
                  <b-col md="6" sm="12">
                    <b-form-group label="Nome: *" label-for="useCondition-name">
                      <b-form-input id="useCondition-name" type="text"
                        v-model="useCondition.name" required
                        :readonly="mode === 'remove'"
                        placeholder="Informe o Nome da Condição de Uso..."/>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-button variant="primary" v-if="mode === 'save'" @click="save">Salvar</b-button>
                <b-button variant="danger" v-if="mode === 'remove'" @click="remove">Excluir</b-button>
                <b-button class="ml-2" @click="reset">Cancelar</b-button>
              </b-form>
              <hr />
            </div>
          </b-tab>
        </b-tabs>
      </b-card>
    </div>
  </div>
</template>

<script>
import PageTitle from '../template/PageTitle'
import { baseApiUrl, showError } from '@/global'
import axios from 'axios'
import { mapState } from 'vuex'

export default {
  name: 'Agrupamento',
  components: { PageTitle },
  computed: mapState(['user']),  
  data: function() {
    return {
      mode: 'save',
      useCondition: {},
      useConditions: [],
      fields: [
        { key: 'codigo', label: 'Código', sortable: true },
        { key: 'name', label: 'Nome', sortable: true },
        { key: 'actions', label: 'Ações' }
      ],
      tabIndex: 1,
      useConditionFilter: '',
      filter: { emptyText: 'Ativo não encontrado'}      
    };
  },
  methods: {
    loadUseConditions() {
      const url = `${baseApiUrl}/useConditions`;
      axios.get(url).then(res => {
        this.useConditions = res.data;
      });
    },
    reset() {
      this.mode = "save";
      this.useCondition = {};
      this.loadUseConditions();
    },
    save() {
      const method = this.useCondition.id ? "put" : "post";
      const id = this.useCondition.id ? `/${this.useCondition.id}` : "";
      axios[method](`${baseApiUrl}/useConditions${id}`, this.useCondition)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        })
        .catch(showError);
    },
    remove() {
      const id = this.useCondition.id;
      axios
        .delete(`${baseApiUrl}/useConditions/${id}`)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        })
        .catch(showError);
    },
    loadUseCondition(useCondition, mode = "save") {
      this.mode = mode;
      this.useCondition = { ...useCondition };
    }
  },
  mounted() {
    this.loadUseConditions();
  }
};
</script>

<style>
  .list .useCondition-filter {
    display: flex;
    justify-content: center;
    align-items: center;

    margin: 20px;
    margin-top: 0px;
    padding-bottom: 8px;
    border-bottom: 1px solid #AAA;
  }

  .list .useCondition-filter i {
    color: #AAA;
    margin-right: 10px;
  }

  .list input {
    color: #000;
    font-size: 1.0rem;
    border: 0;
    outline: 0;
    width: 100%;
    background: transparent;
  }
</style>