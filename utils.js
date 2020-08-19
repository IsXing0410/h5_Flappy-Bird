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