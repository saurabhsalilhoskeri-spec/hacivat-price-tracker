const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const nodemailer = require('nodemailer');

puppeteer.use(StealthPlugin());

// Configuration
const EMAIL_TO = "saurabhsalilhoskeri@gmail.com";
const PRICE_THRESHOLD = 245;
const PRODUCT_URL = "https://www.fragrancex.com/products/nishane/hacivat-perfume";
const XPATH = '/html/body/div[1]/section/div[1]/div[2]/div[1]/div[3]/div[2]/div[3]/div[2]/div/div/div[1]/div[2]/bdo/span[2]';

async function sendEmail(price) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.ALERT_EMAIL,
      pass: process.env.ALERT_EMAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: `"Hacivat Tracker" <${process.env.ALERT_EMAIL}>`,
    to: EMAIL_TO,
    subject: `🔥 Hacivat is now $${price}!`,
    text: `The price of Nishane Hacivat just dropped below $${PRICE_THRESHOLD}.
Current Price: $${price}

Buy it now:
${PRODUCT_URL}`
  };

  await transporter.sendMail(mailOptions);
  console.log("📬 Alert sent!");
}

(async () => {
  console.log("🔁 Starting hourly price check...");

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(PRODUCT_URL, { waitUntil: 'networkidle2', timeout: 0 });
    await page.waitForXPath(XPATH, { timeout: 15000 });
    const [priceEl] = await page.$x(XPATH);
    const rawPrice = await page.evaluate(el => el.textContent.trim(), priceEl);
    const cleanPrice = parseFloat(rawPrice.replace(/[^0-9.]/g, ''));

    console.log(`✅ Current Price: $${cleanPrice}`);

    if (cleanPrice < PRICE_THRESHOLD) {
      await sendEmail(cleanPrice);
    } else {
      console.log("⏳ Price is still too high, no alert sent.");
    }

  } catch (err) {
    console.error("❌ Scraping error:", err.message);
  } finally {
    await browser.close();
  }
})();
