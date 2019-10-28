module.exports = app =>{
    const { existsOrError, notExistsOrError } = app.api.validator

    const save = async(req, res) =>{
        const client = {...req.body}
        if(req.params.id) client.id = req.params.id 

        try{
            existsOrError(client.codigo, "Código do Cliente não informado.")
            existsOrError(client.name, "Cliente não informado.")

            const clientFromDB = await app.db('clients')
                .where({codigo: client.codigo}).first()
            if(!client.id){
                notExistsOrError(clientFromDB, "Cliente já cadastrado.")
            }
        } catch(msg){
            return res.status(400).send(msg)
        }

        if(client.id){
            app.db('clients')
            .update(client)
            .where({id: client.id})
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        } else {
            app.db('clients')
            .insert(client)
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        }
    }

    const remove = async(req, res) =>{
        try{
            existsOrError(req.params.id, "Cliente não informado.")

            const rowsDeleted = await app.db('clients')
                .where({id: req.params.id})
                .del()
            existsOrError(rowsDeleted, "Cliente não encontrado.")

            res.status(204).send()
        } catch(msg){
            res.status(400).send(msg)
        }
    }

    const get = (req, res) =>{
        app.db('clients')
        .select('id','codigo', 'name')
            .then(clients => res.json(clients))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) =>{
        app.db('clients')
            .where({id: req.params.id})
            .then(client => res.json(client))
            .catch(err => res.status(500).send(err))
    }

    return {save, remove, get, getById}

}