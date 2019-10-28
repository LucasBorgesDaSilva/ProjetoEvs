module.exports = app =>{
    const { existsOrError, notExistsOrError} = app.api.validator

    const save = async(req, res) =>{
        const project = {...req.body}
        if(req.params.id) project.id = req.params.id 

        try{
            existsOrError(project.codigo, "Código do Projeto não informado.")
            existsOrError(project.name, "Nome do Projeto não informado.")

            const projectFromDB = await app.db('projects')
                .where({codigo: project.codigo}).first()
            if(!project.id){
                notExistsOrError(projectFromDB, "Projeto já cadastrado.")
            }
        } catch(msg){
            return res.status(400).send(msg)
        }

        if(project.id){
            app.db('projects')
            .update(project)
            .where({id: project.id})
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        } else {
            app.db('projects')
            .insert(project)
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        }
    }

    const remove = async(req, res) =>{
        try{
            existsOrError(req.params.id, "Projeto não informado.")

            const actives = await app.db('actives')
                .where({projectId: req.params.id})
            notExistsOrError(actives, "Projeto possui Ativos.")

            const rowsDeleted = await app.db('projects')
                .where({id: req.params.id})
                .del()
            existsOrError(rowsDeleted, "Projeto não encontrado.")

            res.status(204).send()
        } catch(msg){
            res.status(400).send(msg)
        }
    }

    const get = (req, res) =>{
        app.db('projects')
            .select('id', 'codigo', 'name')
            .then(projects => res.json(projects))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) =>{
        app.db('projects')
            .where({id: req.params.id})
            .then(project => res.json(project))
            .catch(err => res.status(500).send(err))
    }

    return {save, remove, get, getById}

}