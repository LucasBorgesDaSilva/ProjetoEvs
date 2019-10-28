module.exports = app =>{
    const { existsOrError, notExistsOrError} = app.api.validator

    const save = async (req, res) =>{
        const active = {...req.body}
        if (req.params.id) active.id = req.params.id
        
        try{
            existsOrError(active.placa, 'Placa não informada.')
            existsOrError(active.anexo, 'Anexo não informado.')
            existsOrError(active.costCenterId, 'Centro de Custo não informado.')
            existsOrError(active.localId, 'Local não informado.')
            existsOrError(active.descriptionId, 'Descrição não informada.')
            existsOrError(active.useConditionId, 'Condição de Uso não informada.')

            
            const activeFromDB = await app.db('actives')
                .where({placa: active.placa, anexo: active.anexo}).first()
            if(!active.id){
                notExistsOrError(activeFromDB, "Ativo já cadastrado.")
            }
        } catch(msg){
            return res.status(400).send(msg)
        }

        if(active.id){
            app.db('actives')
            .update(active)
            .where({id: active.id})
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        } else {
            app.db('actives')
            .insert(active)
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        }
    }

    const remove = async (req, res) =>{
        try{
            const rowsDeleted = await app.db('actives')
                .where({ id: req.params.id }).del()
            
            try{
                existsOrError(rowsDeleted, "Ativo não encontrado.")
            } catch(msg){
                return res.status(400).send(msg)
            }
            
            res.status(204).send()    
        } catch(msg){
            res.status(400).send(msg)
        }
    }
    
    const limit = 30000 // Paginação
    const get = async (req, res) => {
        const page = req.query.page || 1 // Fazendo a requisição da página, caso não retorne nada ela vai para página 1

        const result = await app.db('actives').count('id').first() //Chamei o banco de Dados dos ativos, e mandei contar do primeiro Id
        const count = parseInt(result.count) // tranformei o result em inteiro pois era string, com o parseInt

        app.db('actives')//Chamei o Banco
            .select('id', 'placa', 'anexo', 'description')//Selecionei os campos que quero exibir.
            .limit(limit).offset(page * limit - limit)//ele faz uma contagem, de como cada página inicia.
            .then(actives => res.json({data: actives, count, limit}))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('actives')
          .where({id: req.params.id}).first()
          .then(active => res.json(active))
          .catch(err => res.status(500).send(err))
    }

    return {save, remove, get, getById}
}