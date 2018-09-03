const cheerio = require("cheerio");
const request = require("request-promise");
const logger = require("morgan");
const express = require("express");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000;
const app = express();
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
let affixes = "";
function scrape(dungeon, affixes, res) {
  const results = [];
  let numCompleted = 0;
  for (let i = -1; i < 84; i++) {
    request(`https://www.wowprogress.com/mythic_plus_all/char_rating/next/${i}/class.${dungeon}/affixes.${affixes}#char_rating%60`, function (error, response, html) {
      if (error) {
        numCompleted++;
      }
      console.log(i);
      if (html) {
        const C = cheerio.load(html);
        C("tr").each(function (i, element) {
          let run = {
            tank: "",
            healer: "",
            dps: [],
            level: 0,
            score: 0
          };
          C(element).children("td").each(function (index, elem) {
            if (index === 1) {
              if (C(elem).children("nobr").children("span").children("a").hasClass("deathknight")) {
                run.tank = "Death Knight";
              } else if (C(elem).children("nobr").children("span").children("a").hasClass("demon_hunter")) {
                run.tank = "Demon Hunter";
              } else if (C(elem).children("nobr").children("span").children("a").hasClass("paladin")) {
                run.tank = "Paladin";
              } else if (C(elem).children("nobr").children("span").children("a").hasClass("monk")) {
                run.tank = "Monk";
              } else if (C(elem).children("nobr").children("span").children("a").hasClass("druid")) {
                run.tank = "Druid";
              } else if (C(elem).children("nobr").children("span").children("a").hasClass("warrior")) {
                run.tank = "Warrior";
              } else {
                run.tank = "Unknown";
              }
            } else if (index === 2) {
              if (C(elem).children("nobr").children("span").children("a").hasClass("priest")) {
                run.healer = "Priest";
              } else if (C(elem).children("nobr").children("span").children("a").hasClass("paladin")) {
                run.healer = "Paladin";
              } else if (C(elem).children("nobr").children("span").children("a").hasClass("druid")) {
                run.healer = "Druid";
              } else if (C(elem).children("nobr").children("span").children("a").hasClass("monk")) {
                run.healer = "Monk";
              } else if (C(elem).children("nobr").children("span").children("a").hasClass("shaman")) {
                run.healer = "Shaman";
              } else {
                run.healer = "Unknown";
              }
            } else if (index === 3) {
              C(elem).children("nobr").each(function (ind, ele) {
                if (C(ele).children("span").children("a").hasClass("demon_hunter")) {
                  run.dps.push("Demon Hunter");
                } else if (C(ele).children("span").children("a").hasClass("rogue")) {
                  run.dps.push("Rogue");
                } else if (C(ele).children("span").children("a").hasClass("warlock")) {
                  run.dps.push("Warlock");
                } else if (C(ele).children("span").children("a").hasClass("warrior")) {
                  run.dps.push("Warrior");
                } else if (C(ele).children("span").children("a").hasClass("mage")) {
                  run.dps.push("Mage");
                } else if (C(ele).children("span").children("a").hasClass("druid")) {
                  run.dps.push("Druid");
                } else if (C(ele).children("span").children("a").hasClass("monk")) {
                  run.dps.push("Monk");
                } else if (C(ele).children("span").children("a").hasClass("hunter")) {
                  run.dps.push("Hunter");
                } else if (C(ele).children("span").children("a").hasClass("paladin")) {
                  run.dps.push("Paladin");
                } else if (C(ele).children("span").children("a").hasClass("shaman")) {
                  run.dps.push("Shaman");
                } else if (C(ele).children("span").children("a").hasClass("priest")) {
                  run.dps.push("Priest");
                } else if (C(ele).children("span").children("a").hasClass("deathknight")) {
                  run.dps.push("Death Knight");
                } else {
                  run.dps.push("Unknown");
                }
              });
            } else if (index === 5) {
              const split = C(elem).text().split(" ");
              const level = split[0].split("M+");
              run.level = level[1];
            } else if (index === 6) {
              run.score = C(elem).text();
            }
          });
          if (run.level !== 0) {
            results.push(run);
          }

        });
      }
    }).then(function () {
      numCompleted++;
      console.log("num: " + numCompleted)
      if (numCompleted === 83) {
        const result = {
          tanks: {
            deathKnight: {
              num: 0,
              score: 0,
              average: 0,
              calcAverage: function () {
                this.average = this.score / this.num;
              }
            },
            demonHunter: {
              num: 0,
              score: 0,
              average: 0,
              calcAverage: function () {
                this.average = this.score / this.num;
              }
            },
            paladin: {
              num: 0,
              score: 0,
              average: 0,
              calcAverage: function () {
                this.average = this.score / this.num;
              }
            },
            warrior: {
              num: 0,
              score: 0,
              average: 0,
              calcAverage: function () {
                this.average = this.score / this.num;
              }
            },
            monk: {
              num: 0,
              score: 0,
              average: 0,
              calcAverage: function () {
                this.average = this.score / this.num;
              }
            },
            druid: {
              num: 0,
              score: 0,
              average: 0,
              calcAverage: function () {
                this.average = this.score / this.num;
              }
            }
          },
          healers: {
            priest: {
              num: 0,
              score: 0,
              average: 0,
              calcAverage: function () {
                this.average = this.score / this.num;
              }
            },
            paladin: {
              num: 0,
              score: 0,
              average: 0,
              calcAverage: function () {
                this.average = this.score / this.num;
              }
            },
            druid: {
              num: 0,
              score: 0,
              average: 0,
              calcAverage: function () {
                this.average = this.score / this.num;
              }
            },
            shaman: {
              num: 0,
              score: 0,
              average: 0,
              calcAverage: function () {
                this.average = this.score / this.num;
              }
            },
            monk: {
              num: 0,
              score: 0,
              average: 0,
              calcAverage: function () {
                this.average = this.score / this.num;
              }
            }
          },
          dps: {
            demonHunter: {
              num: 0,
              score: 0,
              average: 0,
              calcAverage: function () {
                this.average = this.score / this.num;
              }
            },
            rogue: {
              num: 0,
              score: 0,
              average: 0,
              calcAverage: function () {
                this.average = this.score / this.num;
              }
            },
            paladin: {
              num: 0,
              score: 0,
              average: 0,
              calcAverage: function () {
                this.average = this.score / this.num;
              }
            },
            hunter: {
              num: 0,
              score: 0,
              average: 0,
              calcAverage: function () {
                this.average = this.score / this.num;
              }
            },
            priest: {
              num: 0,
              score: 0,
              average: 0,
              calcAverage: function () {
                this.average = this.score / this.num;
              }
            },
            deathKnight: {
              num: 0,
              score: 0,
              average: 0,
              calcAverage: function () {
                this.average = this.score / this.num;
              }
            },
            shaman: {
              num: 0,
              score: 0,
              average: 0,
              calcAverage: function () {
                this.average = this.score / this.num;
              }
            },
            mage: {
              num: 0,
              score: 0,
              average: 0,
              calcAverage: function () {
                this.average = this.score / this.num;
              }
            },
            warlock: {
              num: 0,
              score: 0,
              average: 0,
              calcAverage: function () {
                this.average = this.score / this.num;
              }
            },
            monk: {
              num: 0,
              score: 0,
              average: 0,
              calcAverage: function () {
                this.average = this.score / this.num;
              }
            },
            druid: {
              num: 0,
              score: 0,
              average: 0,
              calcAverage: function () {
                this.average = this.score / this.num;
              }
            },
            warrior: {
              num: 0,
              score: 0,
              average: 0,
              calcAverage: function () {
                this.average = this.score / this.num;
              }
            }
          }
        }
        results.forEach(mythic => {
          switch (mythic.tank) {
            case "Death Knight":
              result.tanks.deathKnight.score += parseFloat(mythic.score);
              result.tanks.deathKnight.num++;
              break;
            case "Demon Hunter":
              result.tanks.demonHunter.score += parseFloat(mythic.score);
              result.tanks.demonHunter.num++;
              break;
            case "Paladin":
              result.tanks.paladin.score += parseFloat(mythic.score);
              result.tanks.paladin.num++;
              break;
            case "Warrior":
              result.tanks.warrior.score += parseFloat(mythic.score);
              result.tanks.warrior.num++;
              break;
            case "Monk":
              result.tanks.monk.score += parseFloat(mythic.score);
              result.tanks.monk.num++;
              break;
            case "Druid":
              result.tanks.druid.score += parseFloat(mythic.score);
              result.tanks.druid.num++;
              break;
            case "Unknown":
              break;
          }
          switch (mythic.healer) {
            case "Monk":
              result.healers.monk.score += parseFloat(mythic.score);
              result.healers.monk.num++;
              break;
            case "Priest":
              result.healers.priest.score += parseFloat(mythic.score);
              result.healers.priest.num++;
              break;
            case "Paladin":
              result.healers.paladin.score += parseFloat(mythic.score);
              result.healers.paladin.num++;
              break;
            case "Shaman":
              result.healers.shaman.score += parseFloat(mythic.score);
              result.healers.shaman.num++;
              break;
            case "Druid":
              result.healers.druid.score += parseFloat(mythic.score);
              result.healers.druid.num++;
              break;
            case "Unknown":
              break;
          }
          mythic.dps.forEach(damage => {
            switch (damage) {
              case "Warrior":
                result.dps.warrior.score += parseFloat(mythic.score);
                result.dps.warrior.num++;
                break;
              case "Paladin":
                result.dps.paladin.score += parseFloat(mythic.score);
                result.dps.paladin.num++;
                break;
              case "Hunter":
                result.dps.hunter.score += parseFloat(mythic.score);
                result.dps.hunter.num++;
                break;
              case "Rogue":
                result.dps.rogue.score += parseFloat(mythic.score);
                result.dps.rogue.num++;
                break;
              case "Priest":
                result.dps.priest.score += parseFloat(mythic.score);
                result.dps.priest.num++;
                break;
              case "Death Knight":
                result.dps.deathKnight.score += parseFloat(mythic.score);
                result.dps.deathKnight.num++;
                break;
              case "Shaman":
                result.dps.shaman.score += parseFloat(mythic.score);
                result.dps.shaman.num++;
                break;
              case "Mage":
                result.dps.mage.score += parseFloat(mythic.score);
                result.dps.mage.num++;
                break;
              case "Warlock":
                result.dps.warlock.score += parseFloat(mythic.score);
                result.dps.warlock.num++;
                break;
              case "Monk":
                result.dps.monk.score += parseFloat(mythic.score);
                result.dps.monk.num++;
                break;
              case "Druid":
                result.dps.druid.score += parseFloat(mythic.score);
                result.dps.druid.num++;
                break;
              case "Demon Hunter":
                result.dps.demonHunter.score += parseFloat(mythic.score);
                result.dps.demonHunter.num++;
                break;
              case "Unknown":
                break;
            }
          });
        });
        result.tanks.deathKnight.calcAverage();
        result.tanks.demonHunter.calcAverage();
        result.tanks.paladin.calcAverage();
        result.tanks.monk.calcAverage();
        result.tanks.druid.calcAverage();
        result.tanks.warrior.calcAverage();
        result.healers.monk.calcAverage();
        result.healers.priest.calcAverage();
        result.healers.paladin.calcAverage();
        result.healers.druid.calcAverage();
        result.healers.shaman.calcAverage();
        result.dps.warrior.calcAverage();
        result.dps.demonHunter.calcAverage();
        result.dps.hunter.calcAverage();
        result.dps.druid.calcAverage();
        result.dps.rogue.calcAverage();
        result.dps.monk.calcAverage();
        result.dps.shaman.calcAverage();
        result.dps.priest.calcAverage();
        result.dps.paladin.calcAverage();
        result.dps.warlock.calcAverage();
        result.dps.mage.calcAverage();
        result.dps.deathKnight.calcAverage();
        console.log(result);
        res.json(result);
      }
    });
  }
}

app.get("/scrapes/:dungeon", function (req, res) {
  const dungeon = req.params.dungeon;
  request('https://raider.io/api/v1/mythic-plus/affixes?region=us&locale=en', function (error, response, html) {
    const firstSplit = html.split('"title":"');
    const secondSplit = firstSplit[1].split('","leaderboard_url"');
    secondSplit[0].replace(",", "-");
    affixes = secondSplit[0].replace(", ", "-").replace(", ", "-").toLowerCase();
  }).then(function () {
    scrape(dungeon, affixes, res);
  });
});

app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});