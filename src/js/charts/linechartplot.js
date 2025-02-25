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
    max,
    color,
    index
} from 'd3';
import { appState } from '../controller';
import { currentYField } from '../controller';
import { exit } from 'process';

const commaFormat = format(',');

export const lineChartPlot = () => {
    let width, height;
    let dataReceived;
    let xCoordinate, yCoordinate;
    let margin;
    let xAxisLabel = "PLACES →";
    let yAxisLabel = "CANDIDATE COUNT →";

    const my = (svg1) => {
        // To Clear pre-existing elements
        svg1.selectAll('.line, .linedata-point, .x-grid, .y-grid, .grid-group')
            .remove();
        console.log('Data received at the start in lineChartPlot: ',dataReceived);//debugging log
        
        
        
        console.log('Processed dataReceived: ',dataReceived);//debugging log
        // console.log('dataReceived[0] :',dataReceived[0]);//debugging log
        console.log(Object.entries(dataReceived));//debugging log
        Object.entries(dataReceived).forEach(([key, value]) => console.log(key,':',value)//debugging log
        );
        Object.entries(dataReceived).forEach(([key,value]) => {
            console.log(value.data);//debugging log
            console.log(value.color);//debugging log
        });
        
        // console.log('dataReceived[0].data :',dataReceived[0].data);//debugging log
        // console.log('Object.values(dataReceived[0].data) :',Object.values(dataReceived[0].data));//debugging log
        // Object.values(dataReceived[0].data).forEach((eachSeries) => console.log('iteration within dataReceived[0].data',eachSeries.data, eachSeries.color));
        // console.log(dataReceived[0].data[0].color);//debugging log
        
        
        // Above transformation is outputing data on 3rd level of nesting. that is, inside dataReceived array, there are many objects having dataset information, in an Array of object fashion, now inside each data object,there are two parameters named color and data. so to reach all of the data set like d1 for one selection of data, d2 for next set of selection of data,and so on we need to iterate over the dataReceived variable which is array of object.So we are using helper functions which will access these long chains of parameters. 
        
        //trying to transform the nested🤮data into consistant format(2nd attempt👹)
        const seriesData=Object.entries(dataReceived).filter(([key]) => key !== 'color' && key !== 'data').map(([key,series]) => {	
            return {
                id:key,
                data:series.data,
                color:series.color,
                xField:series.xField,
                yField:series.yField
                };
        	});
            console.log('seriesData:',seriesData);//debugging log
            

        // Get all unique x-values and all y-values properly
        const allXValues = [...new Set(
            seriesData.flatMap((series) => series.data.map((d) => xCoordinate(d))
            ))];
        console.log('allXvalues: ',allXValues);//debugging log
        
        
        const allYValues = seriesData.flatMap((series) => series.data.map((d) => yCoordinate(d)));
        console.log('allYvalues: ',allYValues);//debugging log
        
        
        // Create scales
        const xScale = scalePoint()
            // .domain(dataReceived.map(xCoordinate))
            .domain(allXValues)
            .range([margin.left, width - margin.right])
            // .padding(pointPadding);
            .padding(allXValues.length > 150 ? 0.2 : 0.5);

        const yScale = scaleLinear()
            // .domain([min(dataReceived, yCoordinate), max(dataReceived, yCoordinate)])
            .domain([min(allYValues), max(allYValues)])
            .range([height - margin.bottom, margin.top]);

        // Create line generator
        const lineGenerator = line()
            .x(d => {
                console.log(xCoordinate(d));//debugging log
                return xScale(xCoordinate(d))})
            .y(d => {
                    console.log(yCoordinate(d));//debugging log
                                    
                return yScale(yCoordinate(d))
            });

        const t = transition().duration(1000);

        //Render each series separately
        seriesData.forEach(eachDataset =>{
            
            // Create line
            svg1.append('path')
                // .datum(series.data[0].data)
                .datum(eachDataset.data)
                .attr('class', 'line')
                .attr('fill', 'none')
                // .attr('stroke', series.data[0].color)
                .attr('stroke', eachDataset.color)
                .attr('stroke-width', 2)
                .attr('d', lineGenerator)
                .call(enter => enter.transition(t)
                    .attr('d', lineGenerator));
    
            // Now adding the data points on this line for better understanding of the user
            svg1.selectAll(null)
                // .data(dataReceived)
                // .data(series.data[0].data)
                .data(eachDataset.data)
                .join('circle')
                .attr('class', 'linedata-point')
                .attr('cx', d => xScale(xCoordinate(d)))
                .attr('cy', d => yScale(yCoordinate(d)))
                .attr('r', 10)
                // .attr('fill', series.color || '#4682B4')
                // .attr('fill', series.data[0].color)
                .attr('fill', eachDataset.color)
            //Adding hower response on these circles on the line
                .append('title')
                .text((d) => `${xCoordinate(d)}: ${yCoordinate(d)} Exam: ${d.exam_name} ${d.exam_year} tier:${d.exam_tier}`);
                // .text((d) => {	
                //     // console.log(d);//debugging log
                    
                //     return JSON.stringify({
                //         type: 'batch',
                //             updates: {
                //         'x-menu': xCoordinate(d),
                //         'y-menu': appState.currentYField,
                //         'menu-examname': d.exam_name,
                //         'menu-examtier': d.exam_tier,
                //         'menu-examyear': d.exam_year
                //         }
                //     },null,2);
                // 	});
        });

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
