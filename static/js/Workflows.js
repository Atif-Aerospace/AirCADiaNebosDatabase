var workflows_form = [
    {
        cols: [
            { view: "text", id: 'CreateWorkflowUI_WorkflowName', label: 'Name', name: 'workflowName', labelAlign: 'left' },
            { view: "text", id: "CreateWorkflowUI_WorkflowCategory", label: 'Category', name: "workflowCategory", labelAlign: 'left' }
        ]
    },
    { view: "textarea", id: "CreateWorkflowUI_WorkflowDescription", label: 'Description', name: "workflowDescription", labelAlign: 'left', height: 100 },
    { view: "combo", label: 'Type', name: "workflowType", labelAlign: 'left', value: "Mode 1", options: ['Mode 1', 'Mode 2', 'Mode 3', 'Mode 4'] },
    {
        cols: [
            { view: "list", id: "CreateWorkflowUI_AvailableModelsList", template: "#title#", minHeight: 150, select: true, data: [] },
            {
                rows: [
                    { view: "button", label: '>>', name: "shiftRightModel", margin: 5, width: 30, click: CreateWorkflowUI_ShiftRightModel },
                    { view: "button", label: '<<', name: "shiftLeftModel", margin: 5, width: 30, click: CreateWorkflowUI_ShiftLeftModel }
                ]
            },
            { view: "list", id: "CreateWorkflowUI_SelectedModelsList", template: "#title#", minHeight: 150, select: true, data: [] },
        ]
    },
    {
        cols: [
            { view: "button", label: 'Load Default Data', name: "loadDefaultData", align: 'right', margin: 5, width: 200 },
        ]
    },

    {
        cols: [
            { view: "list", id: "CreateWorkflowUI_DataInputsList", template: "#title#", minHeight: 150, select: true, data: [] },
            {
                rows: [
                    { view: "button", label: '>>', name: "shiftRightData", margin: 5, width: 30 },
                    { view: "button", label: '<<', name: "shiftLeftData", margin: 5, width: 30 }
                ]
            },
            { view: "list", id: "CreateWorkflowUI_DataOutputsList", template: "#title#", minHeight: 150, select: true, data: [] },
        ]
    },
    {
        margin: 5, cols: [
            { view: "button", label: "Create", width: 120, click: CreateWorkflow },
            { view: "button", label: "Reset", width: 120, },
            { view: "button", label: "Cancel", width: 120, },
        ]
    }
];

function ShowWorkflowsUI() {
    $$("tabview1").addView({
        header: "Workflows", width: 100,
        body: {
            id: "editWorkflowUI",
            view: "scrollview",
            scroll: "auto",
            body: {
                //view: "align", align: "center",
                //body: {
                view: "form", scroll: false, margin: 5,
                align: 'center',
                elements: workflows_form,
                elementsConfig: {
                    labelPosition: "top",
                    labelWidth: 140,
                    //}
                }
            }
        }
    });

    UpdateAvailableModelsList();

    $$("editWorkflowUI").show();
}

function UpdateAvailableModelsList() {
    for (let i = 0; i < nebosProject.models.length; i++) {
        $$("CreateWorkflowUI_AvailableModelsList").data.add({ title: nebosProject.models[i].name });
    }
}







// Shift data from "available list" to "model inputs list"
function CreateWorkflowUI_ShiftRightModel() {
    let selectedDataItems = $$("CreateWorkflowUI_AvailableModelsList").getSelectedItem();
    if (selectedDataItems !== undefined) {
        // add the selected items
        if (selectedDataItems.length === undefined) {
            $$("CreateWorkflowUI_SelectedModelsList").data.add({ title: selectedDataItems.title });
        }
        else {
            let dataItem;
            for (let i = 0; i < selectedDataItems.length; i++) {
                dataItem = selectedDataItems[i];
                $$("CreateWorkflowUI_SelectedModelsList").data.add({ title: dataItem.title });
            }
        }
        // removes the selected items
        $$("CreateWorkflowUI_AvailableModelsList").remove($$("CreateWorkflowUI_AvailableModelsList").getSelectedId());


        // update data lists
        CreateWorkflowUI_UpdateDataLists();
    }
}

