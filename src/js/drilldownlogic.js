/*SuperMarvelConceptLearnByHeart Knowledge Gap
*this module is meant to use a system of logic that will always point in one direction which is ZONE➡️STATE➡️CITY
 * That is, in which ever chart, this logic will be used, with appropriate modifications, it will render data of states within that zone. If clicked item was say related to State, then after the click, it will render city within that state related data
 */
export const createDrillDownHandler = () => {
    // Object For Tracking the drill-down state
    const drillDownState = {
        currentLevel: 'zone', // Can be 'zone', 'state', or 'city'. Default being zone
        history: [], // Stack to track drill-down history. That is, it stores you current states so that it will be used in future to bring you to the same place when you press the history button 
        filters: {} // Current active filters
    };

    //Object to point the Geography hierarchy definition
    const geoHierarchy = {
        zone: {
            idField: 'zone_name',
            scoreField: 'zone_score',
            nextLevel: 'state'
        },
        state: {
            idField: 'state_name',
            scoreField: 'state_score',
            nextLevel: 'city'
        },
        city: {
            idField: 'city_name',
            scoreField: 'city_score',
            nextLevel: null
        }
    };

    // Handling function for drill-down clicks
    const handleDrillDown = (clickedData, currentData) => {
        console.log(clickedData);//debugging log
        console.log(currentData);//debugging log
        
        const currentLevel = drillDownState.currentLevel;// To register which field is currently selected on the x-axis dropDown menu to get the next Geographical location it will point.
        const nextLevel = geoHierarchy[currentLevel].nextLevel;// Got the next level of Geolocation based on currentlevel.Just Beautiful
        
        if (!nextLevel) {
            console.log('At lowest level - no further drill-down possible');
            return null;
            //Using this code for now. Latter on, i will try to use some indicators or make it irr-responsive.
        }

        // Store current state in history for back navigation
        drillDownState.history.push({
            level: currentLevel,//which option on x-axis dropdown menu
            filters: {...drillDownState.filters}// To save the current set of filters like selections on all the dropdown menus present on the chart like Exam name, Exam Tier, Exam Year, Chart type and axis dropdown menu
        });

        // Updating the filters based on clicked item Very tricky. Take A Good Look Marvel
        drillDownState.filters[geoHierarchy[currentLevel].idField] = clickedData[geoHierarchy[currentLevel].idField];
        drillDownState.currentLevel = nextLevel;

        // Generate menu update parameters
        const updates = {
            'x-menu': geoHierarchy[nextLevel].idField,
            'y-menu': geoHierarchy[nextLevel].scoreField,
            ...drillDownState.filters
        };

        return {
            type: 'batch',
            updates
        };
    };

    // Handler for navigating back up the hierarchy
    const handleDrillUp = () => {
        if (drillDownState.history.length === 0) {
            console.log('At top level - cannot drill up');
            return null;
        }

        const previousState = drillDownState.history.pop();
        drillDownState.currentLevel = previousState.level;
        drillDownState.filters = previousState.filters;

        // Generate menu update parameters
        const updates = {
            'x-menu': geoHierarchy[previousState.level].idField,
            'y-menu': geoHierarchy[previousState.level].scoreField,
            ...previousState.filters
        };

        return {
            type: 'batch',
            updates
        };
    };

    // Get current drill-down level info
    const getCurrentLevelInfo = () => ({
        level: drillDownState.currentLevel,
        fields: geoHierarchy[drillDownState.currentLevel],
        filters: drillDownState.filters,
        canDrillDown: !!geoHierarchy[drillDownState.currentLevel].nextLevel,//ConceptNote:"!!" it's used to coerce a value to a boolean. In JavaScript, strings are "truthy" values (they evaluate to true in a boolean context), while null is a "falsy" value (evaluates to false).Here, we want canDrillDown to be a boolean value (true or false).Hence we used type coersion and to do that we used "!!"😎.
        canDrillUp: drillDownState.history.length > 0
    });

    // Reset drill-down state
    const reset = () => {
        drillDownState.currentLevel = 'zone';
        drillDownState.history = [];
        drillDownState.filters = {};
    };

    return {
        handleDrillDown,
        handleDrillUp,
        getCurrentLevelInfo,
        reset
    };
};