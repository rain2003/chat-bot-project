import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export async function sendMessage(message) {
  try {
    const response = await api.post('/api', { question: message });
    console.log(response);
    if (response.status !== 200) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Check if the response is the default "I'm sorry, I don't understand that."
    const answer = response.data.answer;
    // if (answer === "I'm sorry, I don't understand that.") {
    //   return 
    // }

    return answer;
  } catch (error) {
    console.error('Error sending message:', error);
    return 'An error occurred while processing your request.';
  }
}
