/**
 * Author: Brian LeBlanc
 * Date: 25 Jan, 2017
 */

var exit_role = function() {
  if (window.AWSC == undefined || window.AWSC.Auth == undefined) {
    alert('Please go to the AWS Console to use this bookmark.');
    return;
  }
  var p = {
    "action": "switchToBasis",
    "src": "nav",
    "csrf": window.AWSC.Auth.getMbtc(),
    "redirect_uri": escape(window.location.href)
  };
  var f = document.createElement("form");
  f.setAttribute("method", "post");
  f.setAttribute("action", "https://signin.aws.amazon.com/switchrole");
  for (var k in p) {
    if (p.hasOwnProperty(k)) {
      var i = document.createElement("input");
      i.setAttribute("type", "hidden");
      i.setAttribute("name", k);
      i.setAttribute("value", p[k]);
      f.appendChild(i);
    }
  }
  document.body.appendChild(f);
  f.submit();
};

var bookmarklet = function(roleName, account, displayName, color) {
  if (window.AWSC == undefined || window.AWSC.Auth == undefined) {
    alert('Please go to the AWS Console to use this bookmark.');
    return;
  }
  var p = {
    "roleName": roleName,
    "account": account,
    "displayName": displayName,
    "color": color,
    "action": "switchFromBasis",
    "src": "nav",
    "mfaNeeded": 0,
    "csrf": window.AWSC.Auth.getMbtc(),
    "redirect_uri": escape(window.location.href)
  };
  var f = document.createElement("form");
  f.setAttribute("method", "post");
  f.setAttribute("action", "https://signin.aws.amazon.com/switchrole");
  for (var k in p) {
    if (p.hasOwnProperty(k)) {
      var i = document.createElement("input");
      i.setAttribute("type", "hidden");
      i.setAttribute("name", k);
      i.setAttribute("value", p[k]);
      f.appendChild(i);
    }
  }
  document.body.appendChild(f);
  f.submit();
};

function openLink() {
  var href = this.href;
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var tab = tabs[0];
    chrome.tabs.update(tab.id, {url: href});
  });
}

/*
 * Add all the roles in accounts_array to
 */
function listRoles(accounts_array) {
  for (var i = 0; i < accounts_array.length; i++) {
    var role_dict = accounts_array[i];
    var roleName = role_dict["roleName"];
    var account = role_dict["account"];
    var displayName = role_dict["displayName"];
    var color = role_dict["color"];
    var code = '(' + bookmarklet + ')("' + roleName + '","' + account + '","' + displayName + '","' + color + '")';
    var href = 'javascript:' + escape(code.replace(/\s+/g, ' '));
    $('#awsc-username-menu-recent-roles').append(
      '<li>' +
      '<div class="awsc-menu-item-block">' +
        '<label for="awsc-recent-role-switch-' + i + '" class="awsc-role-color" ' +
          'style="background-color: #' + color + ';">&nbsp;&nbsp;&nbsp;&nbsp;</label>' +
        '<a href="' + href + '" class="awsc-role-submit awsc-role-display-name" ' +
          'id="awsc-recent-role-switch-' + i + '" name="displayName">' + displayName + '</a>' +
      '</div>' +
      '</li>'
    );
  }
}

/*
 * Add li with link to run submit to exit assumed role
 */
function addExit() {
  var code = '(' + exit_role + ')()';
  var href = 'javascript:' + escape(code.replace(/\s+/g, ' '));
  $('#awsc-username-menu-recent-roles').append(
    '<li>' +
    '<div class="awsc-menu-item-block">' +
      '<label for="awsc-recent-role-switch-exit" class="awsc-role-color">&nbsp;&nbsp;&nbsp;&nbsp;</label>' +
      '<a href="' + href + '" class="awsc-role-submit awsc-role-display-name" ' +
        'id="awsc-recent-role-switch-exit" name="displayName">Exit Assumed Role</a>' +
    '</div>' +
    '</li>'
  );
}

$(document).ready(function() {
  // Roles are stored as [] of {} under the key "roles" in order to use
  // JSON.stringify and JSON.parse
  var accounts_array = JSON.parse(localStorage.accounts_array || "{}");
  if (accounts_array.roles) {
    addExit();
    listRoles(accounts_array.roles);
    $("a").each(function() {
      this.addEventListener('click', openLink);
    });
  } else {
    // TODO: Add <tr> to inform user of no roles
    console.log("No roles available");
  }
});