/**
 * Author: Brian LeBlanc
 * Date: 25 Jan, 2017
 */

function redraw(accounts_array) {
  $('#all_roles_tbody').empty();
  listRoles(accounts_array);
}

function addRole(roleName, account, displayName, color) {
  var accounts_array = JSON.parse(localStorage.accounts_array || "{\"roles\":[]}");
  accounts_array.roles.push({
    "roleName": roleName,
    "account": account,
    "displayName": displayName,
    "color": color
  });
  localStorage.accounts_array = JSON.stringify(accounts_array);

  // Redraw roles in table
  redraw(accounts_array.roles);
}

function removeRole(roleNumber) {
  if (roleNumber > -1) {
    var accounts_array = JSON.parse(localStorage.accounts_array || "{}");
    if (accounts_array.roles) {
      accounts_array.roles.splice(roleNumber, 1);

      localStorage.accounts_array = JSON.stringify(accounts_array);
    } else {
      console.log("Error: could not find any roles to remove");
    }
  }
}

/*
 * Add all stored roles to table with id "all_roles"
 */
function listRoles(accounts_array) {
  for (var i = 0; i < accounts_array.length; i++) {
    $('#all_roles_tbody').append(
      '<tr>' +
        '<td>' +
          '<label style="background-color: #' + accounts_array[i].color + ';">&nbsp;&nbsp;&nbsp;&nbsp;</label>' +
        '</td>' +
        '<td>' + accounts_array[i].displayName + '</td>' +
        '<td>' + accounts_array[i].account + '</td>' +
        '<td>' + accounts_array[i].roleName + '</td>' +
        '<td><button type="button" value="' + i + '">Remove</button></td>' +
      '</tr>'
    );
  }

  // Remove role when remove button is clicked
  $('button').click(function() {
    removeRole(parseInt($(this).val()));
    redraw((JSON.parse(localStorage.accounts_array || "{\"roles\":[]}")).roles);
  });
}

$(document).ready(function() {
  // Add role when form is submitted
  $('form').on('submit', function (e) {
    // Add role to storage
    addRole(
      $('input[name="roleName"]', 'form').val(),
      $('input[name="account"]', 'form').val(),
      $('input[name="displayName"]', 'form').val(),
      $('input[name="color"]:checked', 'form').val()
    );

    //stop form submission
    e.preventDefault();
  });

  // Roles are stored as [] of {} under the key "roles" in order to use
  // JSON.stringify and JSON.parse
  var accounts_array = JSON.parse(localStorage.accounts_array || "{}");
  if (accounts_array.roles) {
    listRoles(accounts_array.roles);
  } else {
    // TODO: Add <tr> to inform user of no roles
    console.log("No roles to show");
  }
});