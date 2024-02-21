  //Standard function to get all records from a FreeAgent App
  export const getFAAllRecords = (FAClient, appName) => {
    return new Promise((resolve, reject) => {
        let data = [];
        FAClient.listEntityValues({
            entity: appName,
        }, (response) => {
            console.log('Connection successful: ', response);
            if (response) {
                response.forEach(record => {
                    let rowData = {};
                    let val = ""
                    Object.entries(record.field_values).forEach(([key, value]) => {
                        if (typeof value.display_value == "object"){
                          val = JSON.stringify(value.display_value)
                        }
                        rowData = { ...rowData, ...{ [key]: val } };
                    });
                    data.push(rowData);
                });
                resolve(data);
            } else {
                reject("No response from server");
            }
        });
    });
}
    
//Standard function to get specific records from a FreeAgent App
export const getFARecords = async (faClient,appName, fields, filters, order, limit, offset, pattern)=>{
    let data=[];
      try {
        const response = await faClient.listEntityValues({
          entity: appName,
          fields : fields, // List of fields (["seq_id", "description", "created"])
          filters : filters, //[{field_name : "total_amount",operator : "equals",values : [0]}],
          order : order,
          limit : limit,
          offset : offset, // row offset
          pattern : pattern,
          
        });
        (response).map(record=>{
          let rowData = {};
          Object.entries(record.field_values).map(([key,value])=>{
            rowData = {...rowData,...{[key]:value.display_value}};
          })
          data.push(rowData);
        })
        // console.log(data);
        return data;
      }catch(error){
        console.log(error);
        return [];
      }
  }
    
//Standard function to add a new record in a FreeAgent App
export const addFARecord = async (faClient,appName, formData)=>{
  
    //Only send fields where the formData maps the fields in the app
    let updatedFormData = {};
    try{
      const tableData = await getFARecords(appName);
      console.log(tableData);
      const fields = Object.keys(tableData[0]);
      console.log(fields);
  
      Object.keys(formData).map(item=>{
        if(fields.includes(item)){
          updatedFormData = {...updatedFormData,...{[item]:formData[item]}};
        }
      })
      console.log(updatedFormData);
    }catch(error){
      console.log(error)
    }
  
      const response = await  faClient.createEntity({
        entity:appName,
        field_values: updatedFormData
      })
      console.log(response)
  }
    
//Update or delete a record in a Free Agent app
export const updateFARecord = async (faClient,appName, recordId)=>{
      await faClient.updateEntity({
          entity:appName, // app name
          id: recordId, //What record to update
          field_values: {
              description: "",
              owner: "",
              deleted: false //ONLY USE IF need to delete
          }
      })
  }

  export const getCurrentUserData = async (faClient)=>{
    const response = await faClient.getUserInfo();
    return response
  }

  export const getAllUserData = async (faClient)=>{
    const response = await faClient.getTeamMembers({
      entity: 'agent',
    });
    return response
  }
