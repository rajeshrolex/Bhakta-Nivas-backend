const fetch = require('node-fetch');
const BASE = 'https://teal-butterfly-804797.hostingersite.com/api';

async function test() {
    console.log('Fetching lodges...');
    const lRes = await fetch(`${BASE}/lodges`);
    const lodges = await lRes.json();
    console.log('Lodges:', lodges.length);
    if (!lodges.length) return;
    
    const lodgeId = lodges[0]._id;
    console.log('Lodge ID:', lodgeId);

    const monthStr = '2026-03';
    console.log(`Fetching daily prices for ${monthStr}...`);
    const pRes = await fetch(`${BASE}/daily-prices?lodgeId=${lodgeId}&month=${monthStr}`);
    const prices = await pRes.json();
    console.log('Prices:', typeof prices !== 'string' ? prices.length : prices);

    console.log(`Fetching blocked dates for ${monthStr}...`);
    const bRes = await fetch(`${BASE}/blocked-dates/${lodgeId}/month/${monthStr}`);
    const blocks = await bRes.json();
    console.log('Blocks:', typeof blocks !== 'string' ? blocks.length : blocks);
}
test().catch(console.error);
