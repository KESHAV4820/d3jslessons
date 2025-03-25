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
    console.log('Listeners created:', listeners);//debugging log
    
    
    const my = (svg1) => {
        console.log('Initializing bar chart with data:', dataReceived);//debugging log
        
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
                enter => {
                const rect=enter.append('rect')
                    .attr('class', 'bar')
                    .attr('x', d => xScale(xCoordinate(d)))
                    .attr('width', xScale.bandwidth())
                    // .attr('y', height - margin.bottom)//
                    .attr('y', d => yScale(yCoordinate(d)))//Alternative Code
                    // .attr('height', 0)
                    .attr('height', d => height - margin.bottom - yScale(yCoordinate(d)))//Alternative Code
                    .attr('fill', '#4682B4')  // Added consistent color
                    // .style('cursor', 'pointer')
                    // .on('click', function(event, d) {
                    //     console.log('Bar clicked:', d);  // Explicit console log
                    //     console.log('Event:', event);    // Log the event object
                        
                    //     // Verify coordinates and scales
                    //     console.log('xCoordinate:', xCoordinate(d));
                    //     console.log('yCoordinate:', yCoordinate(d));
                    //     console.log('xScale:', xScale(xCoordinate(d)));
                    //     console.log('yScale:', yScale(yCoordinate(d)));
                        
                    //     listeners.call('barClicked', null, {
                    //         data: d,
                    //         entireDataset: dataReceived
                    //     });
                    // })//working codelegacy code
                    .call(enter => enter.transition(t)
                        .attr('y', d => yScale(yCoordinate(d)))
                        .attr('height', d => height - margin.bottom - yScale(yCoordinate(d)))
                    );
                    // .style('cursor', 'pointer')
                    // .on('click', function(event, d) {
                    //     console.log('Bar clicked:', d);  // Explicit console log
                    //     console.log('Event:', event);    // Log the event object
                        
                    //     // Verify coordinates and scales
                    //     console.log('xCoordinate:', xCoordinate(d));
                    //     console.log('yCoordinate:', yCoordinate(d));
                    //     console.log('xScale:', xScale(xCoordinate(d)));
                    //     console.log('yScale:', yScale(yCoordinate(d)));
                        
                    //     listeners.call('barClicked', null, {
                    //         data: d,
                    //         entireDataset: dataReceived
                    //     });
                    // })//working codecode upgrade
                    rect.append('title')
                    .text(d => `${xCoordinate(d)}: ${commaFormat(yCoordinate(d))}`);

                    return rect;
                },
                /* SuperConcept: i was trying to chain .on() on enter, update selection to add the event listen like .on(click,__). But i was failing. why? becouse at the end of the chain, i was using ".append()" to add titles to the bars in barchart as they enter or get updated. But .append() has a sneaky property, such that it won't return you the original selection object as the .attr() method does while in chains. instead, .append() return the object that it appended. like title in our case. And my .on(click) wasn't working as it was not getting applied on the bars, but rather the title name as it was the last thing being return in the chain. Hence, to fix this problem, we broke the implementation of method chaining using the "const rect" variable which at the end we use to add titles and returing it. NOw finally, const bars can be used to implement the listeners like i have done. it was tricky. Remember It
                
                */
                update => {
                const rect=update.call(update => update.transition(t)
                    .attr('x', d => xScale(xCoordinate(d)))
                    .attr('width', xScale.bandwidth())
                    .attr('y', d => yScale(yCoordinate(d)))
                    .attr('height', d => height - margin.bottom - yScale(yCoordinate(d)))
                    .select('title')
                );
                // .style('cursor', 'pointer')
                //     .on('click', function(event, d) {
                    //         console.log('Bar clicked:', d);  // Explicit console log
                    //         console.log('Event:', event);    // Log the event object
                    
                    //         // Verify coordinates and scales
                    //         console.log('xCoordinate:', xCoordinate(d));
                    //         console.log('yCoordinate:', yCoordinate(d));
                    //         console.log('xScale:', xScale(xCoordinate(d)));
                    //         console.log('yScale:', yScale(yCoordinate(d)));
                    
                    //         listeners.call('barClicked', null, {
                        //             data: d,
                        //             entireDataset: dataReceived
                        //         });
                        //     }),//working code 
                        
                        rect.select('title')
                        .text(d => `${xCoordinate(d)}: ${commaFormat(yCoordinate(d))}`);
                        return rect;
            },
                exit => exit.call(exit => exit.transition(t)
                    .attr('y', height - margin.bottom)
                    .attr('height', 0)
                    .remove())
            );
    
    // WE shall create a grid group that stays behind the plotting area in the chart on which the ploting of the data using the graph will make sense to the user viewing it. 
        // First, create a dedicated group for grid lines that will stay behind everything

    const gridGroup = svg1.selectAll('.grid-group')
    .data([null])
    .join('g')
    .attr('class', 'grid-group');

    // Y-grid lines (render these first)
    gridGroup.selectAll('.y-grid')
    .data(yScale.ticks())
    .join(
        enter => enter.append('line')
        .attr('class', 'y-grid')
        .attr('x1', margin.left)
        .attr('x2', width - margin.right)
        .attr('stroke', '#000')
        .attr('stroke-dasharray', '5,5')
        .attr('opacity', 0)
        .attr('y1', d => yScale(d))
        .attr('y2', d => yScale(d))
        .transition(t)
        .attr('opacity', 1),
        update => update.transition(t)
        .attr('y1', d => yScale(d))
        .attr('y2', d => yScale(d)),
        exit => exit.transition(t)
        .attr('opacity', 0)
        .remove()
    );

    // X-grid lines
    gridGroup.selectAll('.x-grid')
        .data(xScale.domain())
        .join(
        enter => enter.append('line')
            .attr('class', 'x-grid')
            .attr('y1', margin.top)
            .attr('y2', height - margin.bottom)
            .attr('stroke', '#000')
            .attr('stroke-dasharray', '5,5')
            .attr('opacity', 0)
            .attr('x1', d => xScale(d))
            .attr('x2', d => xScale(d))
            .transition(t)
            .attr('opacity', 1),
        update => update.transition(t)
            .attr('x1', d => xScale(d))
            .attr('x2', d => xScale(d)),
        exit => exit.transition(t)
            .attr('opacity', 0)
            .remove()
    );
            

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
            console.group('Bar Click Event');//debugging log
            console.log('Clicked bar data:', d); // debugging log
            console.log('Current x coordinate:', xCoordinate(d)); // debugging log
            console.log('Current y coordinate:', yCoordinate(d));// debugging log
            console.log('Full dataset:', dataReceived);// debugging log//Bug Found
            console.groupEnd();

            // Using the listeners.call to send the event up to the controller
            listeners.call('barClicked', null, {
                data:d,
                // entireDataset:dataReceived,//Bug Found//Resolved: as on now this is used to filter zone to state data only. for state to city, we don't use it. it creates problem. In future, our aim is to make the data filtration independent just like state to city. 
                currentXField: xCoordinate(d),
                currentYField: yCoordinate(d)
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
        console.log('Setting up event listener:', arguments[0]);//debugging log
        
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