const sqadval = [];
// Function to format a date as "YYYY-MM-DD"
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}
const Url = 'https://www.footballtransfers.com/us/values/actions/most-valuable-football-teams/overview';

async function fetchDataForPage(pageNumber) {
  const payload = new URLSearchParams({
    orderBy: 'total_current_player_value',
    orderByDescending: '1',
    page: pageNumber.toString(),
    pages: '0',
    pageItems: '25',
    continentId: 'all',
    countryId: 'all',
    tournamentId: 'all'
  });

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded', // Set the appropriate content type
    },
    body: payload.toString(),
  };

  try {
    const response = await fetch(Url, requestOptions);

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data; // Replace this with your data processing logic
  } catch (error) {
    console.error(`Error fetching data for page ${pageNumber}: ${error}`);
    throw error;
  }
}

async function fetchAllPages() {
  const totalPages = 54; // Set the total number of pages to fetch

  try {
    const promises = [];
    for (let page = 1; page <= totalPages; page++) {
      promises.push(fetchDataForPage(page));
    }

    const allPageData = await Promise.all(promises);
    // Process allPageData as needed (it will be an array of data from all pages)
    console.log(allPageData);
    const res = allPageData.map((rr) => {
        return rr.records
    })
   
    const mergeres = mergeResults(res);
    sqadval.push(mergeres)
  } catch (error) {
    console.error('Error fetching data for all pages:', error);
  }
}

fetchAllPages();

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
        console.log(sqd);
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
                // const msqd1 = mergedResults.map(sq1 => {
                //     const sqd1 = sqd.find(sq1 => sq1.team_name === r.team_score_a.team.name);
                //     if (sqd1) {
                //       return { ...r, ...sqd1 }; // Merge the objects
                //     } else {
                //       return r; // If there's no matching object in array2, use the object from array1
                //     };
                // });
                // const msqd2 = mergedResults.map(sq2 => {
                //     const sqd2 = sqd.find(sq2 => sq2.team_name === r.team_score_b.team.name);
                //     if (sqd2) {
                //       return { ...r, ...sqd2 }; // Merge the objects
                //     } else {
                //       return r; // If there's no matching object in array2, use the object from array1
                //     };
                // });
                // console.log(msqd2[0], r.team_score_b.team.name,);
            const rem = {
                state: r.state,
                date: r.match_date,
                time: r.match_time,
                league: r.competition.name,
                // leaguelogo: msqd1[0].tournament_image.file_url,
                team1: r.team_score_a.team.name,
                team2: r.team_score_b.team.name,
                // t1logo: msqd1[0].team_image,
                // t2logo: msqd2[0].team_image,
                // t1skill: msqd1[0].team_sciskill_smg,
                // t2skill: msqd2[0].team_sciskill_smg,
                // t2potn: msqd2[0].team_potential_smg,
                // t1potn: msqd1[0].team_potential_smg,
                FTscore1: r.full_time_score && typeof r.full_time_score.home !== 'undefined' && !Number.isNaN(r.full_time_score.home) ? r.full_time_score.home : 0,
                FTscore2: r.full_time_score && typeof r.full_time_score.away !== 'undefined' && !Number.isNaN(r.full_time_score.away) ? r.full_time_score.away : 0,
                HTscore1: r.half_time_score && typeof r.half_time_score.home !== 'undefined' && !Number.isNaN(r.half_time_score.home) ? r.half_time_score.home : 0,
                HTscore2: r.half_time_score && typeof r.half_time_score.away !== 'undefined' && !Number.isNaN(r.half_time_score.away) ? r.half_time_score.away : 0,
                rank1: r.homeLeagueStanding,
                rank2: r.awayLeagueStanding,
                // val1: msqd1[0].team_value,
                // val2: msqd2[0].team_value,
                winner: r.match_outcome && r.match_outcome.winner && typeof r.match_outcome.winner.name !== 'undefined' ? r.match_outcome.winner.name : 'Draw',
                result: r.match_outcome.outcome,
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
        // console.log(remap);
        
        const his  = filter(remap, (re)=>re.state=="FULLTIME")
        const fix  = filter(remap, (re)=>re.date>=today)
        console.log(his);
        // console.log(fix);
        fix.forEach(f => {
         const leagueMatches = filter(his, (hs)=>hs.league==f.league);
         const tot = sum([f.FTscore1,f.FTscore2]);
         const t1Home = filter(leagueMatches, (hs)=>hs.team1==f.team1);
         const t1Away = filter(leagueMatches, (hs)=>hs.team2==f.team1);
         const t1matches = concat(t1Home,t1Away);
         const t1Won = filter(t1matches, (hs)=>hs.winner == f.team1);
         const t1Lost = filter(t1matches, (hs)=>hs.result=="WIN" && hs.winner!==f.team1);
         const t1Drw = filter(t1matches, (hs)=>hs.result=="DRAW");
         const t1GfHome = sum(map(t1Home,(hs)=>hs.FTscore1));
         const t1GfAway = sum(map(t1Away,(hs)=>hs.FTscore2));
         const t1Gf = sum([t1GfHome,t1GfAway]);
         const t1GaHome = sum(map(t1Home,(hs)=>hs.FTscore2));
         const t1GaAway = sum(map(t1Away,(hs)=>hs.FTscore1));
         const t1Ga = sum([t1GaHome,t1GaAway]);
         const t1PTS = sum([t1Won.length*3,t1Drw.length])
        //  console.log(t1PTS);
        });
        
    } catch (error) {
        console.error("Error fetching data for one or more URLs:", error);
    }
}

