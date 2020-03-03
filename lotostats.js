const euromillions = require("./euromillions0219to0220.json");

const cutArray = (stats, limit) =>
  Object.entries(stats)
    .sort((a, b) => (a[1] < b[1] ? 1 : -1))
    .splice(0, limit);

const getCurrentBall = str => Number(str.split(" ")[0]);
const getMonthlyOccurence = str =>
  Number(str.replace(/([()])|x/g, "").split(" ")[1]);

function lotoStats(a) {
  const globalStats = [];
  const monthlyStats = [];
  const bestGlobalBalls = [];
  const bestGlobalStars = [];
  let statsGlobalBalls = {};
  let statsGlobalStars = {};
  // Months
  a.map(month => {
    const currentMonth = Object.keys(month).toString();
    Object.values(month).map(m => {
      const bestBalls = [];
      const bestStars = [];
      let statsBalls = {};
      let statsStars = {};
      m.map(draw => {
        draw.balls.map(ball =>
          ball in statsBalls ? ++statsBalls[ball] : (statsBalls[ball] = 1)
        );
        draw.stars.map(star =>
          star in statsStars ? ++statsStars[star] : (statsStars[star] = 1)
        );
      });
      const fiveMostCommonBalls = cutArray(statsBalls, 5);
      const twoMostCommonStars = cutArray(statsStars, 2);
      fiveMostCommonBalls.map(ball =>
        bestBalls.push(`${ball[0]} (x${ball[1]})`)
      );
      twoMostCommonStars.map(star =>
        bestStars.push(`${star[0]} (x${star[1]})`)
      );
      return monthlyStats.push({ [currentMonth]: { bestBalls, bestStars } });
    });
  });
  // Global
  monthlyStats.map(month => {
    Object.values(month).map(m => {
      // parse all balls
      m.bestBalls.map(ball => {
        const currentBall = getCurrentBall(ball);
        const monthOccurence = getMonthlyOccurence(ball);
        if (currentBall in statsGlobalBalls) {
          return (statsGlobalBalls[currentBall] += monthOccurence);
        }
        return (statsGlobalBalls[currentBall] = monthOccurence);
      });
      // parse all stars
      m.bestStars.map(star => {
        const currentStar = getCurrentBall(star);
        const monthOccurence = getMonthlyOccurence(star);
        if (currentStar in statsGlobalStars) {
          return (statsGlobalStars[currentStar] += monthOccurence);
        }
        return (statsGlobalStars[currentStar] = monthOccurence);
      });
    });
  });
  const fiveMostCommonGlobalBalls = cutArray(statsGlobalBalls, 5);
  const twoMostCommonGlobalStars = cutArray(statsGlobalStars, 2);
  fiveMostCommonGlobalBalls.map(ball =>
    bestGlobalBalls.push(`${ball[0]} (x${ball[1]})`)
  );
  twoMostCommonGlobalStars.map(star =>
    bestGlobalStars.push(`${star[0]} (x${star[1]})`)
  );
  globalStats.push({ global: { bestGlobalBalls, bestGlobalStars } });
  // Final return
  return [...globalStats, ...monthlyStats];
}

console.log(JSON.stringify(lotoStats(euromillions), null, 4));
