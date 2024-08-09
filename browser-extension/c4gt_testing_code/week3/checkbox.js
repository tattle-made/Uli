console.log("here")
let crazyCheckbox = document.getElementById('flexCheckCrazy');
let stupidCheckbox = document.getElementById('flexCheckStupid');

crazyCheckbox.addEventListener('change', function () {
    if (crazyCheckbox.checked) {
        funRemoveCrazy();
    } else {
        funAddCrazy();
    }
});

stupidCheckbox.addEventListener('change', function () {
    if (stupidCheckbox.checked) {
        funRemoveStupid();
    } else {
        funAddStupid();
    }
});

function funRemoveCrazy() {
    let className = "icon-container-crazy";
    let allCrazy = Array.from(document.querySelectorAll(`.${className}`))
    allCrazy.forEach(element => {
        element.style.display = 'none';
    });
}

function funAddCrazy(){
    let className = "icon-container-crazy";
    let allCrazy = Array.from(document.querySelectorAll(`.${className}`))
    console.log(allCrazy) ;
    allCrazy.forEach(element => {
        element.style.display = 'inline';
    });
    
}

function funRemoveStupid() {
    let className = "icon-container-stupid";
    let allStupid = Array.from(document.querySelectorAll(`.${className}`))
    allStupid.forEach(element => {
        element.style.display = 'none';
    });
}

function funAddStupid(){
    let className = "icon-container-stupid";
    let allStupid = Array.from(document.querySelectorAll(`.${className}`))
    allStupid.forEach(element => {
        element.style.display = 'inline';
    });
    
}