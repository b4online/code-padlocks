/**
 * Simple hmac implementation
 * @param key {string} the key to use
 * @param message {string} the message to sign
 * @return {Promise<string>} the signature
 */
const generateHmac = async (key, message) => {
    const encoder = new TextEncoder();
    const cryptoKey = await window.crypto.subtle.importKey("raw", encoder.encode(key), { name: "HMAC", hash: { name: "SHA-256" } }, false, ["sign", "verify"]);
    const signature = await window.crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(message));
    return Array.from(new Uint8Array(signature))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

/**
 * Generate a 6 digit OTP using TOTP
 * @param time {number} the current time to use
 * @param secret {number} the secret key to use
 * @return {Promise<string>} the 6-digit OTP
 */
const generateOTP = async (time, secret) => {
    const timeHex = time.toString(16).padStart(16, '0');
    const secretHex = secret.toString(16).padStart(16, '0');
    const hmac = await generateHmac(secretHex, timeHex);
    const offset = parseInt(hmac.substring(hmac.length - 1), 16);
    const otp = (parseInt(hmac.substring(offset * 2, offset * 2 + 8), 16) & 0x7fffffff) % 1000000;
    return otp.toString().padStart(6, '0');
}

/**
 * Generate a 6 digit OTP which changes monthly
 * @param secret {number} the secret key to use
 * @return {Promise<string>} the 6-digit OTP
 */
const generateMonthlyOTP = async (secret) => {
    const currentMonthSinceEpoch = Math.floor(Date.now() / 2592000000);
    return generateOTP(currentMonthSinceEpoch, secret);
}

/**
 * Generate a 6 digit OTP which changes biweekly
 * @param secret {number} the secret key to use
 * @return {Promise<string>} the 6-digit OTP
 */
const generateBiWeeklyOTP = async (secret) => {
    const currentWeekSinceEpoch = Math.floor(Date.now() / 1209600000);
    return generateOTP(currentWeekSinceEpoch, secret);
}

/**
 * Generate a 6 digit OTP which changes weekly
 * @param secret {number} the secret key to use
 * @return {Promise<string>} the 6-digit OTP
 */
const generateWeeklyOTP = async (secret) => {
    const currentWeekSinceEpoch = Math.floor(Date.now() / 604800000);
    return generateOTP(currentWeekSinceEpoch, secret);
}

/**
 * Generate a 6 digit OTP which changes daily
 * @param secret {number} the secret key to use
 * @return {Promise<string>} the 6-digit OTP
 */
const generateDailyOTP = async (secret) => {
    const currentDaySinceEpoch = Math.floor(Date.now() / 86400000);
    return generateOTP(currentDaySinceEpoch, secret);
}

/**
 * Generate a 6 digit OTP which changes hourly
 * @param secret {number} the secret key to use
 * @return {Promise<string>} the 6-digit OTP
 */
const generateHourlyOTP = async (secret) => {
    const currentHourSinceEpoch = Math.floor(Date.now() / 3600000);
    return generateOTP(currentHourSinceEpoch, secret);
}

/**
 * Generate a 6 digit OTP which changes every 30 minutes
 * @param secret {number} the secret key to use
 * @return {Promise<string>} the 6-digit OTP
 */
const generate30MinuteOTP = async (secret) => {
    const current30MinutesSinceEpoch = Math.floor(Date.now() / 1800000);
    return generateOTP(current30MinutesSinceEpoch, secret);
}

/**
 * Generate a 6 digit OTP which changes every minute
 * @param secret {number} the secret key to use
 * @return {Promise<string>} the 6-digit OTP
 */
const generateMinutelyOTP = async (secret) => {
    const currentMinuteSinceEpoch = Math.floor(Date.now() / 60000);
    return generateOTP(currentMinuteSinceEpoch, secret);
}

/**
 * Format the 6 digit OTP to be more human-readable (2 pairs of 3 digits)
 * @param otp {string} the 6-digit OTP
 * @return {string} the formatted OTP
 */
const formatOTP = (otp) => {
    return `${otp.substring(0, 3)} ${otp.substring(3)}`;
}

/**
 * Update the OTPs on screen every second
 */
setInterval(async () => {
    const secret = document.getElementById('secret').value.replaceAll(' ', '')

    const monthlyOTP = await generateMonthlyOTP(secret);
    const biWeeklyOTP = await generateBiWeeklyOTP(secret);
    const weeklyOTP = await generateWeeklyOTP(secret);
    const dailyOTP = await generateDailyOTP(secret);
    const hourlyOTP = await generateHourlyOTP(secret);
    const thirtyMinuteOTP = await generate30MinuteOTP(secret);
    const minuteOTP = await generateMinutelyOTP(secret);

    document.getElementById('monthly-otp').innerText = formatOTP(monthlyOTP);
    document.getElementById('biweekly-otp').innerText = formatOTP(biWeeklyOTP);
    document.getElementById('weekly-otp').innerText = formatOTP(weeklyOTP);
    document.getElementById('daily-otp').innerText = formatOTP(dailyOTP);
    document.getElementById('hourly-otp').innerText = formatOTP(hourlyOTP);
    document.getElementById('30-minute-otp').innerText = formatOTP(thirtyMinuteOTP);
    document.getElementById('minute-otp').innerText = formatOTP(minuteOTP);
}, 1000)


/**
 * Simple test function
 */
const testCodes = async () => {
    const secret = document.getElementById('secret').value.replaceAll(' ', '')
    const code = document.getElementById('code').value.replaceAll(' ', '')

    const codes = [
        { name: 'Monthly', fn: await generateMonthlyOTP(secret) },
        { name: 'Bi-Weekly', fn: await generateBiWeeklyOTP(secret) },
        { name: 'Weekly', fn: await generateWeeklyOTP(secret) },
        { name: 'Daily', fn: await generateDailyOTP(secret) },
        { name: 'Hourly', fn: await generateHourlyOTP(secret) },
        { name: '30-Minute', fn: await generate30MinuteOTP(secret) },
        { name: 'Minute', fn: await generateMinutelyOTP(secret) },
    ];

    const match = codes.find(c => c.fn === code);
    if (match) {
        document.getElementById('test-result').innerText = `Code matches ${match.name} code`;
    } else {
        document.getElementById('test-result').innerText = 'Code does not match any code';
    }
}