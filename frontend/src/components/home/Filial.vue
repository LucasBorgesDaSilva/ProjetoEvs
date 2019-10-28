<template>
    <div class="filial">
        <PageTitle icon="fa fa-building-o" main="Filial"
            sub="Cadastro de Filiais" />
        <div class="filial-tab">
      <b-card no-body>
        <b-tabs v-model="tabIndex" card>
          <b-tab title="Lista" active>
            <div class="list">
              <div class="batch-filter">
                <i class="fa fa-search fa-lg"></i>
                <input type="text" placeholder="Digite para filtrar..." v-model="batchFilter" 
                  class="filter-field">
              </div>
              <b-form>
                <input id="batch-id" type="hidden" v-model="batch.id" />
              </b-form>
              <b-table hover striped :items="batchs" :fields="fields" :filter="batchFilter">
                <template slot="actions" slot-scope="data">
                  <b-button variant="warning" v-if="user.admin" @click="loadBatch(data.item), tabIndex++" class="mr-2">
                    <i class="fa fa-pencil" />
                  </b-button>
                  <b-button variant="danger" v-if="user.email === 'leandro@evspatrimonio.com.br' || user.email === 'everaldo@evspatrimonio.com.br' && user.admin" @click="loadBatch(data.item, 'remove'), tabIndex++">
                    <i class="fa fa-trash" />
                  </b-button>
                </template>
              </b-table>
            </div> 
          </b-tab> 
          <b-tab title="Incluir" v-if="user.admin">
            <div class="include">
              <b-form>
                <input id="batch-id" type="hidden" v-model="batch.id" />
                <b-row>
                  <b-col md="6" sm="12">
                    <b-form-group label="Código: *" label-for="batch-codigo">
                      <b-form-input id="batch-codigo" type="text"
                        v-model="batch.codigo" required
                        :readonly="mode === 'remove'"
                        placeholder="Informe o Código da Filial..."/>
                    </b-form-group>
                  </b-col>
                  <b-col md="6" sm="12">
                    <b-form-group label="Nome: *" label-for="batch-name">
                      <b-form-input id="batch-name" type="text"
                        v-model="batch.name" required
                        :readonly="mode === 'remove'"
                        placeholder="Informe o Nome da Filial..."/>
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
    name: 'Filial',
    components: { PageTitle },
    computed: mapState(['user']),
    data: function(){
      return{
        mode: 'save',
        batch: {},
        batchs: [],                   
        fields: [
          { key: 'codigo', label: 'Código', sortable: true },
          { key: 'name', label: 'Nome', sortable: true },
          { key: 'actions', label: 'Ações'}
        ],
        tabIndex: 1,
        batchFilter: '',
        filter: { emptyText: 'Descrição não encontrada.' }        
        };
    },
    methods: {
        loadBatchs(){
            const url = `${baseApiUrl}/batchs`
            axios.get(url).then(res =>{
                this.batchs = res.data
            })
        },
        reset() {
            this.mode = "save";
            this.batch = {};
            this.loadBatchs();
        },
        save() {
        const method = this.batch.id ? "put" : "post";
        const id = this.batch.id ? `/${this.batch.id}` : "";
        axios[method](`${baseApiUrl}/batchs${id}`, this.batch)
            .then(() => {
                this.$toasted.global.defaultSuccess();
                this.reset();
            })
            .catch(showError);
        },
        remove() {
        const id = this.batch.id;
        axios.delete(`${baseApiUrl}/batchs/${id}`)
            .then(() => {
                this.$toasted.global.defaultSuccess();
                this.reset();
            })
            .catch(showError);
        },
        loadBatch(batch, mode = "save") {
            this.mode = mode;
            this.batch = { ...batch };
        }        
    },
    mounted(){
        this.loadBatchs()
    }     
}    
</script>

<style>
  .list .batch-filter {
    display: flex;
    justify-content: center;
    align-items: center;

    margin: 20px;
    margin-top: 0px;
    padding-bottom: 8px;
    border-bottom: 1px solid #AAA;

  }

  .list .batch-filter i {
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