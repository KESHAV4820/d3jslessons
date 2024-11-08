'use strict';

import {
    select,
    scaleBand,
    scaleLinear,
    axisBottom,
    axisLeft,
    format,
    transition,
    max
} from 'd3';

const commaFormat = format(',');

export const barChartPlot = () => {
    let width, height;
    let dataReceived;
    let xCoordinate, yCoordinate;
    let margin;
    let yAxisLabel = "CANDIDATE COUNT →";
    let xAxisLabel = "PLACES →";

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

        //trying to add hover effects😕
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

    return my;
};