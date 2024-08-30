import axios from 'axios'
export async function sendSlackMessage(channel: string, blocks) {
    const url = 'https://slack.com/api/chat.postMessage';
    try {
        return await axios.post(url, {
            channel: channel,
            blocks: blocks
        }, { headers: { authorization: `Bearer ${process.env.SLACK_BOT_USER_OAUTH_TOKEN}` } });
    } catch (error) {
        console.error(error);
    }
}
