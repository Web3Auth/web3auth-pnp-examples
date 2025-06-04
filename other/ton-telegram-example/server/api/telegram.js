import { Telegraf } from "telegraf";

export default async function handler(req, res) {
 if (req.method !== 'POST') {
   return res.status(405).json({ error: 'Method not allowed' });
 }

 const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
 
 bot.command('start', async (ctx) => {
   await ctx.reply(
`Welcome to Web3Auth Telegram MiniApp! 🌟  

Experience blockchain wallets reimagined inside Telegram! Our demo showcases integration with the TON blockchain, but that's just the beginning - the same seamless experience can be adapted for any blockchain network.

How does it work? It's brilliantly simple:
- Your Telegram identity securely powers your Web3 wallet creation
- Access your wallet seamlessly across all your Telegram devices
- No repeated setups - your wallet is always ready when you are

Ready to experience the future of Web3 authentication?`,
     {
       reply_markup: {
         inline_keyboard: [[
           {
             text: "Launch Web3Auth Telegram MiniApp 🚀",
             web_app: { url: process.env.APP_URL }
           }
         ]]
       }
     }
   );
 });

 try {
   await bot.handleUpdate(req.body);
   res.status(200).json({ ok: true });
 } catch (error) {
   console.error('Webhook handling error:', error);
   res.status(500).json({ error: 'Failed to process update' });
 }
}

export const config = {
 api: {
   bodyParser: false,
 },
};