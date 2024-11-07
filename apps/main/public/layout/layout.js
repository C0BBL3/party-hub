/* global js goes here */
/* if this file becomes too long (i.e. >400 lines) 
   create new files that are very specific on what they do 
   even if they end up being like 50 lines and 2 function 
   but are a good button onclick listener */

function navigateBack() {
      window.history.back();
  }
  
var menuDiv;
var menuTimer;

function showMenu(menuButton, menuId) {
   menuDiv = $(menuId);
   menuDiv.style.visibility = 'visible';


   clearMenuTimer();

   menuButton.onmouseout = setMenuTimer;

   menuDiv.onmouseover = clearMenuTimer;
   menuDiv.onmouseout = setMenuTimer;

   return menuDiv;
}

function setMenuTimer() {
   clearTimeout(menuTimer);
   menuTimer = setTimeout((evt) => { 
         menuDiv.style.visibility = 'hidden'; 
   }, 100);
}

function clearMenuTimer() {
   clearTimeout(menuTimer);
}

async function showSwitchUserDialog() {
   let title = 'Switch User';
   let placeholder = 'Enter User Email or Enter User ID with the prefix "id=" or "id:"';

   const contextMenu = new ContextMenu(title);
   contextMenu.createInput(placeholder);
   contextMenu.setHeight('175');

   const userIdentifier = await contextMenu.showSync();

   await api.main.switchUser(userIdentifier);

   window.location.href = '/party/feed';
}