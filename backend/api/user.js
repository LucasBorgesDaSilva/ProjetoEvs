//Importando o Bcrypt do nodeJs
const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
    //Importando e Desestruturando as functions da api Validator
    const  { existsOrError, notExistsOrError, equalsOrError } = app.api.validator

    //Criando a criptografia de Senha
    const encryptPassword = password => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }

    //Função de Inserir e Alterar
    const save = async (req, res) => {
        const user = {...req.body}
        if (req.params.id) user.id = req.params.id

        if(!req.originalUrl.startsWith('/users')) user.admin = false
        if(!req.user || !req.user.admin) user.admin = false

        try {
            existsOrError(user.name, 'Nome não informado.')
            existsOrError(user.email, 'Email não informado.')
            existsOrError(user.password, 'Senha não informada.')
            existsOrError(user.confirmPassword, 'Confirmação de Senha inválida.')
            equalsOrError(user.password, user.confirmPassword,
                'Senhas não conferem')

            const userFromDB = await app.db('users')
                .where({ email: user.email }).first()
            if (!user.id) {
                notExistsOrError(userFromDB, "Usuário já Cadastrado.")
            }
        } catch (msg) {
            return res.status(400).send(msg)
        }


        user.password = encryptPassword(user.password)
        delete user.confirmPassword

        if(user.id) {
            app.db('users')
                .update(user)
                .where({ id: user.id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('users')
                .insert(user)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    //Criando a Função buscar os usuários
    const get = (req, res) =>{
        app.db('users')
        .select('id', 'name', 'email', 'admin')
        .then(users => res.json(users))
        .catch(err => res.status(500).send(err))
    }

    //Funcção para buscar os usuários pelo id
    const getById = (req, res) =>{
        app.db('users')
        .select('id', 'name', 'email', 'admin')
        .where({id: req.params.id})
        .first()
        .then(users => res.json(users))
        .catch(err => res.status(500).send(err))
    }

    const remove = async (req, res) =>{
        try{
            existsOrError(req.params.id, "Usuário não informado.")

            const rowsDeleted = await app.db('users')//Aceso a tabela
                .where({id: req.params.id})//Verifica se os Id's batem
                .del()//exclui a filial
            existsOrError(rowsDeleted, "Filial não encontrada.")
            
            res.status(204).send()    
        } catch(msg){
            res.status(400).send(msg)
        }
    }

    return { save, get, getById, remove }

}


