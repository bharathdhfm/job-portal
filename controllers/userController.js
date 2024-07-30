import User from "../models/usermodels.js";

export const updateUserController = async (req, res, next) => {
    const { name, email, lastName, location } = req.body;

    if (!name || !email || !lastName || !location) {
        console.log('Validation error: missing fields'); // Debug log
        return next(new Error('Please provide all fields'));
    }

    try {
        console.log('User ID from token:', req.user.userId); // Debug log

        const user = await User.findOne({ _id: req.user.userId });

        if (!user) {
            console.log('User not found with ID:', req.user.userId); // Debug log
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('User found:', user); // Debug log

        user.name = name;
        user.lastName = lastName;
        user.email = email;
        user.location = location;

        await user.save();

        const token = user.createJWT();
        res.status(200).json({
            user,
            token,
        });

    } catch (error) {
        console.log('Error updating user:', error); // Debug log
        next(error);
    }
};

//get user data

export const getUserController  =  async (req,res,next) =>  {
    try {
        const user = await userModel.findById({_id:req.body.user.userId})
        user.password = undefined;
         if (!user) {
            return res.status(200).send({
                message: 'User not found',
                success: false
            });
    }
    else {
        res.status(200).send({
            message: 'User fetched successfully',
            success: true,
            data: user
        });
    }
 } catch (error) {
        console.log(error);
        res.status(500).send({
            message: 'auth error',
            success: false,
            error: error.message
        });
    }
};