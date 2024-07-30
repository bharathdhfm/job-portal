import User from "../models/usermodels.js";

// Register Controller
export const registerController = async (req, res, next) => {
    const { name, email, password ,lastName} = req.body;

    // Validate input
    if (!name) return next(new Error("Name is required"));
    if (!email) return next(new Error("Email is required"));
    if (!password || password.length <= 6) return next(new Error("Password should be greater than 6 characters"));

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return next(new Error("Email already exists. Please login"));

        // Create new user
        const user = await User.create({ name, email, password , lastName});
        const token = user.createJWT();

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: {
                name: user.name,
                lastName: user.lastName,
                email: user.email,
                location: user.location,
            },
            token
        });
    } catch (error) {
        if (error.code === 11000) {
            next(new Error('Email already exists. Please login.'));
        } else {
            next(error);
        }
    }
};

// Login Controller
export const loginController = async (req, res, next) => {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) return next(new Error('Please provide all fields'));

    try {
        // Find user by email
        const user = await User.findOne({ email }).select("+password");
        if (!user) return next(new Error('Invalid username or password'));

        // Compare password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) return next(new Error('Invalid password or username'));

        user.password = undefined; // Hide the password field
        const token = user.createJWT();

        res.status(200).json({
            success: true,
            message: 'Login successful',
            user,
            token,
        });
    } catch (error) {
        next(error); // Pass any errors to the error handling middleware
    }
};
