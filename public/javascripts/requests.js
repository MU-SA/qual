var xhttp = new XMLHttpRequest();

module.exports = function sendParams(method, url) {
    xhttp.open(method, url, true);
    xhttp.send();
};
