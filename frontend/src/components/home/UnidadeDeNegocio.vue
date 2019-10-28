<template>
  <div class="unidade-de-negocio">
    <PageTitle icon="fa fa-thumb-tack" main="Unidade de Negócio" sub="Cadastro de Unidade de Negócio"/>
    <div class="unidade-de-negocio-tab">
      <b-card no-body>
        <b-tabs v-model="tabIndex" card>
          <b-tab title="Lista" active>
            <div class="list">
              <div class="trade-filter">
                <i class="fa fa-search fa-lg"></i>
                <input type="text" placeholder="Digite para filtrar..." v-model="tradeFilter" 
                  class="filter-field">
              </div>              
              <b-form>
                <input id="trade-id" type="hidden" v-model="trade.id" />
              </b-form>
              <b-table hover striped :items="trades" :fields="fields" :filter="tradeFilter">
                <template slot="actions" slot-scope="data">
                  <b-button variant="warning" v-if="user.admin" @click="loadTrade(data.item), tabIndex++" class="mr-2">
                    <i class="fa fa-pencil" />
                  </b-button>
                  <b-button variant="danger" v-if="user.email === 'leandro@evspatrimonio.com.br' || user.email === 'everaldo@evspatrimonio.com.br' && user.admin" @click="loadTrade(data.item, 'remove'), tabIndex++">
                    <i class="fa fa-trash" />
                  </b-button>
                </template>
              </b-table>
            </div>
          </b-tab>
          <b-tab title="Incluir" v-if="user.admin">
            <div class="include">
              <b-form>
                <input id="trade-id" type="hidden" v-model="trade.id" />
                <b-row>
                  <b-col md="6" sm="12">
                    <b-form-group label="Código: *" label-for="trade-codigo">
                      <b-form-input id="trade-codigo" type="text"
                        v-model="trade.codigo" required
                        :readonly="mode === 'remove'"
                        placeholder="Informe o Código da Unidade de Negócio..."/>
                    </b-form-group>
                  </b-col>
                  <b-col md="6" sm="12">
                    <b-form-group label="Nome: *" label-for="trade-name">
                      <b-form-input id="trade-name" type="text"
                        v-model="trade.name" required
                        :readonly="mode === 'remove'"
                        placeholder="Informe o Nome da Unidade de Negócio..."/>
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
  name: 'UnidadeDeNegocio',
  components: { PageTitle },
  computed: mapState(['user']),
  data: function() {
    return {
      mode: 'save',
      trade: {},
      trades: [],
      fields: [
        { key: 'codigo', label: 'Código', sortable: true },
        { key: 'name', label: 'Nome', sortable: true },
        { key: 'actions', label: 'Ações' }
      ],
      tabIndex: 1,
      tradeFilter: '',
      filter: { emptyText: 'Descrição não encontrada.' }  
    }
  },
  methods: {
    loadUnitBusiness() {
      const url = `${baseApiUrl}/unitBusiness`;
      axios.get(url).then(res => {
        this.trades = res.data;
      });
    },
    reset() {
      this.mode = "save";
      this.trade = {};
      this.loadUnitBusiness();
    },
    save() {
      const method = this.trade.id ? "put" : "post";
      const id = this.trade.id ? `/${this.trade.id}` : "";
      axios[method](`${baseApiUrl}/unitBusiness${id}`, this.trade)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        })
        .catch(showError);
    },
    remove() {
      const id = this.trade.id;
      axios.delete(`${baseApiUrl}/unitBusiness/${id}`)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        })
        .catch(showError);
    },
    loadTrade(trade, mode = "save") {
      this.mode = mode;
      this.trade = { ...trade };
    }
  },
  mounted() {
    this.loadUnitBusiness();
  }
};
</script>

<style>
  .list .trade-filter {
    display: flex;
    justify-content: center;
    align-items: center;

    margin: 20px;
    margin-top: 0px;
    padding-bottom: 8px;
    border-bottom: 1px solid #AAA;

  }

  .list .trade-filter i {
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