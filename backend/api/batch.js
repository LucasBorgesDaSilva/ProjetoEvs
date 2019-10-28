module.exports = app =>{
    const {existsOrError, notExistsOrError} = app.api.validator

    const save = async (req, res) =>{
        const batch = {...req.body}
        if(req.params.id) batch.id = req.params.id
        
        try{
            existsOrError(batch.codigo, 'Código da Filial não informado.')
            existsOrError(batch.name, 'Nome da Filial não informado.')
            
            const batchFromDB = await app.db('batchs')
                .where({codigo: batch.codigo}).first()
            if(!batch.id){
                notExistsOrError(batchFromDB, "Filial já cadastrada.")
            }
        } catch(msg){
            return res.status(400).send(msg)
        }

        if(batch.id){
            app.db('batchs')
            .update(batch)
            .where({id: batch.id})
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        } else {
            app.db('batchs')
            .insert(batch)
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        }
    }

    const remove = async (req, res) =>{
        try{
            existsOrError(req.params.id, "Nome de filial não informado.")

            const actives = await app.db('actives')//Aceso a tabela de Ativos
                .where({batchId: req.params.id}) // Verifico se os Id's batem
            notExistsOrError(actives, 'Filial possui Ativos.')

            const rowsDeleted = await app.db('batchs')//Aceso a tabela de Filiais
                .where({id: req.params.id})//Verifica se os Id's batem
                .del()//exclui a filial
            existsOrError(rowsDeleted, "Filial não encontrada.")
            
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
        app.db('batchs')
            .select('id', 'codigo', 'name')
            .then(batchs => res.json(batchs))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('batchs')
          .where({id: req.params.id})
          .then(batch => res.json(batch))
          .catch(err => res.status(500).send(err))
    }

    return {save, remove, get, getById}
}