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
    color
} from 'd3';
import { appState } from '../controller';
import { currentYField } from '../controller';

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
        svg1.selectAll('.line, .linedata-point')
            .remove();
        console.log('Data received in lineChartPlot: ',dataReceived);//debugging log
        
        // to handle multiple series
        // const allData = Array.isArray(dataReceived) ? [{data:dataReceived}]: Object.values(dataReceived);//Bug Found
        // new data transformation logic
        let allData;
        if (Array.isArray(dataReceived)) {
        // If dataReceived  is an array, it's a single series
        allData = [{
            data: dataReceived,
            color:'#4682B4'
        }];
        } else if (typeof dataReceived === 'object'){
            // If dataReceived is an object containing multiple series
            allData = Object.values(dataReceived);
        } else {
            console.error('Invalid data format received');
            return;
        };
        allData[0].data.forEach((d) => console.log(d));//debugging log
        console.log('Processed allData: ',allData);//debugging log
        console.log(allData[0]);//debugging log
        // console.log(allData[0].data[0].data);//debugging log
        // console.log(allData[0].data[0].data);//debugging log
        
        

        // Above transformation is outputing data on 3rd level of nesting. that is, inside allData array, there are many objects having dataset information, in an Array of object fashion, now inside each data object,there are two parameters named color and data. so to reach all of the data set like d1 for one selection of data, d2 for next set of selection of data,and so on we need to iterate over the allData variable which is array of object.So we are using helper functions which will access these long chains of parameters. 
        const getDataFromSeries = (series) => {	
            if (series.data?.[0]?.data) {
                return series.data[0].data;
            }
            // if series has direct data array
            return series.data;
        	};
        const getColorFromSeries = (series) => {	
            if (series.data?.[0]?.color) {
                return series.data[0].color;
            }
            return series.color;
        	};

        // Get all unique x-values and all y-values properly
        // const allXValues =[...new Set(allData.flatMap((series) => series.data[0].data.map((d) => xCoordinate(d))))];
        const allXValues = [...new Set(allData.flatMap((series) => getDataFromSeries(series).map((d) => xCoordinate(d))
        ))];
        // const allYValues = allData.flatMap((series) => series.data[0].data.map((d) => yCoordinate(d)));
        const allYValues = allData.flatMap((series) => getDataFromSeries(series).map((d) => yCoordinate(d))
        );
        
        // create scales using all data points
        // const allPoints = allData.reduce((acc, series) => {	acc.concat(series.data), []});

        // const pointPadding = dataReceived.length > 150 ? 0.2 : 0.5;
        // console.log('data received:',dataReceived);//debugging log
        
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
                // console.log(xCoordinate(d));//debugging log
                return xScale(xCoordinate(d))})
            .y(d => {
                    // console.log(yCoordinate(d));//debugging log
                                    
                return yScale(yCoordinate(d))
            });

        const t = transition().duration(1000);

        //Render each series separately
        allData[0].data.forEach((series, index) => {
            // const color = series.color || '#4682B4';
            const seriesData = getDataFromSeries(series);
            const seriesColor = getColorFromSeries(series);
            console.log(seriesColor,seriesData);//debugging log
            
            // Create line
            svg1.append('path')
                // .datum(series.data[0].data)
                .datum(seriesData)
                .attr('class', 'line')
                .attr('fill', 'none')
                // .attr('stroke', series.data[0].color)
                .attr('stroke', seriesColor)
                .attr('stroke-width', 2)
                .attr('d', lineGenerator)
                .call(enter => enter.transition(t)
                    .attr('d', lineGenerator));
    
            // Now adding the data points on this line for better understanding of the user
            svg1.selectAll(null)
                // .data(dataReceived)
                // .data(series.data[0].data)
                .data(seriesData)
                .join('circle')
                .attr('class', 'linedata-point')
                .attr('cx', d => xScale(xCoordinate(d)))
                .attr('cy', d => yScale(yCoordinate(d)))
                .attr('r', 10)
                // .attr('fill', series.color || '#4682B4')
                // .attr('fill', series.data[0].color)
                .attr('fill', seriesColor)
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
