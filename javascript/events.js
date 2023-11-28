async function pageChange(button) {
    if (button.innerText == 'post') {
        postData();
    }
    else if (button.innerText == 'get') {
        await fetchData('events');
    }
}

function postData() {
        let obj = document.getElementById('content')
        obj.innerHTML=`<form class="swing-in-top-fwd" id="uploadEvents" enctype="multipart/form-data">
        <label for="organization">Organization:</label>
        <input class="shadow-pop-br" type="text" placeholder="organization" name="organization" required>
        <br>
        <label for="description">Description:</label>
        <input class="shadow-pop-br" type="text" placeholder="description" name="description" required>
        <br>
        <label for="url">URL:</label>
        <input class="shadow-pop-br" type="text" placeholder="url" name="url" required>
        <br>
        <label for="image">Select an image:</label>
        <input class="shadow-pop-br" type="text" placeholder="image" name="image" required>
        <br>
        <button class="shake-bottom" type="button" onclick="uploadEvents()">Upload</button>
    </form>`
}

async function fetchData(prompt) {
    let obj = document.getElementById('content')
    obj.innerHTML = `<div id="view" class="view  swing-in-top-fwd"></div>`
    try {
        const response = await fetch(`https://portfoliobackend-hnx5.onrender.com/content/${prompt}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const jsonResponse = await response.json();
        if (jsonResponse.length> 0){
            jsonResponse.forEach((data, index) => {
                if (index % 2 == 0) {
                document.getElementById('view').innerHTML += `
                    <div id="${index}" class="card tilt-in-fwd-tr">
                <div class="avatar">
                    ${index+1}
                </div>
                <div class="header">
                    ${data.organization}
                </div>
                <button onclick="onDelete('${index}')"><img id="delete${index}" src="../assets/trash-bin.png" alt="delete"></button>
            </div>
                `}
                else {
                document.getElementById('view').innerHTML += `
                    <div id="${index}" class="card tilt-in-fwd-tl">
                <div class="avatar">
                    ${index+1}
                </div>
                <div class="header">
                    ${data.organization}
                </div>
                <button onclick="onDelete('${index}')"><img id="delete${index}" src="../assets/trash-bin.png" alt="delete"></button>
            </div>
                `
                }
            });
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}



function uploadEvents() {
            const form = document.getElementById('uploadEvents');
            const formData = new FormData(form);
    let flag = [1,''];
    for (let entry of formData.entries()) {
        if ((entry[0] != 'File')&&(entry[1]=='')) {
            flag[0] = 0;
            flag[1]=entry[0]
            break;
        }
    }
    if (flag[0] == 0) {
        let err = 'you have not filled ' + flag[1];
        openPopup(err);
    }
    else{
        fetch('https://portfoliobackend-hnx5.onrender.com/events/', {
                method: 'POST',
                body: formData,
            }).then(response => response.json())
            .then(data => {
                console.log('Details uploaded successfully:', data);
                alert('Details uploaded successfully!');
            })
            .catch(error => {
                console.error('Error uploading Details:', error);
                alert('Error uploading Details. Please try again.');
        });
    }
            
}

function openPopup(element) {
    let popid = document.getElementById("popup")
    let popup_text = document.getElementById("popup-text")
    document.getElementById("shade").style.display = 'block';
    popup_text.innerText = element;
    popid.style.display='flex'
}
function closePopup() {
    document.getElementById("shade").style.display = 'none';
    let popid = document.getElementById("popup")
    let popup_text=document.getElementById("popup-text")
    popup_text.innerText = '';
    popid.style.display = 'none';
}

async function onDelete(idx) {
    let delayInMilliseconds = 1000;
    try {
        const response = await fetch(`https://portfoliobackend-hnx5.onrender.com/delete/events/${idx}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const jsonResponse = await response.json();
        if (jsonResponse.status == 'success') {
            alert('content deleted');
        }
        else if(jsonResponse.status== 'failed'){
            alert('content not deleted');
        }
        
    } catch (error) {
        console.error('Error fetching data:', error);
    }
    document.getElementById('delete'+idx).src='../assets/trash-bin.gif'
    setTimeout(function () {
        document.getElementById(idx).remove();
    }, delayInMilliseconds);
}