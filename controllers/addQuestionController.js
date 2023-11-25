const Questions = require('../models/questionModel');

const addQuestionController = {};

addQuestionController.addQuestion = async (req, res) => {
    try {
        const question = new Questions(req.body);
        const addedQuestion = await question.save();

        res.status(201).json({
            message: "Question added successfully",
            status: true,
            question: addedQuestion
        });
    } catch (error) {
        handleError(res, error);
    }
}

function handleError(res, error) {
    res.status(500).json({
        errors: { message: error.toString() },
        status: false
    });
}

module.exports = addQuestionController;
