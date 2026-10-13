/**
 * Scoring evaluation utility - ADMIN USE ONLY.
 * Computes official test results and analytics from student answers and verified answer key.
 */

export const PASS_PERCENTAGE = 40; // Configurable pass threshold (40%)

/**
 * Evaluates a single student attempt against the official answer key.
 * 
 * @param {Object} answers - Student answers map { [questionId]: optionIndex }
 * @param {Array} answerKey - Array of { question_id, answer, explanation }
 * @param {Array} questions - Optional questions list for category metadata
 * @returns {Object} Full score summary, percentage, category breakdowns, and question statuses.
 */
export function scoreSubmission(answers = {}, answerKey = [], questions = []) {
  const answerMap = new Map();
  answerKey.forEach(item => {
    answerMap.set(item.question_id, item);
  });

  const questionMetaMap = new Map();
  questions.forEach(q => {
    questionMetaMap.set(q.id, q);
  });

  let correctCount = 0;
  let wrongCount = 0;
  let skippedCount = 0;

  const categoryBreakdown = {};
  const questionResults = [];

  // Iterate over answerKey items
  answerKey.forEach(keyItem => {
    const qId = keyItem.question_id;
    const qMeta = questionMetaMap.get(qId) || {};
    const category = qMeta.category || 'General';

    if (!categoryBreakdown[category]) {
      categoryBreakdown[category] = { total: 0, correct: 0, wrong: 0, skipped: 0, percentage: 0 };
    }
    categoryBreakdown[category].total += 1;

    const userChoice = answers[qId];
    const isSkipped = userChoice === undefined || userChoice === null;
    const isCorrect = !isSkipped && Number(userChoice) === Number(keyItem.answer);
    const isWrong = !isSkipped && !isCorrect;

    if (isCorrect) {
      correctCount += 1;
      categoryBreakdown[category].correct += 1;
    } else if (isWrong) {
      wrongCount += 1;
      categoryBreakdown[category].wrong += 1;
    } else {
      skippedCount += 1;
      categoryBreakdown[category].skipped += 1;
    }

    questionResults.push({
      question_id: qId,
      q: qMeta.q || '',
      category,
      options: qMeta.options || [],
      userAnswer: userChoice,
      correctAnswer: keyItem.answer,
      explanation: keyItem.explanation,
      isCorrect,
      isWrong,
      isSkipped,
    });
  });

  // Calculate category percentages
  Object.keys(categoryBreakdown).forEach(cat => {
    const item = categoryBreakdown[cat];
    item.percentage = item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0;
  });

  const total = answerKey.length || 27;
  const score = correctCount;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const isPassed = percentage >= PASS_PERCENTAGE;

  return {
    score,
    total,
    percentage,
    isPassed,
    correctCount,
    wrongCount,
    skippedCount,
    categoryBreakdown,
    questionResults,
  };
}
