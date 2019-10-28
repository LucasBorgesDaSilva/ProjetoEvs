<template>
  <div class="agrupamento">
    <PageTitle icon="fa fa-cubes" main="Agrupamento" sub="Cadastro de Agrupamento" />
    <div class="agrupamento-tab">
      <b-card no-body>
        <b-tabs v-model="tabIndex" card>
          <b-tab title="Lista" active>
            <div class="list">
              <div class="grouping-filter">
                <i class="fa fa-search fa-lg"></i>
                <input type="text" placeholder="Digite para filtrar..." v-model="groupingFilter"
                  class="filter-field">
              </div>
              <b-form>
                <input id="grouping-id" type="hidden" v-model="grouping.id" />
              </b-form>
              <b-table hover striped :items="groupings" :fields="fields" :filter="groupingFilter">
                <template slot="actions" slot-scope="data">
                  <b-button variant="warning" v-if="user.admin" @click="loadGrouping(data.item), tabIndex++"
                    class="mr-2">
                    <i class="fa fa-pencil" />
                  </b-button>
                  <b-button variant="danger" v-if="user.email === 'leandro@evspatrimonio.com.br' || user.email === 'everaldo@evspatrimonio.com.br' && user.admin" @click="loadGrouping(data.item, 'remove'), tabIndex++">
                    <i class="fa fa-trash" />
                  </b-button>
                </template>
              </b-table>
            </div>
            <!--<b-button class="mt-3" @click="gerarCSV(grouping.codigo, grouping.name)">Importar Arquivo</b-button>-->
          </b-tab>
          <b-tab title="Incluir" v-if="user.admin">
            <div class="include">
              <b-form>
                <input id="grouping-id" type="hidden" v-model="grouping.id" />
                <b-row>
                  <b-col md="6" sm="12">
                    <b-form-group label="Código: *" label-for="grouping-codigo">
                      <b-form-input id="grouping-codigo" type="text" 
                        v-model="grouping.codigo" required
                        :readonly="mode === 'remove'" placeholder="Informe o Código do Agrupamento..."/>
                    </b-form-group>
                  </b-col>
                  <b-col md="6" sm="12">
                    <b-form-group label="Nome: *" label-for="grouping-name">
                      <b-form-input id="grouping-name" type="text"
                        v-model="grouping.name" required
                        :readonly="mode === 'remove'" placeholder="Informe o Nome do Agrupamento..."/>
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
import { mapState } from 'vuex' 
import axios from 'axios'

export default {
  name: "Agrupamento",
  components: { PageTitle },
  computed: mapState(['user', 'grouping']),
  data: function() {
    return {
      mode: 'save',
      grouping: {},
      groupings: [],
      fields: [
        { key: 'codigo', label: 'Código', sortable: true },
        { key: 'name', label: 'Nome', sortable: true },
        { key: 'actions', label: 'Ações' }
      ],
      tabIndex: 1,
      groupingFilter: '',
      filter: { emptyText: 'Agrupamento não encontrado.'}
    };
  },
  
  methods: {
    loadGroupings() {
      const url = `${baseApiUrl}/groupings`
      axios.get(url).then(res => {
        this.groupings = res.data;
      });
    },
    reset() {
      this.mode = "save";
      this.grouping = {};
      this.loadGroupings();
    },
    save() {
      const method = this.grouping.id ? "put" : "post";
      const id = this.grouping.id ? `/${this.grouping.id}` : "";
      axios[method](`${baseApiUrl}/groupings${id}`, this.grouping)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        })
        .catch(showError);
    },
    remove() {
      const id = this.grouping.id;
      axios.delete(`${baseApiUrl}/groupings/${id}`)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        })
        .catch(showError);
    },
    loadGrouping(grouping, mode = "save") {
      this.mode = mode;
      this.grouping = { ...grouping };
    },
    gerarCSV: function(valueA, valueB){
      var itens =[
            {
              codigo: valueA,
              name: valueB
            }
          ]
      var csv = 'codigo, name\n'

        itens.forEach(function(row){
          csv += row.codigo;
          csv += ',' + row.name;
          csv += '\n';
      });

        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
        hiddenElement.target = '_blank';
        hiddenElement.download = 'Agrupamento.csv';
        hiddenElement.click();
      }    
  },
  mounted() {
    this.loadGroupings();
  }
};
</script>

<style>
  .list .grouping-filter {
    display: flex;
    justify-content: center;
    align-items: center;

    margin: 20px;
    margin-top: 0px;
    padding-bottom: 8px;
    border-bottom: 1px solid #AAA;
  }

  .list .grouping-filter i {
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