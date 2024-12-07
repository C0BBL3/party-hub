### **PartyHub User Documentation**  

Welcome to **PartyHub**, your ultimate platform for effortlessly managing parties and RSVPs online! Whether you’re hosting grand events or seeking exciting gatherings to attend, PartyHub simplifies the process and makes it fun. This guide provides a detailed walkthrough of each feature and screen to help you make the most of PartyHub.  

---

## **Screens Overview**  

PartyHub consists of the following screens, each tailored to specific functionalities:  
1. **Landing Page**: Introduces the app and provides links to sign up or log in.  
2. **Signup Screen**: Allows users to create an account and customize their profile.  
3. **Login Screen**: Enables existing users to log into their accounts.  
4. **Party Screen**: Helps patrons discover, RSVP to, and manage parties.  
5. **Host Screen**: Dedicated to hosts for creating, editing, and managing hosted parties.  
6. **Settings Screen**: Allows users to manage their profiles and update their passwords.  

Each screen is carefully designed with a user-friendly interface and clear functionality to enhance your PartyHub experience.  

---

### **1. Landing Page**  

The **Landing Page** is the starting point for all users. It introduces PartyHub’s purpose and functionality, encouraging new users to join and existing users to log in.  

#### **Features**:   
- **Join Now**:  
  Clicking this button takes new users to the Signup screen, where they can create a PartyHub account.  
- **Login**:  
  Clicking this button takes existing users to the Login screen, where they can access their accounts.  

---

### **2. Signup Screen**  

The **Signup Screen** guides new users through creating an account in four distinct steps:  

#### **Page 1: Account Type Selection**  
- **Purpose**:  
  Select whether you will use PartyHub as a **Host** (to create and manage parties) or a **Patron** (to RSVP to and attend parties).  

- **Features**:  
  - Two buttons:  
    - **Host**: Select this if you plan to host parties on PartyHub.  
    - **Patron**: Choose this option if you’re primarily attending parties.  

- **Navigation**:  
  - Selecting an account type directs you to the next page.  

#### **Page 2: Account Details**  
- **Purpose**:  
  Enter your account details, including a username and password, to secure your PartyHub account.  

- **Fields**:  
  1. **Username**:  
     - Must be unique and at least 3 characters long.  
     - Validation messages provide feedback:  
       - **Gray**: "Username must be unique" (field is empty).  
       - **Red with 'x'**: Username is invalid or taken.  
       - **Green with ✓**: Username is valid and available.  
  2. **Password**:  
     - Must be at least 6 characters long and include at least one non-alphabetic character.  
     - Validation messages provide feedback:  
       - **Gray**: "Password at least 6 characters" and "Password contains at least one non-alpha character" (field is empty).  
       - **Red with 'x'**: Password does not meet requirements.  
       - **Green with ✓**: Password meets all requirements.  

- **Navigation**:  
  - **Back**: Return to the Account Type Selection page.  
  - **Next**: Proceed to the Personal Details page after entering valid information.  

#### **Page 3: Personal Details**  
- **Purpose**:  
  Provide your name and email address.  

- **Fields**:  
  1. **First Name**: Optional.  
  2. **Last Name**: Optional.  
  3. **Email**: Required for account creation.  
     - Validation messages provide feedback:  
       - **Red with 'x'**: "Must be valid email" if the input is invalid.  
       - **Green with ✓**: "Email available" if the input is valid.  

- **Navigation**:  
  - **Back**: Return to the Account Details page.  
  - **Next**: Proceed to the Profile Details page.  

#### **Page 4: Profile Details**  
- **Purpose**:  
  Personalize your PartyHub profile by adding vibes and a description.  

- **Fields**:  
  1. **Tell us about yourself**: Optional field to list adjectives that describe you (e.g., “cool,” “fun-loving,” etc.).  
  2. **Description**: Optional field to add a brief profile description.  

- **Submit**:  
  Clicking this button completes the signup process and redirects you to the appropriate landing page (Party or Host) based on your account type.  

---

### **3. Login Screen**  

The **Login Screen** is where returning users access their PartyHub accounts.  

#### **Fields**:  
1. **Username/Email**: Enter the username or email address associated with your account (required).  
2. **Password**: Enter your account password (required).  

#### **Actions**:  
- **Log in**:  
  - On success:  
    - Redirects **Patrons** to the Party screen and **Hosts** to the Host screen.  
  - On failure:  
    - Displays the error message: *“The username/email or password was incorrect.”*  

---

### **4. Party Screen**  

The **Party Screen** is where patrons explore, RSVP to, and manage parties. This screen is divided into three pages: **Home**, **Friends**, and **RSVP**.  

#### **Home Page**  
- **Purpose**:  
  View a feed of parties available for RSVP.  

- **Features**:  
  - **Filters**:  
    Use dropdown menus to narrow the list of parties:  
    - **Start Day**: Filter by the day of the week.  
    - **Start Time**: Filter by time of day.  
    - **Discoverability**: Choose between **Following Only** or **Friends Only** parties.  
    - **Vibes**: Enter adjectives describing parties you’re interested in (e.g., “fun,” “outdoor”).  

  - **RSVP Process**:  
    Clicking on a party prompts you to RSVP:  
    - **RSVP**: Confirms attendance.  
    - **Cancel**: Declines attendance.  

