import puppeteer from 'puppeteer';
import fs from 'fs';

const teamNameInUrl = 'vasco'
const teamCodeInFlashscore = '2RABlYFn'
const amountOfMatches = '5';
const url = `https://www.flashscore.com/team/${teamNameInUrl}/${teamCodeInFlashscore}/results/`;

async function getStats() {
    console.log('Running...');
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(url);
    const teamName = await page.$eval('.heading__name', (el) => el.innerText);
    const matches = await page.$$eval('[id^="g_1_"]', (el) =>{
        return el.map((el) => el.id.replace('g_1_', ''));
    });
    fs.writeFile('src/stats.txt', `${teamName} latest ${amountOfMatches} matches statistics:`, (err) => {
        if(err) throw err;
        console.log('Stats.txt created.');
    });
    for (let i = 0; i < Number(amountOfMatches); i++){
        const matchStatsUrl = `https://www.flashscore.com/match/${matches[i]}/#/match-summary/match-statistics/0`;
        await page.goto(matchStatsUrl);
        await page.waitForSelector('.stat__categoryName');
        const homeTeam = await page.$eval('.duelParticipant__home', (el) => el.innerText);
        const awayTeam = await page.$eval('.duelParticipant__away', (el) => el.innerText);
        const matchResult = await page.$eval('.detailScore__wrapper', (el) => el.innerText.replace(/\n/g, ' '));
        const matchStartTime = await page.$eval('.duelParticipant__startTime', (el) => el.innerText)
        fs.appendFile('src/stats.txt', `\n\n${homeTeam} ${matchResult} ${awayTeam} on ${matchStartTime}\n\n`, (err) =>{
            if (err) throw err;
        });
        const stats = await page.$$eval('.stat__category', (el) => el.map((el) => el.innerText.replace(/\n/g, ' - ')));
        for (let j = 0; j < stats.length; j++){
            fs.appendFile('src/stats.txt', `${stats[j]}\n`, (err) => {
                if (err) throw err;
            });
        };
    };
    await browser.close();
}
getStats();
