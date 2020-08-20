function createEle(eleName,classArr,styleObj){
    var aDiv = document.createElement(eleName);

    for(var i=0;i<classArr.length;i++){
        aDiv.classList.add(classArr[i]);
    }

    for(var key in styleObj){
        aDiv.style[key] = styleObj[key];
    }

    return aDiv;
}

function setLocal(key,value){
    if(typeof value === 'object' && value !==null){
        value = JSON.stringify(value);
    }

    localStorage.setItem(key,value);
}


function getLocal (key){
    var value = localStorage.getItem(key);
    if(value === null){return null}
    if(value[0]==='[' || value[0] === "{"){
        return JSON.parse(value);
    }
    return value;
}