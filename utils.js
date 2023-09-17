// Function to format a date as "YYYY-MM-DD"
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  // Get the current date
  const currentDate = new Date();
  
  // Calculate dates
  const yesterdayDate = new Date(currentDate);
  yesterdayDate.setDate(currentDate.getDate() - 1);
  const tomorrowDate = new Date(currentDate);
  tomorrowDate.setDate(currentDate.getDate() + 1);
  const past7DaysDate = new Date(currentDate);
  past7DaysDate.setDate(currentDate.getDate() - 7);
  const next7DaysDate = new Date(currentDate);
  next7DaysDate.setDate(currentDate.getDate() + 7);
  
  // Format the dates
  const today = formatDate(currentDate);
  const yesterday = formatDate(yesterdayDate);
  const tomorrow = formatDate(tomorrowDate);
  const past7Days = formatDate(past7DaysDate);
  const next7Days = formatDate(next7DaysDate);

console.log(today); // Output: "2023-09-10"


// map function
function map(collection, mapper) {
    if (!Array.isArray(collection)) {
        throw new Error('Input must be an array.');
    }

    const result = [];

    for (let i = 0; i < collection.length; i++) {
        result.push(mapper(collection[i], i, collection));
    }

    return result;
}
// filter function
function filter(collection, filterCriteria) {
    if (!Array.isArray(collection) && typeof collection !== 'object') {
        throw new Error('Collection must be an array or object.');
    }

    const result = [];

    if (typeof filterCriteria === 'function') {
        // Predicate-based filtering
        for (const key in collection) {
            if (collection.hasOwnProperty(key)) {
                const value = collection[key];
                if (filterCriteria(value, key, collection)) {
                    if (Array.isArray(collection)) {
                        result.push(value);
                    } else {
                        result[key] = value;
                    }
                }
            }
        }
    } else if (typeof filterCriteria === 'object') {
        // Object-based filtering
        for (const key in collection) {
            if (collection.hasOwnProperty(key)) {
                const value = collection[key];
                if (isObjectMatch(value, filterCriteria)) {
                    if (Array.isArray(collection)) {
                        result.push(value);
                    } else {
                        result[key] = value;
                    }
                }
            }
        }
    }

    return result;
}

function isObjectMatch(obj, filterObject) {
    for (const key in filterObject) {
        if (filterObject.hasOwnProperty(key)) {
            if (obj[key] !== filterObject[key]) {
                return false;
            }
        }
    }
    return true;
}
//   examples
// const users = [
//     { 'user': 'barney', 'age': 36, 'active': true },
//     { 'user': 'fred',   'age': 40, 'active': false }
//   ];

//   // Predicate-based filtering
//   const activeUsers = filter(users, (user) => user.active);
//   console.log(activeUsers);

//   // Object-based filtering
//   const filteredUsers = filter(users, { 'age': 36, 'active': true });
//   console.log(filteredUsers);



// findfunction
function find(collection, searchCriteria) {
    if (!Array.isArray(collection) && typeof collection !== 'object') {
        throw new Error('Collection must be an array or object.');
    }

    if (typeof searchCriteria === 'function') {
        // Predicate-based search
        for (const key in collection) {
            if (collection.hasOwnProperty(key)) {
                const value = collection[key];
                if (searchCriteria(value, key, collection)) {
                    return value;
                }
            }
        }
    } else if (typeof searchCriteria === 'object') {
        // Object-based search
        for (const key in collection) {
            if (collection.hasOwnProperty(key)) {
                const value = collection[key];
                if (isObjectMatch(value, searchCriteria)) {
                    return value;
                }
            }
        }
    }

    return undefined;
}

function isObjectMatch(obj, searchObject) {
    for (const key in searchObject) {
        if (searchObject.hasOwnProperty(key)) {
            if (obj[key] !== searchObject[key]) {
                return false;
            }
        }
    }
    return true;
}
//   examples
//   const users = [
//     { 'user': 'barney', 'age': 36, 'active': true },
//     { 'user': 'fred',   'age': 40, 'active': false }
//   ];

//   // Predicate-based search
//   const foundUser1 = customFind(users, (user) => user.age > 35);
//   console.log(foundUser1); // Output: { 'user': 'barney', 'age': 36, 'active': true }

//   // Object-based search
//   const foundUser2 = customFind(users, { 'age': 36, 'active': true });
//   console.log(foundUser2); // Output: { 'user': 'barney', 'age': 36, 'active': true }

// take function: Returns the first n elements of an array.
function take(array, n = 1) {
    if (!Array.isArray(array)) {
        throw new Error('Input must be an array.');
    }

    const length = array.length;
    if (n <= 0 || length === 0) {
        return [];
    }

    const endIndex = Math.min(n, length);
    const result = [];

    for (let i = 0; i < endIndex; i++) {
        result.push(array[i]);
    }

    return result;
}

// takeRight function: Returns the last n elements of an array.
function takeRight(array, n = 1) {
    if (!Array.isArray(array)) {
        throw new Error('Input must be an array.');
    }

    const length = array.length;
    if (n <= 0 || length === 0) {
        return [];
    }

    const startIndex = Math.max(length - n, 0);
    const result = [];

    for (let i = startIndex; i < length; i++) {
        result.push(array[i]);
    }

    return result;
}

// apply default value
function fallback(value, defaultValue) {
    return typeof value !== 'undefined' ? value : defaultValue;
}

// concat function
function concat(...arrays) {
    if (arrays.length === 0) {
      return [];
    }
  
    const result = [];
  
    for (let i = 0; i < arrays.length; i++) {
      if (Array.isArray(arrays[i])) {
        for (let j = 0; j < arrays[i].length; j++) {
          result.push(arrays[i][j]);
        }
      } else {
        result.push(arrays[i]);
      }
    }
  
    return result;
  }

//   adder
function sum(arr) {
    if (!Array.isArray(arr)) {
      throw new Error('Input must be an array.');
    }
  
    return arr.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  }
// Function to merge all results into a single array
function mergeResults(resultsArray) {
    return resultsArray.reduce((merged, data) => {
        return merged.concat(data);
    }, []);
}

// get value of object path
function getVal(obj, path) {
    const pathArray = path.split('.');
    let current = obj;
  
    for (const key of pathArray) {
      if (current && current.hasOwnProperty(key)) {
        current = current[key];
      } else {
        return undefined; // Return undefined if the path doesn't exist
      }
    }
  
    return current;
  }
  
//   fuzzy
function fuzzyMatch(obj1, obj2, key1, key2, threshold = 0.6) {
    if (obj1[key1] === obj2[key1] && obj1[key2] === obj2[key2]) {
      return 1; // Objects are identical
    }
  
    const matchingPairs = (obj1[key1] === obj2[key1]) + (obj1[key2] === obj2[key2]);
    const similarity = matchingPairs / 2;
  
    return similarity >= threshold ? similarity : 0;
  }
  
  function fuzzyMerge(arr1, arr2, key1, key2, threshold = 0.6) {
    const mergedArray = [];
  
    for (const obj1 of arr1) {
      for (const obj2 of arr2) {
        const similarity = fuzzyMatch(obj1, obj2, key1, key2, threshold);
  
        if (similarity >= threshold) {
          // Merge the two objects into a new object in the mergedArray
          const mergedObj = { ...obj1, ...obj2 };
          mergedArray.push(mergedObj);
        }
      }
    }
  
    return mergedArray;
  }
  