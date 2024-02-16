import Mailjet from 'node-mailjet';

const mailjet = new Mailjet({
  apiKey: process.env.MAILJET_API_KEY,
  apiSecret: process.env.MAILJET_SECRET_KEY,
});

export async function sendWelcomeEmail(toEmail: string, toName: string) {
  try {
    await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: process.env.CONTACT_EMAIL,
            Name: 'Node express template',
          },
          To: [
            {
              Email: toEmail,
              Name: toName,
            },
          ],
          Subject: 'Greet message',
          TextPart: 'Greetings from the best node express template :D',
          HTMLPart:
            `<h3>Hi ${toName},</h3>
             <p>Thanks for signing up</p>
             <p>For any requirement please contact us at ${process.env.CONTACT_EMAIL || ''}.</p>
             <img style="width: 150px;" src="https://assets.afcdn.com/recipe/20210702/121062_w1024h768c1cx924cy924cxt0cyt0cxb1848cyb1848.jpg" />
          `,
        },
      ],
    });
  } catch (e) {
    console.error(e);
  }
}