// Shift data from "model inputs list" to "available list"
function CreateWorkflowUI_ShiftLeftModel() {
    let selectedDataItems = $$("CreateWorkflowUI_SelectedModelsList").getSelectedItem();
    if (selectedDataItems !== undefined) {
        // add the selected items
        if (selectedDataItems.length === undefined) {
            $$("CreateWorkflowUI_AvailableModelsList").data.add({ title: selectedDataItems.title });
        }
        else {
            let dataItem;
            for (let i = 0; i < selectedDataItems.length; i++) {
                dataItem = selectedDataItems[i];
                $$("CreateWorkflowUI_AvailableModelsList").data.add({ title: dataItem.title });
            }
        }
        // removes the selected items
        $$("CreateWorkflowUI_SelectedModelsList").remove($$("CreateWorkflowUI_SelectedModelsList").getSelectedId());


        // update data lists
        CreateWorkflowUI_UpdateDataLists();
    }
}

var CreateWorkflowUI_SelectedWorkflowComponents = [];
var CreateWorkflowUI_SelectedData = [];

function CreateWorkflowUI_UpdateDataLists() {
    CreateWorkflowUI_GetDefaultData();

    // get the status of "data variables"
    let status = CreateWorkflowUI_GetDataStatus(CreateWorkflowUI_SelectedWorkflowComponents, CreateWorkflowUI_SelectedData);


    $$("CreateWorkflowUI_DataInputsList").data.clearAll();
    $$("CreateWorkflowUI_DataOutputsList").data.clearAll();
    for (let i = 0; i < CreateWorkflowUI_SelectedData.length; i++) {
        if (status[CreateWorkflowUI_SelectedData[i].name] == "Input")
            $$("CreateWorkflowUI_DataInputsList").data.add({ title: CreateWorkflowUI_SelectedData[i].name });
        else
            $$("CreateWorkflowUI_DataOutputsList").data.add({ title: CreateWorkflowUI_SelectedData[i].name });
    }

}
function CreateWorkflowUI_GetDefaultData() {
    CreateWorkflowUI_SelectedWorkflowComponents = [];
    CreateWorkflowUI_SelectedData = [];
    let list_SelectedWorkflowComponents = $$("CreateWorkflowUI_SelectedModelsList");

    // get all selected "workflow components" and their "data variables"
    list_SelectedWorkflowComponents.data.each(function (obj) {
        let model = nebosProject.models.filter(m => m.name == obj.title)[0];
        if (model != null)
            CreateWorkflowUI_SelectedWorkflowComponents.push(model);

        for (let i = 0; i < model.inputs.length; i++) {
            let obj = CreateWorkflowUI_SelectedData.find(d => d.name === model.inputs[i].name);
            if (obj == null)
                CreateWorkflowUI_SelectedData.push(nebosProject.data.find(d => d.name == model.inputs[i].name));
        }
        for (let i = 0; i < model.outputs.length; i++) {
            let obj = CreateWorkflowUI_SelectedData.find(d => d.name === model.outputs[i].name);
            if (obj == null)
                CreateWorkflowUI_SelectedData.push(nebosProject.data.find(d => d.name == model.outputs[i].name));
        }
    });
}

function CreateWorkflowUI_GetDataStatus(workflowComponents, allData) {
    let status = {}; // dictionary to store status of data
    for (let i = 0; i < allData.length; i++) {
        status[allData[i].name] = "UnRelated";
    }
    for (let i = 0; i < workflowComponents.length; i++) {
        let workflowComponent = workflowComponents[i];
        for (let j = 0; j < workflowComponent.inputs.length; j++) {
            let dataName = workflowComponent.inputs[j].name;
            if (status[dataName] == "UnRelated")
                status[dataName] = "Input";
            else if (status[dataName] == "Output")
                status[dataName] = "Both";
            // Otherwise it has been visited and will keep the current satatus
        }
        for (let j = 0; j < workflowComponent.outputs.length; j++) {
            let dataName = workflowComponent.outputs[j].name;
            if (status[dataName] == "UnRelated") // Hasn't been visited, set as output
                status[dataName] = "Output";
            else if (status[dataName] == "Input") // If it has been visited and determined input, will be changed to both,
                status[dataName] = "Both";
            else if (status[dataName] == "Both" || status[dataName] == "Output") // If it's already output we have a problem, this workflow cannot be created
                status[dataName] = "Conflict";
        }
    }
    return status;
}



