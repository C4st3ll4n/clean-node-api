import swaggerConfig from '../docs'
import { Express } from "express"
import { serve, setup } from "swagger-ui-express"
import { noCache } from '../middlewares/no-cache'

export default (app: Express):void => {
    app.use('/api-docs', serve, setup(swaggerConfig))
    app.use(noCache)
}