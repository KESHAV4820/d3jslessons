'use strict';

import {
    select,
    pie,
    arc,
    scaleOrdinal,
    schemeCategory10,
    format,
    transition
} from 'd3';

const commaFormat = format(',');

export const pieChartPlot = () => {
    let width, height;
    let dataReceived;
    let xCoordinate, yCoordinate;
    let margin;

    const my = (svg1) => {
        // Clear existing elements
        svg1.selectAll('.pie-slice').remove();
        // svg1.selectAll('.pie-label').remove();

        const radius = Math.min(width - margin.left - margin.right, 
                              height - margin.top - margin.bottom) / 2;

        // Create pie layout
        const pieLayout = pie()
            .value(d => yCoordinate(d))
            .sort(null);

        // Create arc generator
        const arcGenerator = arc()
            .innerRadius(0)
            .outerRadius(radius);

        // Create color scale
        const colorScale = scaleOrdinal(schemeCategory10);

        // Calculate pie center
        const centerX = width / 2;
        const centerY = height / 2;

        const t = transition().duration(1000);

        // Create group for pie
        const pieGroup = svg1.selectAll('.pie-group')
            .data([null])
            .join('g')
            .attr('class', 'pie-group')
            .attr('transform', `translate(${centerX},${centerY})`);

        // Create pie slices
        const slices = pieGroup.selectAll('.pie-slice')
            .data(pieLayout(dataReceived))
            .join(
                enter => enter.append('path')
                    .attr('class', 'pie-slice')
                    .attr('fill', (d, i) => colorScale(i))
                    .attr('d', arcGenerator)
                    .style('opacity', 0.8)
                    .each(function(d) { this._current = d; })
                    .call(enter => enter.transition(t)
                        .attrTween('d', function(d) {
                            const interpolate = d3.interpolate({startAngle: 0, endAngle: 0}, d);
                            return t => arcGenerator(interpolate(t));
                        }))
                    .append('title')
                    .text(d => `${xCoordinate(d.data)}: ${commaFormat(yCoordinate(d.data))}`),
                
                update => update.call(update => update.transition(t)
                    .attrTween('d', function(d) {
                        const interpolate = d3.interpolate(this._current, d);
                        this._current = interpolate(1);
                        return t => arcGenerator(interpolate(t));
                    })),
                
                exit => exit.call(exit => exit.transition(t)
                    .style('opacity', 0)
                    .remove())
            );

        // Add labels
        const labelArc = arc()
            .innerRadius(radius * 0.6)
            .outerRadius(radius * 0.6);

        const labels = pieGroup.selectAll('.pie-label')
            .data(pieLayout(dataReceived))
            .join(
                enter => enter.append('text')
                    .attr('class', 'pie-label')
                    .attr('transform', d => `translate(${labelArc.centroid(d)})`)
                    .attr('dy', '0.35em')
                    .style('text-anchor', 'middle')
                    .style('font-size', '12px')
                    .style('opacity', 0)
                    .text(d => xCoordinate(d.data))
                    .call(enter => enter.transition(t)
                        .style('opacity', 1)),
                
                update => update.call(update => update.transition(t)
                    .attr('transform', d => `translate(${labelArc.centroid(d)})`)
                    .text(d => xCoordinate(d.data))),
                
                exit => exit.call(exit => exit.transition(t)
                    .style('opacity', 0)
                    .remove())
            );

        // Add hover effects
        slices
            .on('mouseover', function() {
                select(this)
                    .transition()
                    .duration(300)
                    .style('opacity', 1)
                    .attr('transform', function(d) {
                        const centroid = arcGenerator.centroid(d);
                        const x = centroid[0] * 0.1;
                        const y = centroid[1] * 0.1;
                        return `translate(${x},${y})`;
                    });
            })
            .on('mouseout', function() {
                select(this)
                    .transition()
                    .duration(300)
                    .style('opacity', 0.8)
                    .attr('transform', 'translate(0,0)');
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

    my.margin = function(_) {
        return arguments.length ? (margin = _, my) : margin;
    };

    return my;
};