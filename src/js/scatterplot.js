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
    format,
    symbols,
    symbol,
    timeFormat,
    transition,
    easeLinear
} from 'd3';

const commaFormat = format(',');// this adds comma separator

export const scatterPlot = () => {
    let width,height;
    let dataReceived;
    let xCoordinate,yCoordinate;
    let margin;
    let minRadius,maxRadius;
    let yAxisLabel="candidates count";
    let xAxisLabel="Zones";
    let symbolValue, size;// we are using let not const becouse these variables are susceptible to changes for proper functioning of the application.  
    
    // console.log('rValueCalculated:', rValueCalculated);// Code Testing

    const rValueCalculated= (d) => {
        return d.zone_score/1000;
    };

    //my() function is he place where it sets up all the selections like svg1 and does all the transformation needed using getter, setter functions, local declared variables. 
    const my = (svg1) => {

        // now i will first generate the X coordinate and Y coordinate for the center of the circles, and then radious of the circle that will be used in scatter plot
    const xCoordinateOfCenter=scaleLinear().domain(extent(dataReceived,xCoordinate)).range([margin.left,width-margin.right]);//Issue Found this scale function has to be tuned to handle name.
    console.log(dataReceived);
    
    
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
        // console.log('Processing data point:', d);//Code Testing
        // console.log('rValueCalculated(d):', rValueCalculated(d));//Code Testing
        return {
        x: xCoordinateOfCenter(xCoordinate(d)),
        y: yCoordinateOfCenter(yCoordinate(d)),
        title: `(${commaFormat(xCoordinate(d))},${commaFormat(yCoordinate(d))})`,// this will let us know the value on the point.
        r: rOfPlotCircle(rValueCalculated(d)),
        };
    });
    console.log(marks);//Code Testing
    

    // svg1.selectAll('circle').data,dataReceived).join('circle').attr('cx');
/*code upgrade 👇🏼
    .data(marks)
        .join('circle')
        // .transition()// SuperNoteEariler version of D3.js used to return selection object. On which you can used append() funtion. But now, it's no more the case. Becouse it returns it's own transition related object which doesn't have access to .append(). Hence we need to break the implementation like below.
        .attr('cx', d=> d.x)
        .attr('cy', d=> d.y)
        .attr('r',(d) => d.r)
        .append('title')
        .text(d=>d.title);
    */

        const positionCircles = (circleCoordinates) => {	
        circleCoordinates.attr('cx',(d) => d.x)
                         .attr('cy', (d) => d.y);
    	}

        const t=transition().duration(1000);
                            // .ease(easeLinear);
