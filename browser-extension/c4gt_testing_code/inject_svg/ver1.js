// Find all elements that contain the target word
const iconSrc = './info.svg';
const iconAlt = 'Icon description'; 
const targetWord = 'crazy'; 

// Find all elements that contain the target word
document.querySelectorAll('*').forEach(element => {
    // Use innerHTML to ensure all text content is considered
    if (element.innerHTML.includes(targetWord)) {
        // Split the innerHTML into parts to handle replacements
        const parts = element.innerHTML.split(targetWord);
        const replacedHTML = parts.join(`${targetWord}<span class="icon-container"></span>`);

        // Update the element with the replaced content
        element.innerHTML = replacedHTML;

        // Add icon after each occurrence of the target word
        const iconContainers = element.querySelectorAll('.icon-container');
        iconContainers.forEach(container => {
            const icon = document.createElement('img');
            icon.src = iconSrc;
            icon.alt = iconAlt;
            container.appendChild(icon);

            // Optionally, adjust icon styles here
            // icon.style.width = '5%';
            // icon.style.height = '5%';
        });
    }
});