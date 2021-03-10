


// USER LIST DATA ARRAY for filling in info box
var userListData = [];

// DOM ready state execution
$(document).ready(function(){
    // Populate the user table on initial page load
    populateTable();

    // To populate the information table for a specific employee
    $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

    // Add user button click
    $('#btnAddUser').on('click', addUser);

    // Delete user link
    $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);


});


// Function to fill table with data
function populateTable(){
    var tableContent = '';

    // JQuery AJAX call for JSON data
    $.getJSON('/users/userlist', function( data ){
        
        userListData = data;
        // For each item in the received data from AJAX call, Creating table row templates and storing them in a string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
            tableContent += '<td>' + this.email + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '"> delete </a></td>';
            tableContent += '</tr>';
        });

        // Injecting the table data string into our HTML table
        $('#userList table tbody').html(tableContent);

    });
};

// Function to fill data in the information box for a specific employee
function showUserInfo(event){

    event.preventDefault();

    var thisUserName = $(this).attr('rel');
    

    var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.username ;}).indexOf(thisUserName);

    var thisUserObject = userListData[arrayPosition];

    $('#userInfoName').text(thisUserObject.fullname);
    $('#userInfoAge').text(thisUserObject.age);
    $('#userInfoGender').text(thisUserObject.gender);
    $('#userInfoLocation').text(thisUserObject.location);

};

// Function to add user to our database
function addUser(event){
    event.preventDefault();

    // Basic form validation
    
    // Incrementing errorCount variable if there is a blank input field
    var errorCount = 0;

    // Checking and incrementing errorCount
    $('#addUser input').each(function(index, val) {
        if( $(this).val() === '' ) { errorCount++; }
    });

    // If errorCount is 0, creating a data object with input values
    if( errorCount === 0 ) {

        var newUser = {
            'username' : $('#addUser fieldset input#inputUserName').val(),
            'email'    : $('#addUser fieldset input#inputUserEmail').val(),
            'fullname' : $('#addUser fieldset input#inputUserFullname').val(),
            'age'      : $('#addUser fieldset input#inputUserAge').val(),
            'location' : $('#addUser fieldset input#inputUserLocation').val(),
            'gender'   : $('#addUser fieldset input#inputUserGender').val() 

        }
        
        // Using AJAX to POST the object to ouradduser service
        $.ajax({
            type : 'POST',
            data : newUser,
            url  : '/users/adduser',
            dataType : 'JSON'
        }).done(function( response ) {

            // check for successful response (blank)
            if(response.msg === '') {
                // Clear the form inputs
                $('#addUser fieldset input').val('');
                // Updating the table
                populateTable();
            }
            else {
                // If something goes wrong, alert the error message
                alert('Error: ' + response.msg);
            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};

// Delete user function

function deleteUser(event){
    event.preventDefault();

    // Popup a confirmation dialog to the user
    var confirmation = confirm('Are you sure you want to delete this user ?');

    if(confirmation === true) {

        // Using AJAX with DELETE method to  delete the user in the database
        $.ajax({
            type : 'DELETE',
            url  : '/users/deleteuser/' + $(this).attr('rel')
        }).done(function( response ){
            
            if(response.msg === '') {}
            else {
                alert('Error : ' + response.msg);
            }

            populateTable();
        });
    }
    else {
        // If selected 'no' in confirm dialog box, then do nothing
        return false;
    }

};