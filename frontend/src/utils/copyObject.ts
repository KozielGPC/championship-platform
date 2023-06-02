function copyObject(obj: Record<string, any>): Record<string, any> {
    const newObj: Record<string, any> = {};

    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
        const value = obj[key];

        if (value !== undefined && value !== "") {
            newObj[key] = value;
        }
        }
    }

    return newObj;
}

export default copyObject;