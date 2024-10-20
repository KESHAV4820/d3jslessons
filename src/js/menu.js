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

export const menu = () => {
    let id;
    let textForMenuLabel;
    let optionsWithinMenu;

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
 
    return my;

};