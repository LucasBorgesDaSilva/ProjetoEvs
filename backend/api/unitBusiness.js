module.exports = app =>{
    const {existsOrError, notExistsOrError} = app.api.validator

    const save = async (req, res) =>{
        const unitBusiness = {...req.body}
        if(req.params.id) unitBusiness.id = req.params.id
        
        try{
            existsOrError(unitBusiness.codigo, 'Código da Unidade de Negócio não informado.')
            existsOrError(unitBusiness.name, 'Unidade de Negócio não informada.')
            

            const unitBusinessFromDB = await app.db('unitBusiness')
                .where({codigo: unitBusiness.codigo}).first()
            if(!unitBusiness.id){
                notExistsOrError(unitBusinessFromDB, "Unidade de Negócio já cadastrada.")
            }
        } catch(msg){
            return res.status(400).send(msg)
        }

        if(unitBusiness.id){
            app.db('unitBusiness')
            .update(unitBusiness)
            .where({id: unitBusiness.id})
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        } else {
            app.db('unitBusiness')
            .insert(unitBusiness)
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        }
    }

    const remove = async (req, res) =>{
        try{
            existsOrError(req.params.id, "Nome da Unidade de Negócio não informado.")

            const actives = await app.db('actives')//Aceso a tabela de Ativos
                .where({unitBusId: req.params.id}) // Verifico se os Id's batem
            notExistsOrError(actives, 'Unidade de Negócio possui Ativos.')

            const rowsDeleted = await app.db('unitBusiness')
                .where({id: req.params.id})
                .del()
            existsOrError(rowsDeleted, "Unidade de Negócio não encontrada.")
            
            res.status(204).send()    
        } catch(msg){
            res.status(400).send(msg)
        }
    }
    
    const get = (req, res) => {
        app.db('unitBusiness')
            .select('id', 'codigo', 'name')
            .then(unitBusiness => res.json(unitBusiness))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('unitBusiness')
          .where({id: req.params.id})
          .then(unitBus => res.json(unitBus))
          .catch(err => res.status(500).send(err))
    }

    return {save, remove, get, getById}
}