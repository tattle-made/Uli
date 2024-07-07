const switchInput = document.getElementById('flexCheckDefault');
const toRemove = ['crazy'] ; 

switchInput.addEventListener('click' , (event)=>{
    if(switchInput.value === "off"){
        // console.log("hello world")
        // fun() ; 
        alert("hello")
        switchInput.value = "on"
        
    }
    else{
        // funRemove(); 
        alert("hello world")
        switchInput.value = "off" 
        
    }
})


console.log(switchInput.value)

if(switchInput.value == "off"){
    fun() ; 
}
else{
    alert("hello")
    // funRemove(); 
}
// Add an event listener to detect changes
// switchInput.addEventListener('change', (event) => {
//     if (event.target.checked) {
//         // fun() ; 
//         // alert("hello world")
//         console.log('Switch is ON');
//         // funRemove(toRemove) ; 
        
//     } else {
        
//         console.log('Switch is OFF');
//         // fun([]) ; 
//     }
// });

// function funct(){
//     alert("hello world")
// }

// window.addEventListener("load", (event) => {
//     fun() ; 
//   });
function fun() {
    
    const iconSrc = './info.svg';
    const iconAlt = 'Icon description';
    // const toRemove = ['crazy']
    const targetWords = ['crazy', 'stupid', 'mad']; // Replace with your list of target words

    // Find all elements that contain any of the target words
    document.querySelectorAll('*').forEach(element => {
        targetWords.forEach(targetWord => {

            // if(toRemove.includes(targetWord)){
            //     // continue ; 
            // }
            if (element.innerHTML.includes(targetWord)) {
                const className = `icon-container-${targetWord}`;
                // Split the innerHTML into parts to handle replacements
                const parts = element.innerHTML.split(targetWord);
                const replacedHTML = parts.join(`${targetWord}<span class="${className}"></span>`);

                // Update the element with the replaced content
                element.innerHTML = replacedHTML;

                // Add icon after each occurrence of the target word
                const iconContainers = element.querySelectorAll(`.${className}`);
                iconContainers.forEach(container => {
                    const icon = document.createElement('img');
                    icon.src = iconSrc;
                    icon.alt = iconAlt;
                    container.appendChild(icon);

                });
            }
        });
    });
}

function funRemove(){
    let word = "crazy" ; 
    // toRemove.forEach(targetWord => {
        let allIcons = document.querySelector(`.icon-container-${targetWord}`) ; 
        allIcons.forEach(icon => {
            console.log(icon) ; 
        })
    // })

}
