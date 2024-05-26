async function parseLink(url) {
    const start = url.indexOf("loadout/") + "loadout/".length;
    const numbersStr = url.substring(start);
    let result = numbersStr.replace(/&/g, ",");
    if (!result.split(",").includes("136") && document.getElementById('RoG').checked) {
        result += ",136";
    }
    let resultA = result.split(","); // Return an array of numbers
	resultA[0] = "        \"ID\": [" + resultA[0].toString();
	resultA[resultA.length-1] += ("],\r\n");
	return resultA
}

async function handleParse(url) {
    try {
        const urlPattern = /loadout\/[\d&]+$/;
        if (urlPattern.test(url)) {
            const parsedResult = await parseLink(url);
            displayResult(parsedResult); // Display the result with animation
            copyToClipboard(parsedResult.join(', ')); // Copy result to clipboard
            document.getElementById('copy-info').textContent = "Copied to clipboard. \u2934";
            console.log("The parsed result has been copied to the clipboard.");
        } else {
            document.getElementById('copy-info').textContent = "The provided text does not contain a valid link ending with a number.";
        }
    } catch (err) {
        console.error('Failed to parse or copy to clipboard: ', err);
    }
}

async function displayResult(numbers) {
    const resultArea = document.getElementById('result');
    resultArea.innerHTML = ''; // Clear the result area
    numbers.forEach((number, index) => {
        setTimeout(() => {
            const resultNumber = document.createElement('span');
            resultNumber.classList.add('result-number');
            resultNumber.textContent = number + (index !== numbers.length - 1 ? ", " : ""); // Add comma if not last number
            resultArea.appendChild(resultNumber);
        }, index * 100); // Delay each number by 500 milliseconds
    });
}

async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
    } catch (err) {
        console.error('Failed to copy to clipboard: ', err);
    }
}



document.getElementById('manual-parse').addEventListener('click', async () => {
    const url = document.getElementById('link-input').value;
    await handleParse(url);
});

document.getElementById('clipboard-parse').addEventListener('click', async () => {
    try {
        const text = await navigator.clipboard.readText();
        await handleParse(text);
    } catch (err) {
        console.error('Failed to read from clipboard: ', err);
    }
});
