const getResponseFromAI = require('./openAI');

const chat = async (req, res) => {
    try {
        const request = req.body;
        const response = await getResponseFromAI(request.message); 
        res.json({response : response});
    } catch (error) {
        res.json({response: "Sorry, I am not able to respond at the moment. Please try again later."})
    }
}

module.exports = chat;