// Call the function to fetch data for all URLs and merge the results
fetchAllData();



// for the sharps
const sqadval = [];
// Function to format a date as "YYYY-MM-DD"
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}
const Url = 'https://www.footballtransfers.com/us/values/actions/most-valuable-football-teams/overview';
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
            const rem = {
                state: r.state,
                date: r.match_date,
                time: r.match_time,
                league: r.competition.name,
                team1: r.team_score_a.team.name,
                team2: r.team_score_b.team.name,
                FTscore1: r.full_time_score && typeof r.full_time_score.home !== 'undefined' && !Number.isNaN(r.full_time_score.home) ? r.full_time_score.home : '-',
                FTscore2: r.full_time_score && typeof r.full_time_score.away !== 'undefined' && !Number.isNaN(r.full_time_score.away) ? r.full_time_score.away : '-',
                HTscore1: r.half_time_score && typeof r.half_time_score.home !== 'undefined' && !Number.isNaN(r.half_time_score.home) ? r.half_time_score.home : '-',
                HTscore2: r.half_time_score && typeof r.half_time_score.away !== 'undefined' && !Number.isNaN(r.half_time_score.away) ? r.half_time_score.away : '-',
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
                            };}),};}),
                team2scorer: r.awayGoals && r.awayGoals.map(scorer => {
                    return {
                        scorer: scorer.team_player,
                        goals: scorer.goal.map(goal => {
                            return {
                                type: goal.type,
                                time: goal.time,
                            };}),};}),
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
                    };}),};
            return rem;
        });
        // console.log(remap);
        const his  = filter(remap, (re)=>re.state=="FULLTIME")
        const fix  = filter(remap, (re)=>re.date>=yesterday)
        // console.log(his);
        console.log(fix);
        const container = document.getElementById('container');
        // container.innerHTML = '';  // Clear the container if needed
        fix.forEach(f => {
            // league stats
          const leaguePL = takeRight(filter(his, (st)=>st.league==f.league));
          const t1Home = takeRight(filter(his, (st)=>st.team1==f.team1));
          const t1Away = takeRight(filter(his, (st)=>st.team2==f.team1));
          const t1PL = _.concat(t1Home,t1Away);
          const t2Home = takeRight(filter(his, (st)=>st.team1==f.team2));
          const t2Away = takeRight(filter(his, (st)=>st.team2==f.team2));
          const t2PL = _.concat(t2Home,t2Away);
          const ds = _.compact(_.concat(t1Home,t1Away,t2Home,t2Away));
          // team1 Stats
          const team1WH = filter(t1Home, (st)=>st.winner==f.team1)
          const team1WA = filter(t1Away, (st)=>st.winner==f.team1)
          const team1LH = filter(t1Home, (st)=>st.FTscore2>st.FTscore1)
          const team1LA = filter(t1Away, (st)=>st.FTscore2<st.FTscore1)
          const team1DH = filter(t1Home, (st)=>st.winner=="Draw")
          const team1DA = filter(t1Away, (st)=>st.winner=="Draw")
          const team1GFH = _.sum(map(t1Home, (st)=> _.toNumber(st.FTscore1)))
          const team1GFA = _.sum(map(t1Away, (st)=> _.toNumber(st.FTscore2)))
          const team1GAH = _.sum(map(t1Home, (st)=> _.toNumber(st.FTscore2)))
          const team1GAA = _.sum(map(t1Away, (st)=> _.toNumber(st.FTscore1)))
          const team1GF = _.sum([team1GFH,team1GFA])
          const team1GA = _.sum([team1GAH,team1GAA])
          const team1AvGF = _.ceil(team1GF/t1PL.length,2)
          const team1AvGA = _.ceil(team1GA/t1PL.length,2)
          // team2 Stats
          const team2WH = filter(t2Home, (st)=>st.winner==f.team2)
          const team2WA = filter(t2Away, (st)=>st.winner==f.team2)
          const team2LH = filter(t2Home, (st)=>st.FTscore2>st.FTscore1)
          const team2LA = filter(t2Away, (st)=>st.FTscore2<st.FTscore1)
          const team2DH = filter(t2Home, (st)=>st.winner=="Draw")
          const team2DA = filter(t2Away, (st)=>st.winner=="Draw")
          const team2GFH = _.sum(map(t2Home, (st)=> _.toNumber(st.FTscore1)))
          const team2GFA = _.sum(map(t2Away, (st)=> _.toNumber(st.FTscore2)))
          const team2GAH = _.sum(map(t2Home, (st)=> _.toNumber(st.FTscore2)))
          const team2GAA = _.sum(map(t2Away, (st)=> _.toNumber(st.FTscore1)))
          const team2GF = _.sum([team2GFH,team2GFA])
          const team2GA = _.sum([team2GAH,team2GAA])
          const team2AvGF = _.ceil(team2GF/t2PL.length,2)
          const team2AvGA = _.ceil(team2GA/t2PL.length,2)
        


          console.log(team1AvGF);
// Helper function to calculate player appearances and percentages
function calculatePlayerAppearancesAndPercentages(matches, squad, teamName) {
    const playerAppearances = new Map();
    const totalMatches = matches.length;
    matches.forEach(match => {
        const isHomeMatchForTeam = match.team1 === teamName;
        const isAwayMatchForTeam = match.team2 === teamName;
        if (isHomeMatchForTeam || isAwayMatchForTeam) {
            const relevantSquad = isHomeMatchForTeam ? match.team1sqad : match.team2sqad;
            relevantSquad.forEach(player => {
                const playerName = player.player;
                playerAppearances.set(playerName, (playerAppearances.get(playerName) || 0) + 1);
            });
        }
    });
    const playerPercentages = new Map();
    playerAppearances.forEach((appearances, playerName) => {
        playerPercentages.set(playerName, (appearances / totalMatches) * 100);
    });
    return playerPercentages;
}
// Helper function to calculate the mean percentage
function calculateMeanPercentage(percentages) {
    const totalPlayers = percentages.length;
    const meanPercentage = percentages.reduce((sum, percentage) => sum + percentage, 0) / totalPlayers;
    return meanPercentage;
}
const team1HomePlayerPercentages = calculatePlayerAppearancesAndPercentages(t1Home, t1Home.flatMap(match => match.team1sqad.map(player => player.player)), f.team1);
const team1AwayPlayerPercentages = calculatePlayerAppearancesAndPercentages(t1Away, t1Away.flatMap(match => match.team2sqad.map(player => player.player)), f.team1);
const team2HomePlayerPercentages = calculatePlayerAppearancesAndPercentages(t2Home, t2Home.flatMap(match => match.team1sqad.map(player => player.player)), f.team2);
const team2AwayPlayerPercentages = calculatePlayerAppearancesAndPercentages(t2Away, t2Away.flatMap(match => match.team2sqad.map(player => player.player)), f.team2);
const meanPercT1Home = calculateMeanPercentage(Array.from(team1HomePlayerPercentages.values()));
const meanPercT1Away = calculateMeanPercentage(Array.from(team1AwayPlayerPercentages.values()));
const meanPercT2Home = calculateMeanPercentage(Array.from(team2HomePlayerPercentages.values()));
const meanPercT2Away = calculateMeanPercentage(Array.from(team2AwayPlayerPercentages.values()));
const meanTeam1 = _.ceil(_.mean([meanPercT1Home,meanPercT1Away]),2);
const meanTeam2 = _.ceil(_.mean([meanPercT2Home,meanPercT2Away]),2);

// Algos
const XGFH = team1AvGF/(100/meanTeam1)
const XGAH = team1AvGA/(100/meanTeam1)
const XGFA = team2AvGF/(100/meanTeam2)
const XGAA = team2AvGA/(100/meanTeam2)
const XGH = _.ceil(XGFH*XGAA,2)
const XGA = _.ceil(XGFA*XGAH,2)
console.log(XGH,'--',XGA)


const card = document.createElement('div');
// card.id = 'card';
const formattedDate = new Date(f.date).toLocaleDateString();
const html = `
<div class="card">
        <div class="header">
            <div class="league">${f.league}</div>
            <div class="date">${formattedDate}</div>
            <div class="time">${f.time}</div>
        </div>
        <div class="teams">
            <div class="team">${f.team1}</div>
            <div class="vs">vs</div>
            <div class="team">${f.team2}</div>
        </div>
        <div class="perc">${XGH} AV ${XGA}</div>
        <div class="score">${f.FTscore1} - ${f.FTscore2}</div>
        <div class="info">
            <div class="info-item">Ranking: ${f.team1} : ${f.rank1}, ${f.team2} : ${f.rank2}</div>
        </div>
    </div>
`;
container.innerHTML += html;
        });
        
    } catch (error) {
        console.error("Error fetching data for one or more URLs:", error);
    }
}
// Call the function to fetch data for all URLs and merge the results
fetchAllData();
