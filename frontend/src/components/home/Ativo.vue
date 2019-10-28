<template>
  <div class="ativo">
    <PageTitle icon="fa fa-barcode" main="Ativos" sub="Cadastro de Ativos" />
    <div class="ativos-tab">
      <b-card no-body>
        <b-tabs v-model="tabIndex" card>
          <b-tab title="Lista" active>
            <div class="list">
              <div class="active-filter">
                <i class="fa fa-search fa-lg"></i>
                <input type="text" placeholder="Digite para filtrar..." v-model="activeFilter"
                  class="filter-field">
              </div>
              <b-form>
                <input id="active-id" type="hidden" v-model="active.id" />
              </b-form>
              <b-table hover striped :items="actives" :fields="fields" :filter="activeFilter">
                <template slot="actions" slot-scope="data">
                  <b-button variant="warning" v-if="user.admin" @click="loadActive(data.item), tabIndex++" class="mr-2">
                    <i class="fa fa-pencil" />
                  </b-button>
                  <b-button variant="danger" v-if="user.email === 'leandro@evspatrimonio.com.br' || user.email === 'everaldo@evspatrimonio.com.br' && user.admin" @click="loadActive(data.item, 'remove'), tabIndex++">
                    <i class="fa fa-trash" />
                  </b-button>
                </template>
              </b-table>
              <b-pagination class="paginacao" size="md" v-model="page" :total-rows="count" :per-page="limit"/>
            </div>
          </b-tab>
          <b-tab title="Incluir" v-if="user.admin">
          <div class="include">
            <b-form>   
              <input id="active-id" type="hidden" v-model="active.id"/>         
              <b-row >
                <b-col md="6" sx="12">
                  <b-form-group v-if="mode === 'save'" label="Empresa: " label-for="empresa">
                    <!-- <select2 id="empresa" :options="clients" name="empresa" 
                      v-model.number="active.empresaId" class="empresa select2" required>
                      <option disabled value="0">Selected One</option>
                    </select2> -->
                    <b-form-select id="empresa" :options="clients" 
                       v-model="active.empresaId" required>  
                    </b-form-select>
                  </b-form-group>
                </b-col>
                <b-col md="6" sx="12">
                  <b-form-group v-if="mode === 'save'" label="Filial:" label-for="filial">
                    <!-- <select2 id="filial" :options="batchs" name="filial" 
                      v-model.number="active.batchId" class="select2" required>
                      <option disabled value="0">Selected One</option>
                    </select2> -->
                    <b-form-select id="filial" :options="batchs" 
                      v-model="active.batchId" required>
                    </b-form-select>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <div id="camera"></div>
                <b-col md="3" sm="12"> 
                  <b-form-group label="Placa: *" label-for="placa">
                    <b-form-input id="placa" type="text" v-model="active.placa" required
                      :readonly="mode === 'remove'" placeholder="Placa..."/>
                  </b-form-group>
                </b-col>
                <b-col md="3" sm="12">
                  <b-form-group label="Anexo: *" label-for="anexo">
                    <b-form-input id="anexo" type="text" v-model="active.anexo" required
                    :readonly="mode === 'remove'" />
                  </b-form-group>
                </b-col>
                <b-col md="6" sm="12"> 
                  <b-form-group v-if="mode=== 'save'" label="Centro de Custo: *" label-for="costCenterId">
                    <!-- <select2 id="costCenterId" :options="costCenters" name="costCenterId" 
                      v-model.number="active.costCenterId" class="select2" required>
                      <option disabled value="0">Selected One</option>
                    </select2> -->
                    <b-form-select id="costCenterId" :options="costCenters"
                      v-model="active.costCenterId" required>
                    </b-form-select>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col md="6" sm="12">
                  <b-form-group v-if="mode=== 'save'" label="Local: *" label-for="local">
                    <!-- <select2 id="active-local" :options="locals" name="localId" 
                      v-model.number="active.localId" class="select2" required>
                      <option disabled value="0">Selected One</option>
                    </select2>                     -->
                    <b-form-select id="active-local" :options="locals"
                      v-model="active.localId" required>
                    </b-form-select>
                  </b-form-group>
                </b-col>
                <b-col md="6" sm="10">
                  <b-form-group v-if="mode === 'save'" label="Descrição Padrão: *" label-for="descriptionId">
                    <!-- <select2 :options="descriptions" v-model="active.descriptionId" class="select2" required>
                      <option disabled value="0">Select one</option>
                    </select2>                      -->
                    <b-form-select id="descriptionId" :options="descriptions" 
                       v-model="active.descriptionId" required>  
                    </b-form-select>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col sx="12">
                  <b-form-group label="Descrição:" label-for="description">
                  <b-form-textarea id="description"  v-model="active.description"
                    :readonly="mode === 'remove'" 
                    placeholder="Descrição..." rows="3" max-rows="5" no-resize>
                  </b-form-textarea>
                  </b-form-group>
                </b-col>        
              </b-row>
              <b-row>
                <b-col sx="12"> 
                  <b-form-group label="Complemento:" label-for="complemento">
                    <b-form-input id="complemento" type="text" v-model="active.complemento" 
                      :readonly="mode === 'remove'" placeholder="Complemento..."/>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col md="3" sm="12"> 
                  <b-form-group label="Marca:" label-for="marca">
                    <b-form-input id="marca" type="text" v-model="active.marca" 
                      :readonly="mode === 'remove'" placeholder="Marca..."/>
                  </b-form-group>
                </b-col>
                <b-col md="3" sm="12"> 
                    <b-form-group label="Modelo:" label-for="modelo">
                      <b-form-input id="modelo" type="text" v-model="active.modelo" 
                        :readonly="mode === 'remove'" placeholder="Modelo..."/>
                    </b-form-group>
                </b-col>
                <b-col md="3" sm="12"> 
                  <b-form-group label="Nº de Série: " label-for="numSerie">
                    <b-form-input id="numSerie" type="text" v-model="active.numSerie" 
                      :readonly="mode === 'remove'" placeholder="Nº de Série..."/>
                  </b-form-group>
                </b-col>       
                <b-col md="3" sm="12"> 
                  <b-form-group label="Dimensão:" label-for="dimensao">
                    <b-form-input id="dimensao" type="text" v-model="active.dimensao" 
                      :readonly="mode === 'remove'" placeholder="Dimensão..."/>
                  </b-form-group>
                </b-col>                      
              </b-row>
              <b-row>
                <b-col md="3" sm="12"> 
                  <b-form-group label="Capacidade:" label-for="capacidade">
                    <b-form-input id="capacidade" type="text" v-model="active.capacidade" 
                      :readonly="mode === 'remove'" placeholder="Capacidade..."/>
                  </b-form-group>
                </b-col>   
                <b-col md="7" sm="12">
                  <b-form-group v-if="mode=== 'save'" label="Condição de Uso: *" label-for="useConditionId">
                    <b-form-select id="useConditionId" :options="useConditions"
                      v-model="active.useConditionId" required>
                    </b-form-select>
                  </b-form-group>
                </b-col>         
                <b-col md="2" sm="12">
                  <b-form-group label="Tag:" label-for="tag">
                    <b-form-input id="tag" type="text" v-model="active.tag" 
                      :readonly="mode === 'remove'" placeholder="Tag..."/>
                  </b-form-group>
                </b-col>                              
              </b-row>
              <b-row>
                <b-col md="6" sm="12"> 
                  <b-form-group v-if="mode=== 'save'" label="Responsável:" label-for="responsibleId">
                    <b-form-select id="responsibleId" :options="responsibles"
                      v-model="active.responsibleId" required>
                    </b-form-select>
                  </b-form-group>
                </b-col>
                  <b-col md="6" sm="12">
                    <b-form-group v-if="mode=== 'save'" label="Projeto:" label-for="projectId">
                      <b-form-select id="projectId" :options="projects"
                        v-model="active.projectId" required>
                      </b-form-select>
                    </b-form-group>
                  </b-col>              
              </b-row>
              <b-row>
                <b-col md="6" sm="12">
                  <b-form-group v-if="mode=== 'save'" label="Unidade de Negócio:" label-for="unitBusinessId">
                    <b-form-select id="unitBusinessId" :options="trades"
                      v-model="active.unitBusId" required>
                    </b-form-select>
                  </b-form-group>
                </b-col>
                  <b-col md="6" sm="12">
                    <b-form-group v-if="mode=== 'save'" label="Agrupamento:" label-for="groupingsId">
                      <b-form-select id="groupingsId" :options="groupings"
                        v-model="active.groupingId" required>
                      </b-form-select>
                    </b-form-group>
                  </b-col>              
              </b-row>
              <b-row>
                <b-col md="3" sm="12"> 
                  <b-form-group label="Nº Antigo:" label-for="numAntigo">
                    <b-form-input id="numAntigo" type="text" v-model="active.numAntigo" 
                      :readonly="mode === 'remove'" placeholder="Nº Antigo..."/>
                  </b-form-group>
                </b-col>    
                <b-col md="4" sm="12"> 
                  <b-form-group label="Ano de Fabricação:" label-for="anoFabricacao">
                    <b-form-input id="anoFabricacao" type="text" v-model="active.anoFabricacao" 
                      :readonly="mode === 'remove'" placeholder="Ano de Fabricação..."/>
                  </b-form-group>
                </b-col>
                <b-col md="5" sm="12"> 
                  <b-form-group label="Observação:" label-for="observacao">
                    <b-form-input id="observacao" type="text" v-model="active.observacao" 
                      :readonly="mode === 'remove'" placeholder="Observação..."/>
                  </b-form-group>
                </b-col>              
              </b-row>
              <b-row>
                <b-col sx="12">
                  <b-form-group label="Imagem (URL):" label-for="imageURL">
                     <b-form-input id="imageURL" type="text" v-model="active.imageURL" 
                      :readonly="mode === 'remove'" placeholder="Informe a URL da Imagem..." />
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col sx="12">
                  <div class="showImageURL d-none d-sm-block">
                    <img v-if="active.imageURL" :src="active.imageURL" height="150" width="150"
                    alt="Imagem">
                    <img v-else
                      src="@/assets/image.png" height="150" width="150">
                  </div> 
                </b-col>
              </b-row>
              <b-row>
                <b-col sx="12">
                  <b-form-group v-if="mode=== 'save'" label="Usuário:" label-for="userId">
                    <b-form-select id="userId" :options="users"
                      v-model="active.userId" required>
                    </b-form-select>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-button variant="primary" v-if="mode === 'save'" @click="save">Salvar</b-button>
              <b-button variant="danger" v-if="mode === 'remove'" @click="remove">Excluir</b-button>
              <b-button class="ml-2" @click="reset">Cancelar</b-button>  
            </b-form>
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
//import Select2 from './Select2.vue'

