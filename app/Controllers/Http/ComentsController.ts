//import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Coment from 'App/Models/Coment'
import Moment from 'App/Models/Moment'

export default class ComentsController {
  public async store({ request, params, response }) {
    const body = request.body()
    const momentId = params.momentId
    await Moment.findOrFail(momentId)

    body.momentId = momentId
    const coment = await Coment.create(body)
    response.status(201)
    return {
      message: 'Comentario adicionado com sucesso',
      data: coment,
    }
  }

  public async index({ request, params, response }) {
    const momentId = params.momentId
    const comments = await Coment.query().preload(momentId)
    return {
      body: comments,
    }
  }
}
