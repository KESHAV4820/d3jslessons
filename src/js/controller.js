'use strict';

//Note: to use live server extension for development, you need to change the folder name in the setting of workspace which starts like this: " Live Server › Settings: Multi Root Workspace Name This the entry point of server when you're in multiroot workspace ". there you need to change the name of the file from 'allexamstable project' to 'd3js charting' folder name. 


import {csv, 
        select,
        style,
        text,
        // format
    } from 'd3';// all of the deconstructed words here are actually functions or SuperConcept functions that gives you access to another function when right parameter is passed into them. like sya axisLeft(). axisLeft(yourchoiceofaxis) will actually return another function, which will actually takes as the parameter to itself the append instructions on the svg1 selection. 
import {scatterPlot} from './charts/scatterplot';
import {lineChartPlot} from './charts/linechartplot';
import {barChartPlot} from './charts/barchartplot';
import {pieChartPlot} from './charts/piechartplot';
import {menu} from './menu';

{/*SuperNote:-
    0️⃣D3.js is highly dependent on method chaining.
    1️⃣ScaleLinear: it sets the linear function between Domain and Range. Domain: is the sample space from where the input to a function is possible. Range: is the sample space, only within which, the output to the function is possible.  
    2️⃣ ScalePoint: is used to plot the values which are strings.
    3️⃣ScaleOrdinal:
    4️⃣ScalePow: is used to set exponential relation in function between Domain and Range. 
    5️⃣extent: returns an array after processing an array of values. This array has two value, one max and other min. 
    6️⃣ how .call statement works. abc.call(xyz) simply means that xyz(abc); where xyz() is a function and abc is the parameter being passed into xyz();
    7️⃣Super svg.append(g):- this as soon as envoked;  makes a brand new d3 selection of a brandnew DOM element which is a group element. there group element in d3.js is represented using the letter 'g'. 
    8️⃣SuperConcept"implicit return":- this kind of return is found in arrow function with single line of code in their body. There are arrow functions with multiple lines  of body put inside the curly brance. But these don't have implicit return into them.you will have to write the return statment explicitly. But if you want to use the implicit return feature and multiple lines as well, then you better wrap you body of function within () braces. which may look like: const fun1= (abc)=>({and here your multipline code.}); 
    9️⃣SuperNoteMarvel
    Note that we are using this expression from d3.js axis documentation.Super There they had used underscore _ as the name of the variable in getter, setter function. Hence, i am using it as well. Not get bothered. It's just being used as variable name.LearnByHeartTake A Good LookRemember It "height = +_, my" this expression has a great Concept hidden in it. There is implicit return involved in it. That is inside a ternarry operation, like (condition)?(expression1, expression2):(); when "condition" is checked, if the condition is found true, then (expression1,expression2) section is executed. now SuperNoteVIE "expression1" is calculated and "expression2" is always returned IMPLICITLY. That's how this construct works in JS , this property is to facilitate method chaining.LearnByHeartJust Beautiful
    🔟SuperNoteConcept 
    we can't use arrow function in getter , setter funtion becouse "argument" parameter object isn't defined.(Remember It "arguments" is as special keyword in JS .) like if you say let f= ()=> console.log(arguments); the output will give error that arguments isn't defined. but if you use old school function syntax like let f = function() {console.log(arguments)}, this will not throw error. it will only say that arugments is undefined. if you pass f(1,2,3), then the output will be Arguments(3)[1,2,3]. 
    How ever, there is a work around this limitation. 
    1️⃣1️⃣after modularation of code, we have turned the rValue() function not into getter or setter function, but into a full fledged rValueCalculated() function and hence, it return radius values not the "my" in scatterplot.js . Becouse there is no point in making it into a getter or setter function if the radius is variable and has to be calculated internally from the data accessed. If the radius were to be constant, then using getter, setter makes a sense. 
    1️⃣2️⃣ controller.js is basically the area where you have all the section of code that you will need to change or configure for different types of data. Within main(), we are calling scatterplot() and adding all configuration to it. 
    1️⃣3️⃣in Scatterplot.js we have all the data that need very few and far in between changes, basically, they are static code for data visualisation. hence it has been put to another module for better code visibility in controller.js
    1️⃣4️⃣setInterval() is best to use when you are going to use it for duration of longer time scale and not for any animation related rendering.
    1️⃣5️⃣requestAnimationFrames() is best used for small scale time duration and specially for Animation related implementation. It has better settings for the synchronization and controls in between with your display and rendering w.r.t set Interval.
    1️⃣6️⃣Take A Good LookVIELearnByHeart .on() setter getter function in menu.js has very important and intricate logic for implementing event listeners to it. 
        🅰️ First we import "dispatch" from d3. this gives us construct that help us in emitting the events in d3.js And then, we instatiate it once like👉🏼 const listeners = dispatch('change'); for say 'change' event.
        but why! are we using dispatch library at all. Becouse using this, we can declare our own set of 'events' right within the menu options.
        🅱️  now this 'change' event is added to the select element say svg1 in our case which is the standered element that emits the events in DOM. And when we get that event, we are extracting the value that was clicked on which resides in the target method.
        👉🏼 .on('change', (event)=>{listeners.call('change',null,event.target.value)})
        and now this data is funneled using our d3 dispatch library to the controller.js call back function used inside the.on() method has been used. Note: this process of funneling this data is done  by listeners.call(). Think of it like a pipe line
    1️⃣7️⃣ VIE To remove the cache file of parcel bundler, so that you can see the latest changes that you made to the file after fresh bundling, you need to run this command in the root folder of the project👉"rmdir /s /q .parcel-cache" on CMD Or sometimes, this command 👉🏼"Remove-Item -Recurse -Force .parcel-cache" is used as well. Note that the npm server shouldn't be running at the time of executing this command. It wont work. 
    1️⃣8️⃣
    1️⃣9️⃣
    
*/}

