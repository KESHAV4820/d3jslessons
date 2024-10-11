'use strict'

import {selectAll,
    svg,
    scaleLinear,
    scalePoint,
    scaleOrdinal,
    scalePow,
    scaleSqrt,
    scaleBand,
    scaleTime,
    extent,
    axisBottom,
    axisLeft,
    min,
    max,
    format
} from 'd3';

const commaFormat = format(',');// this adds comma separator

export const scatterPlot = () => {
    let width,height;
    let dataReceived;
    let xCoordinate,yCoordinate;
    let margin;
    let minRadius,maxRadius;// we are using let not const becouse these variables are susceptible to changes for proper functioning of the application.  
    
    // console.log('rValueCalculated:', rValueCalculated);// Code Testing

    const rValueCalculated= (d) => {
        return d.zone_score/1000;
    };

    //my() function is he place where it sets up all the selections like svg1 and does all the transformation needed using getter, setter functions, local declared variables. 
    const my = (svg1) => {

        // now i will first generate the X coordinate and Y coordinate for the center of the circles, and then radious of the circle that will be used in scatter plot
    const xCoordinateOfCenter=scaleLinear().domain(extent(dataReceived,xCoordinate)).range([margin.left,width-margin.right]);//Issue Found this scale function has to be tuned to handle name.
    
    //legacy code const yCoordinateOfCenter=scaleLinear().domain([
    //     d3.min,dataReceived, yCoordinate), 
    //     d3.max,dataReceived,yCoordinate)]);
    //code upgrade👇
    const yCoordinateOfCenter=scaleLinear().domain(extent(dataReceived,yCoordinate)).range([height-margin.bottom,margin.top]);//Concept if you want to start your scale with 0, then you can write into .domain() like .domain([0, d3.max,dataReceived,YCoordinate)]); For example in barchart, we always start from 0.
    // console.log(yCoordinateOfCenter.domain());//Code Testing 
    
    const rOfPlotCircle=scaleSqrt().domain([0,max(dataReceived,rValueCalculated)]).range([minRadius,maxRadius]);

    // Now we will process the data and create marks that has to be plotted using the scale of the Axis for the chart that we calcuted just above in xCoordinateOfCenter function(yes, it is a function Take A Good Look), yCoordinateOfCenter function.
    // console.log('Creating marks. rValueCalculated type:', typeof rValueCalculated);//Code Testing
    const marks=dataReceived.map(d =>{
        console.log('Processing data point:', d);//Code Testing
        console.log('rValueCalculated(d):', rValueCalculated(d));//Code Testing
        return {
        x: xCoordinateOfCenter(xCoordinate(d)),
        y: yCoordinateOfCenter(yCoordinate(d)),
        title: `(${commaFormat(xCoordinate(d))},${commaFormat(yCoordinate(d))})`,// this will let us know the value on the point.
        r: rOfPlotCircle(rValueCalculated(d)),
        };
    });
    console.log(marks);//Code Testing
    

    // svg1.selectAll('circle').data,dataReceived).join('circle').attr('cx');
    svg1.selectAll('circle').data(marks).join('circle').attr('cx', d=> d.x).attr('cy', d=> d.y).attr('r',(d) => d.r).append('title').text(d=>d.title);

    // putting y and x axis in the chart. 
    svg1.append('g').attr('transform',`translate(${margin.left},0)`).call(axisLeft(yCoordinateOfCenter));
    /*QuickNote
    this same code can also be written as the following:-
    axisLeft(yCoordinateOfCenter)(svg1.append('g').attr('transform',`translate(${margin.left},0)`));
    The above example shows that there are many functions that gives access to another function in D3.js. So mind the structure like fun()(). it is correct. 
    */ 

    svg1.append('g').attr('transform',`translate(0,${height-margin.bottom})`).call(axisBottom(xCoordinateOfCenter));

    };


    // Now defining getter and setter functions for above my();
    my.height=function(_){
        return arguments.length?(height = +_, my):height;
    }; 
    /*SuperNoteMarvel
    Note that we are using this expression from d3.js axis documentation.Super There they had used underscore _ as the name of the variable in getter, setter function. Hence, i am using it as well. Not get bothered. It's just being used as variable name.LearnByHeartTake A Good LookRemember It ➡️"height = +_, my" this expression has a great Concept hidden in it. There is implicit return involved in it. That is inside a ternarry operation, like (condition)?(expression1, expression2):(); when "condition" is checked, if the condition is found true, then (expression1,expression2) section is executed. now SuperNoteVIE "expression1" is calculated and "expression2" is always returned IMPLICITLY. That's how this construct works in JS , this property is to facilitate method chaining.LearnByHeartJust Beautiful
    */ 
    /*SuperNoteConcept 
    ⭐ we can't use arrow function in getter , setter funtion becouse "argument" parameter object isn't defined.(Remember It "arguments" is as special keyword in JS .) like if you say let f= ()=> console.log(arguments); the output will give error that arguments isn't defined. but if you use old school function syntax like let f = function() {console.log(arguments)}, this will not throw error. it will only say that arugments is undefined. if you pass f(1,2,3), then the output will be Arguments(3)[1,2,3]. How ever, there is a work around this limitation.
    ⭐ Just BeautifulTake A Good Look did you notice the sytex of getter setter function. you may feel that it's like function and your  brain get tricked into thinking that it's function declaration syntex. But, it's not. 
    RHS➡️VIENote look like old school function declaration and it is. Correct. 
    LHS➡️Super here is the change. Normally there is syntex like const fun1 where fun1 is the name of the function. but in getter setter function, it's like my.data where 'my' is the name of the function whose getter or setter function it is being declared which deals with assigning or showing the value of the variable named 'data'. 
    */
    my.width=function(_){
        return arguments.length?((width = +_), my):width;
    };

    my.dataReceived=function(_){
        return arguments.length?((dataReceived = _), my):dataReceived;
    };

    my.xCoordinate=function(_){
        return arguments.length?((xCoordinate = _), my):xCoordinate;
    };

    my.yCoordinate=function(_){
        return arguments.length?((yCoordinate = _), my):yCoordinate;
    };

    my.margin=function(_){
        return arguments.length?((margin = _), my):margin;
    };

    my.minRadius=function(_){
        return arguments.length?((minRadius = +_), my):minRadius;
    };

    my.maxRadius=function(_){
        return arguments.length?((maxRadius = +_), my):maxRadius;
    }; 

    return my;
};