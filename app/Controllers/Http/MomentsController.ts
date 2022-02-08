import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Moment from 'App/Models/Moment'
import { v4 as uuid4 } from 'uuid'

import Application from '@ioc:Adonis/Core/Application'

export default class MomentsController {
  private validateOptions = {
    type: ['image'],
    size: '2mb',
  }

  public async store({ request, response }: HttpContextContract) {
    const body = request.body()

    const image = request.file('image', this.validateOptions)

    if (image) {
      const imageName = `${uuid4()}.${image.extname}`

      await image.move(Application.tmpPath('uploads'), {
        name: imageName,
      })

      body.image = imageName
    }

    const moment = await Moment.create(body)
    response.status(201)

    return {
      message: 'Cadastrado com sucesso',
      data: moment,
    }
  }

  public async index() {
    const moments = await Moment.query().preload('coments')
    // const moments = await Moment.all()
    return {
      body: moments,
    }
  }

  public async show({ params }: HttpContextContract) {
    const moment = await Moment.findOrFail(params.id)
    return {
      body: moment,
    }
  }

  public async destroy({ params }: HttpContextContract) {
    const moment = await Moment.findOrFail(params.id)

    await moment.delete()

    return {
      message: 'Excluido com sucesso',
      data: moment,
    }
  }

  public async update({ params, request }: HttpContextContract) {
    const body = request.body()
    const moment = await Moment.findOrFail(params.id)

    moment.title = body.title
    moment.description = body.description

    // eslint-disable-next-line eqeqeq
    if (moment.image != body.image || !moment.image) {
      const image = request.file('image', this.validateOptions)
      if (image) {
        const imageName = `${uuid4()}.${image.extname}`

        await image.move(Application.tmpPath('uploads'), {
          name: imageName,
        })
        body.image = imageName
      }
    }

    await moment.save()

    return {
      message: 'momento atualizado com sucesso',
      body: moment,
    }
  }
}
