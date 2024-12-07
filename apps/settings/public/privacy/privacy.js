/*
Dynamically manages the Privacy screen and its behaviors
Author Colby Roberts
*/
class Privacy {
    constructor() {
        document.body.onload = this.init.bind(this);      
    }
    
    init() {        
       
    }
}

privacy = new Privacy();

document.addEventListener('DOMContentLoaded', () => {
    const savePrivacyButton = document.getElementById('savePrivacyButton');

    savePrivacyButton.addEventListener('click', () => {
        const profilePrivacy = document.getElementById('profilePrivacy').value;
        const eventsPrivacy = document.getElementById('eventsPrivacy').value;
        const discoverPrivacy = document.getElementById('discoverPrivacy').value;
        const rsvpPrivacy = document.getElementById('rsvpPrivacy').value;

        const privacySettings = {
            profilePrivacy,
            eventsPrivacy,
            discoverPrivacy,
            rsvpPrivacy
        };

        console.log('Saving privacy settings:', privacySettings);
        alert('Privacy settings have been saved!');
    });
});

