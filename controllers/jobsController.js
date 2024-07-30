import moment from "moment";
import jobsModel from "../models/jobsModel.js";
import mongoose from "mongoose";

// Create job
export const createJobController = async (req, res, next) => {
    const { company, position } = req.body;
    if (!company || !position) {
        return next("Please provide all fields");
    }
    req.body.createdBy = req.user.userId;
    try {
        const job = await jobsModel.create(req.body);
        res.status(201).json({ job });
    } catch (error) {
        next(error);
    }
};

// Get jobs
export const getAllJobsController = async (req, res, next) => {
    const { status, worktype, search, sort } = req.query;

    const queryObject = {
        createdBy: req.user.userId,
    };

    if (status && status !== "all") {
        queryObject.status = status;
    }
    if (worktype && worktype !== "all") {
        queryObject.worktype = worktype;
    }
    if (search) {
        queryObject.position = { $regex: search, $options: 'i' };
    }

    let queryResult = jobsModel.find(queryObject);

    const validSortValues = ['latest', 'oldest', 'a-z', 'z-a'];
    if (validSortValues.includes(sort)) {
        if (sort === 'latest') {
            queryResult = queryResult.sort("-createdAt");
        } else if (sort === 'oldest') {
            queryResult = queryResult.sort("createdAt");
        } else if (sort === 'a-z') {
            queryResult = queryResult.sort("position");
        } else if (sort === 'z-a') {
            queryResult = queryResult.sort("-position");
        }
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    queryResult = queryResult.skip(skip).limit(limit);

    const totalJobs = await jobsModel.countDocuments(queryObject);
    const numOfPage = Math.ceil(totalJobs / limit);

    const jobs = await queryResult;

    res.status(200).json({
        totalJobs,
        jobs,
        numOfPage,
    });
};

// Update job
export const updateJobController = async (req, res, next) => {
    const { id } = req.params;
    const { company, position } = req.body;

    if (!company || !position) {
        return next('Provide all the details');
    }

    try {
        const job = await jobsModel.findOne({ _id: id });

        if (!job) {
            return next(`No job found with this id ${id}`);
        }
        if (req.user.userId !== job.createdBy.toString()) {
            return next('You are not authorized to update this job');
        }

        const updateJob = await jobsModel.findOneAndUpdate({ _id: id }, req.body, {
            new: true,
            runValidators: true,
        });
        res.status(200).json({ updateJob });
    } catch (error) {
        next(error);
    }
};

// Delete job
export const deleteJobController = async (req, res, next) => {
    const { id } = req.params;

    try {
        const job = await jobsModel.findOne({ _id: id });

        if (!job) {
            return next(`No job found with this id ${id}`);
        }
        if (req.user.userId !== job.createdBy.toString()) {
            return next('You are not authorized to delete this job');
        }

        await job.deleteOne();
        res.status(200).json({ message: "Success, job deleted" });
    } catch (error) {
        next(error);
    }
};

// Filter the jobs
export const jobStatsController = async (req, res) => {
    try {
        const stats = await jobsModel.aggregate([
            {
                $match: {
                    createdBy: new mongoose.Types.ObjectId(req.user.userId),
                },
            },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ]);

        const defaultStats = {
            pending: stats.find(stat => stat._id === 'pending')?.count || 0,
            reject: stats.find(stat => stat._id === 'reject')?.count || 0,
            interview: stats.find(stat => stat._id === 'interview')?.count || 0,
        };

        let monthlyApplication = await jobsModel.aggregate([
            {
                $match: {
                    createdBy: new mongoose.Types.ObjectId(req.user.userId)
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                    },
                    count: {
                        $sum: 1,
                    },
                }
            }
        ]);

        monthlyApplication = monthlyApplication.map(item => {
            const { _id: { year, month }, count } = item;
            const date = moment().month(month - 1).year(year).format('MMM YYYY');
            return { date, count };
        }).reverse();

        res.status(200).json({
            totalJob: stats.length,
            defaultStats,
            monthlyApplication,
        });
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
};
