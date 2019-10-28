<template>
  <div class="clientes">
    <PageTitle icon="fa fa-users" main="Cliente" sub="Cadastro de Clientes" />
    <div class="clientes-tab">
      <b-card no-body>
        <b-tabs v-model="tabIndex" card>
          <b-tab title="Lista" active>
            <div class="list">
              <div class="clients-filter">
                <i class="fa fa-search fa-lg"></i>
                <input type="text" placeholder="Digite para filtrar..." v-model="clientsFilter"
                  class="filter-field">
              </div>              
              <b-form>
                <input id="client-id" type="hidden" v-model="client.id" />
              </b-form>
              <b-table hover striped :items="clients" :fields="fields" :filter="clientsFilter">
                <template slot="actions" slot-scope="data">
                  <b-button variant="warning" v-if="user.admin" @click="loadClient(data.item), tabIndex++" class="mr-2">
                    <i class="fa fa-pencil" />
                  </b-button>
                  <b-button variant="danger" v-if="user.email === 'leandro@evspatrimonio.com.br' || user.email === 'everaldo@evspatrimonio.com.br' && user.admin" @click="loadClient(data.item, 'remove'), tabIndex++">
                    <i class="fa fa-trash" />
                  </b-button>
                </template>
              </b-table>
            </div>
          </b-tab>
          <b-tab title="Incluir" v-if="user.admin">
            <div class="include">
              <b-form>
                <input id="client-id" type="hidden" v-model="client.id" />
                <b-row>
                  <b-col md="6" sm="12">
                    <b-form-group label="Código: *" label-for="client-codigo">
                      <b-form-input id="client-codigo" type="text"
                        v-model="client.codigo" required
                        :readonly="mode === 'remove'"
                        placeholder="Informe o Código do Cliente..."/>
                    </b-form-group>
                  </b-col>
                  <b-col md="6" sm="12">
                    <b-form-group label="Nome: *" label-for="client-name">
                      <b-form-input id="client-name" type="text"
                        v-model="client.name" required
                        :readonly="mode === 'remove'"
                        placeholder="Informe o Nome do CLiente..."/>
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
    name: 'Cliente',
    components: { PageTitle },
    computed: mapState(['user']),
    data: function(){
        return{
            mode: 'save',
            client: {},
            clients: [],
            fields: [
              { key: 'codigo', label: 'Código', sortable: true },
              { key: 'name', label: 'Nome', sortable: true },
              { key: 'actions', label: 'Ações'}
            ],
            tabIndex: 1,
            clientsFilter: '',
            filter: { emptyText: 'Ativo não encontrado'}
        };
    },
    methods: {
        loadClients(){
            const url = `${baseApiUrl}/clients`
            axios.get(url).then(res =>{
                this.clients = res.data
            })
        },
        reset() {
            this.mode = "save";
            this.client = {};
            this.loadClients();
        },
        save() {
        const method = this.client.id ? "put" : "post";
        const id = this.client.id ? `/${this.client.id}` : "";
        axios[method](`${baseApiUrl}/clients${id}`, this.client)
            .then(() => {
                this.$toasted.global.defaultSuccess();
                this.reset();
            })
            .catch(showError);
        },
        remove() {
        const id = this.client.id;
        axios.delete(`${baseApiUrl}/clients/${id}`)
            .then(() => {
                this.$toasted.global.defaultSuccess();
                this.reset();
            })
            .catch(showError);
        },
        loadClient(client, mode = "save") {
        this.mode = mode;
        this.client = { ...client };
        }    
    },
    mounted(){
        this.loadClients()
    }
}
</script>

<style>
  .list .clients-filter {
    display: flex;
    justify-content: center;
    align-items: center;

    margin: 20px;
    margin-top: 0px;
    padding-bottom: 8px;
    border-bottom: 1px solid #AAA;
  }

  .list .clients-filter i {
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