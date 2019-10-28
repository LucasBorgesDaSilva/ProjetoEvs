const admin = require('./admin')

module.exports = app =>{
    app.post('/signup', app.api.user.save)
    app.post('/signin', app.api.auth.signin)
    app.post('/validateToken', app.api.auth.validateToken)

    //Rotas de Usuários
    app.route('/users')
      .all(app.config.passport.authenticate())
      .get(admin(app.api.user.get))
      .post(admin(app.api.user.save))//Inserindo
      
    app.route('/users/:id')
      .all(app.config.passport.authenticate())
      .put(admin(app.api.user.save))//Atualizando 
      .get(admin(app.api.user.getById))
      .delete(admin(app.api.user.remove))

    //Rotas de Filiais
    app.route('/batchs')
      .all(app.config.passport.authenticate())    
      .get(app.api.batch.get)
      .post(admin(app.api.batch.save))//Inserindo

    app.route('/batchs/:id')
      .all(app.config.passport.authenticate())    
      .get(app.api.batch.getById)
      .put(admin(app.api.batch.save))//Atualizando
      .delete(admin(app.api.batch.remove))

    //Rotas de Centro de Custo
    app.route('/costCenters')
      .all(app.config.passport.authenticate())    
      .get(app.api.costCenter.get)
      .post(admin(app.api.costCenter.save))//Inserindo
      
    app.route('/costCenters/:id')
      .all(app.config.passport.authenticate())    
      .get(app.api.costCenter.getById)
      .put(admin(app.api.costCenter.save))//Atualizando
      .delete(admin(app.api.costCenter.remove))
      
    //Rotas de Descrição
    app.route('/descriptions')
      .all(app.config.passport.authenticate())    
      .get(app.api.description.get)
      .post(admin(app.api.description.save))//Inserindo
    
    app.route('/descriptions/:id')
      .all(app.config.passport.authenticate())    
      .get(app.api.description.getById)
      .put(admin(app.api.description.save))//Atualizando
      .delete(admin(app.api.description.remove)) 

    //Rotas de Local
    app.route('/locals')
      .all(app.config.passport.authenticate())    
      .get(app.api.local.get)
      .post(admin(app.api.local.save))//Inserindo
    
    app.route('/locals/:id')
      .all(app.config.passport.authenticate())    
      .get(app.api.local.getById)
      .put(admin(app.api.local.save))//Atualizando
      .delete(admin(app.api.local.remove)) 
    
    //Rotas de Responsável
    app.route('/responsibles')
      .all(app.config.passport.authenticate())    
      .get(app.api.responsible.get)
      .post(admin(app.api.responsible.save))//Inserindo
    
    app.route('/responsibles/:id')
      .all(app.config.passport.authenticate())    
      .get(app.api.responsible.getById)
      .put(admin(app.api.responsible.save))//Atualizando
      .delete(admin(app.api.responsible.remove))

    //Rotas de Projetos
    app.route('/projects')
      .all(app.config.passport.authenticate())    
      .get(app.api.project.get)
      .post(admin(app.api.project.save))//Inserindo
    
    app.route('/projects/:id')
      .all(app.config.passport.authenticate())    
      .get(app.api.project.getById)
      .put(admin(app.api.project.save))//Atualizando
      .delete(admin(app.api.project.remove))

    //Rotas de Condição de Uso
    app.route('/useConditions')
      .all(app.config.passport.authenticate())    
      .get(app.api.useCondition.get)
      .post(admin(app.api.useCondition.save))//Inserindo
    
    app.route('/useConditions/:id')
      .all(app.config.passport.authenticate())    
      .get(app.api.useCondition.getById)
      .put(admin(app.api.useCondition.save))//Atualizando
      .delete(admin(app.api.useCondition.remove))

    //Rotas de Unidade de Negócio
    app.route('/unitBusiness')
      .all(app.config.passport.authenticate())    
      .get(app.api.unitBusiness.get)
      .post(admin(app.api.unitBusiness.save))//Inserindo
    
    app.route('/unitBusiness/:id')
      .all(app.config.passport.authenticate())    
      .get(app.api.unitBusiness.getById)
      .put(admin(app.api.unitBusiness.save))//Atualizando
      .delete(admin(app.api.unitBusiness.remove))  
    
    //Rotas de Agrupamento
    app.route('/groupings')
      .all(app.config.passport.authenticate())    
      .get(app.api.grouping.get)
      .post(admin(app.api.grouping.save))//Inserindo
    
    app.route('/groupings/:id')
      .all(app.config.passport.authenticate())    
      .get(app.api.grouping.getById)
      .put(admin(app.api.grouping.save))//Atualizando
      .delete(admin(app.api.grouping.remove))     
    
    //Rotas de Ativos
    app.route('/actives')
      .all(app.config.passport.authenticate())    
      .get(app.api.active.get)
      .post(admin(app.api.active.save))//Inserindo
    
    app.route('/actives/:id')
      .all(app.config.passport.authenticate())    
      .get(app.api.active.getById)
      .put(admin(app.api.active.save))//Atualizando
      .delete(admin(app.api.active.remove)) 
      
    //Rotas de Cliente
    app.route('/clients')
      .all(app.config.passport.authenticate())    
      .get(app.api.client.get)
      .post(admin(app.api.client.save))//Inserindo
    
    app.route('/clients/:id')
      .all(app.config.passport.authenticate())    
      .get(app.api.client.getById)
      .put(admin(app.api.client.save))//Atualizando
      .delete(admin(app.api.client.remove))       
}