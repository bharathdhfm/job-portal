import express from 'express';
import { createJobController, deleteJobController, getAllJobsController, jobStatsController, updateJobController } from '../controllers/jobsController.js';
import userAuth from '../middlewares/authMiddleware.js';

const router = express.Router();


/**
 * @swagger
 * components:
 *   schemas:
 *     Job:
 *       type: object
 *       required:
 *         - company
 *         - position
 *         - workLocation
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the job
 *         company:
 *           type: string
 *           description: Company name
 *         position:
 *           type: string
 *           description: Job position
 *         status:
 *           type: string
 *           description: Job status
 *           enum: [pending, reject, interview]
 *           default: pending
 *         worktype:
 *           type: string
 *           description: Type of work
 *           enum: [full-time, part-time, internship, contract]
 *           default: full-time
 *         workLocation:
 *           type: string
 *           description: Work location
 *           default: AP
 *         createdBy:
 *           type: string
 *           description: User ID who created the job
 *       example:
 *         id: 1234567890
 *         company: ABC Corp
 *         position: Software Engineer
 *         status: pending
 *         worktype: full-time
 *         workLocation: AP
 *         createdBy: 9876543210
 */

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication APIs
 */

/**
 * @swagger
 * /api/v1/job/create-job:
 *   post:
 *     summary: Create a new job
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Job'
 *     responses:
 *       201:
 *         description: Job created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Job'
 *       500:
 *         description: Internal server error
 */
// Handle POST request
router.post('/create-job', userAuth, createJobController);

//get jobs || get
router.get('/get-job', userAuth , getAllJobsController);

// update jobs || Put || patch

router.patch("/update-job/:id",userAuth ,  updateJobController);

//delete jobs || Delete

router.delete("/delete-job/:id",userAuth , deleteJobController)

// jobs stats filter || Get

router.get("/job-stats",userAuth , jobStatsController)


export default router;
