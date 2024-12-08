/*
Global js goes here.
If this file becomes too long (i.e., >400 lines), 
create new files that are very specific on what they do 
even if they end up being like 50 lines and 2 functions 
but are a good button onclick listener.
Author Colby Roberts
*/

// Function to navigate back to the previous page in the browser history
function navigateBack() {
   window.history.back();
}

var menuDiv; // Holds the reference to the menu div
var menuTimer; // Holds the reference to the timeout for hiding the menu

// Function to display a menu when a button is clicked
function showMenu(menuButton, menuId) {
   // Get the menu element by its ID
   menuDiv = $(menuId);
   
   // Make the menu visible
   menuDiv.style.visibility = 'visible';

   // Clear any previously set menu timers
   clearMenuTimer();

   // Set mouse out event listener to hide the menu after a delay
   menuButton.onmouseout = setMenuTimer;

   // Set event listeners to clear the timer if the mouse is over the menu
   menuDiv.onmouseover = clearMenuTimer;
   menuDiv.onmouseout = setMenuTimer;

   return menuDiv;
}

// Function to set a timer that will hide the menu after a delay
function setMenuTimer() {
   clearTimeout(menuTimer); // Clear any previous timer

   // Set a new timer to hide the menu after 100ms
   menuTimer = setTimeout((evt) => {
       menuDiv.style.visibility = 'hidden'; // Hide the menu
   }, 100);
}

// Function to clear any set menu timers
function clearMenuTimer() {
   clearTimeout(menuTimer); // Cancel any active menu timer
}

// Function to show the "Switch User" dialog
async function showSwitchUserDialog() {
   // Set the title and placeholder for the dialog
   let title = 'Switch User';
   let placeholder = 'Enter User Email or Enter User ID with the prefix "id=" or "id:"';

   // Create a new ContextMenu instance
   const contextMenu = new ContextMenu(title);

   // Create an input field inside the context menu with a placeholder
   contextMenu.createInput(placeholder);

   // Set the height of the context menu
   contextMenu.setHeight('175');

   // Show the context menu and wait for the user input
   const userIdentifier = await contextMenu.showSync();

   // Call the API to switch the user based on the identifier entered
   await api.main.switchUser(userIdentifier);

   // Redirect the user to the feed page after switching the user
   window.location.href = '/party/feed';
}