import puppeteer from 'puppeteer';
import fs from 'fs';
import { exec } from 'child_process';

const teamNameInUrl = process.argv[2] || 'vasco'
const teamCodeInFlashscore = process.argv[3] || '2RABlYFn'
const amountOfMatches = process.argv[4] || '5';
const url = `https://www.flashscore.com/team/${teamNameInUrl}/${teamCodeInFlashscore}/results/`;

async function getStats() {
    console.log('Running...');
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url);
    const invalidUrl = await page.$eval('p', (el) => el.innerText);
    if(invalidUrl == `Error: The requested page can't be displayed. Please try again later.`) {
        console.log(`Invalid url, please check the team name and code in flashscore\nThe correct input format:\nnpm start (TeamNameLikeInURL) (teamCodeInFlashscore) (AmountOfMatches)\nOr use only "npm start" to get the last 5 stats matches from Vasco da Gama`);
        process.exit(1);
    }
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
        console.log(`Match ${i+1} statistics saved.`);
    };
    console.log('\nAll matches statistics saved.');
    await browser.close();
    exec('notepad.exe src/stats.txt');

}
getStats();
