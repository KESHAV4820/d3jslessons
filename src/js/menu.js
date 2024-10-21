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
              listeners.call('change', null, event.target.value);//Super This line of code is actually sending the content that we clicked on, to controller.js .on() method.😎💃🕺 but why! there is "null". here if you put an object which is going to be refered with "this" keyword in controller.js, given the condition that you are using the oldschool way of function notation. but using "this" is a tricky business. becouse it could resolve to anything. Hence nope. Hence null. Here null simply says that the announcement of the event isn't for any one but for all.    
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