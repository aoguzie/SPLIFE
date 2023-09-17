// Function to format a date as "YYYY-MM-DD"
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

// Function to fetch data from a URL asynchronously
async function fetchData(url) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Network response was not ok for ${url}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
        throw error; // Re-throw the error to handle it later
    }
}

// Get the current date
const currentDate = new Date();

// Calculate the date 2 weeks ago
const twoWeeksAgo = new Date();
twoWeeksAgo.setDate(currentDate.getDate() - 100);

// Define the base URL
const baseUrl = "https://www.sportinglife.com/api/football/v2/matches/";

// Fetch data for each day within the past 2 weeks asynchronously
const urlsToFetch = [];

while (twoWeeksAgo <= currentDate) {
    const formattedDate = formatDate(twoWeeksAgo);
    const apiUrl = `${baseUrl}${formattedDate}`;
    urlsToFetch.push(apiUrl);

    // Move to the next day
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() + 1);
}

// Function to merge all results into a single array
function mergeResults(resultsArray) {
    return resultsArray.reduce((merged, data) => {
        return merged.concat(data);
    }, []);
}

// Function to fetch data for all URLs asynchronously
async function fetchAllData() {
    const dataPromises = urlsToFetch.map((url) => fetchData(url));

    try {
        const results = await Promise.all(dataPromises);
        // Merge all results into a single array
        const mergedResults = mergeResults(results);
        // Handle the merged data here
        console.log("Merged data for all URLs:", mergedResults);
        const remap = mergedResults.map(r => {
            const rem = {
                state: r.state,
                date: r.match_date,
                time: r.match_time,
                league: r.competition.name,
                team1: r.team_score_a.team.name,
                team2: r.team_score_b.team.name,
                FTscore1: r.full_time_score && typeof r.full_time_score.home !== 'undefined' && !Number.isNaN(r.full_time_score.home) ? r.full_time_score.home : 0,
                FTscore2: r.full_time_score && typeof r.full_time_score.away !== 'undefined' && !Number.isNaN(r.full_time_score.away) ? r.full_time_score.away : 0,
                HTscore1: r.half_time_score && typeof r.half_time_score.home !== 'undefined' && !Number.isNaN(r.half_time_score.home) ? r.half_time_score.home : 0,
                HTscore2: r.half_time_score && typeof r.half_time_score.away !== 'undefined' && !Number.isNaN(r.half_time_score.away) ? r.half_time_score.away : 0,
                rank1: r.homeLeagueStanding,
                rank2: r.awayLeagueStanding,
                winner: r.match_outcome && r.match_outcome.winner && typeof r.match_outcome.winner.name !== 'undefined' ? r.match_outcome.winner.name : 'not finished',
                team1scorer: r.homeGoals && r.homeGoals.map(scorer => {
                    return {
                        scorer: scorer.team_player,
                        goals: scorer.goal.map(goal => {
                            return {
                                type: goal.type,
                                time: goal.time,
                            };
                        }),
                    };
                }),
                team2scorer: r.awayGoals && r.awayGoals.map(scorer => {
                    return {
                        scorer: scorer.team_player,
                        goals: scorer.goal.map(goal => {
                            return {
                                type: goal.type,
                                time: goal.time,
                            };
                        }),
                    };
                }),
                team1sqad:  r.homePlayers && r.homePlayers.map(player => {
                    return {
                        player: player.player.display_name,
                        starter: player.starter,
                    };
                }),
                team2sqad: r.awayPlayers && r.awayPlayers.map(player => {
                    return {
                        player: player.player.display_name,
                        starter: player.starter,
                    };
                }),
            };
            return rem;
        });

        console.log(remap)
    } catch (error) {
        console.error("Error fetching data for one or more URLs:", error);
    }
}

// Call the function to fetch data for all URLs and merge the results
fetchAllData();






const sqadval = [];
// Function to format a date as "YYYY-MM-DD"
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}
const Url = 'https://www.footballtransfers.com/us/values/actions/most-valuable-football-teams/overview';

