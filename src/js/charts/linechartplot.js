'use strict';

import {
    select,
    line,
    scaleLinear,
    scalePoint,
    axisBottom,
    axisLeft,
    format,
    transition,
    min,
    max
} from 'd3';

const commaFormat = format(',');

export const lineChartPlot = () => {
    let width, height;
    let dataReceived;
    let xCoordinate, yCoordinate;
    let margin;
    let xAxisLabel = "PLACES →";
    let yAxisLabel = "CANDIDATE COUNT →";

    const my = (svg1) => {
        // Clear existing elements
        // svg1.selectAll('.line').remove();
        // svg1.selectAll('.x-axis').remove();
        // svg1.selectAll('.y-axis').remove();
        // svg1.selectAll('.x-axis-label').remove();
        // svg1.selectAll('.y-axis-label').remove();// This code has been suppressed just to tinker with code. Normally, this code has to be uncommented

        const pointPadding = dataReceived.length > 150 ? 0.2 : 0.5;

        // Create scales
        const xScale = scalePoint()
            .domain(dataReceived.map(xCoordinate))
            .range([margin.left, width - margin.right])
            .padding(pointPadding);

        const yScale = scaleLinear()
            .domain([min(dataReceived, yCoordinate), max(dataReceived, yCoordinate)])
            .range([height - margin.bottom, margin.top]);

        // Create line generator
        const lineGenerator = line()
            .x(d => xScale(xCoordinate(d)))
            .y(d => yScale(yCoordinate(d)));

        const t = transition().duration(1000);

        // Create line
        svg1.append('path')
            .datum(dataReceived)
            .attr('class', 'line')
            .attr('fill', 'none')
            .attr('stroke', '#4682B4')
            .attr('stroke-width', 2)
            .attr('d', lineGenerator)
            .call(enter => enter.transition(t)
                .attr('d', lineGenerator));

        // X Axis
        const xAxisG = svg1.selectAll('.x-axis')
            .data([null])
            .join('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0,${height - margin.bottom})`);

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
                    .attr('x', width / 2)
                    .attr('fill', 'black')
                    .attr('text-anchor', 'middle')
                    .text(xAxisLabel)
                    .call(enter => enter.transition(t)
                        .attr('y', 55)
                        .attr('x', width / 2)),
                update => update.call(update =>
                    update.attr('y', height * 55)
                        .transition(t)
                        .text(xAxisLabel)
                        .attr('y', 115)),
                exit => exit.remove()
            );

        // Y Axis
        const yAxisG = svg1.selectAll('.y-axis')
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
                    .attr('x', -height / 2)
                    .attr('fill', 'black')
                    .attr('text-anchor', 'middle')
                    .text(yAxisLabel)
                    .call(enter => enter.transition(t)
                        .attr('y', -97)
                        .attr('x', -height / 2)),
                update => update.call(update =>
                    update.attr('y', height * 55)
                        .transition(t)
                        .text(yAxisLabel)
                        .attr('y', -97)
                        .attr('x', -height / 2)),
                exit => exit.remove()
            );
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