async function CreateWorkflow() {
    console.log('In CreateWorkflow...');
    if (isWorkflowNameValid($$("CreateWorkflowUI_WorkflowName").getValue()) === true) {
        // #################################
        // #region prepare request json data
        // #################################
        let workflowJson = {};
        workflowJson.name = $$("CreateWorkflowUI_WorkflowName").getValue();
        workflowJson.category = $$("CreateWorkflowUI_WorkflowCategory").getValue();
        workflowJson.description = $$("CreateWorkflowUI_WorkflowDescription").getValue();
        //workflowJson.endPoint = $$("workflowEndPoint").getValue();

        // data
        workflowJson.data = CreateWorkflowUI_SelectedData;

        // executable components
        workflowJson.executableComponents = CreateWorkflowUI_SelectedWorkflowComponents;

        // inputs
        workflowJson.inputs = [];
        $$("CreateWorkflowUI_DataInputsList").data.each(
            function (obj) {
                let dataName = obj.title;
                let data = nebosProject.getData(dataName);
                workflowJson.inputs.push({ "name": data.name })
            });

        // outputs
        workflowJson.outputs = [];
        $$("CreateWorkflowUI_DataOutputsList").data.each(
            function (obj) {
                let dataName = obj.title;
                let data = nebosProject.getData(dataName);
                workflowJson.outputs.push({ "name": data.name })
            });

        // #endregion

        // ##########################################
        // #region Workflow Orchestration Web Service
        // ##########################################

        //let uriOrchestrateWorkflow = nebosProject.endPoint.concat('create-workflow');
        let uriOrchestrateWorkflow = "https://localhost:44313/api/workflow";

        let popun = JSON.stringify(workflowJson);

        // #region execution
        let responseWorkflowOrchestration = await fetch(uriOrchestrateWorkflow, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(workflowJson)
        });
        let resultWorkflowOrchestration = await responseWorkflowOrchestration.json();

        // #endregion Workflow Orchestration Web Service


        workflowJson.scheduledComponents = CreateWorkflowUI_SelectedWorkflowComponents;


        let uri = nebosProject.endPoint.concat('create-workflow');

        let voto = JSON.stringify(workflowJson);

        // #region execution
        let response = await fetch(uri, {
            method: 'POST',
            //mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(workflowJson)
        });
        let result = await response.json();
        // #endregion

        console.log('Workflow Created on Client Side: ' + JSON.stringify(workflowJson));
        // create view of the newly created workflow on all the connected clients
        let responseStatus = result['Result'];
        if (responseStatus == 'Workflow Created') {
            socket.emit('create_workflow', workflowJson);
        }
    }

}

function AddWorkflowNode(workflowJson) {
    nebosProject.workflows.push(workflowJson);
    let workflowNodeId = $$("ProjectExplorerTree").getItem('WorkflowsTreeNode').id;
    $$("ProjectExplorerTree").add({ id: "WorkflowsTreeNode_" + workflowJson.name, value: workflowJson.name }, -1, workflowNodeId);
}

function isWorkflowNameValid(workflowName) {
    let isValid = true;
    for (let i = 0; i < nebosProject.workflows.length; i++) {
        if (nebosProject.workflows[i].name == workflowName) {
            isValid = false;
            break;
        }
    }
    return isValid;
}

function Cancel_CreateWorkflowUI() {
}

function Reset_CreateWorkflowUI() {
}
