module.exports = app =>{
    const {existsOrError, notExistsOrError} = app.api.validator

    const save = async (req, res) =>{
        const useCondition = {...req.body}
        if(req.params.id) useCondition.id = req.params.id
        
        try{
            existsOrError(useCondition.codigo, 'Código da Condição de Uso não informado.')
            existsOrError(useCondition.name, 'Condição de Uso não informada.')
            

            const useConditionFromDB = await app.db('useConditions')
                .where({codigo: useCondition.codigo}).first()
            if(!useCondition.id){
                notExistsOrError(useConditionFromDB, "Condição de Uso já cadastrada.")
            }
        } catch(msg){
            return res.status(400).send(msg)
        }

        if(useCondition.id){
            app.db('useConditions')
            .update(useCondition)
            .where({id: useCondition.id})
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        } else {
            app.db('useConditions')
            .insert(useCondition)
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        }
    }

    const remove = async (req, res) =>{
        try{
            existsOrError(req.params.id, "Nome da Condição de Uso não informado.")

            const actives = await app.db('actives')//Aceso a tabela de Ativos
                .where({useConditionId: req.params.id}) // Verifico se os Id's batem
            notExistsOrError(actives, 'Condição de Uso possui Ativos.')

            const rowsDeleted = await app.db('useConditions')//Acesoo a tabela
                .where({id: req.params.id})//Verifica se os Id's batem
                .del()//exclui o registro
            existsOrError(rowsDeleted, "Condição de Uso não encontrada.")
            
            res.status(204).send()    
        } catch(msg){
            res.status(400).send(msg)
        }
    }
    
    /*const withPath = batchs =>{
        const getParent = (batchs, id) =>{
            const parent = batchs.filter(parent => parent.id === parentId)
            return parent.lenght ? parent[0] : null
        }

        const batchsWithPath = batchs.map(batch => {
            let path = batch.name
            let parent = getParent(batchs, batch.id)

            while(parent){
                path = `${parent.name} > ${path}`
                //parent = getParent(batchs, batch.Id)
            }

            return {...batch, path}
        })

        batchsWithPath.sort((a, b) => {
            if(a.path < b.path) return -1
            if(a.path > b.path) return 1
            return 0
        })

        return batchsWithPath
    }*/

    const get = (req, res) => {
        app.db('useConditions')
            .select('id', 'codigo', 'name')
            .then(useConditions => res.json(useConditions))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('useConditions')
          .where({id: req.params.id})
          .then(useCondition => res.json(useCondition))
          .catch(err => res.status(500).send(err))
    }

    return {save, remove, get, getById}
}