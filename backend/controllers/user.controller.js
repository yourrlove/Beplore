const UserService = require('../services/user.service');
const { CREATED, OK } = require('../core/success.response');

class UserController {
    signUp = async (req, res, next) => {
        const { token, user } = await UserService.create(req.body);
        res.cookie("jwt", token, {
            httpOnly: true, // more secure
            maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
            sameSite: "strict", // CSRF
        }); 
        new CREATED({
            message: 'User created successfully',
            metadata: user
        }).send(res);
    }

    logIn = async (req, res, next) => {
        const { token, user } =  await UserService.login(req.body);
        res.cookie("jwt", token, {
            httpOnly: true, // more secure
            maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
            sameSite: "strict", // CSRF
        });    
        new OK({
            message: 'User logged in successfully',
            metadata: user
        }).send(res);
    }

    logOut = async (req, res, next) => {
        res.clearCookie("jwt");
        new OK({
            message: 'User logged out successfully'
        }).send(res);
    }

    getMe = async (req, res, next) => {
        new OK({
            message: 'User information retrieved successfully',
            metadata: await UserService.getUserInfor(req.user._id)
        }).send(res);
    }

    getUserDetails = async (req, res, next) => {
        new OK({
            message: 'User information retrieved successfully',
            metadata: await UserService.getByUsername(req.params.username)
        }).send(res);
    }

    updateUserProfile = async (req, res, next) => {
        new OK({
            message: 'User information updated successfully',
            metadata: await UserService.updateProfile(req.params.userId, {...req.body, file: req.file})
        }).send(res);
    }

    updateUserFollow = async (req, res, next) => {
        new OK({
            message: 'User information updated successfully',
            metadata: await UserService.updateFollow(req.user._id, req.params.targetUserId)
        }).send(res);
    }

    updateUserAvatar = async (req, res, next) => {
        new OK({
            message: 'User Avatar updated successfully',
            metadata: await UserService.updateAvatar(req.params.userId, req.file)
        }).send(res);
    }

    getAllUsers = async (req, res, next) => {
        new OK({
            message: 'Users retrieved successfully',
            metadata: await UserService.getAllUsers(req.query)
        }).send(res);
    }
}

module.exports = new UserController();