// async function fetchDataForPage(pageNumber) {
//   const payload = new URLSearchParams({
//     orderBy: 'total_current_player_value',
//     orderByDescending: '1',
//     page: pageNumber.toString(),
//     pages: '0',
//     pageItems: '25',
//     continentId: 'all',
//     countryId: 'all',
//     tournamentId: 'all'
//   });

//   const requestOptions = {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded', // Set the appropriate content type
//     },
//     body: payload.toString(),
//   };

//   try {
//     const response = await fetch(Url, requestOptions);

//     if (!response.ok) {
//       throw new Error(`HTTP Error! Status: ${response.status}`);
//     }

//     const data = await response.json();
//     return data; // Replace this with your data processing logic
//   } catch (error) {
//     console.error(`Error fetching data for page ${pageNumber}: ${error}`);
//     throw error;
//   }
// }

// async function fetchAllPages() {
//   const totalPages = 54; // Set the total number of pages to fetch

//   try {
//     const promises = [];
//     for (let page = 1; page <= totalPages; page++) {
//       promises.push(fetchDataForPage(page));
//     }

//     const allPageData = await Promise.all(promises);
//     // Process allPageData as needed (it will be an array of data from all pages)
//     console.log(allPageData);
//     const res = allPageData.map((rr) => {
//         return rr.records
//     })
   
//     const mergeres = mergeResults(res);
//     sqadval.push(mergeres)
//   } catch (error) {
//     console.error('Error fetching data for all pages:', error);
//   }
// }

// fetchAllPages();

// Function to fetch data from a URL asynchronously
async function fetchData(url) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Network response was not ok for ${url}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
        throw error; // Re-throw the error to handle it later
    }
}

// Function to calculate the date range
function getDateRange() {
    const currentDate = new Date();
    const twoWeeksAgo = new Date();
    const nextWeek = new Date();

    twoWeeksAgo.setDate(currentDate.getDate() - 100);
    nextWeek.setDate(currentDate.getDate() + 7);

    return { startDate: twoWeeksAgo, endDate: nextWeek };
}

// Define the base URL
const baseUrl = "https://www.sportinglife.com/api/football/v2/matches/";

// Function to generate URLs within the date range
function generateUrlsWithinDateRange(startDate, endDate) {
    const urlsToFetch = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        const formattedDate = formatDate(currentDate);
        const apiUrl = `${baseUrl}${formattedDate}`;
        urlsToFetch.push(apiUrl);

        // Move to the next day
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return urlsToFetch;
}



