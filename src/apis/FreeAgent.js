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
                    
                    Object.entries(record.field_values).forEach(([key, value]) => {
                        let val = value.display_value
                        if (typeof val == "object"){
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
export const getFARecords = async (FAClient,appName, fields, filters, order, limit, offset, pattern)=>{
  return new Promise((resolve, reject) => {
      let data = [];
      FAClient.listEntityValues({
          entity: appName,
          fields : fields, // List of fields (["seq_id", "description", "created"])
          filters : filters, //[{field_name : "total_amount",operator : "equals",values : [0]}],
          order : order,
          limit : limit,
          offset : offset, // row offset
          pattern : pattern
      }, (response) => {
          console.log('Connection successful: ', response);
          if (response) {
              response.forEach(record => {
                  let rowData = {};
                  
                  Object.entries(record.field_values).forEach(([key, value]) => {
                      let val = value.display_value
                      if (typeof val == "object"){
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

//Standard function to add a new record in a FreeAgent App
export const addFARecord = async (FAClient,appName, formData)=>{

   //Only send fields where the formData maps the fields in the app
   let updatedFormData = {};
   getFAAllRecords(FAClient, appName)
   .then(response => {
       console.log("data received from FA function: ", response)
       if(response.length>0){
           const fields = Object.keys(response[0]);
           Object.keys(formData).map(item=>{
               if(fields.includes(item)){
               updatedFormData = {...updatedFormData,...{[item]:formData[item]}};
               }
           })
           console.log("Updated formData", updatedFormData);

           return new Promise((resolve, reject) => {  
               FAClient.updateEntity({
                   entity:appName, // app name
                   id: recordId, //What record to update
                   field_values: updatedFormData
                   }, (response) => {
                   console.log('Update successful: ', response);
                   if (response) {
                       resolve(response);
                   } else {
                       reject("No response from server");
                   }
               });
           });
       }
   })
   .catch(error => {
       console.error("Error fetching data:", error);
   });
}


//Update or delete a record in a Free Agent app
export const updateFARecord = (FAClient, appName, recordId, formData) => {

    console.log("Form Data to Update: ", formData);

    //Only send fields where the formData maps the fields in the app
    let updatedFormData = {};
    getFAAllRecords(FAClient, appName)
    .then(response => {
        console.log("data received from FA function: ", response)
        if(response.length>0){
            const fields = Object.keys(response[0]);
            Object.keys(formData).map(item=>{
                if(fields.includes(item)){
                updatedFormData = {...updatedFormData,...{[item]:formData[item]}};
                }
            })
            console.log("Updated formData", updatedFormData);

            return new Promise((resolve, reject) => {  
                FAClient.updateEntity({
                    entity:appName, // app name
                    id: recordId, //What record to update
                    field_values: updatedFormData
                    }, (response) => {
                    console.log('Update successful: ', response);
                    if (response) {
                        resolve(response);
                    } else {
                        reject("No response from server");
                    }
                });
            });
        }
    })
    .catch(error => {
        console.error("Error fetching data:", error);
    });
}


//Update or delete a record in a Free Agent app
export const deleteFARecord = (FAClient, appName, recordId) => {
  return new Promise((resolve, reject) => {
      let data = [];
      FAClient.deleteEntity({
          entity:appName, // app name
          id: recordId, //What record to delete
          delete: true
      }, (response) => {
          console.log('Delete successful: ', response);
          if (response) {
              resolve(response);
          } else {
              reject("No response from server");
          }
      });
  });
}



  //Standard function to get a user's data from FreeAgent
  export const getCurrentUserData = (FAClient) => {
    return new Promise((resolve, reject) => {
        FAClient.getUserInfo((response) => {
            console.log('Connection successful: ', response);
            if (response) {
                resolve(response);
            } else {
                reject("No response from server");
            }
        });
    });
}

  //Standard function to get a user's data from FreeAgent
  export const getAllUserData = (FAClient) => {
    return new Promise((resolve, reject) => {
        FAClient.getTeamMembers((response) => {
            console.log('Connection successful: ', response);
            if (response) {
                resolve(response);
            } else {
                reject("No response from server");
            }
        });
    });
}