export default {
  name: 'Ativo',
  components: { PageTitle /*Select2*/ },
  computed: mapState(['user']),
  data: function() {
    return {
      mode: 'save',
      active: {},
      actives: [],
      descriptions: [],
      clients: [],
      batchs: [],
      costCenters: [],
      locals: [],
      responsibles: [],
      projects: [],
      trades: [],
      groupings: [],
      useConditions: [],
      users: [],
      page: 1,
      limit: 0,
      count: 0,
      fields: [
        { key: 'placa', label: 'Placa', sortable: true },
        { key: 'anexo', label: 'Anexo', sortable: true },
        { key: 'description', label: 'Descrição', sortable: true },
        { key: 'actions', label: 'Ações' }
      ],
      tabIndex: 1,
      empresaId: 0,
      activeFilter: '',
      filter: { emptyText: 'Ativo não encontrado'},
    };
  },
  methods: {
    loadActives() {
      const url = `${baseApiUrl}/actives?page=${this.page}`
      axios.get(url).then(res => {
        this.actives = res.data.data
        this.count = res.data.count
        this.limit = res.data.limit
      });
    },
    reset() {
      this.mode = 'save'
      this.active = {}
      this.active.anexo = 0
      this.loadActives()
      this.getDescription()
    },
    save() {
      const method = this.active.id ? "put" : "post";
      const id = this.active.id ? `/${this.active.id}` : "";
      axios[method](`${baseApiUrl}/actives${id}`, this.active)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          //this.reset();
          this.loadActives();
        })
        .catch(showError);
    },
    remove() {
      const id = this.active.id
      axios.delete(`${baseApiUrl}/actives/${id}`)
        .then(() => {
          this.$toasted.global.defaultSuccess()
          this.reset()
        })
        .catch(showError)
    },
    loadActive(active, mode = 'save') {
      this.mode = mode
      axios.get(`${baseApiUrl}/actives/${active.id}`)
          .then(res => this.active = res.data)
    },
    loadBatchs(){
      const url = `${baseApiUrl}/batchs`
      axios.get(url).then(res => {
          this.batchs = res.data.map(batch => {
              return { value: batch.id, text: batch.name }
          })
      })
    },
    loadClients(){
      const url = `${baseApiUrl}/clients`
      axios.get(url).then(res => {
          this.clients = res.data.map(client => {
              return { value: client.id, text: client.name }
          })
      })
    },
    loadDescriptions(){
      const url = `${baseApiUrl}/descriptions`
      axios.get(url).then(res => {
          this.descriptions = res.data.map(description => {     
              return {value: description.id, text: description.name }
        })
      })
    },
    getDescription(){
      var select = document.querySelector("#descriptionId")
      select.addEventListener('change', function() {
        var option = this.selectedOptions[0];
        var texto = option.textContent;
        //$('#description').text(texto)
        document.getElementById('description').value = texto;
      })
    },
    loadCostCenters(){
      const url = `${baseApiUrl}/costCenters`
      axios.get(url).then(res => {
        this.costCenters = res.data.map(costCenter => {
          return { value: costCenter.id, text: costCenter.name }
        })
      })
    },
    loadLocals(){
      const url = `${baseApiUrl}/locals`
      axios.get(url).then(res => {
        this.locals = res.data.map(local => {
          return {value: local.id, text: local.name }
        })
      })
    },
    loadResponsibles(){
      const url = `${baseApiUrl}/responsibles`
      axios.get(url).then(res => {
        this.responsibles = res.data.map(responsible => {
          return { value: responsible.id, text: responsible.name }
        })
      })
    },
    loadProjects(){
      const url = `${baseApiUrl}/projects`
      axios.get(url).then(res => {
        this.projects = res.data.map(project => {
          return { value: project.id, text: project.name }
        })
      })
    },
    loadTrades(){
      const url = `${baseApiUrl}/unitBusiness`
      axios.get(url).then(res => {
        this.trades = res.data.map(trade => {
          return { value: trade.id, text: trade.name }
        })
      })
    },
    loadGroupings(){
      const url = `${baseApiUrl}/groupings`
      axios.get(url).then(res => {
        this.groupings = res.data.map(grouping => {
          return { value: grouping.id, text: grouping.name }
        })
      })
    },
    loadUseConditions(){
      const url = `${baseApiUrl}/useConditions`
      axios.get(url).then(res => {
        this.useConditions = res.data.map(useCondition =>{
          return { value: useCondition.id, text: useCondition.name }
        })
      })
    },
    loadUsers(){
      const url = `${baseApiUrl}/users`
      axios.get(url).then(res =>{
        this.users = res.data.map(user =>{
          return { value: user.id, text: user.name }
        })
      })
    },
    valorPadrao(){
      document.getElementById('anexo').value = 0;
    },
  },
  watch: {
      page() {
        this.loadActives()
      },
  },
  mounted() {
    this.loadActives();
    this.loadBatchs();
    this.loadClients();
    this.loadDescriptions();
    this.loadCostCenters();
    this.loadLocals();
    this.loadResponsibles();
    this.loadProjects();
    this.loadTrades();
    this.loadGroupings();
    this.loadUseConditions();
    this.loadUsers();
    this.getDescription();
    this.valorPadrao();
  },


};
</script>

<style>
  .list .active-filter {
    display: flex;
    justify-content: center;
    align-items: center;

    margin: 20px;
    margin-top: 0px;
    padding-bottom: 8px;
    border-bottom: 1px solid #AAA;
  }

  .list .active-filter i {
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

  .paginacao {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .select2 {
    width: 500px;
  }
</style>