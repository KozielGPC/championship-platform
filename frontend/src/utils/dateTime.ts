
export const dateTime = ()=>{

    function pad(num: number) {
        return num < 10 ? '0' + num : num;
    }
    var formattedDateTime = new Date().getFullYear() + '-' + 
                        pad(new Date().getMonth() + 1) + '-' + 
                        pad(new Date().getDate()) + 'T' + 
                        pad(new Date().getHours()) + ':' + 
                        pad(new Date().getMinutes());

    return formattedDateTime;
                        
}