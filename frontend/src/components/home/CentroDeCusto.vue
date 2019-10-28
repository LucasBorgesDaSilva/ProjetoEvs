<template>
  <div class="centro-de-custo">
    <PageTitle icon="fa fa-usd" main="Centro de Custo" sub="Cadastro de Centro de Custo" />
    <div class="centro-de-custo-tab">
      <b-card no-body>
        <b-tabs v-model="tabIndex" card>
          <b-tab title="Lista" active>
            <div class="list">
              <div class="costCenter-filter">
                <i class="fa fa-search fa-lg"></i>
                <input type="text" placeholder="Digite para filtrar..." v-model="costCenterFilter"
                  class="filter-field">
              </div>
              <b-form>
                <input id="costCenter-id" type="hidden" v-model="costCenter.id"/>
              </b-form>
              <b-table hover striped :items="costCenters" :fields="fields" :filter="costCenterFilter">
                <template slot="actions" slot-scope="data">
                  <b-button variant="warning" v-if="user.admin" @click="loadCostCenter(data.item), tabIndex++" class="mr-2">
                    <i class="fa fa-pencil" />
                  </b-button>
                  <b-button variant="danger" v-if="user.email === 'leandro@evspatrimonio.com.br' || user.email === 'everaldo@evspatrimonio.com.br' && user.admin" @click="loadCostCenter(data.item, 'remove'), tabIndex++">
                    <i class="fa fa-trash" />
                  </b-button>
                </template>
              </b-table>
            </div>
          </b-tab>
          <b-tab title="Incluir" v-if="user.admin">
            <div class="include">
              <b-form>
                <input id="costCenter-id" type="hidden" v-model="costCenter.id" />
                <b-row>
                  <b-col md="6" sm="12">
                    <b-form-group label="Código: *" label-for="costCenter-codigo">
                      <b-form-input id="costCenter-codigo" type="text"
                        v-model="costCenter.codigo" required
                        :readonly="mode === 'remove'"
                        placeholder="Informe o Código do Centro de Custo..."/>
                    </b-form-group>
                  </b-col>
                  <b-col md="6" sm="12">
                    <b-form-group label="Nome: *" label-for="costCenter-name">
                      <b-form-input id="costCenter-name" type="text"
                        v-model="costCenter.name" required
                        :readonly="mode === 'remove'"
                        placeholder="Informe o Nome do Centro de Custo..."/>
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
  name: 'CentroDeCusto',
  components: { PageTitle },
  computed: mapState(['user']),
  data: function() {
    return {
      mode: 'save',
      costCenter: {},
      costCenters: [],
      fields: [
        { key: 'codigo', label: 'Código', sortable: true },
        { key: 'name', label: 'Nome', sortable: true },
        { key: 'actions', label: 'Ações' }
      ],
      tabIndex: 1,
      costCenterFilter: '',
      filter: { emptyText: 'Ativo não encontrado'}
    };
  },
  methods: {
    loadCostCenters() {
      const url = `${baseApiUrl}/costCenters`
      axios.get(url).then(res => {
        this.costCenters = res.data;
      });
    },
    reset() {
      this.mode = "save";
      this.costCenter = {};
      this.loadCostCenters();
    },
    save() {
      const method = this.costCenter.id ? "put" : "post";
      const id = this.costCenter.id ? `/${this.costCenter.id}` : "";
      axios[method](`${baseApiUrl}/costCenters${id}`, this.costCenter)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        })
        .catch(showError);
    },
    remove() {
      const id = this.costCenter.id;
      axios.delete(`${baseApiUrl}/costCenters/${id}`)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        })
        .catch(showError);
    },
    loadCostCenter(costCenter, mode = "save") {
      this.mode = mode;
      this.costCenter = { ...costCenter };
    }
  },
  mounted() {
    this.loadCostCenters();
  }
};
</script>

<style>
  .list .costCenter-filter {
    display: flex;
    justify-content: center;
    align-items: center;

    margin: 20px;
    margin-top: 0px;
    padding-bottom: 8px;
    border-bottom: 1px solid #AAA;
  }

  .list .costCenter-filter i {
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