if(module.hot){
    module.hot.accept();
};

{/*Note const csvDataPath='./../../data/sampletestingdata.csv';// SuperVIE this way of passing the address is important as it is less error prone and helps bundler to find the file. Absolute address are not allowed for security reason. 

const csvDataPath = [
    '.',  // This refers to the current directory
    '..', // This refers to the parent directory
    '..', // This goes up one more level
    'data', // Then it goes into the 'data' folder
    'sampletestingdata.csv' // Finally, the CSV file
].join('/');// Remember ItJust Beautiful this is how we make a address more clean for maintainance.
*/}
import csvDataPath from './../../data/sampletestingdata.csv'; // Let Parcel handle asset


// console.log(csvDataPath);// Code Testing.

// const commaFormat = format(',');// this adds comma separator code migrated to scatterplot.js

const parseRow = (d)=>{
    d.exam_name=d.exam_name;
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

//VIEConcept Now i will define "Accessor functions". They are used to set value in "Idempotent style" of programming. In this, we program in a manner that user need not remember the "order and number of parameter" to be given to the function. You can pass the parameters in much more fluid manner, not totally fluid, but fluid to a great extent. They are very useful in largescale programming.
/*code migrated to scatterplot getter setter accessor function
const xCoordinate = (d) => d.zone_score;//use zone_name going forward. 
const yCoordinate = (d) => d.zone_score;
const rValue = (d) => d.zone_score/1000;
// console.log(rValue);// Code Testing



//Margin Convention:  Here we are alloting margin around the charing area which will come after this. 
const margin = {
    top:30, 
    right:30, 
    bottom:30, 
    left:100,
};
const maxRadius=15;
const minRadius=3;
*/

// const radius=5;legacy code becouse i have implemented variable radious below. 

// here we are declaring the area where chart shall be made
const width=window.innerWidth;
const height=window.innerHeight-55;//800;

//create wrapper div for chart container
const chartWrapper = select('body').append('div')
                                    .attr('class','chart-wrapper')
                                    .style('position','relative')
                                    .style('width','100%')
                                    .style('height',`${height}px`);

// const svg1= select('body').append('svg').attr('width',width).attr('height',height);//code upgrade👇🏼
const svg1 = chartWrapper.append('svg')
                         .attr('width',width)
                         .attr('height',height);

const menuContainerY= select('body')
                    .append('div')
                    .attr('class','menu-container-y');

const menuContainerX= select('body')
                    .append('div')
                    .attr('class','menu-container-x');

const menuExamName= select('body')
                    .append('div')
                    .attr('class','menu-container-examname');

const menuExamTier= select('body')
                    .append('div')
                    .attr('class','menu-container-examtier');

const menuExamYear= select('body')
                    .append('div')
                    .attr('class','menu-container-examyear');

const menuChartType= select('body')
                    .append('div')
                    .attr('class','menu-container-charttype');

const chartTypes = [
    {value:'scatterPlot', text:'Scatter Plot'},
    {value:'barChartPlot', text:'BarChart Plot'},
    {value:'pieChartPlot', text:'PieChart Plot'},
    // {value:'lineChartPlot',text:'LineChart Plot'}
];



const main = async () =>{
    // SuperConceptThese👇🏼😟 are state tracking variable. When switching to a new chart type, dfault buggs were comming up. Hence, this to track axis fields.
    let currentXField='zone_name';
    let currentYField='zone_score';
    const dataExtracted =await csv(csvDataPath, parseRow); 
    // console.log(dataExtracted);//Code Testing

    // Function to calculate effective width based on data points
    const calculateEffectiveWidth = (data) => {
        return data.length > 150 ? Math.max(width * 2.5, data.length * 30) : width;
    };
    
    const columnsForXaxis=Object.keys(dataExtracted[0]).filter(
        (column) => typeof dataExtracted[0][column] === 'string'
    );//SuperConceptObject.keys(dataExtracted[0]) gives an array of things in first row. 
    // const columnsForYaxis=Object.keys(dataExtracted[0]).filter(
        //     (column) => typeof dataExtracted[0][column] === 'number'
        //     );
        // console.log(columnsForXaxis);// Code Testing
        
    // now we shall extract unique values from exam_name, exam_tier and exam_year for their menu
        const uniqueExamNames = Array.from(new Set(dataExtracted.map((d) => d.exam_name)));
        const uniqueExamTiers=Array.from(new Set(dataExtracted.map((d) => d.exam_tier)));
        const uniqueExamYears=Array.from(new Set(dataExtracted.map((d) => d.exam_year)));
        // console.log("uniqueExamName :"+uniqueExamNames);//Code Testing
        // console.log("uniqueExamTier :"+uniqueExamTiers);//Code Testing
        // console.log("type of uniqueExamTier :"+typeof(uniqueExamTiers));//Code Testing
        // console.log("uniqueExamName :"+uniqueExamTiers);//Code Testing

    //Now turning these unique values into options formate for their menus becouse we need to pass value and text in the html components of the dropdown menu we are going to create.
        const columnsForExamName = uniqueExamNames.map((examname) => ({value: examname, text:examname}));
        const columnsForExamTier=uniqueExamTiers.map((examtier) => ({value: examtier, text: examtier}));
        const columnsForExamYear=uniqueExamYears.map((examyear) => ({value: examyear, text:examyear}));
        // console.log("columnsForExamName :"+uniqueExamNames);//Code Testing
        // console.log("columnsForExamTier :"+uniqueExamTiers);//Code Testing
        // console.log("type ofcolumnsForExamTier :"+typeof(columnsForExamTier));//Code Testing
        // console.log("columnsForExamName :"+uniqueExamTiers);//Code Testing
        
    // we are putting some default values for the system to function properly right from start
        let selectedExamName = columnsForExamName[0].value;
        let selectedExamTier = columnsForExamTier[0].value;
        let selectedExamYear = columnsForExamYear[0].value;
        // console.log("selectedExamName :"+selectedExamName);//Code Testing
        // console.log("selectedExamTier :"+selectedExamTier);//Code Testing
        // console.log("type of selectedExamTier :"+typeof(selectedExamTier));//Code Testing
        // console.log("selectedExamName :"+selectedExamTier);//Code Testing
        

    // now a function to filter the data according to selected options in the the Exam Name, Exam Tier, Exam Year menus
        const filteredData= () => {	
            return dataExtracted.filter((d) => 
            d.exam_name=== selectedExamName &&
            d.exam_tier=== +selectedExamTier &&
            d.exam_year=== +selectedExamYear
                );
        	};
   
/*code migrated to setInterval()
    const plot = scatterPlot()
    .width(width)
    .height(height)
    .dataReceived(dataExtracted) 
    // .dataReceived( await csv(csvDataPath,parseRow))//Alternative Code
    .xCoordinate((d) => d.zone_score )
    .yCoordinate((d) => d.zone_score)
    .margin({
        top:30, 
        right:33, 
        bottom:55, 
        left:120,})
    .maxRadius(16)
    .minRadius(2);
   svg1.call(plot);
   */
    /*code migrated to scatterplot.js file
    // now i will first generate the X coordinate and Y coordinate for the center of the circles, and then radious of the circle that will be used in scatter plot
    const xCoordinateOfCenter=scaleLinear().domain(extent(dataExtracted,xCoordinate)).range([margin.left,width-margin.right]);// this scale function has to be tuned to handle name.
    
    //legacy code const yCoordinateOfCenter=scaleLinear().domain([
    //     d3.min(dataExtracted, yCoordinate), 
    //     d3.max(dataExtracted,yCoordinate)]);
    //code upgrade👇
    const yCoordinateOfCenter=scaleLinear().domain(extent(dataExtracted,yCoordinate)).range([height-margin.bottom,margin.top]);//Concept if you want to start your scale with 0, then you can write into .domain() like .domain([0, d3.max(dataExtracted,YCoordinate)]); For example in barchart, we always start from 0.
    // console.log(yCoordinateOfCenter.domain());//Code Testing 
    
    const rOfPlotCircle=scaleSqrt().domain([0,max(dataExtracted,rValue)]).range([minRadius,maxRadius]);

    // Now we will process the data and create marks that has to be plotted using the scale of the Axis for the chart that we calcuted just above in xCoordinateOfCenter function(yes, it is a function Take A Good Look), yCoordinateOfCenter function.
    const marks= dataExtracted.map(d =>({
        x: xCoordinateOfCenter(xCoordinate(d)),
        y: yCoordinateOfCenter(yCoordinate(d)),
        title: `(${commaFormat(xCoordinate(d))},${commaFormat(yCoordinate(d))})`,// this will let us know the value on the point.
        r: rOfPlotCircle(rValue(d)),
    }));
    console.log(marks);//Code Testing
    

    // svg1.selectAll('circle').data(dataExtracted).join('circle').attr('cx');
    svg1.selectAll('circle').data(marks).join('circle').attr('cx', d=> d.x).attr('cy', d=> d.y).attr('r',(d) => d.r).append('title').text(d=>d.title);

    // putting y and x axis in the chart. 
    //svg1.append('g').attr('transform',`translate(${margin.left},0)`).call(axisLeft(yCoordinateOfCenter));
    
    //Notethis same code can also be written as the following:-
    //axisLeft(yCoordinateOfCenter)(svg1.append('g').attr('transform',`translate(${margin.left},0)`));
    //The above example shows that there are many functions that gives access to another function in D3.js. So mind the structure like fun()(). it is correct. 

    svg1.append('g').attr('transform',`translate(0,${height-margin.bottom})`).call(axisBottom(xCoordinateOfCenter));
    */

    // console.log('Setting up scatterPlot');//Code Testing

//code migratedcode upgrade👇🏼 to implement multiple type of charts rendering.(By default)
    const plot=scatterPlot()
    .width(width)
    .height(height)
    // .dataReceived(dataExtracted)//Alternative Code17/10/2024 code upgrade👇🏼
    // .dataReceived( await csv(csvDataPath,parseRow))Alternative Code24/10/2024code upgrade👇🏼
    .dataReceived(filteredData())// 
    .xCoordinate((d) => d.zone_name)
    .yCoordinate((d) => d.zone_score)
    .margin({
        top:30, 
        right:33, 
        bottom:130, 
        left:125,})
    .maxRadius(16)
    .minRadius(1);
// svg1.call(plot);
//Concept becouse reusable chart in d3.js expects as an input a d3 selection which in our case is svg1, basically an element where the svg is plotting or charting the graph. Or the same can also be passed as :- "scatterPlot().width(width).height(height)(svg1)"
    // console.log('scatterplot setup complete');//Code Testing
//
let currentChartType = 'scatterPlot';// default value
// Function to render the selected Chart type
const renderChart = (data) => {	
    svg1.selectAll("*").remove();//It clears all the content of previous chart type
    let chart;

    //calculate effective width based on data size to make scrolling logic work.
    const effectiveWidth= calculateEffectiveWidth(data);

    //set updated width to svg and container for overflow on x-axis
    svg1.attr('width',effectiveWidth);//Super this will set the effective width to the svg container itself and hence the<svg> element to display the graph. here we aren't setting it for the X-axis scale, which itself is a part of the <svg>, not yet.This will actually trigger the horizonal scroll on whole svg element itself. 
        chartWrapper.style('width', `${effectiveWidth}px`)
                    .style('overflow-x', 'auto')
                    .style('display', 'block');

    // for scatter plot:-
    if (currentChartType === 'scatterPlot') {
        chart = scatterPlot()
                    .width(effectiveWidth)//VIEhere we are setting effective width on axis, so that it could populate the ticks accordingly. 
                    .height(height)
                    .dataReceived(data)
                    .xCoordinate((d) => d[currentXField])
                    .yCoordinate((d) => d[currentYField])
                    .margin({
                        top: 30, 
                        right: 33, 
                        bottom: 130, 
                        left: 125})
                    .maxRadius(16)
                    .minRadius(2);

        };
        // Placeholder for other chart types, e.g., barChartPlot, pieChartPlot
        // for barchart:-
        if (currentChartType === 'barChartPlot') {
            chart = barChartPlot()
                .width(width)
                .height(height)
                .dataReceived(data)
                .xCoordinate(d => d[currentXField])
                .yCoordinate(d => d[currentYField])
                .margin({ 
                    top: 30, 
                    right: 33, 
                    bottom: 130, 
                    left: 125 
                        }
                    );
        }
        // for Piechart:-
        if (currentChartType === 'pieChartPlot') {
            chart = pieChartPlot()
                .width(width)
                .height(height)
                .dataReceived(data)
                .xCoordinate(d => d[currentXField])
                .yCoordinate(d => d[currentYField])
                .margin({ 
                    top: 30, 
                    right: 33, 
                    bottom: 130, 
                    left: 125 
                        }
                    );
        }
        if(chart){
            svg1.call(chart);
        }
        //Forceing the reflow of svg once again
        svg1.node().getBoundingClientRect();

    // const container = select('.chart-wrapper');
    // if(container.node()){
    //     container.dispatch('scroll');
    // }; 
  };

renderChart(filteredData());// to render something by default

// we are adding id, options, eventlistener getter setter on each dropdonw menu element.
    menuExamName.call(
                        menu().id('menu-examname')
                              .textForMenuLabel('Exam Name')
                              .optionsWithinMenu(columnsForExamName)//👈🏼
                              .on('change', function(column){
                                selectedExamName=column;
                                // svg1.call(plot.dataReceived(filteredData()));//code upgrade👇🏼
                                renderChart(filteredData());
                                console.log('Exam Name Menu Changed: '+column);//Code Testing
                            })
                    );    
    menuExamTier.call(
                    menu().id('menu-examtier')
                            .textForMenuLabel('Exam Tier')
                            .optionsWithinMenu(columnsForExamTier)
                            .on('change', (column) => {
                            selectedExamTier = column;
                            // svg1.call(plot.dataReceived(filteredData()));
                            renderChart(filteredData());
                            // console.log('Exam Tier Menu Changed: '+column);// Code Testing
                            })
                    );
    menuExamYear.call(
                    menu().id('menu-examyear')
                            .textForMenuLabel('Exam Year')
                            .optionsWithinMenu(columnsForExamYear)
                            .on('change', (column) => {
                                selectedExamYear=column;
                                // svg1.call(plot.dataReceived(filteredData()));
                                renderChart(filteredData());
                            // console.log('Exam Year Menu Changed: '+column);// Code Testing
                            })
                    );
      menuChartType.call(
                        menu().id('menu-charttype')
                              .textForMenuLabel('Chart Type')
                              .optionsWithinMenu(chartTypes)
                              .on('change', (chartType) => {	
                                currentChartType=chartType;
                                renderChart(filteredData());
                                // console.log('Menu Chart Type Changed: '+chartType);//Code Testing
                              	})
                        );

    const columnsForX=[
        // { value:'exam_name',text:'Exam Name'},
        // { value:'exam_year',text:'Exam Year'},
        // { value:'exam_tier',text:'Exam Tier'},
        { value:'zone_name',text:'Zone Name'},
        // 'zone_score',
        { value:'state_name',text:'State Name'},
        // 'state_score',
        { value:'city_name',text:'City Name'},
        // 'city_score'
    ];
    const columnsForY=[
        // 'exam_name',
        // 'exam_year',
        // 'exam_tier',
        // 'zone_name',
        { value:'zone_score',text:'Zone Score'},
        // 'state_name',
        { value:'state_score',text:'State Score'},
        // 'city_name',
        { value:'city_score',text:'City Score'},
    ];
    
    menuContainerY.call(
        menu().id('y-menu')
              .textForMenuLabel('Candidate Counts')
              .optionsWithinMenu(columnsForY)
              .on('change',(column) => {
                    // svg1.call(plot.yCoordinate((d) => d[column]).yAxisLabel(column));
                    // const container=select('.chart-wrapper');
                    // if (container.node()) {
                    //     container.dispatch('scroll');
                    // }
                    currentYField=column;// Note: changed the state based on menu selection on Y

                    const filteredDataResult = filteredData();
                    const effectiveWidth = calculateEffectiveWidth(filteredDataResult);
                    
                    svg1.attr('width', effectiveWidth);
                    chartWrapper.style('width', `${effectiveWidth}px`);
                    
                    renderChart(filteredDataResult);
                /* code upgrade☝🏼 this code wasn't compatible with the multiple charts. It broke as soon as different charting was chosen from the charts drop down menu 
                        svg1.call(plot.width(effectiveWidth)
                                .yCoordinate((d) => d[column])
                                .yAxisLabel(column)
                                .dataReceived(filteredDataResult));
                    */

                    // console.log(column);//Code Testing    
                })
        );
    menuContainerX.call(
        menu().id('x-menu')
              .textForMenuLabel('Group Wise')
              .optionsWithinMenu(columnsForX)
              .on('change',(column) =>{
                    // svg1.call(plot.xCoordinate((d) => d[column]).xAxisLabel(column));
                    // const container=select('.chart-wrapper');
                    // if (container.node()) {
                    //     container.dispatch('scroll');
                    // }
                    currentXField=column; // changed the state based on selection on X axis.

                    const filteredDataResult = filteredData();
                    const effectiveWidth = calculateEffectiveWidth(filteredDataResult);
                    
                    // Update SVG and container dimensions first
                    svg1.attr('width', effectiveWidth);
                    chartWrapper.style('width', `${effectiveWidth}px`);
                    
                    // Then update the plot with new coordinates
                    renderChart(filteredDataResult);
            /* code upgradethis code failed as soon as different chart manu was made operational. 
                 svg1.call(plot.width(effectiveWidth)
                                .xCoordinate((d) => d[column])
                                .xAxisLabel(column)
                                .dataReceived(filteredDataResult)); 
            */

                // console.log('x menu changed: '+column);//Code Testing
              })
        );

    /*NoteVIETake A Good LookThis section was just for learning that how graphs actually form and automatically take the data. 
    let i =0;//counter variable to set offset for x axis
    let j=0;// counter variable to set offset for y axis
    setInterval(() => {
        
            const plot = scatterPlot()
                .width(width)
                .height(height)
                .dataReceived(dataExtracted) 
                // .dataReceived( await csv(csvDataPath,parseRow))//Alternative Code
                .xCoordinate((d) => d[columnsForXaxis[i]])
                .xAxisLabel(columnsForXaxis[i])
                .yCoordinate((d) => d[dataExtracted[0][j]])
                .yAxisLabel(dataExtracted[0][j])
                .margin({
                    top:30, 
                    right:33, 
                    bottom:55, 
                    left:120,})
                .maxRadius(16)
                .minRadius(2);
            svg1.call(plot);

        // plot.xCoordinate((d) => d[columns[i%columns.length]] ),//columns[i%columns.length] expression is to set the offset for selection in loop. 
        // plot.yCoordinate((d) => d[columns[i%columns.length]] ),// Usless Coding could be used in future.
        svg1.call(plot);
        // i++;
        i=(i+1)%columnsForXaxis.length;
        j=(j+1)%dataExtracted[0].length;
    }, 4000);
    */

// Add window resize handler
window.addEventListener('resize', () => {	
     const newWidth = window.innerWidth;
     const newHeight=window.innerHeight-55;
     const filteredDataResult = filteredData();
     const effectiveWidth = calculateEffectiveWidth(filteredDataResult);

     chartWrapper.style('height',`${newHeight}px`)
                 .style('overflow-x','auto');
                //  .style('width', '100%');
                 
             svg1.attr('width', effectiveWidth)
                 .attr('height', newHeight);
                 
             plot.width(effectiveWidth)
                 .height(newHeight);

        renderChart(filteredDataResult);
	});
    // Initial Render
    // renderChart(filteredData());//07/11/2024
};
main();


