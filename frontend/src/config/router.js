import Vue from 'vue'
import VueRouter from 'vue-router'

import Ativo from '@/components/home/Ativo'
import AdminPages from '@/components/admin/AdminPages'
import Agrupamento from '@/components/home/Agrupamento'
import CentroDeCusto from '@/components/home/CentroDeCusto'
import CondicaoDeUso from '@/components/home/CondicaoDeUso'
import Descricao from '@/components/home/Descricao'
import Filial from '@/components/home/Filial'
import Local from '@/components/home/Local'
import Projeto from '@/components/home/Projeto'
import Responsavel from '@/components/home/Responsavel'
import UnidadeDeNegocio from '@/components/home/UnidadeDeNegocio'
import Cliente from '@/components/home/Cliente'
import Auth from '@/components/auth/Auth'

import { userKey } from '@/global'


Vue.use(VueRouter)

const routes = [{
    name: 'ativo',
    path: '/',
    component: Ativo    
}, {
    name: 'adminPages',
    path: '/admin',
    component: AdminPages,
    meta: { requiresAdmin: true}
}, {
    name: 'agrupamento',
    path: '/groupings',
    component: Agrupamento    
}, {
    name: 'condicoesDeUso',
    path: '/useConditions',
    component: CondicaoDeUso    
}, {
    name: 'centroDeCusto',
    path: '/costCenters',
    component: CentroDeCusto   
}, {
    name: 'codicaoDeUso',
    path: '/useConditions',
    component: CondicaoDeUso    
}, {
    name: 'descricao',
    path: '/descriptions',
    component: Descricao    
}, {
    name: 'filial',
    path: '/branchs',
    component: Filial    
}, {
    name: 'local',
    path: '/locals',
    component: Local    
}, {
    name: 'projeto',
    path: '/projects',
    component: Projeto    
}, {
    name: 'responsavel',
    path: '/responsibles',
    component: Responsavel    
}, {
    name: 'UnidadeDeNegocio',
    path: '/unitBusiness',
    component: UnidadeDeNegocio
}, {
    name: 'Cliente',
    path: '/clients',
    component: Cliente
}, {
    name: 'auth',
    path: '/auth',
    component: Auth
}]

const router = new VueRouter({
    mode: 'history', 
    routes
})

router.beforeEach((to, from, next) => {
    const json = localStorage.getItem(userKey)

    if(to.matched.some(record => record.meta.requiresAdmin)){
        const user = JSON.parse(json)
        user && user.admin ? next() : next({ path: '/' })
    }else {
        next()
    }
})

export default router