const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
});

// @desc    Generate AI Recommendations
// @route   POST /api/ai/recommend
// @access  Private
const generateRecommendations = async (req, res) => {
  const { employees, type } = req.body;
  // type can be 'promotion', 'ranking', 'training', 'feedback'

  if (!employees || employees.length === 0) {
    return res.status(400).json({ message: 'No employees provided' });
  }

  let prompt = '';
  if (type === 'promotion') {
    prompt = `Analyze the following employee(s) and provide a Promotion Recommendation based on high performance score (> 80). State clearly if they deserve a promotion and why.\n${JSON.stringify(employees, null, 2)}`;
  } else if (type === 'ranking') {
    prompt = `Rank the following employees based on their performance score and experience. Provide a ranked list from best to worst with a brief justification.\n${JSON.stringify(employees, null, 2)}`;
  } else if (type === 'training') {
    prompt = `Analyze the skills and performance of the following employee(s) and provide Training Suggestions based on missing or weak skills (e.g., lower performance score). Suggest 1-2 specific courses or areas to focus on.\n${JSON.stringify(employees, null, 2)}`;
  } else if (type === 'feedback') {
    prompt = `Generate a narrative AI Feedback for the following employee(s). If their score is high, praise them. If their score is low (< 70), provide constructive improvement feedback.\n${JSON.stringify(employees, null, 2)}`;
  } else {
    return res.status(400).json({ message: 'Invalid recommendation type. Must be promotion, ranking, training, or feedback.' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.AI_MODEL || 'openai/gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are an expert HR AI assistant specializing in employee performance analytics and recommendations. Be concise and professional.' },
        { role: 'user', content: prompt }
      ]
    });

    const aiOutput = completion.choices[0].message.content;
    res.status(200).json({ recommendation: aiOutput });
  } catch (error) {
    console.error('AI API Error:', error);
    res.status(500).json({ message: 'Failed to generate AI recommendations.' });
  }
};

module.exports = {
  generateRecommendations
};
