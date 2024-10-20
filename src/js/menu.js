'use strict'

{/* Note: this is a model for the menu button we are going to use. WE shall create this structure within menu(), programatically.😎.
    <label for="cars">Choose cars:</label>
<select name="cars" id="cars">
    <Option value="volvo">Volvo</Option>
    <Option value="ms">Maruti Suzuki</Option>
    <Option value="hundai">Hundai</Option>
    <Option value="tata">TATA</Option>
</select> 
*/}
import { dispatch } from "d3";//Note For event listening.
export const menu = () => {
    let id;
    let textForMenuLabel;
    let optionsWithinMenu;
    // let changeHandler;
    const listeners= dispatch('change');//SuperNote other types of event like change are start or brush or end

    const my = (svg1) => {	
        svg1.selectAll('label')
            .data([null])
            .join('label')
            .attr('for', id)
            .text(textForMenuLabel);

        svg1.selectAll('select')
            .data([null])
            .join('select')
            .attr('name', id)
            .attr('id', id)
            .on('change', (event) => {
              console.log(event);//Code Testing
              console.log(event.target.value);//Code Testing
              listeners.call('change', null, event.target.value);//Super This line of code is actually sending the content that we clicked on, to controller.js .on() method.😎💃🕺
              
            })//SuperVIERemember It
            .selectAll('option')
            .data(optionsWithinMenu)
            .join('option')
            .attr('value',(d) => d.value)
            .text((d) => d.text);
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
    //👇SuperImportant
    my.on = function(){
        let value = listeners.on.apply(listeners, arguments);
        return value === listeners? my: value;
    };
 
    return my;

};