<template>
    <div class="local">
        <PageTitle icon="fa fa-building" main="Local" sub="Cadastro de Locais" />
    <div class="local-tab">        
      <b-card no-body>
        <b-tabs v-model="tabIndex" card>
          <b-tab title="Lista" active>
            <div class="list">
              <div class="local-filter">
                <i class="fa fa-search fa-lg"></i>
                <input type="text" placeholder="Digite para filtrar..." v-model="localFilter" 
                  class="filter-field">
              </div>              
              <b-form>
                <input id="local-id" type="hidden" v-model="local.id" />
              </b-form>
                    <b-table hover striped :items="locals" :fields="fields" :filter="localFilter">
                <template slot="actions" slot-scope="data">
                  <b-button variant="warning" v-if="user.admin" @click="loadLocal(data.item), tabIndex++" class="mr-2">
                    <i class="fa fa-pencil" />
                  </b-button>
                  <b-button variant="danger" v-if="user.email === 'leandro@evspatrimonio.com.br' || user.email === 'everaldo@evspatrimonio.com.br' && user.admin" @click="loadLocal(data.item, 'remove'), tabIndex++">
                    <i class="fa fa-trash" />
                  </b-button>
                </template>
              </b-table>                        
            </div> 
          </b-tab> 
          <b-tab title="Incluir" v-if="user.admin">
            <div class="include">
              <b-form>
                <input id="local-id" type="hidden" v-model="local.id" />
                <b-row>
                  <b-col md="6" sm="12">
                    <b-form-group label="Código: *" label-for="local-codigo">
                      <b-form-input id="local-codigo" type="text"
                        v-model="local.codigo" required
                        :readonly="mode === 'remove'"
                        placeholder="Informe o Código do Local..."/>
                    </b-form-group>
                  </b-col>
                  <b-col md="6" sm="12">
                    <b-form-group label="Nome: *" label-for="local-name">
                      <b-form-input id="local-name" type="text"
                        v-model="local.name" required
                        :readonly="mode === 'remove'"
                        placeholder="Informe o Nome do Local..."/>
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
    name: 'Local',
    components: { PageTitle },
    computed: mapState(['user']),
    data: function(){
        return{
            mode: 'save',
            local: {},
            locals: [],
            fields: [
                { key: 'codigo', label: 'Código', sortable: true },
                { key: 'name', label: 'Nome', sortable: true },
                { key: 'actions', label: 'Ações'}
            ],
            tabIndex: 1,
            localFilter: '',
            filter: { emptyText: 'Descrição não encontrada.' } 
        }
    },
    methods: {
        loadLocals(){
            const url = `${baseApiUrl}/locals`
            axios.get(url).then(res =>{
                this.locals = res.data
            })
        },
        reset() {
            this.mode = "save";
            this.local = {};
            this.loadLocals();
        },
        save() {
        const method = this.local.id ? "put" : "post";
        const id = this.local.id ? `/${this.local.id}` : "";
        axios[method](`${baseApiUrl}/locals${id}`, this.local)
            .then(() => {
                this.$toasted.global.defaultSuccess();
                this.reset();
            })
            .catch(showError);
        },
        remove() {
        const id = this.local.id;
        axios.delete(`${baseApiUrl}/locals/${id}`)
            .then(() => {
                this.$toasted.global.defaultSuccess();
                this.reset();
            })
            .catch(showError);
        },
        loadLocal(local, mode = "save") {
            this.mode = mode;
            this.local = { ...local };
        }          
    },
    mounted(){
        this.loadLocals()
    }     
}
</script>

<style>
  .list .local-filter {
    display: flex;
    justify-content: center;
    align-items: center;

    margin: 20px;
    margin-top: 0px;
    padding-bottom: 8px;
    border-bottom: 1px solid #AAA;

  }

  .list .local-filter i {
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