import exprees from 'express'
import { testPostController } from '../controllers/testControllers.js'
import userAuth from '../middlewares/authMiddleware.js'
//Routers objects
const router = exprees.Router()

//routes
router.post('/test-post', userAuth, testPostController )

export default router