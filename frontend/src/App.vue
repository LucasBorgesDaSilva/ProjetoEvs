<template>
	<div id="app" :class="{'hide-menu': !isMenuVisible || !user}">
		<Header title=" EVS Inventário" 
			:hideToggle="!user"
			:hideUserDropDown="!user"/>
		<Menu v-if="user"/>
		<Loading v-if="validatingToken"/>
		<Content v-else />  			
		<Footer />
	</div>
</template>

<script>
import axios from 'axios'
import { baseApiUrl, userKey } from '@/global'
import { mapState } from 'vuex'
import Header from '@/components/template/Header'
import Menu from '@/components/template/Menu'
import Content from '@/components/template/Content'
import Footer from '@/components/template/Footer'
import Loading from '@/components/template/Loading'

export default {
	name: "App",
	components: { Header, Menu, Content, Footer, Loading }, 
	computed: mapState(['isMenuVisible', 'user']),
	data: function(){
		return {
			validatingToken: true
		}
	}, 
	methods: {
		async validateToken() {//Validando o token
			this.validatingToken = true //Setando para Verdadeiro

			const json = localStorage.getItem(userKey)//Pegar o Json que está localizado no localStorage
			const userData = JSON.parse(json)// Caso esteja setado, vou tranformar para userData
			this.$store.commit('setUser', null)//Inicialmente no processo de validação o usuario começa como null

			if(!userData){//Se não tiver usuário
				this.validatingToken = false// Seto o o token de Validação para falso
				this.$router.push({name: 'auth'})// e volto para tela de autenticação, não precisando acessar o backend 
				return// mando retornar
			}

			const res = await axios.post(`${baseApiUrl}/validateToken`, userData)//

			if(res.data){
				this.$store.commit('setUser', userData)

				if(this.$mq === 'xs' || this.$mq === 'sm') {
					this.$store.commit('toggleMenu', false)
				}
			} else {
				localStorage.removeItem(userKey)
				this.$router.push({ name: 'auth' })
			}

			this.validatingToken = false
		}
	},
	created() {
		this.validateToken()
	}
}
</script>

<style>
	*{
		font-family: "Lato", sans-serif;

	}

	body{
		margin: 0;
	}

	#app{
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;

		height: 100vh;
		display: grid;
		grid-template-rows: 50px 1fr 40px;
		grid-template-columns: 230px 1fr;
		grid-template-areas: 
			"header header"
			"menu content"
			"menu footer"
	}

	#app.hide-menu{
		grid-template-areas:	
			"header header"
			"content content"
			"footer footer";
	}
</style>