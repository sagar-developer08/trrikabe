const UserController = require('../models/user');
const bcrypt = require('bcrypt');
// const UserController = require('../models/userModel');

// Import any required modules or dependencies here

// Define your controller functions
const registerUser = (req, res) => {
    const { name, email, password, role, phone } = req.body;
    
    // Encrypt the password
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to register user', error: err });
        }
        
        UserController.findOne({ email })
            .then((user) => {
                if (user) {
                    return res.status(409).json({ message: 'User already exists' });
                }
                
                const newUser = new UserController({ name, email, password: hashedPassword, role, phone });
                
                newUser.save()
                    .then(() => {
                        const userData = {
                            name: newUser.Name,
                            email: newUser.email,
                            role: newUser.role,
                            phone: newUser.phone
                        };
                        res.status(201).json({ message: 'User registered successfully', userData });
                    })
                    .catch((error) => res.status(500).json({ message: 'Failed to register user', error }));
            })
            .catch((error) => res.status(500).json({ message: 'Failed to register user', error }));
    });
};

const loginUser = (req, res) => {
    const { email, password } = req.body;
    
    UserController.findOne({ email })
        .then((user) => {
            if (user) {
                // Compare the provided password with the stored hashed password
                bcrypt.compare(password, user.password, (err, result) => {
                    if (err) {
                        return res.status(500).json({ message: 'Failed to login user', error: err });
                    }
                    
                    if (result) {
                        res.status(200).json({ message: 'User logged in successfully' });
                    } else {
                        res.status(401).json({ message: 'Invalid email or password' });
                    }
                });
            } else {
                res.status(401).json({ message: 'Invalid email or password' });
            }
        })
        .catch((error) => res.status(500).json({ message: 'Failed to login user', error }));
};

const updatePassword = (req, res) => {
    const { email, password, newPassword } = req.body;
    
    UserController.findOne({ email })
        .then((user) => {
            if (user) {
                // Compare the provided password with the stored hashed password
                bcrypt.compare(password, user.password, (err, result) => {
                    if (err) {
                        return res.status(500).json({ message: 'Failed to update password', error: err });
                    }
                    
                    if (result) {
                        // Encrypt the new password
                        bcrypt.hash(newPassword, saltRounds, (err, hashedPassword) => {
                            if (err) {
                                return res.status(500).json({ message: 'Failed to update password', error: err });
                            }
                            
                            UserController.findOneAndUpdate({ email }, { password: hashedPassword })
                                .then(() => res.status(200).json({ message: 'Password updated successfully' }))
                                .catch((error) => res.status(500).json({ message: 'Failed to update password', error }));
                        });
                    } else {
                        res.status(401).json({ message: 'Invalid password' });
                    }
                });
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        })
        .catch((error) => res.status(500).json({ message: 'Failed to update password', error }));
};

const viewDetails = (req, res) => {
    const { email } = req.body;
    
    UserController.findOne({ email })
        .then((user) => {
            if (user) {
                res.status(200).json({ message: 'User details retrieved successfully', user });
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        })
        .catch((error) => res.status(500).json({ message: 'Failed to retrieve user details', error }));
};

module.exports = {
    registerUser,
    loginUser,
    updatePassword,
    viewDetails,
};