class NebosProject {
    constructor(divID) {
        this.ProjectName;
        this.endPoint;
        this.data = [];
        this.models = [];
        this.workflows = [];
        this.studies = [];
    }

    initialise() {
        this.ProjectName = "Test1";
        this.endPoint = AirCADiaProject;

        //this.data.push({ "name": "x1", 'category': 'system.wing.span', 'description': 'Wing span of the aircraft', "type": "Double", "value": 2, "unit": "[ft]", "minValue": 0, "maxValue": 100 });
        //this.data.push({ "name": "x2", 'category': 'system.wing.area', 'description': 'Wing area of the aircraft', "type": "Double", "value": 5, "unit": "[ft2]", "minValue": 0, "maxValue": 100 });
        //this.data.push({ "name": "y1", 'category': 'system.wing.weight', 'description': 'Wing weight of the aircraft', "type": "Double", "value": 2, "unit": "[kg]", "minValue": 0, "maxValue": 1000 });

        //this.models.push(
        //    {
        //        "name": "AddNumbers",
        //        "description": "",
        //        "endPoint": 'https://aircadiatest1.azurewebsites.net/api/modelexecution',
        //        "inputs": [
        //            { "name": "x1", "value": 2 },
        //            { "name": "x2", "value": 34 }
        //        ],
        //        "outputs": [
        //            { "name": "y1", "value": 0 }
        //        ]
        //    });

        //this.workflows.push(
        //    {
        //        "name": "DefWorkflow1"
        //    });

        //this.workflows.push(
        //    {
        //        "name": "DefWorkflow2"
        //    });
    }

    getData(dataName) {
        // get model object
        let data;
        for (var i = 0; i < this.data.length; i++) {
            if (this.data[i].name == dataName) {
                data = this.data[i];
                break;
            }
        }
        return data;
    }

    getModel(modelName) {
        // get model object
        let model;
        for (var i = 0; i < this.models.length; i++) {
            if (this.models[i].name == modelName) {
                model = this.models[i];
                break;
            }
        }
        return model;
    }

    getWorkflow(workflowName) {
        // get workflow object
        let workflow;
        for (var i = 0; i < this.workflows.length; i++) {
            if (this.workflows[i].name == workflowName) {
                workflow = this.workflows[i];
                break;
            }
        }
        return workflow;
    }
}