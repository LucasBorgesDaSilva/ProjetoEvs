<template>
  <div class="responsavel">
    <PageTitle icon="fa fa-user-plus" main="Responsável" sub="Cadastro de Responsável" />
    <div class="responsavel-tab">
      <b-card no-body>
        <b-tabs v-model="tabIndex" card>
          <b-tab title="Lista" active>
            <div class="list">
              <div class="responsible-filter">
                <i class="fa fa-search fa-lg"></i>
                <input type="text" placeholder="Digite para filtrar..." v-model="responsibleFilter" 
                  class="filter-field">
              </div>
              <b-form>
                <input id="responsible-id" type="hidden" v-model="responsible.id" />
              </b-form>
              <b-table hover striped :items="responsibles" :fields="fields" :filter="responsibleFilter">
                <template slot="actions" slot-scope="data">
                  <b-button variant="warning" v-if="user.admin" @click="loadResponsible(data.item), tabIndex++" class="mr-2">
                    <i class="fa fa-pencil" />
                  </b-button>
                  <b-button variant="danger" v-if="user.email === 'leandro@evspatrimonio.com.br' || user.email === 'everaldo@evspatrimonio.com.br' && user.admin" @click="loadResponsible(data.item, 'remove'), tabIndex++">
                    <i class="fa fa-trash" />
                  </b-button>
                </template>
              </b-table>
            </div>
          </b-tab>
          <b-tab title="Incluir" v-if="user.admin">
            <div class="include">
              <b-form>
                <input id="responsible-id" type="hidden" v-model="responsible.id" />
                <b-row>
                  <b-col md="6" sm="12">
                    <b-form-group label="Código: *" label-for="responsible-codigo">
                      <b-form-input id="responsible-codigo" type="text"
                        v-model="responsible.codigo" required
                        :readonly="mode === 'remove'"
                        placeholder="Informe o Código do Responsável..."/>
                    </b-form-group>
                  </b-col>
                  <b-col md="6" sm="12">
                    <b-form-group label="Nome: *" label-for="responsible-name">
                      <b-form-input id="responsible-name" type="text"
                        v-model="responsible.name" required
                        :readonly="mode === 'remove'"
                        placeholder="Informe o Nome do Responsável..."/>
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
  name: 'Responsável',
  components: { PageTitle },
  computed: mapState(['user']),
  data: function() {
    return {
      mode: 'save',
      responsible: {},
      responsibles: [],
      fields: [
        { key: 'codigo', label: 'Código', sortable: true },
        { key: 'name', label: 'Nome', sortable: true },
        { key: 'actions', label: 'Ações' }
      ],
      tabIndex: 1,
      responsibleFilter: '',
      filter: { emptyText: 'Descrição não encontrada.' }       
    };
  },
  methods: {
    loadResponsibles() {
      const url = `${baseApiUrl}/responsibles`;
      axios.get(url).then(res => {
        this.responsibles = res.data;
      });
    },
    reset() {
      this.mode = "save";
      this.responsible = {};
      this.loadResponsibles();
    },
    save() {
      const method = this.responsible.id ? "put" : "post";
      const id = this.responsible.id ? `/${this.responsible.id}` : "";
      axios[method](`${baseApiUrl}/responsibles${id}`, this.responsible)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        })
        .catch(showError);
    },
    remove() {
      const id = this.responsible.id;
      axios.delete(`${baseApiUrl}/responsibles/${id}`)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        })
        .catch(showError);
    },
    loadResponsible(responsible, mode = "save") {
      this.mode = mode;
      this.responsible = { ...responsible };
    }
  },
  mounted() {
    this.loadResponsibles();
  }
};
</script>

<style>
  .list .responsible-filter {
    display: flex;
    justify-content: center;
    align-items: center;

    margin: 20px;
    margin-top: 0px;
    padding-bottom: 8px;
    border-bottom: 1px solid #AAA;

  }

  .list .responsible-filter i {
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