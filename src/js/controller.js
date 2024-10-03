'use strict';

//Note: to use live server extension for development, you need to change the folder name in the setting of workspace which starts like this: " Live Server › Settings: Multi Root Workspace Name This the entry point of server when you're in multiroot workspace ". there you need to change the name of the file from 'allexamstable project' to 'd3js charting' folder name. 


import {csv, 
        select,
        selectAll,
        svg,
        scaleLinear,
        scalePoint,
        scaleOrdinal,
        scalePow,
        scaleBand,
        extent,
        axisBottom,
        axisLeft,
        min,
        max,
} from 'd3';


/*SuperNote:-
    1️⃣ScaleLinear: it sets the linear function between Domain and Range. Domain: is the sample space from where the input to a function is possible. Range: is the sample space, only within which, the output to the function is possible.  
    2️⃣ ScalePoint: is used to plot the values which are strings.
    3️⃣ScaleOrdinal:
    4️⃣ScalePow: is used to set exponential relation in function between Domain and Range. 
    5️⃣extent: returns an array after processing an array of values. This array has two value, one max and other min. 
    6️⃣
    7️⃣
    8️⃣
    9️⃣
    🔟
*/

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

const parseRow = (d)=>{
    d.exam_year=+d.exam_year;
    d.exam_tier=+d.exam_tier;
    d.zone_score=+d.zone_score;
    d.state_score=+d.state_score;
    d.city_score=+d.city_score;
    d.zone_name=d.zone_name;
    d.state_name=d.state_name;
    d.city_name=d.city_name;
    return d;
};
// csv(csvDataPath, parseRow).then(data =>{console.log(data);});// Code Testing

//VIE Now i will define "Accessor functions". They are used to set value in "Idempotent style" of programming. In this, we program in a manner that user need not remember the "order and number of parameter" to be given to the function. You can pass the parameters in much more fluid manner, not totally fluid, but fluid to a great extent. They are very useful in largescale programming.
const xCoordinate = (d) => d.zone_name;
const yCoordinate = (d) => d.zone_score;

// Here we are alloting margin around the charing area which will come after this. 
const margin = {top:30, right:30, bottom:30, left:100,};

// here we are declaring the area where chart shall be made
const width=window.innerWidth;
const height=window.innerHeight;
const svg1= select('body').append('svg').attr('width',width).attr('height',height);

const main = async () =>{
    const dataExtracted =await csv(csvDataPath, parseRow); 
    // console.log(dataExtracted);//Code Testing

    // now i will first generate the X coordinate and Y coordinate for the center of the circles, and then radious of the circle that will be used in scatter plot
    const xCoordinateOfCenter=scalePoint().domain(extent(dataExtracted,xCoordinate)).range([margin.left,width-margin.right]);//Issue Found this scale function has to be tuned to handle name.
    
    //legacy code const yCoordinateOfCenter=scaleLinear().domain([
    //     d3.min(dataExtracted, yCoordinate), 
    //     d3.max(dataExtracted,yCoordinate)]);
    //code upgrade👇
    const yCoordinateOfCenter=scaleLinear().domain(extent(dataExtracted,yCoordinate)).range([height-margin.bottom,margin.top]);
    // console.log(yCoordinateOfCenter.domain());//Code Testing 
    

    // Now we will process the data and create marks that has to be plotted using the scale of the Axis for the chart that we calcuted just above in xCoordinateOfCenter function(yes, it is a function Take A Good Look), yCoordinateOfCenter function.
    const marks= dataExtracted.map(d =>({
        x: xCoordinateOfCenter(xCoordinate(d)),
        y: yCoordinateOfCenter(yCoordinate(d)),
    }));
    console.log(marks);//Code Testing
    

    // svg1.selectAll('circle').data(dataExtracted).join('circle').attr('cx');
    svg1.selectAll('circle').data(marks).join('circle').attr('cx', d=> d.x).attr('cy', d=> d.y).attr('r',5);

    svg1.append('g').attr('transform',`translate(${margin.left},0)`).call(axisLeft(yCoordinateOfCenter));

    svg1.append('g').attr('transform',`translate(0,${height-margin.bottom})`).call(axisBottom(xCoordinateOfCenter));
};
main();


