'use strict';

//Note: to use live server extension for development, you need to change the folder name in the setting of workspace which starts like this: " Live Server › Settings: Multi Root Workspace Name This the entry point of server when you're in multiroot workspace ". there you need to change the name of the file from 'allexamstable project' to 'd3js charting' folder name. 


import {csv, 
        select,
        svg,
} from 'd3';



if(module.hot){
    module.hot.accept();
};


// const csvDataPath='./../../data/sampletestingdata.csv';// SuperVIE this way of passing the address is important as it is less error prone and helps bundler to find the file. Absolute address are not allowed for security reason. 

// const csvDataPath = [
//     '.',  // This refers to the current directory
//     '..', // This refers to the parent directory
//     '..', // This goes up one more level
//     'data', // Then it goes into the 'data' folder
//     'sampletestingdata.csv' // Finally, the CSV file
// ].join('/');// Remember ItJust Beautiful this is how we make a address more clean for maintainance.

import csvDataPath from './../../data/sampletestingdata.csv'; // Let Parcel handle asset


// console.log(csvDataPath);// Code Testing.
// csv(csvDataPath, parseRow).then(data =>{console.log(data);});// Code Testing

const parseRow = (d)=>{
d.exam_year=+d.exam_year;
d.exam_tier=+d.exam_tier;
d.zone_score=+d.zone_score;
d.state_score=+d.state_score;
d.city_score=+d.city_score;
    return d;
};

const width=window.innerWidth;
const height=window.innerHeight;
const svg1= select('body').append('svg').attr('width',width).attr('height',height);

const main = async () =>{
    const dataExtracted =await csv(csvDataPath, parseRow); 
};
main();


