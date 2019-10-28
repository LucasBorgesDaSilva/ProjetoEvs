module.exports = app =>{
    const { existsOrError, notExistsOrError} = app.api.validator

    const save = async(req, res) =>{
        const costCenter = {...req.body}
        if(req.params.id) costCenter.id = req.params.id 

        try{
            existsOrError(costCenter.codigo, "Código do Centro de Custo não informado.")
            existsOrError(costCenter.name, "Nome do Centro de Custo não informado.")

            const costCenterFromDB = await app.db('costCenters')
                .where({codigo: costCenter.codigo}).first()
            if(!costCenter.id){
                notExistsOrError(costCenterFromDB, "Centro de Custo já cadastrado.")
            }
        } catch(msg){
            return res.status(400).send(msg)
        }

        if(costCenter.id){
            app.db('costCenters')
            .update(costCenter)
            .where({id: costCenter.id})
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        } else {
            app.db('costCenters')
            .insert(costCenter)
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        }
    }

    const remove = async(req, res) =>{
        try{
            existsOrError(req.params.id, "Nome do centro de Custo não informado.")

            const actives = await app.db('actives')
                .where({costCenterId: req.params.id})
            notExistsOrError(actives, "Centro de Custo possui Ativos.")

            const rowsDeleted = await app.db('costCenters')
                .where({id: req.params.id})
                .del()
            existsOrError(rowsDeleted, "Centro de Custo não encontrado.")

            res.status(204).send()
        } catch(msg){
            res.status(400).send(msg)
        }
    }

    const get = (req, res) =>{
        app.db('costCenters')
            .select('id', 'codigo', 'name')
            .then(costCenters => res.json(costCenters))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) =>{
        app.db('costCenters')
            .where({id: req.params.id})
            .then(costCenter => res.json(costCenter))
            .catch(err => res.status(500).send(err))
    }

    return {save, remove, get, getById}

}