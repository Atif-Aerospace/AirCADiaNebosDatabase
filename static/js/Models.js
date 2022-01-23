// #region


var models_form = [
    {
        cols: [
            { view: "text", id: 'modelName', label: 'Name', name: 'modelName', labelAlign: 'left' },
            { view: "text", id: 'modelCategory', label: 'Category', name: "modelCategory", labelAlign: 'left' },
            { view: "checkbox", label: 'Auxiliary', name: "modelAuxiliary", labelPosition: 'top', width: 200 },
        ]
    },

    { view: "textarea", id: 'modelDescription', label: 'Description', name: "modelDescription", labelAlign: 'left', height: 100 },
    { view: "text", id: 'modelEndPoint', label: 'EndPoint', name: "modelEndPoint", labelAlign: 'left' },
    {
        cols: [
            { view: "list", id: "modelsAvailableDataList", template: "#title#", minHeight: 150, select: "multiselect", data: [] },
            {
                rows: [
                    {
                        view: "align", width: 50, align: "middle,center",
                        body: {
                            rows: [
                                { view: "button", label: '>>', name: "shiftRightInputData", margin: 5, width: 30, click: ShiftRightInput },
                                { view: "button", label: '<<', name: "shiftLeftInputData", margin: 5, width: 30, click: ShiftLeftInput }
                            ]
                        }
                    },
                    {
                        view: "align", width: 50, align: "middle,center",
                        body: {
                            rows: [
                                { view: "button", label: '>>', name: "shiftRightOutputData", margin: 5, width: 30, click: ShiftRightOutput },
                                { view: "button", label: '<<', name: "shiftLeftOutputData", margin: 5, width: 30, click: ShiftLeftOutput }
                            ]
                        }
                    }
                ]
            },
            {
                rows: [
                    { view: "list", id: "modelsInputsList", template: "#title#", minHeight: 150, select: "multiselect", data: [] },
                    { view: "list", id: "modelsOutputsList", template: "#title#", minHeight: 150, select: "multiselect", data: [] },
                ]
            },
        ]
    },
    {
        view: "align", height: 30, align: "middle,right", 
        body: {
            cols: [
                { view: "button", label: "Reset", width: 120, click: Reset_CreateModelUI },
                { view: "button", label: "Cancel", width: 120, click: Cancel_CreateModelUI },
                { view: "button", label: "Create", width: 120, click: CreateModel },
            ]
        }
    }
];

// Shift data from "available list" to "model inputs list"
function ShiftRightInput() {
    let selectedDataItems = $$("modelsAvailableDataList").getSelectedItem();
    if (selectedDataItems !== undefined) {
        // add the selected items
        if (selectedDataItems.length === undefined) {
            $$("modelsInputsList").data.add({ title: selectedDataItems.title });
        }
        else {
            let dataItem;
            for (let i = 0; i < selectedDataItems.length; i++) {
                dataItem = selectedDataItems[i];
                $$("modelsInputsList").data.add({ title: dataItem.title });
            }
        }
        // removes the selected items
        $$("modelsAvailableDataList").remove($$("modelsAvailableDataList").getSelectedId());
    }
}

// Shift data from "model inputs list" to "available list"
function ShiftLeftInput() {
    let selectedDataItems = $$("modelsInputsList").getSelectedItem();
    if (selectedDataItems !== undefined) {
        // add the selected items
        if (selectedDataItems.length === undefined) {
            $$("modelsAvailableDataList").data.add({ title: selectedDataItems.title });
        }
        else {
            let dataItem;
            for (let i = 0; i < selectedDataItems.length; i++) {
                dataItem = selectedDataItems[i];
                $$("modelsAvailableDataList").data.add({ title: dataItem.title });
            }
        }
        // removes the selected items
        $$("modelsInputsList").remove($$("modelsInputsList").getSelectedId());
    }
}

function ShiftRightOutput() {
    let selectedDataItems = $$("modelsAvailableDataList").getSelectedItem();
    if (selectedDataItems !== undefined) {
        // add the selected items
        if (selectedDataItems.length === undefined) {
            $$("modelsOutputsList").data.add({ title: selectedDataItems.title });
        }
        else {
            let dataItem;
            for (let i = 0; i < selectedDataItems.length; i++) {
                dataItem = selectedDataItems[i];
                $$("modelsOutputsList").data.add({ title: dataItem.title });
            }
        }
        // removes the selected items
        $$("modelsAvailableDataList").remove($$("modelsAvailableDataList").getSelectedId());
    }
}
 
