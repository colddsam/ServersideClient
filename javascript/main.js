function pageChange(button) {
    setTimeout(function () {
        window.location.href = './screens/' + button.innerText + '.html';
    }, 500);
}