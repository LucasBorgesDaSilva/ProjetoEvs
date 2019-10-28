<template>
    <aside class="menu" v-show="isMenuVisible">
        <router-link to="/" class="router-link"> Ativos </router-link>
        <router-link to="/descriptions" class="router-link"> Descrição Padrão </router-link>
        <router-link to="/clients" class="router-link"> Cliente </router-link>
        <router-link to="/branchs" class="router-link"> Filial </router-link>
        <router-link to="/costCenters" class="router-link"> Centro de Custos </router-link>
        <router-link to="/locals" class="router-link"> Local </router-link>
        <router-link to="/responsibles" class="router-link"> Responsável </router-link>
        <router-link to="/projects" class="router-link"> Projetos </router-link>
        <router-link to="/unitBusiness" class="router-link"> Unidade de Negócio </router-link>
        <router-link to="/groupings" class="router-link"> Agrupamento</router-link>
        <router-link to="/useConditions" class="router-link"> Condição de Uso </router-link>
    </aside>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: "Menu",
    computed: mapState(['isMenuVisible', 'user'])
}
</script>

<style>
    .menu{
        grid-area: menu;
        background: linear-gradient(to right, #062F4F, #252161);

        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        position: fixed;
        width: 230px;
        height: 100%;
        margin-top: 50px;
    }

    aside.menu .router-link{
        text-decoration: none;
        color: #FFF;
        padding: 13px;
    }

    aside.menu .router-link:hover{
        background: linear-gradient(to right, #1E469A, #49A7C1);
    }
</style>