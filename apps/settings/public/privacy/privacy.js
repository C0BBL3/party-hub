class Privacy {
    constructor() {
        document.body.onload = this.init.bind(this);      
    }
    
    init() {        
       
    }
}

privacy = new Privacy();

document.addEventListener('DOMContentLoaded', () => {
    const privacySwitch = document.getElementById('privacySwitch');
    const privacyStatus = document.getElementById('privacyStatus');

    // Update the status text based on switch position
    privacySwitch.addEventListener('change', (event) => {
        privacyStatus.textContent = event.target.checked ? 'Private' : 'Public';
    });
});
