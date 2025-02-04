'use strict';

import {
    select,
    scaleBand,
    scaleLinear,
    axisBottom,
    axisLeft,
    format,
    transition,
    max,
    dispatch
} from 'd3';


const commaFormat = format(',');

export const barChartPlot = () => {
    let width, height;
    let dataReceived;
    let xCoordinate, yCoordinate;
    let margin;
    let yAxisLabel = "CANDIDATE COUNT →";
    let xAxisLabel = "PLACES →";
    
    //Creating dispatch for component-level events. This allows the chart to communicate with the controller.js
    const listeners = dispatch('barClicked');// to use dispatch/listener pattern to pass the click event to the controller where drillDownHandler() is actually declared. 
    
    const my = (svg1) => {
        // clear all prexisting elements in chart
        svg1.selectAll('.bar').remove();

        const t = transition().duration(1000);

        // Create scales
        const xScale = scaleBand()
            .domain(dataReceived.map(xCoordinate))
            .range([margin.left, width - margin.right])
            .padding(0.2);
            console.log(dataReceived);// Code Testing
            

        const yScale = scaleLinear()
            .domain([0, max(dataReceived, yCoordinate)])
            .range([height - margin.bottom, margin.top]);

        // Create bars
        const bars = svg1.selectAll('.bar')
            .data(dataReceived)
            .join(
                enter => enter.append('rect')
                    .attr('class', 'bar')
                    .attr('x', d => xScale(xCoordinate(d)))
                    .attr('width', xScale.bandwidth())
                    .attr('y', height - margin.bottom)
                    .attr('height', 0)
                    .attr('fill', '#4682B4')  // Added consistent color
                    .call(enter => enter.transition(t)
                        .attr('y', d => yScale(yCoordinate(d)))
                        .attr('height', d => height - margin.bottom - yScale(yCoordinate(d)))
                    )
                    .append('title')
                    .text(d => `${xCoordinate(d)}: ${commaFormat(yCoordinate(d))}`),
                
                update => update.call(update => update.transition(t)
                    .attr('x', d => xScale(xCoordinate(d)))
                    .attr('width', xScale.bandwidth())
                    .attr('y', d => yScale(yCoordinate(d)))
                    .attr('height', d => height - margin.bottom - yScale(yCoordinate(d)))
                    .select('title')
                    .text(d => `${xCoordinate(d)}: ${commaFormat(yCoordinate(d))}`)),
                
                exit => exit.call(exit => exit.transition(t)
                    .attr('y', height - margin.bottom)
                    .attr('height', 0)
                    .remove())
            );

        // Y Axis
        const yAxisG = svg1.selectAll('g.y-axis')
            .data([null])
            .join('g')
            .attr('class', 'y-axis')
            .attr('transform', `translate(${margin.left},0)`);

        yAxisG.transition(t)
            .call(axisLeft(yScale)
                .tickFormat(commaFormat));

        // Y Axis Label
        yAxisG.selectAll('.y-axis-label')
            .data([null])
            .join(
                enter => enter.append('text')
                    .attr('class', 'y-axis-label')
                    .attr('transform', 'rotate(-90)')
                    .attr('y', -97)
                    .attr('x', -height/2)
                    .attr('fill', 'black')
                    .attr('text-anchor', 'middle')
                    .text(yAxisLabel)
                    .call(((enter) => 
                        enter.transition(t)
                                .attr('y',-97)
                                .attr('x',-height/2))),
                update => update.call(update => 
                    update.attr('y', height*5)
                          .transition(t)
                          .text(yAxisLabel))
                          .attr('y',-97)
                          .attr('x',-height/2),
                exit => exit.remove()
            );

        // X Axis
        const xAxisG = svg1.selectAll('g.x-axis')
            .data([null])
            .join('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0,${height-margin.bottom})`);

        xAxisG.transition(t)
            .call(axisBottom(xScale))
            .call(g => g.selectAll('.tick text')
                .attr('text-anchor', 'end')
                .attr('transform', 'rotate(-45)')
                .style('font-size', '15px'));

        // X Axis Label
        xAxisG.selectAll('.x-axis-label')
            .data([null])
            .join(
                enter => enter.append('text')
                    .attr('class', 'x-axis-label')
                    .attr('y', 115)
                    .attr('x', width/2)
                    .attr('fill', 'black')
                    .attr('text-anchor', 'middle')
                    .text(xAxisLabel)
                    .call((enter) => enter.transition(t))
                    .attr('y',55)
                    .attr('x',width/2),
                update => update.call(update => 
                    update.attr('y',height*55)
                          .transition(t)
                          .text(xAxisLabel)
                          .attr('y',115)),
                exit => exit.remove()
            );

        //trying to add hover effects😕. Note .on() being used here isn't setter/getter function. it's built-in DOM event handler of D3.js itself.
        bars.on('mouseover', function() {
            select(this)
                .transition()
                .duration(300)
                .style('opacity', 0.7);
        })
        .on('mouseout', function() {
            select(this)
                .transition()
                .duration(300)
                .style('opacity', 1);
        })
        .on('click', function (event, d) {
            // Using the listeners.call to send the event up to the controller
            listeners.call('barClicked', null, {
                data:d,
                entireDataset:dataReceived
            });
        });
    };

    // Getter/Setter methods
    my.width = function(_) {
        return arguments.length ? (width = +_, my) : width;
    };

    my.height = function(_) {
        return arguments.length ? (height = +_, my) : height;
    };

    my.dataReceived = function(_) {
        return arguments.length ? (dataReceived = _, my) : dataReceived;
    };

    my.xCoordinate = function(_) {
        return arguments.length ? (xCoordinate = _, my) : xCoordinate;
    };

    my.yCoordinate = function(_) {
        return arguments.length ? (yCoordinate = _, my) : yCoordinate;
    };

    my.xAxisLabel = function(_) {
        return arguments.length ? (xAxisLabel = `${_} →`, my) : xAxisLabel;
    };

    my.yAxisLabel = function(_) {
        return arguments.length ? (yAxisLabel = `${_} Count →`, my) : yAxisLabel;
    };

    my.margin = function(_) {
        return arguments.length ? (margin = _, my) : margin;
    };

    my.on = function() {
        let value = listeners.on.apply(listeners, arguments);
        return value === listeners ? my:value;
    };
    /*Note
    Component .on() (my.on = function...):
   - Custom implementation
   - Handles component-level events
   - Allows communication between chart and controller
   - Used for application logic and data flow
   - Example: Telling controller about drill-down actions
    */
    

    return my;
};




/* Note and Concept
EVENT HANDLING EXPLANATION:

1. D3's .on() (bars.on('click', ...)):
   - It is  built into D3
   - Handles DOM-level events (clicks, hovers, etc.)
   - Works directly with DOM elements
   - Used for visual effects and capturing raw user interactions
   - It works only within the chart, that is, only within the barchartplot.js file. It can't talk to other files while interacting with this file here. for that you need component style .on() function or as you may like to define it like .onNNN(), but the crux is that it is a setter getter function that helps propagate the interaction of the d3's .on() functions interaction to other files of the project like controller.js in our case.
   - Example: Changing opacity on hover

2. Component .on() (my.on = function...):
   - Custom/user-made implementation
   - it Handles on component-level events
   - it Allows communication between the concerned chart and controller
   - useing for maintaining the application logic and data flow
   - Example: Telling controller about drill-down actions

The flow of control is like :
1. User clicks a bar
2. D3's .on('click') picksup the DOM event
3. listeners.call() will dispatch this event up to the component level
4. Controller's .on('barClicked') receives this event and handles the drill-down function
*/