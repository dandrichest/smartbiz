// server/src/controllers/authController.js
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        console.log('Registration attempt:', { name, email });

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'staff'
        });

        await user.save();

        console.log('User created successfully:', user.email);

        // Generate token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || 'your_secret_key',
            { expiresIn: '30d' }
        );

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    phone: user.phone || '',
                    address: user.address || '',
                    company: user.company || ''
                },
                token
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to register user',
            error: error.message
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log('Login attempt:', email);

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || 'your_secret_key',
            { expiresIn: '30d' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    phone: user.phone || '',
                    address: user.address || '',
                    company: user.company || ''
                },
                token
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to login',
            error: error.message
        });
    }
};

export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone || '',
                address: user.address || '',
                company: user.company || ''
            }
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user',
            error: error.message
        });
    }
};

export const logout = async (req, res) => {
    res.json({
        success: true,
        message: 'Logged out successfully'
    });
};

// ✅ Profile Update - FIXED
export const updateProfile = async (req, res) => {
    try {
        console.log('📝 Updating profile for user:', req.userId);
        console.log('📦 Update data:', req.body);

        const { name, email, phone, address, company, password } = req.body;
        
        // Build update object
        const updateData = {};
        
        // Only add fields that are provided
        if (name !== undefined && name !== '') {
            updateData.name = name.trim();
        }
        if (phone !== undefined) {
            updateData.phone = phone.trim();
        }
        if (address !== undefined) {
            updateData.address = address.trim();
        }
        if (company !== undefined) {
            updateData.company = company.trim();
        }
        
        // Handle email separately - check for duplicates
        if (email) {
            // Get current user to check if email is being changed
            const currentUser = await User.findById(req.userId).select('email');
            if (!currentUser) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }
            
            if (email.toLowerCase() !== currentUser.email.toLowerCase()) {
                // Check if new email is already taken
                const existingUser = await User.findOne({ 
                    email: email.toLowerCase(),
                    _id: { $ne: req.userId }
                });
                if (existingUser) {
                    return res.status(400).json({
                        success: false,
                        message: 'Email already in use'
                    });
                }
                updateData.email = email.toLowerCase();
            }
        }
        
        // Handle password separately if provided
        if (password && password.length > 0) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        // If there's nothing to update
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No fields to update'
            });
        }

        // ✅ Use findByIdAndUpdate - THIS AVOIDS THE PRE-SAVE MIDDLEWARE
        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            { $set: updateData },
            {
                new: true,
                runValidators: true,
                context: 'query'
            }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        console.log('✅ Profile updated successfully for user:', updatedUser._id);

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                phone: updatedUser.phone || '',
                address: updatedUser.address || '',
                company: updatedUser.company || ''
            }
        });
    } catch (error) {
        console.error('❌ Error updating profile:', error);
        
        // Handle duplicate email error
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Email already in use'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Failed to update profile',
            error: error.message
        });
    }
};

// ✅ Security Settings Update
export const updateSecurity = async (req, res) => {
    try {
        console.log('🔒 Updating security settings for user:', req.userId);
        console.log('📦 Security data:', req.body);

        const { twoFactor, sessionTimeout } = req.body;
        
        // Build update object for security settings
        const updateData = {};
        if (twoFactor !== undefined) {
            updateData['security.twoFactor'] = twoFactor;
        }
        if (sessionTimeout !== undefined) {
            updateData['security.sessionTimeout'] = sessionTimeout;
        }

        // If there's nothing to update
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No security fields to update'
            });
        }

        // Update user with security settings
        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            { $set: updateData },
            {
                new: true,
                runValidators: true,
                context: 'query'
            }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        console.log('✅ Security settings updated successfully for user:', updatedUser._id);

        res.json({
            success: true,
            message: 'Security settings updated successfully',
            data: {
                twoFactor: updatedUser.security?.twoFactor || false,
                sessionTimeout: updatedUser.security?.sessionTimeout || '30'
            }
        });
    } catch (error) {
        console.error('❌ Error updating security settings:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update security settings',
            error: error.message
        });
    }
};

// ✅ Appearance Settings Update
export const updateAppearance = async (req, res) => {
    try {
        console.log('🎨 Updating appearance settings for user:', req.userId);
        console.log('📦 Appearance data:', req.body);

        const { theme, fontSize, sidebarCollapsed } = req.body;
        
        // Build update object for appearance settings
        const updateData = {};
        if (theme !== undefined) {
            updateData['appearance.theme'] = theme;
        }
        if (fontSize !== undefined) {
            updateData['appearance.fontSize'] = fontSize;
        }
        if (sidebarCollapsed !== undefined) {
            updateData['appearance.sidebarCollapsed'] = sidebarCollapsed;
        }

        // If there's nothing to update
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No appearance fields to update'
            });
        }

        // Update user with appearance settings
        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            { $set: updateData },
            {
                new: true,
                runValidators: true,
                context: 'query'
            }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        console.log('✅ Appearance settings updated successfully for user:', updatedUser._id);

        res.json({
            success: true,
            message: 'Appearance settings updated successfully',
            data: {
                theme: updatedUser.appearance?.theme || 'dark',
                fontSize: updatedUser.appearance?.fontSize || 'medium',
                sidebarCollapsed: updatedUser.appearance?.sidebarCollapsed || false
            }
        });
    } catch (error) {
        console.error('❌ Error updating appearance settings:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update appearance settings',
            error: error.message
        });
    }
};