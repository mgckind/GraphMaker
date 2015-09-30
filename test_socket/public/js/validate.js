/*
Function to make sure a name is input during the cell creation
*/
function validateCell() {
    var x = document.forms["NewCell"]["fname"].value;
    if (x == null || x == "") {
        alert("Name must be filled out");
        return false;
    }
    else {
        return true;
    }
}