const errorResponse = (res, statusCode, message) => {
    return res.status(statusCode).json({ message, success: false })
}

const successResponse = (res, message, data = {}) => {
    return res.status(200).json({ message, success: true, data: data || {} });
};

module.exports = { errorResponse, successResponse }
