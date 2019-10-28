<template>
    <div class="projetos">
        <PageTitle icon="fa fa-desktop" main="Projetos" sub="Cadastro de Projetos" />
    <div class="projeto-tab">
      <b-card no-body>
        <b-tabs v-model="tabIndex" card>
          <b-tab title="Lista" active>
            <div class="list">
              <div class="project-filter">
                <i class="fa fa-search fa-lg"></i>
                <input type="text" placeholder="Digite para filtrar..." v-model="projectFilter" 
                  class="filter-field">
              </div>       
              <b-form>
                <input id="project-id" type="hidden" v-model="project.id" />
              </b-form>
              <b-table hover striped :items="projects" :fields="fields" :filter="projectFilter">
                <template slot="actions" slot-scope="data">
                  <b-button variant="warning" v-if="user.admin" @click="loadProject(data.item), tabIndex++" class="mr-2">
                    <i class="fa fa-pencil" />
                  </b-button>
                  <b-button variant="danger" v-if="user.email === 'leandro@evspatrimonio.com.br' || user.email === 'everaldo@evspatrimonio.com.br' && user.admin" @click="loadProject(data.item, 'remove'), tabIndex++">
                    <i class="fa fa-trash" />
                  </b-button>
                </template>
              </b-table>
            </div>
          </b-tab>
          <b-tab title="Incluir" v-if="user.admin">
            <div class="include">
              <b-form>
                <input id="project-id" type="hidden" v-model="project.id" />
                <b-row>
                  <b-col md="6" sm="12">
                    <b-form-group label="Código: *" label-for="project-codigo">
                      <b-form-input id="project-codigo" type="text"
                        v-model="project.codigo" required
                        :readonly="mode === 'remove'"
                        placeholder="Informe o Código do Projeto..."/>
                    </b-form-group>
                  </b-col>
                  <b-col md="6" sm="12">
                    <b-form-group label="Nome: *" label-for="project-name">
                      <b-form-input id="project-name" type="text"
                        v-model="project.name" required
                        :readonly="mode === 'remove'"
                        placeholder="Informe o Nome do Projeto..."/>
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
  name: 'Projeto',
  components: { PageTitle },
  computed: mapState(['user']),
  data: function() {
    return {
      mode: 'save',
      project: {},
      projects: [],
      fields: [
        { key: 'codigo', label: 'Código', sortable: true },
        { key: 'name', label: 'Nome', sortable: true },
        { key: 'actions', label: 'Ações' }
      ],
      tabIndex: 1,
      projectFilter: '',
      filter: { emptyText: 'Descrição não encontrada.' } 
    };
  },
  methods: {
    loadProjects() {
      const url = `${baseApiUrl}/projects`;
      axios.get(url).then(res => {
        this.projects = res.data;
      });
    },
    reset() {
      this.mode = "save";
      this.project = {};
      this.loadProjects();
    },
    save() {
      const method = this.project.id ? "put" : "post";
      const id = this.project.id ? `/${this.project.id}` : "";
      axios[method](`${baseApiUrl}/projects${id}`, this.project)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        })
        .catch(showError);
    },
    remove() {
      const id = this.project.id;
      axios
        .delete(`${baseApiUrl}/projects/${id}`)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        })
        .catch(showError);
    },
    loadProject(project, mode = "save") {
      this.mode = mode;
      this.project = { ...project };
    }
  },
  mounted() {
    this.loadProjects();
  }
};
</script>

<style>
  .list .project-filter {
    display: flex;
    justify-content: center;
    align-items: center;

    margin: 20px;
    margin-top: 0px;
    padding-bottom: 8px;
    border-bottom: 1px solid #AAA;

  }

  .list .project-filter i {
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