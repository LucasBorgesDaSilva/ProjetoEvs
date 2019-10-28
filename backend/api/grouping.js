module.exports = app =>{
    const {existsOrError, notExistsOrError} = app.api.validator

    const save = async (req, res) =>{
        const grouping = {...req.body}
        if(req.params.id) grouping.id = req.params.id
        
        try{
            existsOrError(grouping.codigo, 'Código de Agrupamento não informado.')
            existsOrError(grouping.name, 'Nome do Agrupamento não informado.')

            const groupingFromDB = await app.db('groupings')
                .where({codigo: grouping.codigo}).first()
            if(!grouping.id){
                notExistsOrError(groupingFromDB, "Agrupamento já cadastrado.")
            }
        } catch(msg){
            return res.status(400).send(msg)
        }

        if(grouping.id){
            app.db('groupings')
            .update(grouping)
            .where({id: grouping.id})
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        } else {
            app.db('groupings')
            .insert(grouping)
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        }
    }

    const remove = async (req, res) =>{
        try{
            existsOrError(req.params.id, "Agrupamento não informado.")

            const rowsDeleted = await app.db('groupings')//Acesoo a tabela
                .where({id: req.params.id})//Verifica se os Id's batem
                .del()//exclui o registro
            existsOrError(rowsDeleted, "Agrupamento não encontrado.")
            
            res.status(204).send()    
        } catch(msg){
            res.status(400).send(msg)
        }
    }

    const get = (req, res) => {
        app.db('groupings')
            .select('id', 'codigo', 'name')
            .then(groupings => res.json(groupings))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('groupings')
          .where({id: req.params.id})
          .then(grouping => res.json(grouping))
          .catch(err => res.status(500).send(err))
    }

    return {save, remove, get, getById}
}