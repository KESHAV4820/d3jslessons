'use strict'

{/*Take A Good LookVIELearnByHeart Concept on dispatch library
    .on() setter getter function in menu.js has very important and intricate logic for implementing event listeners to it. 
        🅰️ import { dispatch } from "d3";
        Imagine you're setting up a new restaurant. You're importing a special communication system (dispatch) that's commonly used in the restaurant industry.
        const listeners = dispatch('change');
        This is like setting up a special announcement system in your restaurant that can broadcast messages about menu changes. You've labeled this system "change" because it's specifically for announcing changes.
        but why! are we using dispatch? ⭐You can have several components respond to the same event without them needing to know about each other.⭐dispatch allows you to create and trigger custom events easily. ⭐Using dispatch provides a centralized place to manage all the events for a component.
        🅱️  .on('change', (event) => { ... }
        This is like instructing your waitstaff to listen for announcements about menu changes. When they hear an announcement, they should do something specific (in this case, log information and pass it along).
        listeners.call('change', null, event.target.value);
        This is like using the announcement system to broadcast a message about a menu change. The null is like saying "this message is for everyone, not a specific person," and event.target.value is the actual content of the message (e.g., "We're out of fish today").
        and now this data is funneled using our d3 dispatch library to the controller.js call back function used inside the.on() method has been used. Note: this process of funneling this data is done  by listeners.call(). Think of it like a pipe line
*/}
{/* Note: this is a model for the menu button we are going to use.
     WE shall create this structure within menu(), programatically.😎.
    <label for="cars">Choose cars:</label>
<select name="cars" id="cars">
    <Option value="volvo">Volvo</Option>
    <Option value="ms">Maruti Suzuki</Option>
    <Option value="hundai">Hundai</Option>
    <Option value="tata">TATA</Option>
</select> 
*/}
import { dispatch, select as d3Select } from "d3";//Note For event listening.
import { appState, clearChartData, currentChartType } from "./controller";
import { drillDownHandler } from "./controller";
// import { resetBarChart } from "./drilldownlogic";
//Create a global state to track pending changes
// const pendingChanges = new Map();

export const menu = () => {
    let id;
    let textForMenuLabel;
    let optionsWithinMenu;
    // let changeHandler;
    const listeners= dispatch('change','clear','apply');//SuperNote other types of event like change are start or brush or end or clear
    let sharedButtonContainer;

    // Updating the options programmatically for menu-axis coupling
    const updateOptions = (newOptions) => {
        optionsWithinMenu = newOptions;
        return my;
    };

    // Set value programmatically
    const setValue = (newValue) => {
        const select = document.getElementById(id);
        if (select) {
            select.value = newValue;

            // forwarding the change event for the use by other components
            listeners.call('change', null, {
                menuId: id,
                value: newValue,
                programmatic: true // This will be value when y-axis menu value changes due to coupling, not user action
            });
        };
        return my;
    };

const my = (svg1) => {
    svg1.selectAll('label')
        .data([null])
        .join('label')
        .attr('for', id)
        .text(textForMenuLabel);

    const select = svg1.selectAll('select')
        .data([null])
        .join('select')
        .attr('name', id)
        .attr('id', id)
        .on('change', (event) => {
            // Dispatching the change event with both menuId and value
            listeners.call('change', null, {
                menuId: id,
                value: event.target.value,
                programmatic: false // This will be the flag value when user action happens
            });
        });

    select.selectAll('option')
        .data(optionsWithinMenu)
        .join('option')
        .attr('value', (d) => d.value)
        .text((d) => d.text);

    // Create or update shared button container
    if (!sharedButtonContainer) {
        sharedButtonContainer = d3Select('body')
            .append('div')
            // .join('div')
            .attr('class', 'shared-control-buttons')
            // .style('position', 'fixed')
            .style('margin-top', '10px')
            // .style('right', '10px')
            .style('display', 'flex')
            .style('gap', '10px');

        // Add OK button
        sharedButtonContainer
            // .selectAll('.apply-button')
            .append('button')
            // .data([null])
            // .join('button')
            .attr('class', 'apply-button')
            .text('OK')
            .on('click', () => {
                // Get current select values for all menus
                const batchUpdates = {};
                const menuIds=['x-menu','y-menu','menu-examname','menu-examtier','menu-examyear','menu-charttype'];
                    menuIds.forEach(menuId => {
                    const select = document.getElementById(menuId);
                    if (select) {
                        batchUpdates[menuId] = select.value;
                    }
                });
                console.log('Batch Updates:', batchUpdates);//Code Testing

                // Reseting geographical filters when OK button is pressed to avoid any drill down related parameter
                if (appState.currentChartType==='barChartPlot') {
                    appState.selectedZone = null;
                    appState.selectedState = null;
                    if (drillDownHandler) {
                        // resetBarChart;
                        drillDownHandler.resetBarChart();
                        console.log('Reset of drillDownHandler has been attempted');//debugging log
                    }
                    console.log('Reset geographical filters on OK button press. appState: ',appState);
                }
                
                // Dispatch apply event with all updates
                    if (Object.keys(batchUpdates).length>0) {
                        listeners.call('apply', null,{
                            type:'batch',
                            updates: batchUpdates
                        });
                    } else {
                        console.warn('No menu values found to update');
                    }
    
                    // handleMenuUpdate({menuId, value});
                // });
            });

        // Add Clear Graph button
        sharedButtonContainer
            // .selectAll('.clear-graph-button')
            // .data([null])
            // .join('button')
            .append('button')
            .attr('class', 'clear-graph-button')
            .text('Clear Graph')
            .on('click', () => {
                // To reset the drilldown state for barchart not working as of now.
                // console.log(drillDownHandler);//debugging log
                
                // if (currentChartType === 'barChartPlot') {
                //     drillDownHandler.resetBarChart();
                // };
                const chartWrapper = document.querySelector('.chart-wrapper');
                if (chartWrapper) {
                    const svg=d3Select(chartWrapper)
                    .select('svg');
                    // Remove only data driven elements, preserving the rest of the structure.
                    svg.selectAll('.line, .linedata-point, .bar, .pie-group, .scatter-point, .x-grid, .y-grid, .grid-group')
                    .remove();

                }
                //To clear the global variable named "globalChartData" in controller.js which helps in cumulative rendering of graphs
                clearChartData(currentChartType);


                listeners.call('clear', null);
            });
    }
};            


    // Now defining getter and setter functions for above my();
    my.id=function(_){
        return arguments.length?(id = _, my):id;
    }; 
    my.textForMenuLabel=function(_){
        return arguments.length?(textForMenuLabel = _, my):textForMenuLabel;
    }; 
    my.optionsWithinMenu=function(_){
        return arguments.length?(optionsWithinMenu = _, my):optionsWithinMenu;
    }; 
    //👇SuperVIELearnByHeartMarvelTake A Good LookJust Beautiful
    my.on = function(){
        let value = listeners.on.apply(listeners, arguments);
        return value === listeners? my: value;
    };

    // Take A Good LookConcept: it's not a getter or setter function. It normal function that we are exposing to the outside world.
    //  Exposing the updateOptions method to the outside world
    my.updateOptions = updateOptions;
    // Exposing the setValue method to the outside world
    my.setValue = setValue;
 
    return my;

};