// Function to fetch data for all URLs asynchronously
async function fetchAllData() {
    const { startDate, endDate } = getDateRange();
    const urlsToFetch = generateUrlsWithinDateRange(startDate, endDate);

    const dataPromises = urlsToFetch.map((url) => fetchData(url));

    try {
        const results = await Promise.all(dataPromises);
        // Merge all results into a single array
        const mergedResults = mergeResults(results);
        // Handle the merged data here
        console.log("Merged data for all URLs:", mergedResults);
        const sqd = mergeResults(sqadval);
        // console.log(sqd);
        // merge
        const merged1 = mergedResults.map(obj1 => {
            const obj2 = sqd.find(obj2 => obj2.team_name === obj1.team_score_a.team.name);
            if (obj2) {
              return { ...obj1, ...obj2 }; // Merge the objects
            } else {
              return obj1; // If there's no matching object in array2, use the object from array1
            }
          });
          const merged2 = mergedResults.map(obj1 => {
            const obj2 = sqd.find(obj2 => obj2.team_name === obj1.team_score_b.team.name);
            if (obj2) {
              return { ...obj1, ...obj2 }; // Merge the objects
            } else {
              return obj1; // If there's no matching object in array2, use the object from array1
            }
          });
          const merged = mergeResults(merged1,merged2)
        //   console.log(merged);
            const remap = mergedResults.map(r => {
              // const leagueMatches = filter(mergedResults, (st)=>st.competition.name==r.competition.name && st.state =='FULLTIME');
              // const tot = sum([r.full_time_score && typeof r.full_time_score.home !== 'undefined' && !Number.isNaN(r.full_time_score.home) ? r.full_time_score.home : 0,r.full_time_score && typeof r.full_time_score.away !== 'undefined' && !Number.isNaN(r.full_time_score.away) ? r.full_time_score.away : 0]);
              // const t1Home = filter(leagueMatches, (st)=>st.team_score_a.team.name==r.team_score_a.team.name);
              // const t1Away = filter(leagueMatches, (st)=>st.team_score_b.team.name==r.team_score_a.team.name);
              // const t1matches = _.concat(t1Home,t1Away);
              // const t1Won = filter(t1matches, (st)=>st.match_outcome.winner && typeof st.match_outcome.winner.name !== 'undefined' && !Number.isNaN(st.match_outcome.winner.name) ? st.match_outcome.winner.name : ''== r.team_score_a.team.name);
              // const t1Drw = filter(t1matches, (st)=>st.match_outcome.outcome == 'DRAW');
              // const t1Lost = filter(t1matches, (st)=>st.match_outcome.outcome == 'WIN' && st.match_outcome.winner.name !== r.team_score_a.team.name);
              // const t1GfHome = sum(map(t1Home,(st)=>st.full_time_score && typeof st.full_time_score.home !== 'undefined' && !Number.isNaN(st.full_time_score.home) ? st.full_time_score.home : 0));
              // const t1GfAway = sum(map(t1Away,(st)=>st.full_time_score && typeof st.full_time_score.away !== 'undefined' && !Number.isNaN(st.full_time_score.away) ? st.full_time_score.away : 0));
              // const t1Gf = sum([t1GfHome,t1GfAway]);
              // const t1GaHome = sum(map(t1Home,(st)=>st.full_time_score && typeof st.full_time_score.away !== 'undefined' && !Number.isNaN(st.full_time_score.away) ? st.full_time_score.away : 0));
              // const t1GaAway = sum(map(t1Away,(st)=>st.full_time_score && typeof st.full_time_score.home !== 'undefined' && !Number.isNaN(st.full_time_score.home) ? st.full_time_score.home : 0));
              // const t1Ga = sum([t1GaHome,t1GaAway]);
              // const t1PTS = sum([t1Won.length*3,t1Drw.length]);
              // // team2 stats
              // const t2Home = filter(leagueMatches, (st)=>st.team_score_a.team.name==r.team_score_b.team.name);
              // const t2Away = filter(leagueMatches, (st)=>st.team_score_b.team.name==r.team_score_b.team.name);
              // const t2matches =  _.concat(t2Home,t2Away);
              // const t2Won = filter(t2matches, (st)=>st.match_outcome.winner && typeof st.match_outcome.winner.name !== 'undefined' && !Number.isNaN(st.match_outcome.winner.name) ? st.match_outcome.winner.name : ''== r.team_score_b.team.name);
              // const t2Drw = filter(t2matches, (st)=>st.match_outcome.outcome == 'DRAW');
              // const t2Lost = filter(t2matches, (st)=>st.match_outcome.outcome == 'WIN' && st.match_outcome.winner.name !== r.team_score_b.team.name);
              // const t2GfHome = sum(map(t2Home,(st)=>st.full_time_score && typeof st.full_time_score.home !== 'undefined' && !Number.isNaN(st.full_time_score.home) ? st.full_time_score.home : 0));
              // const t2GfAway = sum(map(t2Away,(st)=>st.full_time_score && typeof st.full_time_score.away !== 'undefined' && !Number.isNaN(st.full_time_score.away) ? st.full_time_score.away : 0));
              // const t2Gf = sum([t2GfHome,t2GfAway]);
              // const t2GaHome = sum(map(t2Home,(st)=>st.full_time_score && typeof st.full_time_score.away !== 'undefined' && !Number.isNaN(st.full_time_score.away) ? st.full_time_score.away : 0));
              // const t2GaAway = sum(map(t2Away,(st)=>st.full_time_score && typeof st.full_time_score.home !== 'undefined' && !Number.isNaN(st.full_time_score.home) ? st.full_time_score.home : 0));
              // const t2Ga = sum([t2GaHome,t2GaAway]);
              // const t2PTS = sum([t2Won.length*3,t2Drw.length]);
        //  console.log(t1Lost);
            const rem = {
                state: r.state,
                date: r.match_date,
                time: r.match_time,
                league: r.competition.name,
                team1: r.team_score_a.team.name,
                team2: r.team_score_b.team.name,
                // team1Matches: t1matches.length,
                // team2Matches: t2matches.length,
                // team1W: t1Won.length,
                // team2W: t2Won.length,
                // team1D: t1Drw.length,
                // team2D: t2Drw.length,
                // team1L: t1Lost.length,
                // team2L: t2Lost,
                // team1GF: t1Gf,
                // team2GF: t2Gf,
                // team1GA: t1Ga,
                // team2GA: t2Ga,
                // team1PTS: t1PTS,
                // team2PTS: t2PTS,
                FTscore1: r.full_time_score && typeof r.full_time_score.home !== 'undefined' && !Number.isNaN(r.full_time_score.home) ? r.full_time_score.home : 0,
                FTscore2: r.full_time_score && typeof r.full_time_score.away !== 'undefined' && !Number.isNaN(r.full_time_score.away) ? r.full_time_score.away : 0,
                HTscore1: r.half_time_score && typeof r.half_time_score.home !== 'undefined' && !Number.isNaN(r.half_time_score.home) ? r.half_time_score.home : 0,
                HTscore2: r.half_time_score && typeof r.half_time_score.away !== 'undefined' && !Number.isNaN(r.half_time_score.away) ? r.half_time_score.away : 0,
                rank1: r.homeLeagueStanding,
                rank2: r.awayLeagueStanding,
                winner: r.match_outcome && r.match_outcome.winner && typeof r.match_outcome.winner.name !== 'undefined' ? r.match_outcome.winner.name : 'Draw',
                result: r.match_outcome.outcome,
                // total: tot,
                team1scorer: r.homeGoals && r.homeGoals.map(scorer => {
                    return {
                        scorer: scorer.team_player,
                        goals: scorer.goal.map(goal => {
                            return {
                                type: goal.type,
                                time: goal.time,
                            };
                        }),
                    };
                }),
                team2scorer: r.awayGoals && r.awayGoals.map(scorer => {
                    return {
                        scorer: scorer.team_player,
                        goals: scorer.goal.map(goal => {
                            return {
                                type: goal.type,
                                time: goal.time,
                            };
                        }),
                    };
                }),
                team1sqad:  r.homePlayers && r.homePlayers.map(player => {
                    return {
                        player: player.player.display_name,
                        // starter: player.starter,
                    };
                }),
                team2sqad: r.awayPlayers && r.awayPlayers.map(player => {
                    return {
                        player: player.player.display_name,
                        // starter: player.starter,
                    };
                }),
            };
            return rem;
        });
        // console.log(remap);
        
        const his  = filter(remap, (re)=>re.state=="FULLTIME")
        const fix  = filter(remap, (re)=>re.date>=today)
        console.log(his);
        // console.log(fix);
        fix.forEach(f => {
          const t1Home = takeRight(filter(his, (st)=>st.team1==f.team1),5);
          const t2Away = takeRight(filter(his, (st)=>st.team2==f.team2),5);
          const ds = _.compact(_.concat(t1Home,t2Away));
        //  training set
        const data = ds.map((dt) => {
          const tr = {
            team1: dt.team1,
            team2: dt.team2,
            team1sqad: dt.team1sqad,
            team2sqad: dt.team2sqad,
            winner: dt.winner
          };
          return tr
        });
//         const playerCounts = {};

//         // Iterate over the data
//         for (const match of data) {
//           if (match.team1 === f.team1) {
//             // Iterate over the players in team1sqad for this match
//             for (const playerData of match.team1sqad) {
//               const playerName = playerData.player;
//               playerCounts[playerName] = (playerCounts[playerName] || 0) + 1;
//             }
//           }
//         }
        
//         // Find the most featured players
//         const maxCount = Math.max(...Object.values(playerCounts));
//         const mostFeaturedPlayers = Object.keys(playerCounts).filter(
//           playerName => playerCounts[playerName] === maxCount
//         );
        
//         console.log('Most featured players for ' + f.team1);
//         console.log(mostFeaturedPlayers);
//         console.log('Number of appearances:', maxCount);
// console.log(data)

// const squadCompositionChanges = [];

// // Helper function to calculate percentage change
// function calculatePercentageChange(initialCount, finalCount) {
//   return ((finalCount - initialCount) / initialCount) * 100;
// }

// // Iterate over the data
// const team1Data = data.filter(match => match.team1 === f.team1);
// for (let i = 1; i < team1Data.length; i++) {
//   const match1 = team1Data[i - 1];
//   const match2 = team1Data[i];

//   const squad1 = match1.team1sqad.map(playerData => playerData.player);
//   const squad2 = match2.team1sqad.map(playerData => playerData.player);

//   const uniquePlayers1 = new Set(squad1);
//   const uniquePlayers2 = new Set(squad2);

//   const playerCount1 = uniquePlayers1.size;
//   const playerCount2 = uniquePlayers2.size;

//   const changePercentage = calculatePercentageChange(playerCount1, playerCount2);
//   squadCompositionChanges.push(changePercentage);
// }

// console.log('Rate of change of squad composition (in %) between consecutive matches:');
// console.log(squadCompositionChanges);

// const playerCounts = {};

// // Iterate over the data
// const totalMatches = data.filter(match => match.team1 === f.team1).length;
// for (const match of data) {
//   if (match.team1 === f.team1) {
//     // Iterate over the players in team1sqad for this match
//     for (const playerData of match.team1sqad) {
//       const playerName = playerData.player;
//       playerCounts[playerName] = (playerCounts[playerName] || 0) + 1;
//     }
//   }
// }

// // Calculate the percentage for each player
// const playerPercentages = {};
// for (const playerName in playerCounts) {
//   const appearances = playerCounts[playerName];
//   const percentage = (appearances / totalMatches) * 100;
//   playerPercentages[playerName] = percentage.toFixed(2) + '%';
// }

// console.log('Player appearance percentages for:', f.team1);
// console.log(playerPercentages);

const playerCounts = {};
let totalPlayers = 0;

// Iterate over the data
const totalMatches = data.filter(match => match.team1 === f.team1).length;
for (const match of data) {
  if (match.team1 === f.team1) {
    // Iterate over the players in team1sqad for this match
    for (const playerData of match.team1sqad) {
      const playerName = playerData.player;
      playerCounts[playerName] = (playerCounts[playerName] || 0) + 1;
      totalPlayers++;
    }
  }
}

let totalPercentage = 0;

// Calculate the total percentage of appearances
for (const playerName in playerCounts) {
  const appearances = playerCounts[playerName];
  const percentage = (appearances / totalMatches) * 100;
  totalPercentage += percentage;
}

// Calculate the average percentage
const averagePercentage = totalPercentage / totalPlayers;

console.log('Average percentage at which the total squad appears per match for: '+ f.team1);
console.log(averagePercentage.toFixed(2) + '%');

        });
        
    } catch (error) {
        console.error("Error fetching data for one or more URLs:", error);
    }
}

// Call the function to fetch data for all URLs and merge the results
fetchAllData();