/*VIEConcept: transition model
        enter => enter.append("text")
            .attr("fill", "green")
            .attr("x", (d, i) => i * 16)
            .attr("y", -30)
            .text(d => d)
          .call(enter => enter.transition(t)
            .attr("y", 0)),//when data is added
        update => update
            .attr("fill", "black")
            .attr("y", 0)
          .call(update => update.transition(t)
            .attr("x", (d, i) => i * 16)),// when data point simply changes position
        exit => exit
            .attr("fill", "brown")
          .call(exit => exit.transition(t)
            .attr("y", 30)
            .remove()// when data point has to be removed.
*/
    
        const circlePlotted=svg1.selectAll('circle')
        .data(marks)
        .join(enter =>enter.append('circle')
                        //    .attr('cx', d=> d.x)
                        //    .attr('cy', d=> d.y)
                           .call(positionCircles)
                           .attr('r',0)
                           .call(enter => enter.transition(t))//Concept Note this pattern of using .call(). Explained👇🏼 at ⭐1️⃣.
                           .attr('r',(d) => d.r)
                           .append('title')
                           .text(d => d.title),
/*⭐1️⃣ VIE see transition() returns a transition object which
 is not selection object which in our case is svg1. but if you want to chain some method or attribute like ⚡append() or ⚡selectAll() or ⚡data() next to it, what will you do? Concept .call() always return the selection object. so you need to use .call() on the object/parameters after which you want to be sure to use the method chaining. Hence to append() which we can't do on default transition() object returned, we called .call() on it and now we get selection object on which append() will work.😎 Remember that transition and selection object has only few methods in common like .attr(), .style(), .text(), .html(), .on(), .call().
 */ 
        
        update=> update.call((update) => update.transition(t).delay((d,i) => i*10)
                     .call(positionCircles)
                    //  .attr('cx', d=> d.x)
                    //  .attr('cy', d=> d.y)
                     .attr('r',(d) => d.r),
                    ).append('title')
                     .text(d => d.title),

        exit => exit.remove())
        .attr('r',0);


    // putting y and x axis in the chart. 
    const yAxisG=svg1.selectAll('g.y-axis')
                     .data([null])// this data([null]) is just to signify that we want one 1️⃣ thing, not null, not 2, but one thing. 
                     .join('g')
                     .attr('class','y-axis')//Note this class id is actually used to differentiate between element named y-axis and other classes. If this class specialization was missing, then after setting up the y axis using 'g' insider tag, and doing all the formating on it as instructed,it will move on to making another element lets say x axis. there it will use 'g' tag as well. Now since there isn't specialised class name or no name at all, it will overwrite the same old g element and make x axis on it. Now y axis  is lost. ⭐. that's why. 
                     .attr('transform',`translate(${margin.left},0)`);
                     
            yAxisG.transition(t)
                  .call(axisLeft(yCoordinateOfCenter));
    /*QuickNote
    this same code can also be written as the following:-
    axisLeft(yCoordinateOfCenter)(svg1.append('g').attr('transform',`translate(${margin.left},0)`));
    The above example shows that there are many functions that gives access to another function in D3.js. So mind the structure like fun()(). it is correct. 
    */ 
          /*code upgrade 👇🏼👇🏼 to add the lable name such that it doesn't get over written every time the new rendering has to happen in said time interval. 
            yAxisG.append('text')
                .attr('class', 'axis-label')
                .attr('y', -97)
                .attr('x', -height/2)
                .attr('fill', 'black')
                .attr('transform', `rotate(-90)`)
                .attr('text-anchor','middle')
                .text(yAxisLabel);// this code puts the name on the axis and formates the look of the names.
                */
            yAxisG.selectAll('.y-axis-label')
                  .data([null])
                  .join('g')
                  .append('text')//SuperVIENote this position on .append('text') is very important. we are appending the text on the single group element created using y-axis-label
                  .attr('class','y-axis-label')
                  .attr('transform',`rotate(-90)`)
                  .attr('y', -97).attr('x', -height/2)
                  .attr('fill', 'black')
                  .attr('text-anchor','middle')
                  .text(yAxisLabel);//Issue Found that transition(t) not working on this. 
            yAxisG.select('.y-axis-label')
                  .transition(t)
                  .attr('y', -97)
                  .attr('x', -height/2);

    const xAxisG=svg1.selectAll('g.x-axis')
                     .data([null])
                     .join('g')
                     .attr('class','x-axis')
                     .attr('transform',
            `translate(0,${height-margin.bottom})`
                    );
            xAxisG.transition(t)
                  .call(axisBottom(xCoordinateOfCenter));// here .ticks(13).tickFormate(timeFormat('%b')) with axisBottom() in this case to latch it with the "xAxisG" is used to set time formate. you can see time formates by googling for d3 time formate.

    /*code upgrade👇🏼
    // xAxisG.append('text')
    // .attr('class', 'axis-label')
    // .attr('y', 55)
    // .attr('x', 580)
    // .attr('fill', 'black')
    // .attr('text-anchor','middle')
    // .text(xAxisLabel);
    */
            xAxisG.selectAll('.x-axis-label')
                  .data([null])
                  .join('g')
                  .append('text')
                  .attr('class','x-axis-label')
                  .attr('y', 55)
                  .attr('x', 580)
                  .attr('fill', 'black')
                  .attr('text-anchor','middle')
                  .text(xAxisLabel);

            xAxisG.select('.x-axis-label')
                  .transition(t)
                  .attr('y',55)
                  .attr('x',580);

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