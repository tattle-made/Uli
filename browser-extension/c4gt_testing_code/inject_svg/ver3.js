const iconSrc = './info.svg';
const iconAlt = 'Icon description'; 
const targetWords = ['crazy', 'stupid', 'mad']; // Replace with your list of target words

document.querySelectorAll('*').forEach(element => {
    targetWords.forEach(targetWord => {
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

                console.log(icon)
                // Hovering feature: Popup with content
                icon.addEventListener('mouseover', () => {
                    const popup = document.createElement('div');
                    popup.className = 'popup-content';
                    popup.textContent = "wow";
                    // Positioning of the popup content
                    popup.style.position = 'absolute';
                    popup.style.left = `${icon.offsetLeft + icon.offsetWidth}px`;
                    popup.style.top = `${icon.offsetTop}px`;
                    // Append popup to the document body or relevant container
                    document.body.appendChild(popup);
                    // container.appendChild(popup);

                    
                    // Remove popup when mouseout
                    icon.addEventListener('mouseout', () => {
                        popup.remove();
                    });
                });

            });
        }
    });
});
