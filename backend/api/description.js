module.exports = app =>{
    const { existsOrError, notExistsOrError} = app.api.validator

    const save = async(req, res) =>{
        const description = {...req.body}
        if(req.params.id) description.id = req.params.id 

        try{
            existsOrError(description.codigo, "Código da Descrição não informada.")
            existsOrError(description.name, "Descrição não informada.")

            const descriptionFromDB = await app.db('descriptions')
                .where({codigo: description}).first()
            if(!description.id){
                notExistsOrError(descriptionFromDB, "Descrição já cadastrada.")
            }
        } catch(msg){
            return res.status(400).send(msg)
        }

        if(description.id){
            app.db('descriptions')
            .update(description)
            .where({id: description.id})
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        } else {
            app.db('descriptions')
            .insert(description)
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        }
    }

    const remove = async(req, res) =>{
        try{
            existsOrError(req.params.id, "Descrição não informada.")

            const actives = await app.db('actives')
                .where({descriptionId: req.params.id})
            notExistsOrError(actives, "Descrição possui Ativos.")

            const rowsDeleted = await app.db('descriptions')
                .where({id: req.params.id})
                .del()
            existsOrError(rowsDeleted, "Descrição não encontrada.")

            res.status(204).send()
        } catch(msg){
            res.status(400).send(msg)
        }
    }

    const get = (req, res) =>{
        app.db('descriptions')
            .select('id', 'codigo', 'name')
            .then(descriptions => res.json(descriptions))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) =>{
        app.db('descriptions')
            .where({id: req.params.id})
            .then(description => res.json(description))
            .catch(err => res.status(500).send(err))
    }

    return {save, remove, get, getById}

}