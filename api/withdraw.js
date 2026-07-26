export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { username, userId, gems, usdt, wallet } = req.body;
    const BOT_TOKEN = process.env.BOT_TOKEN; 
    const CHANNEL_ID = process.env.CHANNEL_ID;

    if (!BOT_TOKEN || !CHANNEL_ID) {
        return res.status(500).json({ error: 'Server configuration missing' });
    }

    const message = `🔔 **New Withdrawal Request!**\n\n` +
                    `👤 **User:** ${username} (\`${userId}\`)\n` +
                    `💰 **Amount:** ${usdt} USDT (${parseInt(gems).toLocaleString()} Coins)\n` +
                    `💳 **Wallet:** \`${wallet}\`\n` +
                    `⏳ **Status:** Pending Approval`;

    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHANNEL_ID,
                text: message,
                parse_mode: 'Markdown'
            })
        });

        const data = await response.json();
        if (!data.ok) throw new Error(data.description);

        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
              }
