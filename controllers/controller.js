const Questions = require('../models/questionModel');

const controller = {};

controller.addQuestion = async (req, res) => {
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

controller.generateQuestionPaper = async (req, res) => {
    try {
        const paperData = req.body;
        const arrayOfQuestions = calculateQuestionsByDifficulty(paperData);

        const myQuestionPaper = await fetchQuestionsFromDatabase(arrayOfQuestions);

        res.status(201).json({
            message: "Here is your Question paper:",
            status: true,
            myQuestionPaper
        });
    } catch (error) {
        handleError(res, error);
    }
}

function calculateQuestionsByDifficulty(paperData) {
    const { hard, medium, totalMarks } = paperData;
    const varietyOfEasyMarks = [2, 1];
    const varietyOfMediumMarks = [4, 3, 2, 1];
    const varietyOfHardMarks = [10, 5, 4, 3, 2, 1];

    let arrayOfQuestions = [];
    let numberOfHardQuestion = { "10_Marks": 0, "5_Marks": 0, "4_Marks": 0, "3_Marks": 0, "2_Marks": 0, "1_Marks": 0 };
    let numberOfMediumQuestion = { "4_Marks": 0, "3_Marks": 0, "2_Marks": 0, "1_Marks": 0 };
    let numberOfEasyQuestion = { "2_Marks": 0, "1_Marks": 0 };

    let remainMarks = totalMarks;
    let hardQuestionMarks = calculateQuestionMarks(hard, totalMarks, varietyOfHardMarks, numberOfHardQuestion);
    remainMarks -= hardQuestionMarks;

    let mediumQuestionMarks = calculateQuestionMarks(medium, totalMarks, varietyOfMediumMarks, numberOfMediumQuestion);
    remainMarks -= mediumQuestionMarks;

    let easyQuestionMarks = remainMarks;

    calculateNumberOfQuestion("Easy", easyQuestionMarks, varietyOfEasyMarks, numberOfEasyQuestion, arrayOfQuestions);
    calculateNumberOfQuestion("Medium", mediumQuestionMarks, varietyOfMediumMarks, numberOfMediumQuestion, arrayOfQuestions);
    calculateNumberOfQuestion("Hard", hardQuestionMarks, varietyOfHardMarks, numberOfHardQuestion, arrayOfQuestions);

    return arrayOfQuestions;
}

function calculateQuestionMarks(percentage, totalMarks, varietyOfMarks, numberOfQuestions) {
    let questionMarks = Math.floor((percentage * totalMarks) / 100);

    varietyOfMarks.forEach((mark, index) => {
        const markKey = mark + '_Marks';
        numberOfQuestions[markKey] = Math.floor(questionMarks / mark);
        questionMarks -= varietyOfMarks[index] * numberOfQuestions[markKey];
    });

    return questionMarks;
}

function calculateNumberOfQuestion(difficulty, marksByDifficulty, varietyOfQuestionMarks, numberOfQuestions, arrayOfQuestions) {
    let questionMarksByVariety = marksByDifficulty / varietyOfQuestionMarks.length;

    varietyOfQuestionMarks.forEach(mark => {
        const markKey = mark + '_Marks';
        numberOfQuestions[markKey] = Math.floor(marksByDifficulty / mark);
        marksByDifficulty -= mark * numberOfQuestions[markKey];

        if (numberOfQuestions[markKey] !== 0) {
            arrayOfQuestions.push({ difficulty, questionMark: mark, numberOfQuestion: numberOfQuestions[markKey] });
        }
    });
}

async function fetchQuestionsFromDatabase(arrayOfQuestions) {
    let myQuestionPaper = [];

    for (const question of arrayOfQuestions) {
        const aggregatePipeline = [
            { $match: { difficulty: question.difficulty, marks: question.questionMark } },
            { $sample: { size: question.numberOfQuestion } }
        ];

        const questions = await Questions.aggregate(aggregatePipeline);

        if (questions.length !== question.numberOfQuestion) {
            throw new Error("You don't have enough questions in the database according to your requirement.");
        }

        myQuestionPaper.push(questions);
    }

    return myQuestionPaper;
}

function handleError(res, error) {
    res.status(500).json({
        errors: { message: error.toString() },
        status: false
    });
}

module.exports = controller;
