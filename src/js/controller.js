'use strict';

//Note: to use live server extension for development, you need to change the folder name in the setting of workspace which starts like this: " Live Server › Settings: Multi Root Workspace Name This the entry point of server when you're in multiroot workspace ". there you need to change the name of the file from 'allexamstable project' to 'd3js charting' folder name. 


import {csv} from 'd3';



if(module.hot){
    module.hot.accept();
};


// const csvDataPath='./../../data/sampletestingdata.csv';// SuperVIE this way of passing the address is important as it is less error prone and helps bundler to find the file. Absolute address are not allowed for security reason. 

const csvDataPath = [
    '.',  // This refers to the current directory
    '..', // This refers to the parent directory
    '..', // This goes up one more level
    'data', // Then it goes into the 'data' folder
    'sampletestingdata.csv' // Finally, the CSV file
].join('/');// Remember ItJust Beautiful this is how we make a address more clean for maintainance.


console.log(csvDataPath);

    csv(csvDataPath).then(data =>{console.log(data);
    });
