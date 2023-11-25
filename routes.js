const express = require('express');
const router = express.Router()

const addQuestionController = require('./controllers/addQuestionController');

const generateQPController = require('./controllers/generateQuestionPaperController');

router.post("/add-question", addQuestionController.addQuestion);

router.post("/generate-question-paper", generateQPController.generateQuestionPaper);

module.exports = router;