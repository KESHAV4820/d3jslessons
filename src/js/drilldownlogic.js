/*SuperMarvelConceptLearnByHeart Knowledge Gap
*this module is meant to use a system of logic that will always point in one direction which is ZONE➡️STATE➡️CITY
 * That is, in which ever chart, this logic will be used, with appropriate modifications, it will render data of states within that zone. If clicked item was say related to State, then after the click, it will render city within that state related data
 */
export const createDrillDownHandler = (fullDataset) => {
    // Storing the full Data set👹😈. No more mind fuck
        const completeData = fullDataset;

        const setCurrentLevel = (level) => {
            if (['zone', 'state', 'city'].includes(level)) {
                drillDownState.currentLevel = level;
                console.log(`Drill-down level set to: ${level}`);
            } else {
                console.error(`Invalid level: ${level}`);
            }
        };

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

     // New filtering function
     const filterDataByGeography = (clickedItem) => {

        console.log(clickedItem);//debugging log output:
        console.log('data reaching filterDataByGeography at the start:',completeData);//debugging log output:
        
        const currentLevel = drillDownState.currentLevel;
        const nextLevel = geoHierarchy[currentLevel].nextLevel;
        
        if (!nextLevel) return null;

        // Get the clicked item's geographical identifiers
        const examFilters = {
            exam_name: clickedItem.exam_name,
            exam_year: clickedItem.exam_year,
            exam_tier: clickedItem.exam_tier
        };
        
        // Separating the data filtration and handling for zone➡️state and state➡️city drilldown.
        if (currentLevel === 'zone') {
            // zone to state transition
            const zoneFilter ={
                ...examFilters,
                zone_name: clickedItem.zone_name
            };
            console.log('meta data in zonetostate: ',currentLevel,nextLevel,zoneFilter);//debugging log

            // data filteration for this drill down
            const stateResults = completeData.filter((item) => 
            Object.entries(zoneFilter).every(([key, value]) => item[key]===value));
            console.log('stateResults =',stateResults);//debugging log
            

            // De-duplicating the above result
            const uniqueStates = Array.from(
                new Set(stateResults.map(
                    (item) => item.state_name
                ))).map(
                    (stateName) => stateResults.find(
                        (item) => item.state_name === stateName)
                );
                console.log('State Data after de-duplication: ',uniqueStates);//debugging log
                
            return uniqueStates;
        }
        else if (currentLevel === 'state'){
            // state to city transition. Note this stage can't depend on the filterd data of above drilldown stage. It's becouse of the     structure of the data storage in our .csv file. Also, it's a ONE➡️MANY relation where MANY is also unique enteris and hence, no de-duplication is needed.
            const stateFilter ={
                ...examFilters,
                zone_name: clickedItem.zone_name,
                state_name: clickedItem.state_name
            };
            console.log('meta data in statetocity: ',currentLevel,nextLevel,stateFilter);//debugging log
            // only the data filtration needed
            const cityResults = completeData.filter(
            (item) =>Object.entries(stateFilter).every(([key, value]) => {
                const matchs= item[key] === value
                // console.log('comparing',key,': ',item[key]=== value,': ',matchs);//debugging log
                return matchs;
            })
        );
            
            console.log(cityResults);//debugging log
            console.log('City Result found: ', cityResults.length);//debugging log

            //Ensure we have valid city data
            if (cityResults.length === 0) console.log('No city data found for: ', stateFilter);//debugging log
            
            return cityResults;
        };
        return null;
        //legacy codeBug Found it was using the filtered data from zone➡️state drill down for state➡️city drill down and hence only first city of the state was getting rendered. // Now we shall add geographic parameter like zone_name or state_name or city_name based on current level, in the filters that we have updated just above☝🏼
        // switch (currentLevel) {
        //     case 'zone':
        //         filters.zone_name = clickedItem.zone_name;
        //         break;
        //     case 'state':
        //         filters.zone_name = clickedItem.zone_name;
        //         filters.state_name = clickedItem.state_name;
        //         break;
        //     default:
        //         console.warn('Unknown level:', currentLevel);
        //         return null;
        // }

        // // Filter the data based on all criteria
        // const filteredData = data.filter(item => {
        //     return Object.keys(filters).every(key => item[key] === filters[key]);
        // });
        // if (filteredData.length === 0) {
        //     console.warn('No data found after filtering');
        //     return null;
        // }

        // //For State ➡️ city, there is one to many relationship, but since the names of each city is unique, Hence we need not remove duplicates.
        // if (currentLevel === 'state'){
        //     return filteredData;// returning the control right from here.😎
        // };

        // // Remove duplicates for Zone ➡️ state case, becouse there is one to many relation, but names of states are repeated in the .csv file.
        // const nextLevelField = geoHierarchy[nextLevel].idField;
        // const uniqueItems = Array.from(new Set(filteredData.map(item => item[nextLevelField])))
        //     .map(uniqueValue => {
        //         return filteredData.find(item => item[nextLevelField] === uniqueValue);
        //     });

        // return uniqueItems;
    };

    // Handling function for drill-down clicks
    const handleDrillDown = (clickedData) => {
        console.log('Drill-down triggered for:',clickedData);//debugging log output: {exam_name: 'CGL', exam_year: 2016, exam_tier: 1, zone_name: 'NR', zone_score: 450241, …} like city_name: "Sikar" city_score: 0 exam_name: "CGL" exam_tier: 1 exam_year: 2016 state_name: "Rajasthan" state_score: 131834 zone_name:"NR" zone_score:450241
        // console.log(currentData);//debugging log output: (235) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…},  …]
        
        const currentLevel = drillDownState.currentLevel;// To register which field is currently selected on the x-axis dropDown menu to get the next Geographical location it will point.
        const nextLevel = geoHierarchy[currentLevel].nextLevel;// Got the next level of Geolocation based on currentlevel.Just Beautiful
        
        if (!nextLevel) {
            console.log('At lowest level - no further drill-down possible');
            return null;
            //Using this code for now. Latter on, i will try to use some indicators or make it irr-responsive.
        };

        console.log('data being fed to filterDataByGeography() :',clickedData);//debugging log
        
        // Filter data for next level
        const filteredData = filterDataByGeography(clickedData);
        console.log('data comming out of filterDataByGeography() :',filteredData);//debugging log
        
        
        if (!filteredData || filteredData.length === 0) {
            console.warn('No data found for next level');
            return null;
        };
        console.log('drillDownState: ', drillDownState);//debugging log
        
        // Store current state in history for back navigation
        drillDownState.history.push({
            level: currentLevel,//which option on x-axis dropdown menu
            filters: {...drillDownState.filters}// To save the current set of filters like selections on all the dropdown menus present on the chart like Exam name, Exam Tier, Exam Year, Chart type and axis dropdown menu
        });

        // Clear previous filters if starting a new drill down from zone level Note: becouse state_name: parameter in "updates" object was persisting(Bug) when it shouldn't have, that is when pressing OK after a drill down.
        if (currentLevel === 'zone') {
            //Reseting the filters completely😈 wehn starting from zone level😼 to avoid the Bug
            drillDownState.filters = {};
        };
        console.log('drillDownState:',drillDownState);//debugging log
        

        // Updating the filters based on clicked item Very tricky. Take A Good Look Marvel
        drillDownState.filters[geoHierarchy[currentLevel].idField] = clickedData[geoHierarchy[currentLevel].idField];
        drillDownState.currentLevel = nextLevel;
        console.log('drillDownState:',drillDownState);//debugging log
        

        // Generate menu update parameters
        const updates = {
            'x-menu': geoHierarchy[nextLevel].idField,
            'y-menu': geoHierarchy[nextLevel].scoreField,
            ...drillDownState.filters
        };
        console.log('updates before adding current filters: ',updates);//debugging log
        
        // Add current filters to updates
        Object.keys(drillDownState.filters)
              .forEach( (key) => {	
                updates[key] = drillDownState.filters[key];
        });

        console.log('Final drill-down updates:', updates);//debugging log

        return {
            type: 'batch',
            updates,
            filteredData // Include filtered data in the response
        };
    };

    // Handler for navigating back up the hierarchy
    const handleDrillUp = () => {
        if (drillDownState.history.length === 0) {
            console.log('At top level - cannot drill up');
            return null;
        };

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
    const resetBarChart = () => {
        // level -specific reset logic
        switch (drillDownState.currentLevel) {
            case 'zone':
                drillDownState.filters={};
                break;
            case 'state':
                // delete drillDownState.filters['state_name'];
                drillDownState.filters={};
                break;
            case 'city':
                delete drillDownState.filters['city_name'];
                break;
        }


        drillDownState.currentLevel = 'zone';
        drillDownState.history = [];
        drillDownState.filters = {};
        console.log('barchart reset has been fired', drillDownState.currentLevel, drillDownState.history, drillDownState.filters);//debugging log
        
    };

    return {
        handleDrillDown,
        handleDrillUp,
        getCurrentLevelInfo,
        resetBarChart,
        setCurrentLevel
    };
};

export const {resetBarChart}=createDrillDownHandler;