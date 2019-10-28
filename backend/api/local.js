module.exports = app =>{
    const { existsOrError, notExistsOrError} = app.api.validator

    const save = async(req, res) =>{
        const local = {...req.body}
        if(req.params.id) local.id = req.params.id 

        try{
            existsOrError(local.codigo, "Código do Local não informado.")
            existsOrError(local.name, "Local não informado.")

            const localFromDB = await app.db('locals')
                .where({codigo: local.codigo}).first()
            if(!local.id){
                notExistsOrError(localFromDB, "Local já cadastrado.")
            }
        } catch(msg){
            return res.status(400).send(msg)
        }

        if(local.id){
            app.db('locals')
            .update(local)
            .where({id: local.id})
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        } else {
            app.db('locals')
            .insert(local)
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        }
    }

    const remove = async(req, res) =>{
        try{
            existsOrError(req.params.id, "Local não informado.")

            const actives = await app.db('actives')
                .where({localId: req.params.id})
            notExistsOrError(actives, "Local possui Ativos.")

            const rowsDeleted = await app.db('locals')
                .where({id: req.params.id})
                .del()
            existsOrError(rowsDeleted, "Local não encontrado.")

            res.status(204).send()
        } catch(msg){
            res.status(400).send(msg)
        }
    }

    const get = (req, res) =>{
        app.db('locals')
            .select('id', 'codigo', 'name')
            .then(locals => res.json(locals))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) =>{
        app.db('locals')
            .where({id: req.params.id})
            .then(local => res.json(local))
            .catch(err => res.status(500).send(err))
    }

    return {save, remove, get, getById}

}