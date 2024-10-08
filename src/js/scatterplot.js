'use strict'

export const scatterPlot = () => {
    let width,height;
    const my = () => {

        return my;
    };
    // Now defining getter and setter functions for above my();
    my.height=function(_){
        (arguments.length)?(height = +_, my):height;
    }; 
    /*SuperNoteMarvel
    Note that we are using this expression from d3.js axis documentation.Super There they had used underscore _ as the name of the variable in getter, setter function. Hence, i am using it as well. Not get bothered. It's just being used as variable name.LearnByHeartTake A Good LookRemember It "height = +_, my" this expression has a great Concept hidden in it. There is implicit return involved in it. That is inside a ternarry operation, like (condition)?(expression1, expression2):(); when "condition" is checked, if the condition is found true, then (expression1,expression2) section is executed. now SuperNoteVIE "expression1" is calculated and "expression2" is always returned IMPLICITLY. That's how this construct works in JS , this property is to facilitate method chaining.LearnByHeartJust Beautiful
    */ 

    my.width=function(_){
        (arguments.length)?(width = +_, my):width;
    };
};