#### **Friends Page**  
- **Purpose**:  
  Manage your friends and friend requests.  

- **Features**:  
  - **Friends Column**:  
    - Lists your current friends.  
    - Includes a search bar to find specific friends.  
  - **Requests Column**:  
    - Displays incoming friend requests with the following options:  
      - **Accept**: Adds the sender to your friends list.  
      - **Decline**: Rejects the request.  

#### **RSVP Page**  
- **Purpose**:  
  View and manage the parties you’ve RSVP’d to.  

- **Features**:  
  - Lists all parties you’ve RSVP’d to.  
  - Clicking a party prompts you to manage your RSVP:  
    - **Cancel**: Removes your RSVP.  
    - **Nevermind**: Keeps your RSVP.  
### **5. Host Screen**  

The **Host Screen** is where users who have selected to be Hosts can create, manage, and edit the parties they are hosting. This screen consists of three pages: **List**, **Create**, and **Edit**.  

#### **List Page**  
- **Purpose**:  
  View and manage all the parties you have created.  

- **Features**:  
  - **Party List**:  
    A list of the parties you have created.  
  - **Edit Party**:  
    Clicking on a party prompts you to edit it. You are presented with the following options:  
    - **Edit**: Takes you to the Edit page where you can modify the party details.  
    - **Nevermind**: Dismisses the prompt and returns you to the List page.  

#### **Create Page**  
- **Purpose**:  
  Create a new party and enter all the necessary details to set it up.  

- **Fields**:  
  1. **Party Title**:  
     - Enter a unique title for your party. If the title is already in use, you will receive the validation message:  
       - **Red with 'x'**: "Party Title must be unique."  
       - **Green with ✓**: "Party Title must be unique" (if title is valid).  
  2. **Location**:  
     - **Street Address, Postal Code, City, State**: Enter the address details for the party location.  
  3. **Discoverability**:  
     - Choose the visibility of the party:  
       - **Discoverable**: Viewable by everyone.  
       - **Public**: Viewable only by friends and followers.  
       - **Private**: Requires a private invitation link to RSVP.  
  4. **Day of the Week**:  
     - Choose the day of the week the party will occur.  
  5. **Start Time**:  
     - Choose the time the party starts.  
  6. **Thumbnail**:  
     - Use the **Browse** button to upload a thumbnail image for your party.  
  7. **Vibes**:  
     - Enter a short description of the vibe of the party (e.g., Casual, Formal, Disco).  
  8. **Description**:  
     - Provide a detailed description of your party (optional).  

- **Create Party**:  
  - Once all required fields are filled out, the **Create** button will be enabled, allowing you to create the party.  

#### **Edit Page**  
- **Purpose**:  
  Edit the details of an existing party you have created.  

- **Features**:  
  - You can edit the following details:  
    1. **Party Title**: Change the title of the party.  
    2. **Location**: Update the address details for the party.  
    3. **Discoverability**: Adjust the party’s visibility (Discoverable, Public, or Private).  
    4. **Start Time**: Edit the time the party starts.  
    5. **Thumbnail**: Upload a new thumbnail image for your party using the **Browse** button.  
    6. **Vibes**: Update the vibes description.  
    7. **Description**: Modify the party description.  

- **Navigation**:  
  - **Cancel**: Discards changes made to the party and returns you to the List page.  
  - **Save**: Saves the changes made to the party and updates the event. The **Save** button is only available when changes are made to the party.  

---

### **6. Settings Screen**  

The **Settings Screen** allows users to manage their account settings. This screen consists of two pages: **Profile** and **Password**.  

#### **Profile Page**  
- **Purpose**:  
  Update personal details, profile picture, and vibe description.  

- **Features**:  
  1. **Profile Picture**:  
     - Click on the current profile picture to upload a new photo.  
  2. **Name**:  
     - Edit your first and last name by clicking the **Edit** button next to the Name field.  
  3. **Profile Description**:  
     - Edit your profile description by clicking the **Edit** button next to the Profile Description field.  
  4. **Profile Vibes**:  
     - Update the adjectives that describe your vibe by clicking the **Edit** button next to the Profile Vibes field.  

- **Save Changes**:  
  - After making any desired changes, click **Save Changes** to update your profile.  

#### **Password Page**  
- **Purpose**:  
  Change your account password.  

- **Features**:  
  1. **Current Password**:  
     - Enter your current password to verify your identity. This must match the password currently on file.  
  2. **Enter New Password**:  
     - Enter your new password.  
     - The password must be at least 6 characters long and include at least one non-alphabetic character.  
  3. **Confirm Password**:  
     - Re-enter the new password to confirm it matches.  

- **Save Changes**:  
  - After entering the new password and confirming it, click **Save Changes** to update your password.  

---

### **Conclusion**  

PartyHub offers a comprehensive and easy-to-use platform for managing party invitations and RSVPs. Whether you're a host organizing a fun event or a patron looking for exciting parties to attend, PartyHub helps streamline the process with a user-friendly interface and powerful features.  

We hope this documentation helps you navigate the platform and make the most out of your PartyHub experience. If you have any further questions or need assistance, feel free to contact our support team!  
