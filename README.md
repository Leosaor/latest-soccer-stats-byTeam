# Soccer Stats
## Latest soccer stats by team
Soccer Stats allows you to get all the statistics of the latest games of your team

# Installation
Soccer Stats requires [Node.js](https://nodejs.org/) to run.

### Build from source
```sh
$ git clone https://github.com/Leosaor/latest-soccer-stats-byTeam.git
$ cd latest-soccer-stats-byTeam
$ npm install
```

# Usage
Access the [Flashscore](https://www.flashscore.com/) site and search for your team, look in the URL for the team name and the team code. 

Like This:

<p align="center">
    <img src="https://i.imgur.com/UWqZNQK.jpg" width="800px" />
</p>

Then:


### To run with default values:

Default values will return the latest 5 games of Vasco da Gama (Brazil)
```sh
$ npm start
```
### To run with differents values:

Use npm start (TeamNameLikeInURL) (TeamCodeInFlashscore) (AmountOfMatches) Example:
```sh
$ npm start barcelona SKbpVP5K 3
```
This command will return the latest 3 games of Barcelona (Spain)

### Example with different team:
<p align="center">
    <img src="https://i.imgur.com/ZCcVJei.gif" width="800px" />
</p>