function ShiftLeftOutput() {
    let selectedDataItems = $$("modelsOutputsList").getSelectedItem();
    if (selectedDataItems !== undefined) {
        // add the selected items
        if (selectedDataItems.length === undefined) {
            $$("modelsAvailableDataList").data.add({ title: selectedDataItems.title });
        }
        else {
            let dataItem;
            for (let i = 0; i < selectedDataItems.length; i++) {
                dataItem = selectedDataItems[i];
                $$("modelsAvailableDataList").data.add({ title: dataItem.title });
            }
        }
        // removes the selected items
        $$("modelsOutputsList").remove($$("modelsOutputsList").getSelectedId());
    }
}

function ShowModelsUI() {
    $$("tabview1").addView({
        header: "Create Model", width: 120,
        body: {
            id: "editModelUI",
            view: "scrollview",
            scroll: "auto",
            body: {
                cols: [
                    {
                        // container:"box",
                        view: "tree",
                        width: 200,
                        data: [
                            {
                                id: "pythonModel", value: "Python Model", open: true, data: [
                                    { id: "1", open: true, value: "Code" },
                                    { id: "2", open: true, value: "File" }
                                ]
                            },
                            {
                                id: "matlabModel", value: "Matlab Model", open: true, data: [
                                    { id: "3", open: true, value: "Code" },
                                    { id: "4", open: true, value: "File" }
                                ]
                            },
                            {
                                id: "exeModel", value: "Exe Model", open: true, data: [
                                    { id: "5", open: true, value: "Code" },
                                    { id: "6", open: true, value: "File" }
                                ]
                            },
                            {
                                id: "cSharpModel", value: "C# Model", open: true, data: [
                                    { id: "7", open: true, value: "Code" },
                                    { id: "8", open: true, value: "File" }
                                ]
                            }
                        ]
                    },
                    {
                        //view: "align", align: "center",
                        //body: {
                        view: "form", scroll: false,
                        align: 'center',
                        elements: models_form,
                        elementsConfig: {
                            labelPosition: "top",
                            //labelWidth: 140,
                            //}
                        }
                    }
                ]
            }
        }
    });

    UpdateAvailableDataList();
    //for (let i = 0; i < nebosProject.data.length; i++) {
    //    $$("modelsAvailableDataList").data.add({ title: nebosProject.data[i].name });
    //}

    $$("editModelUI").show();
}

// #endregion

function UpdateAvailableDataList() {
    for (let i = 0; i < nebosProject.data.length; i++) {
        $$("modelsAvailableDataList").data.add({ title: nebosProject.data[i].name });
    }
}

// call the web service for creating data
async function CreateModel() {
    if (isModelNameValid($$("modelName").getValue()) === true) {
        // #region prepare request json data
        let modelJson = {};
        modelJson.name = $$("modelName").getValue();
        modelJson.category = $$("modelCategory").getValue();
        modelJson.description = $$("modelDescription").getValue();
        modelJson.endPoint = $$("modelEndPoint").getValue();
        modelJson.inputs = [];
        $$("modelsInputsList").data.each(
            function (obj) {
                let dataName = obj.title;
                let data = nebosProject.getData(dataName);
                modelJson.inputs.push({ "name": data.name })
            });
        modelJson.outputs = [];
        $$("modelsOutputsList").data.each(
            function (obj) {
                let dataName = obj.title;
                let data = nebosProject.getData(dataName);
                modelJson.outputs.push({ "name": data.name })
            });
        // #endregion

        console.log('Model JSON: ' + JSON.stringify(modelJson));
        let uri = nebosProject.endPoint.concat('create-model');

        // #region execution
        let response = await fetch(uri, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(modelJson)
        });
        let result = await response.json();
        // #endregion

        // create view of the newly created model on all the connected clients
        let responseStatus = result['Result'];
        if (responseStatus == 'Model Created') {
            socket.emit('create_model', modelJson);
        }
    }

}

function AddModelNode(modelJson) {
    nebosProject.models.push(modelJson);
    let modelNodeId = $$("ProjectExplorerTree").getItem('ModelsTreeNode').id;
    $$("ProjectExplorerTree").add({ id: "ModelsTreeNode_" + modelJson.name, value: modelJson.name }, -1, modelNodeId);
}

function isModelNameValid(modelName) {
    let isValid = true;
    for (let i = 0; i < nebosProject.models.length; i++) {
        if (nebosProject.models[i].name == modelName) {
            isValid = false;
            break;
        }
    }
    return isValid;
}

function Cancel_CreateModelUI() {
}

function Reset_CreateModelUI() {
}
