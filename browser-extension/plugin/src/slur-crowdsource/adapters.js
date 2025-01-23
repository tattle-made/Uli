function slurCreatePluginToApi(data) {
    let newData = { ...data };
    newData['casual'] = data['casual'] == 1;
    newData['appropriated'] = data['appropriated'] == 1;
    if (data['appropriationContext'] === 1) {
        newData['appropriationContext'] = true;
    } else if (data['appropriationContext'] === 2) {
        newData['appropriationContext'] = false;
    }
    return newData;
}

function slurCreateApiToPlugin(data) {
    let newData = { ...data };
    // newData['casual'] = data['casual'] ? 1 : 2;
    newData['casual'] = data['casual'] === true ? 1 : (data['casual'] === false ? 2 : undefined);
    // newData['appropriated'] = data['casual'] ? 1 : 2;
    newData['appropriated'] = data['appropriated'] === true ? 1 : (data['appropriated'] === false ? 2 : undefined);
    newData['appropriationContext'] = data['appropriationContext'] === true ? 1 : (data['appropriationContext'] === false ? 2 : undefined);
    // newData['categories'] = data['categories'].map(
    //     (category) => category.category
    // );

    return newData;
}

function crowdsourceSlurMapApiKeys(apiSlur){
    return {
        id: apiSlur["id"],
        label: apiSlur["label"],
        levelOfSeverity: apiSlur["level_of_severity"],
        casual: apiSlur["casual"],
        appropriated: apiSlur["appropriated"],
        appropriationContext: apiSlur["appropriation_context"],
        categories: apiSlur["categories"],
        meaning: apiSlur["meaning"] || "",
        createdAt: apiSlur["inserted_at"],
        updatedAt: apiSlur["updated_at"]
    }
}

export { slurCreateApiToPlugin, slurCreatePluginToApi, crowdsourceSlurMapApiKeys };
