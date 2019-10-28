module.exports = app =>{
    const { existsOrError, notExistsOrError} = app.api.validator

    const save = async(req, res) =>{
        const responsible = {...req.body}
        if(req.params.id) responsible.id = req.params.id 

        try{
            existsOrError(responsible.codigo, "Código do Responsável não informado.")
            existsOrError(responsible.name, "Nome do Responsável não informado.")

            const responsibleFromDB = await app.db('responsibles')
                .where({codigo: responsible.codigo}).first()
            if(!responsible.id){
                notExistsOrError(responsibleFromDB, "Responsável já cadastrado.")
            }
        } catch(msg){
            return res.status(400).send(msg)
        }

        if(responsible.id){
            app.db('responsibles')
            .update(responsible)
            .where({id: responsible.id})
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        } else {
            app.db('responsibles')
            .insert(responsible)
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        }
    }

    const remove = async(req, res) =>{
        try{
            existsOrError(req.params.id, "Responsável não informado.")

            const actives = await app.db('actives')
                .where({responsibleId: req.params.id})
            notExistsOrError(actives, "Responsável possui Ativos.")

            const rowsDeleted = await app.db('responsibles')
                .where({id: req.params.id})
                .del()
            existsOrError(rowsDeleted, "Responsável não encontrado.")

            res.status(204).send()
        } catch(msg){
            res.status(400).send(msg)
        }
    }

    const get = (req, res) =>{
        app.db('responsibles')
            .select('id', 'codigo', 'name')
            .then(responsibles => res.json(responsibles))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) =>{
        app.db('responsibles')
            .where({id: req.params.id})
            .then(responsible => res.json(responsible))
            .catch(err => res.status(500).send(err))
    }

    return {save, remove, get, getById}

}