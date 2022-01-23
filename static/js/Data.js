var data_form = [
    {
        cols: [
            { view: "text", id: 'dataName', label: 'Name', name: 'dataName', labelAlign: 'left' },
            { view: "text", id: 'dataCategory', label: 'Category', name: "dataCategory", labelAlign: 'left' },
            { view: "checkbox", label: 'Auxiliary', name: "dataAuxiliary", labelPosition: 'top', width: 200 },
        ]
    },
    { view: "textarea", id: 'dataDescription', label: 'Description', name: "dataDescription", labelAlign: 'left', height: 100 },

    {
        cols: [
            { view: "combo", id: 'dataType', label: 'Type', name: "dataType", labelAlign: 'left', value: "Double", options: ['Double', 'Integer', 'Double Vector', 'Integer Vector', 'Double Matrix'] },
            { view: "text", id: 'dataValue', label: 'Value', name: "dataValue", labelAlign: 'left', },
            { view: "text", id: 'dataUnit', label: 'Unit', name: "dataUnit", labelAlign: 'left', }
        ]
    },
    {
        cols: [
            { view: "text", id: 'dataMinValue', label: 'Minimum Value', name: "dataMinValue", labelAlign: 'left' },
            { view: "text", id: 'dataMaxValue', label: 'Maximum Value', name: "dataMaxValue", labelAlign: 'left' },
            { view: "text", id: 'dataDimension', label: 'Dimension', name: "dataDimension", labelAlign: 'left' }
        ]
    },

    //{
    //    view: "button", value: "Create", align: "center", width: 150, click: function () {
    //        var form = this.getParentView();
    //        if (form.validate()) {
    //            webix.alert("Correct data!")
    //        }

    //    }
    //},
    {
        view: "align", height: 30, align: "middle,right",
        body: {
            cols: [
                { view: "button", label: "Reset", width: 120, },
                { view: "button", label: "Cancel", width: 120, },
                { view: "button", label: "Create", width: 120, click: CreateData },
            ]
        }
    }
];

function ShowDataUI() {
    $$("tabview1").addView({
        header: "Create Data", width: 120,
        body: {
            view: "scrollview",
            id: "editDataUI",
            scroll: "auto",

            body: {

                view: "form", scroll: false,
                align: 'center',
                elements: data_form,
                elementsConfig: {
                    labelPosition: "top",
                    labelWidth: 140,
                }
            }
        }
    });

    $$("editDataUI").show();
}

// call the web service for creating data
async function CreateData() {
    if (isDataNameValid($$("dataName").getValue()) === true) {
        // #region prepare request json data
        let dataJson = {};
        dataJson.name = $$("dataName").getValue();
        dataJson.category = $$("dataCategory").getValue();
        dataJson.description = $$("dataDescription").getValue();
        dataJson.type = $$("dataType").getValue();
        dataJson.value = $$("dataValue").getValue();
        dataJson.unit = $$("dataUnit").getValue();
        dataJson.minValue = $$("dataMinValue").getValue();
        dataJson.maxValue = $$("dataMaxValue").getValue();
        // #endregion


        let uri = nebosProject.endPoint.concat('create-data');

        let poni = JSON.stringify(dataJson);

        // #region execution
        let response = await fetch(uri, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(dataJson)
        });
        let result = await response.json();
        // #endregion

        // create data
        socket.emit('create_data', dataJson);
        // nebosProject.data.push(dataJson);
        // let rrr = result['Result'];
        // if (rrr == 'Data Created') {
        //     AddDataNode(dataJson)
        // }
    }

}

function AddDataNode(dataJson) {
    nebosProject.data.push(dataJson);
    let dataNodeId = $$("ProjectExplorerTree").getItem('DataTreeNode').id;
    $$("ProjectExplorerTree").add({ id: "DataTreeNode_" + dataJson.name, value: dataJson.name }, -1, dataNodeId);
}
function DeleteDataNode(id) {
    $$("ProjectExplorerTree").remove("DataTreeNode_" + id.name);
}

function isDataNameValid(dataName) {
    let isValid = true;
    for (let i = 0; i < nebosProject.data.length; i++) {
        if (nebosProject.data[i].name == dataName) {
            isValid = false;
            break;
        }
    }
    return isValid;
}