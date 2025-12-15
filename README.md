# Breezy HubSpot Integration - Admin Panel

This is a full-stack web application for the HubSpot Solutions Architect Technical Assessment. It demonstrates how Breezy (a smart home technology company) would integrate their smart thermostat platform with HubSpot CRM to manage customer data and track subscription conversions.

> **Note:** This project was built using the HubSpot-provided starter repository (backend server). All frontend implementation, AI integration, data architecture design, and documentation were developed as part of the technical assessment.

---

## A. Setup Instructions

### • How to run your application locally

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Get Your HubSpot Access Token**
   - Sign up for a [free HubSpot account](https://offers.hubspot.com/free-trial)
   - Navigate to **Development** → **Legacy Apps**
   - Click **Create a private app**
   - Give it a name (e.g., "SA Assessment App")
   - Go to the **Scopes** tab and enable:
     - `crm.objects.contacts.read`
     - `crm.objects.contacts.write`
     - `crm.objects.deals.read`
     - `crm.objects.deals.write`
   - Click **Create app** and copy your access token

3. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your HubSpot token:
   ```
   HUBSPOT_ACCESS_TOKEN=pat-na1-your-token-here
   ```

4. **Start the Application**
   
   For development (with hot-reloading):
   ```bash
   npm run dev
   ```
   
   For production:
   ```bash
   npm start
   ```
   
   You should see:
   ```
   ✅ Server running successfully!
   🌐 API available at: http://localhost:3001
   📋 Health check: http://localhost:3001/health
   📁 Static files served from: /public
   ```
   
   To stop the server: Press `Ctrl+C`

5. **Access the Admin Panel**
   
   Open your web browser and navigate to: `http://localhost:3001`
   
   You should see the **Breezy HubSpot Integration Admin Panel** with three main sections:
   - **Contacts from HubSpot** - View all synced contacts
   - **Create Contact (Thermostat Purchase)** - Simulate a new customer purchase
   - **Create Deal (Subscription Conversion)** - Track subscription upgrades

### • Any dependencies or prerequisites

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or yarn
- **A free HubSpot account** - [Sign up here](https://offers.hubspot.com/free-trial)
- **HubSpot Private App access token** (see setup steps above)
- **Modern web browser** (Chrome, Firefox, Safari, or Edge)

### • Expected environment variables

| Variable | Description | Required |
|----------|-------------|----------|
| `HUBSPOT_ACCESS_TOKEN` | Your HubSpot Private App access token | Yes |
| `ANTHROPIC_API_KEY` | Anthropic API key for AI features | Optional |

### • How to test the integration flow

**Quick Verification:**

1. Test the backend API:
   ```bash
   curl http://localhost:3001/health
   ```
   
   Should return:
   ```json
   {
     "status": "Server is running",
     "timestamp": "2025-12-10T..."
   }
   ```

2. Test the frontend:
   
   Open http://localhost:3001 in your browser and click "Load Contacts" to verify the HubSpot connection is working.

**Complete Integration Test:**

See the detailed "Testing the Integration Flow" section below for step-by-step instructions on testing the complete customer journey from thermostat purchase to subscription conversion.

---

## B. Project Overview

The POC simulates this integration with an admin panel that lets you create contacts, create deals, and view the relationships between them, demonstrating the mechanics that would be built into Breezy's actual e-commerce/subscription platform. This proof-of-concept demonstrates how Breezy's smart thermostat platform integrates with HubSpot.

**Core Integration Capabilities:**
- **Customer Data Sync**: Automatically sync thermostat purchases as HubSpot Contacts
  - *APIs*: `POST /api/contacts`, `GET /api/contacts`
- **Subscription Tracking**: Track free trial to paid subscription conversions as HubSpot Deals
  - *APIs*: `POST /api/deals`, `GET /api/deals`
- **Real-time Updates**: Bidirectional data flow between Breezy's platform and HubSpot
  - *APIs*: `GET /api/contacts`, `GET /api/deals`, `GET /api/contacts/:contactId/deals`
- **AI-Powered Insights**: Analyze customer data to provide actionable recommendations for engagement and retention
  - *APIs*: `POST /api/ai/insights`

**Technical Architecture:**
- **Backend**: Express.js server that proxies requests to the HubSpot API
  - *APIs*: All endpoints (`/health`, `/api/contacts`, `/api/deals`, `/api/contacts/:contactId/deals`)
- **Frontend**: Vanilla JavaScript single-page application (SPA) for managing contacts and deals
  - *APIs*: Consumes all `/api/*` endpoints
- **Integration**: Simulates syncing thermostat purchases (contacts) and subscription conversions (deals) to HubSpot
  - *APIs*: `POST /api/contacts`, `POST /api/deals`

**Business Context:**

Breezy sells smart thermostats ($299) with a SaaS subscription model:
- Customers purchase hardware and create an account (synced as HubSpot Contacts)
- Free trial users can upgrade to Breezy Premium ($9.99/month or $99/year)
- Subscription conversions are tracked as HubSpot Deals with "closedwon" stage

This POC demonstrates the integration mechanics that Breezy's engineering team would build into their actual platform.

## API Endpoints

### Health Check

**GET** `/health`

Check if the server is running.

**Response:**

```json
{
  "status": "Server is running",
  "timestamp": "2025-11-10T12:00:00.000Z"
}
```

---

### Get Contacts

**GET** `/api/contacts`

Fetch all contacts from HubSpot (limited to 50).

**Response:**

```json
{
  "results": [
    {
      "id": "12345",
      "properties": {
        "firstname": "Alex",
        "lastname": "Rivera",
        "email": "alex@example.com",
        "phone": "555-0123",
        "address": "123 Main St"
      }
    }
  ]
}
```

---

### Create Contact

**POST** `/api/contacts`

Create a new contact in HubSpot.

**Request Body:**

```json
{
  "properties": {
    "firstname": "Alex",
    "lastname": "Rivera",
    "email": "alex@example.com",
    "phone": "555-0123",
    "address": "123 Main St"
  }
}
```

**Response:**

```json
{
  "id": "12345",
  "properties": {
    "firstname": "Alex",
    "lastname": "Rivera",
    "email": "alex@example.com",
    ...
  }
}
```

---

### Get All Deals

**GET** `/api/deals`

Fetch all deals from HubSpot (limited to 50).

**Response:**

```json
{
  "results": [
    {
      "id": "67890",
      "properties": {
        "dealname": "Breezy Premium - Annual",
        "amount": "99",
        "dealstage": "closedwon"
      }
    }
  ]
}
```

---

### Create Deal

**POST** `/api/deals`

Create a new deal in HubSpot and associate it with a contact.

**Request Body:**

```json
{
  "dealProperties": {
    "dealname": "Breezy Premium - Annual Subscription",
    "amount": "99",
    "dealstage": "closedwon"
  },
  "contactId": "12345"
}
```

**Response:**

```json
{
  "id": "67890",
  "properties": {
    "dealname": "Breezy Premium - Annual Subscription",
    "amount": "99",
    "dealstage": "closedwon"
  }
}
```

---

### Get Deals for Contact

**GET** `/api/contacts/:contactId/deals`

Get all deals associated with a specific contact.

**Example:**

```
GET /api/contacts/12345/deals
```

**Response:**

```json
{
  "results": [
    {
      "id": "67890",
      "properties": {
        "dealname": "Breezy Premium - Annual",
        "amount": "99",
        "dealstage": "closedwon"
      }
    }
  ]
}
```



## Common Deal Stages

For the Breezy use case, you can use these standard HubSpot deal stages:

- `appointmentscheduled` - Trial started
- `qualifiedtobuy` - Active trial user
- `closedwon` - Converted to paid subscription (automatically set by the app)
- `closedlost` - Trial ended without conversion

---

## Testing the Integration Flow

This section provides step-by-step instructions for testing the complete Breezy-HubSpot integration workflow.

### End-to-End Integration Test

Follow these steps to test the complete customer journey from thermostat purchase to subscription conversion:

#### Step 1: Load Existing Contacts

1. Open http://localhost:3001 in your browser
2. Click the **"Load Contacts"** button in the "Contacts from HubSpot" section
3. **Expected Result**: 
   - Loading indicator appears briefly
   - Table populates with existing contacts showing: firstname, lastname, email, jobtitle, company
   - Each row has a "View Deals" button

#### Step 2: Create a New Contact (Simulate Thermostat Purchase)

1. Scroll to the **"Create Contact (Thermostat Purchase)"** section
2. Fill in the form with test data:
   ```
   First Name: Alex
   Last Name: Rivera
   Email: alex.rivera@example.com
   Phone: 555-0123 (optional)
   Address: 123 Main Street, San Francisco, CA (optional)
   ```
3. Click **"Create Contact"**
4. **Expected Result**:
   - Loading indicator appears on the button
   - Success message: "Contact created successfully!"
   - Form clears automatically
   - Contacts table refreshes and shows the new contact
   - Contact dropdown in the "Create Deal" section updates

#### Step 3: Create a Deal (Simulate Subscription Conversion)

1. Scroll to the **"Create Deal (Subscription Conversion)"** section
2. Fill in the form:
   ```
   Select Contact: Alex Rivera (alex.rivera@example.com)
   Deal Name: Breezy Premium - Annual Subscription
   Amount: 99
   ```
3. Click **"Create Deal"**
4. **Expected Result**:
   - Loading indicator appears on the button
   - Success message: "Deal created successfully!"
   - Form clears automatically
   - Deal is created with `dealstage` automatically set to "closedwon"

#### Step 4: View Deals for Contact

1. In the contacts table, find "Alex Rivera"
2. Click the **"View Deals"** button in the Actions column
3. **Expected Result**:
   - Modal window opens with title "Deals for Alex Rivera"
   - Loading indicator appears briefly
   - Deal information displays:
     - Deal Name: Breezy Premium - Annual Subscription
     - Amount: $99
     - Stage: closedwon
   - Click the X or outside the modal to close

#### Step 5: Test Error Handling

**Test invalid email:**
1. Try to create a contact with email: `invalid-email-format`
2. **Expected Result**: Error message displays: "Email address invalid-email-format is invalid"

**Test empty required fields:**
1. Try to submit the contact form with empty firstname
2. **Expected Result**: Browser validation prevents submission with message "Please fill out this field"

**Test viewing deals for contact with no deals:**
1. Create a new contact without creating any deals
2. Click "View Deals" for that contact
3. **Expected Result**: Modal shows "No subscriptions found for this contact"

### Manual Testing Checklist

Use this checklist to verify all functionality:

- [ ] **Load Contacts**
  - [ ] Loading indicator appears during fetch
  - [ ] Table displays all contacts with correct columns
  - [ ] Error handling works if API fails
  - [ ] "View Deals" button appears for each contact

- [ ] **Create Contact**
  - [ ] All form fields have clear labels
  - [ ] Required field validation works (firstname, lastname, email)
  - [ ] Email validation works (must be valid email format)
  - [ ] Loading indicator appears during submission
  - [ ] Success message displays after creation
  - [ ] Form clears after successful submission
  - [ ] Contacts table automatically refreshes
  - [ ] Contact dropdown updates with new contact
  - [ ] Error messages display for invalid data

- [ ] **Create Deal**
  - [ ] Contact dropdown populates with all contacts
  - [ ] All form fields have clear labels
  - [ ] Required field validation works
  - [ ] Loading indicator appears during submission
  - [ ] Success message displays after creation
  - [ ] Form clears after successful submission
  - [ ] Deal stage automatically set to "closedwon"
  - [ ] Error messages display for failures

- [ ] **View Deals**
  - [ ] Modal opens when "View Deals" is clicked
  - [ ] Contact name displays in modal heading
  - [ ] Loading indicator appears during fetch
  - [ ] Deals display with all fields (name, amount, stage)
  - [ ] "No subscriptions found" message for contacts without deals
  - [ ] Error messages display for failures
  - [ ] Modal closes with X button
  - [ ] Modal closes when clicking outside

- [ ] **UI/UX**
  - [ ] All loading states appear for async operations
  - [ ] Success messages auto-hide after 5 seconds
  - [ ] Error messages auto-hide after 5 seconds
  - [ ] Buttons have hover effects
  - [ ] Forms have proper spacing and layout
  - [ ] Tables are readable and well-formatted
  - [ ] Modal has proper styling
  - [ ] Responsive design works on mobile devices

### Testing with cURL (Backend API)

You can also test the backend API directly using cURL:

**Health check:**
```bash
curl http://localhost:3001/health
```

**Get all contacts:**
```bash
curl http://localhost:3001/api/contacts
```

**Create a contact:**
```bash
curl -X POST http://localhost:3001/api/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "properties": {
      "firstname": "Test",
      "lastname": "Customer",
      "email": "test@breezy.com",
      "phone": "555-0199",
      "address": "123 Test Street"
    }
  }'
```

**Create a deal (replace contactId with actual ID):**
```bash
curl -X POST http://localhost:3001/api/deals \
  -H "Content-Type: application/json" \
  -d '{
    "dealProperties": {
      "dealname": "Breezy Premium - Monthly",
      "amount": "9.99",
      "dealstage": "closedwon"
    },
    "contactId": "12345"
  }'
```

**Get deals for a contact (replace contactId):**
```bash
curl http://localhost:3001/api/contacts/12345/deals
```

### Verifying Data in HubSpot

After testing, verify the data was synced correctly:

1. Log in to your HubSpot account
2. Navigate to **Contacts** > **Contacts**
3. Find the contacts you created (search by email)
4. Click on a contact to view details
5. Scroll to the **Deals** section to see associated deals
6. Verify all data matches what you entered in the admin panel

---

## Demo Instructions



### Key Points to Highlight

- **Automatic Refresh**: Contact table updates automatically after creation
- **Dropdown Population**: Contact dropdown updates with new contacts
- **Error Handling**: All operations have proper error handling and user feedback
- **Loading States**: Users always know when operations are in progress
- **Deal Stage Automation**: Deals automatically set to "closedwon" for subscription conversions
- **Responsive Design**: Works on desktop and mobile devices
- **Accessibility**: All forms have proper labels and keyboard navigation

---

## Environment Variables

The application requires the following environment variables in your `.env` file:

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `HUBSPOT_ACCESS_TOKEN` | Your HubSpot Private App access token | `pat-na1-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` |

### Optional Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `OPENAI_API_KEY` | OpenAI API key for AI features (optional) | `sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` |
| `ANTHROPIC_API_KEY` | Anthropic API key for AI features (optional) | `sk-ant-xxxxxxxxxxxxxxxxxxxxxxxx` |

**Note**: AI features are optional and not currently implemented in the frontend.

### Getting Your HubSpot Access Token

1. Log in to your HubSpot account
2. Navigate to **Settings** > **Integrations** > **Private Apps**
3. Click **"Create a private app"**
4. Give it a name (e.g., "Breezy Integration")
5. Go to the **Scopes** tab and enable:
   - `crm.objects.contacts.read`
   - `crm.objects.contacts.write`
   - `crm.objects.deals.read`
   - `crm.objects.deals.write`
6. Click **"Create app"** and copy your access token
7. Paste it into your `.env` file

---

## Error Handling

All API endpoints return errors in this format:

```json
{
  "error": "Human-readable error message",
  "details": "Technical details from HubSpot API"
}
```

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| **401 Unauthorized** | Invalid or missing HubSpot token | Check your `HUBSPOT_ACCESS_TOKEN` in `.env` file |
| **403 Forbidden** | Missing required scopes | Verify your Private App has all required scopes enabled |
| **404 Not Found** | Contact or deal ID doesn't exist | Verify the ID exists in your HubSpot portal |
| **422 Unprocessable Entity** | Invalid data format | Check that email is valid and required fields are provided |
| **500 Internal Server Error** | Server or HubSpot API error | Check console logs for detailed error messages |

### Frontend Error Messages

The frontend displays user-friendly error messages for common scenarios:
- **"Email address [email] is invalid"**: Email format validation failed
- **"Failed to load contacts"**: API request to fetch contacts failed
- **"Failed to create contact"**: Contact creation request failed
- **"Failed to create deal"**: Deal creation request failed
- **"Failed to load deals"**: Request to fetch deals for contact failed
- **"No subscriptions found for this contact"**: Contact has no associated deals

All error messages automatically hide after 5 seconds.

## Project Structure

```
breezy-hubspot-integration/
├── server.js                    # Express.js backend server
├── package.json                 # Dependencies and scripts
├── .env                         # Environment variables (not in git)
├── .env.example                 # Example environment variables
├── .gitignore                   # Git ignore rules
├── README.md                    # This file
├── test-checkpoint-7-results.md # Test results documentation
├── public/                      # Frontend application
│   ├── index.html              # Main HTML structure
│   └── app.js                  # JavaScript application logic
└── docs/                        # Specification documents
    └── specs/
        └── breezy-hubspot-frontend/
            ├── requirements.md  # Feature requirements (EARS format)
            ├── design.md        # Design document with correctness properties
            └── tasks.md         # Implementation task list
```

## Features Implemented

### Core Functionality
- ✅ **View Contacts**: Load and display all contacts from HubSpot with pagination support
- ✅ **Create Contacts**: Simulate thermostat purchases by creating new contacts
- ✅ **Create Deals**: Track subscription conversions with automatic "closedwon" stage
- ✅ **View Deals**: Display all deals associated with each contact
- ✅ **Form Validation**: Client-side validation for required fields and email format
- ✅ **Error Handling**: Comprehensive error handling with user-friendly messages
- ✅ **Loading States**: Visual feedback for all asynchronous operations
- ✅ **Auto-refresh**: Contacts table and dropdown automatically update after mutations
- ✅ **Responsive Design**: Mobile-friendly layout that works on all screen sizes
- ✅ **Accessibility**: Proper labels, semantic HTML, and keyboard navigation

### Technical Highlights
- **Vanilla JavaScript**: No frameworks or build tools required
- **Single Page Application**: All functionality on one page for simplicity
- **RESTful API Integration**: Clean separation between frontend and backend
- **Graceful Shutdown**: Server properly closes connections on exit
- **Hot Reloading**: Development mode with automatic server restart
- **Static File Serving**: Frontend served directly from Express
- **CORS Enabled**: Configured for development environment
- **Comprehensive Testing**: All 11 core correctness properties validated

### Optional Features

## Troubleshooting

### Installation Issues

**Problem: "Module not found" error**
```bash
# Solution: Install dependencies
npm install
```

**Problem: Node.js version too old**
```bash
# Check your Node.js version
node --version

# Should be v14 or higher. If not, download from https://nodejs.org/
```

### Server Issues

**Problem: Port 3001 already in use**

Error message: `EADDRINUSE: address already in use ::1:3001`

**On Mac/Linux:**
```bash
# Find the process using port 3001
lsof -ti:3001

# Kill the process
kill -9 $(lsof -ti:3001)
```

**On Windows:**
```bash
# Find the process
netstat -ano | findstr :3001

# Kill it (replace PID with the number from above)
taskkill /PID <PID> /F
```

**Note:** The server includes graceful shutdown, so pressing `Ctrl+C` should properly close the port.

**Problem: Server won't start - "Invalid HubSpot token"**
```bash
# Solution: Check your .env file
# 1. Make sure .env file exists (copy from .env.example)
# 2. Verify HUBSPOT_ACCESS_TOKEN is set correctly
# 3. Token should start with "pat-na1-" or similar
# 4. No quotes around the token value
```

**Problem: Server starts but frontend shows blank page**
```bash
# Solution: Check that public/index.html and public/app.js exist
ls public/

# If files are missing, they may have been deleted
# Restore from git or recreate them
```

### API Issues

**Problem: 401 Unauthorized error**
- **Cause**: Invalid or missing HubSpot access token
- **Solution**: 
  1. Check your `.env` file has `HUBSPOT_ACCESS_TOKEN` set
  2. Verify the token is valid (not expired or revoked)
  3. Try creating a new Private App in HubSpot

**Problem: 403 Forbidden error**
- **Cause**: HubSpot Private App missing required scopes
- **Solution**:
  1. Go to HubSpot Settings > Integrations > Private Apps
  2. Edit your app and go to the Scopes tab
  3. Enable all required scopes:
     - `crm.objects.contacts.read`
     - `crm.objects.contacts.write`
     - `crm.objects.deals.read`
     - `crm.objects.deals.write`
  4. Save and copy the new token to your `.env` file

**Problem: 404 Not Found error when viewing deals**
- **Cause**: Contact ID doesn't exist or was deleted
- **Solution**: Refresh the contacts list and try again

**Problem: 422 Unprocessable Entity when creating contact**
- **Cause**: Invalid email format or missing required fields
- **Solution**: Ensure email is in valid format (e.g., user@example.com)

### Frontend Issues

**Problem: "Load Contacts" button does nothing**
- **Solution**: 
  1. Open browser developer console (F12)
  2. Check for JavaScript errors
  3. Verify the server is running on http://localhost:3001
  4. Check Network tab to see if API request is being made

**Problem: Forms don't submit**
- **Solution**:
  1. Check browser console for errors
  2. Verify all required fields are filled
  3. Ensure email is in valid format
  4. Try a different browser

**Problem: Modal won't close**
- **Solution**: 
  1. Click the X button in the top-right corner
  2. Click outside the modal (on the dark overlay)
  3. Refresh the page if modal is stuck

**Problem: Success/error messages don't appear**
- **Solution**:
  1. Check browser console for JavaScript errors
  2. Messages auto-hide after 5 seconds - they may have already disappeared
  3. Try the operation again and watch carefully

### Data Issues

**Problem: Contacts not showing in HubSpot**
- **Solution**:
  1. Wait a few seconds for HubSpot to sync
  2. Refresh your HubSpot Contacts page
  3. Check that the API request succeeded (look for success message)
  4. Verify your HubSpot account is the same one used for the Private App

**Problem: Deals not associated with contacts**
- **Solution**:
  1. Verify you selected a contact from the dropdown before creating the deal
  2. Check that the contact exists in HubSpot
  3. In HubSpot, open the contact and check the Deals section

**Problem: Duplicate contacts being created**
- **Solution**: HubSpot allows duplicate contacts with the same email. This is normal behavior. You can merge duplicates in HubSpot if needed.

### Testing Issues

**Problem: cURL commands not working**
- **Solution**:
  1. Make sure server is running
  2. Check that you're using the correct port (3001)
  3. On Windows, use double quotes instead of single quotes in JSON
  4. Verify Content-Type header is set correctly

**Problem: Can't verify data in HubSpot**
- **Solution**:
  1. Log in to the correct HubSpot account
  2. Navigate to Contacts > Contacts
  3. Use the search bar to find contacts by email
  4. Click on a contact to see associated deals

### Getting Help

If you're still experiencing issues:

1. **Check the console logs**: Both browser console (F12) and server terminal output
2. **Test the API directly**: Use cURL commands to isolate frontend vs backend issues
3. **Verify HubSpot setup**: Log in to HubSpot and check that your Private App is configured correctly
4. **Check the test results**: Review `test-checkpoint-7-results.md` to see what should be working
5. **Review the specs**: Check `docs/specs/breezy-hubspot-frontend/` for detailed requirements and design

### Debug Mode

To enable more detailed logging:

1. Open `server.js` and look for console.log statements
2. Open browser developer tools (F12) and check the Console tab
3. Check the Network tab to see API requests and responses
4. Use `console.log()` in `public/app.js` to debug frontend issues

## Architecture & Design

This application was built using a specification-driven development approach with formal correctness properties.


## Technical Stack

### Backend
- **Runtime**: Node.js (v14+)
- **Framework**: Express.js 4.18.2
- **HTTP Client**: Axios 1.6.0
- **Environment**: dotenv 16.3.1
- **CORS**: cors 2.8.5
- **Dev Tools**: nodemon 3.0.1

### Frontend
- **Language**: Vanilla JavaScript (ES6+)
- **HTML**: HTML5 with semantic elements
- **CSS**: CSS3 with responsive design
- **HTTP Client**: Fetch API (native)
- **No Build Tools**: Runs directly in browser

### API Integration
- **HubSpot API**: CRM Objects API v3
- **Authentication**: Private App access token
- **Endpoints**: Contacts and Deals objects
- **Rate Limiting**: Handled by HubSpot (default limits apply)

---


## AI Usage Documentation

### Which AI tools did you use?

This project was developed by Raj Pasupathy using Anthropic claude Sonnet 4.5 and ChatGPT as development assistants. Additionally, the application itself integrates **Anthropic's Claude API** to provide AI-powered customer insights.

### What tasks did you use AI for?

**Development Tasks:**
1. **Requirements Analysis**: Transformed the assignment brief into formal requirements with acceptance criteria, using AI assistants to accelerate the documentation process
2. **System Design**: Designed comprehensive architecture including diagrams, data models, and correctness properties, with AI helping to structure and document the design
3. **Code Implementation**: Developed all frontend (HTML/JavaScript) and backend (Node.js/Express) code, leveraging AI to speed up implementation
4. **API Integration**: Implemented HubSpot API integration patterns and error handling, with AI assisting in code generation
5. **Testing Strategy**: Developed property-based testing approach and manual test checklists, using AI to help create comprehensive test coverage
6. **Documentation**: Wrote extensive README documentation, setup instructions, and troubleshooting guides, with AI helping to organize and format content
7. **Data Architecture**: Designed the HubSpot ERD, custom properties, and deal pipeline architecture, using AI to accelerate diagram creation and documentation

**AI Feature Implementation:**
- Integrated Anthropic Claude API to analyze customer data and provide actionable insights
- Implemented intelligent recommendations for customer engagement, upsell opportunities, and retention strategies



### What did you learn? What was challenging?

**Key Learnings:**

1. **HubSpot CRM Architecture**: Learned how HubSpot structures CRM data with standard objects (Contacts, Deals) and associations. Understanding the association type IDs (e.g., type 3 for Deal-to-Contact) was crucial for proper data relationships.

2. **Specification-Driven Development**: Using formal requirements (EARS format) and correctness properties before coding led to clearer implementation and better test coverage. This approach caught potential issues early.


**Challenges:**

1. **HubSpot API Associations**: The most challenging aspect was understanding HubSpot's association API. Getting deals associated with contacts required:
   - First fetching association IDs from `/contacts/:id/associations/deals`
   - Then batch reading deal details with those IDs
   - This two-step process wasn't immediately obvious from the documentation

2. **Error Handling Across Layers**: Ensuring consistent error handling from HubSpot API → Express backend → Frontend required careful planning. Each layer needed to transform errors appropriately while preserving useful debugging information.

3. **State Management in Vanilla JS**: Without a framework like React, managing UI state (loading indicators, error messages, form resets, dropdown population) required careful DOM manipulation and event coordination.

4. **AI Response Variability**: GhatGPT & Claude's responses are non-deterministic, so ensuring the insights were consistently useful and appropriately scoped required prompt refinement and testing with various customer profiles.


### How did AI help (or not help)?

**Where AI Excelled:**

✅ **Rapid Prototyping**: AI assistants helped generate a working POC in a fraction of the time manual coding would take. The entire frontend, and documentation were created in ~2.5 hours.

✅ **Customer Insights**: The Claude API integration provides genuinely useful recommendations by analyzing customer data patterns and suggesting next actions for sales/success teams.


**Where AI Had Limitations:**

⚠️ **HubSpot-Specific Knowledge**: AI didn't initially know the correct association type ID (3) for Deal-to-Contact relationships. This required consulting HubSpot documentation and iterating.

⚠️ **Testing Execution**: While AI wrote test plans and checklists, actually executing tests and verifying HubSpot data required manual work. AI can't interact with the live HubSpot portal.

⚠️ **Business Context**: AI needed guidance on Breezy's specific business model (free trial → paid conversion, $299 hardware + $9.99/month SaaS) to make appropriate design decisions.

⚠️ **Debugging Live Issues**: When encountering actual runtime errors (like CORS issues or API authentication failures), AI needed error messages and logs to diagnose problems effectively.

---

## HubSpot Data Architecture

For a comprehensive view of the recommended HubSpot data architecture for Breezy's integration, see the dedicated **[HubSpot Data Architecture Document](HUBSPOT_DATA_ARCHITECTURE.md)**.

### Quick Summary

**Entity Relationship Diagram (ERD):**

```mermaid
erDiagram
    CONTACT ||--o{ DEAL : "has"
    CONTACT {
        string id PK
        string firstname
        string lastname
        string email UK
        string phone
        string address
        string thermostat_serial_number
        string thermostat_model
        decimal hardware_purchase_amount
        datetime hardware_purchase_date
    }
    
    DEAL {
        string id PK
        string dealname
        decimal amount
        string dealstage
        datetime closedate
        string subscription_type
        string subscription_tier
        datetime subscription_start_date
        decimal mrr
        decimal arr
    }
```

**Key Design Decisions:**

1. **Standard Objects**: Use HubSpot's Contact and Deal objects rather than custom objects for simplicity and better integration support

2. **Custom Properties**: Add Breezy-specific properties like `thermostat_serial_number`, `subscription_type`, `mrr`, and `arr` to track device and subscription data

3. **Deal Pipeline**: Create custom "Breezy Subscription Pipeline" with stages:
   - Trial Started → Trial Active → Trial Ending Soon → Closed Won/Lost → Active Subscription → Churned

4. **Associations**: Use standard Deal-to-Contact association (type ID: 3) to link subscriptions to customers

5. **Renewal Strategy**: Create new deals for each subscription renewal period to maintain historical revenue tracking

For complete details including:
- Full ERD with all properties
- Custom property recommendations
- Deal pipeline architecture with 8 stages
- 8 design decisions with detailed rationale
- Data flow diagrams
- Scalability considerations
- Implementation roadmap

**See:** [HUBSPOT_DATA_ARCHITECTURE.md](HUBSPOT_DATA_ARCHITECTURE.md)

---

## AI Feature Explanation

### Feature Description

The **AI-Powered Customer Insights** feature uses Anthropic's Claude AI to analyze customer data and provide intelligent recommendations for engagement, retention, and upsell opportunities.

**How it works:**
1. Admin selects a contact from the dropdown
2. System gathers contact information and associated deal data
3. Sends data to Claude API with a structured prompt
4. Claude analyzes the customer profile and subscription status
5. Returns actionable insights displayed in the UI

**Example Insights:**
- "This customer has an active annual subscription ($99), indicating strong engagement. Recommend reaching out to gather feedback for a case study and explore upsell opportunities for additional thermostats if they have multiple properties."
- "Customer is in free trial with no conversion yet. Engagement level appears moderate. Recommend sending targeted email highlighting energy savings features and offering a limited-time discount to encourage conversion before trial ends."

### Why did you choose this feature?

**Business Value:**
- **Scalable Intelligence**: As Breezy grows, manually analyzing each customer becomes impossible. AI provides instant insights for every customer.
- **Actionable Recommendations**: Rather than just showing data, AI suggests specific next actions for sales and customer success teams.
- **Pattern Recognition**: AI can identify engagement patterns and churn risks that humans might miss in large datasets.

**Technical Fit:**
- **Natural Language Output**: AI-generated insights are easy for non-technical users to understand and act on.
- **Contextual Analysis**: Claude can consider multiple data points (contact info, subscription status, deal value) holistically.
- **Low Latency**: API calls return in 1-2 seconds, making it practical for real-time use in an admin panel.

**Demonstration Value:**
- Shows how AI can enhance CRM data beyond simple storage and retrieval
- Demonstrates practical AI integration in a business workflow
- Illustrates the "art of the possible" for Breezy's team

### How does it make the integration smarter?

**Without AI:**
- Admin sees: "Alex Rivera, email: alex@example.com, Deal: $99 Annual Subscription"
- Admin must manually decide: What should we do with this customer?

**With AI:**
- Admin sees the same data PLUS: "High-value customer with strong engagement. Recommend: 1) Request testimonial for marketing, 2) Offer referral incentive, 3) Monitor for multi-device upsell opportunity"
- Admin has clear, prioritized action items

**Specific Intelligence Added:**

1. **Engagement Scoring**: AI assesses customer engagement level based on subscription type, deal value, and account age
2. **Churn Risk Detection**: Identifies customers who might be at risk (e.g., trial ending soon, no recent activity)
3. **Upsell Identification**: Suggests expansion opportunities (additional devices, annual upgrade)
4. **Retention Strategies**: Recommends specific actions to keep customers engaged
5. **Prioritization**: Helps teams focus on high-value or at-risk customers first

### When would you use AI vs traditional rules/logic?

**Use Traditional Rules/Logic When:**

✅ **Criteria are clear and deterministic:**
- "If trial ends in 3 days, send reminder email" → Simple date comparison
- "If deal amount > $99, flag as high-value" → Simple threshold check
- "If no login in 30 days, mark as inactive" → Simple activity tracking

✅ **Compliance or accuracy is critical:**
- Financial calculations (MRR, ARR) must be exact
- Legal/regulatory requirements need audit trails
- Billing and payment processing

✅ **Performance is critical:**
- Real-time validation (email format, required fields)
- High-frequency operations (thousands per second)
- Low-latency requirements (<100ms)

✅ **Cost sensitivity:**
- Operations that run millions of times (AI API costs add up)
- Budget constraints for API usage

**Use AI When:**

🤖 **Context and nuance matter:**
- "Is this customer engaged?" → Requires holistic analysis of multiple signals
- "What's the best next action?" → Depends on customer history, behavior patterns, industry context
- "Why might this customer churn?" → Complex interplay of factors

🤖 **Natural language is valuable:**
- Generating customer-facing messages
- Summarizing complex data for executives
- Creating personalized recommendations

🤖 **Patterns are complex or evolving:**
- Churn prediction based on behavior patterns
- Sentiment analysis from support tickets
- Identifying upsell opportunities from usage data

🤖 **Human-like reasoning helps:**
- "Should we offer a discount to this customer?" → Requires judgment
- "How should we prioritize these leads?" → Multiple competing factors
- "What's the customer's likely intent?" → Inference from limited data

**Hybrid Approach (Best Practice):**

Use **rules for filtering**, **AI for insights:**

```
1. Rules: Identify customers with trials ending in 3 days
2. AI: Analyze each customer's engagement and recommend personalized retention strategy
3. Rules: Automatically send email with AI-generated personalized message
4. AI: Predict likelihood of conversion for prioritization
```

**For Breezy Specifically:**

| Task | Approach | Reason |
|------|----------|--------|
| Sync contact to HubSpot | Rules | Deterministic, must be reliable |
| Calculate MRR/ARR | Rules | Must be exact for financial reporting |
| Identify trial ending soon | Rules | Simple date comparison |
| **Recommend next action** | **AI** | **Requires context and judgment** |
| **Assess engagement level** | **AI** | **Complex pattern recognition** |
| **Generate personalized outreach** | **AI** | **Natural language generation** |
| Set deal stage to "closedwon" | Rules | Simple status update |
| **Predict churn risk** | **AI** | **Multiple subtle signals** |
| Validate email format | Rules | Fast, deterministic |
| **Suggest upsell opportunities** | **AI** | **Contextual recommendations** |

**Key Principle:** Use rules for the "what" (what happened, what threshold was crossed), use AI for the "so what" (what does it mean, what should we do about it).

---

## Design Decisions

### Technical Choices and Rationale

#### 1. Vanilla JavaScript (No Framework)

**Decision**: Use vanilla JavaScript instead of React, Vue, or Angular.

**Why:**
- **Simplicity**: No build process, no npm dependencies for frontend, runs directly in browser
- **Speed**: Faster development for a POC - no time spent on framework setup or configuration
- **Demonstration**: Shows core integration patterns without framework-specific abstractions
- **Accessibility**: Easier for HubSpot team to understand and modify without framework expertise

**Trade-offs:**
- More verbose DOM manipulation
- Manual state management
- No component reusability
- Would recommend React/Vue for production

#### 2. Backend Proxy Pattern

**Decision**: Use Express.js backend to proxy all HubSpot API calls rather than calling directly from frontend.

**Why:**
- **Security**: Never expose HubSpot API token in frontend JavaScript
- **CORS**: Avoid cross-origin issues by making same-origin requests to localhost:3001
- **Error Handling**: Centralize error transformation and logging
- **Rate Limiting**: Can implement rate limiting and caching at proxy layer
- **Flexibility**: Easy to add middleware, logging, or additional business logic

**Trade-offs:**
- Additional server infrastructure required
- Slight latency overhead (negligible for POC)

#### 3. Inline CSS in HTML

**Decision**: Include all CSS in `<style>` tag in index.html rather than separate stylesheet.

**Why:**
- **Single File**: Easier to demo and share
- **No Build Step**: No need for CSS preprocessing or bundling
- **POC Scope**: Styling is not the focus of this assessment

**Trade-offs:**
- Harder to maintain for larger projects
- No CSS reusability across pages
- Would extract to separate file(s) for production

#### 4. Automatic "closedwon" Deal Stage

**Decision**: Automatically set all deals to "closedwon" stage when created.

**Why:**
- **Business Logic**: In Breezy's model, deals represent successful subscription conversions (not opportunities)
- **Simplification**: Removes ambiguity about deal stages for POC
- **Alignment**: Matches HubSpot's intended use of "closed won" for successful sales

**Alternative Considered**: Allow user to select stage
- **Rejected**: Adds complexity without business value for this use case

#### 5. Contact Dropdown Population

**Decision**: Populate contact dropdowns after loading contacts, not on page load.

**Why:**
- **Data Freshness**: Ensures dropdown always has latest contacts
- **User Flow**: Natural progression - load contacts first, then create deals
- **Error Handling**: If contact load fails, user knows immediately

**Trade-offs:**
- Requires user to click "Load Contacts" before creating deals
- Could auto-load on page load for better UX (production improvement)

#### 6. Modal for Deal Viewing

**Decision**: Use modal overlay to display deals rather than inline expansion or separate page.

**Why:**
- **Focus**: Modal draws attention to deal information
- **Context**: User stays on same page, maintains context
- **Simplicity**: No routing or page navigation needed

**Alternative Considered**: Inline expansion in table row
- **Rejected**: Would make table layout complex and harder to read

#### 7. Anthropic Claude for AI (vs OpenAI GPT)

**Decision**: Use Anthropic Claude API for AI insights.

**Why:**
- **Context Window**: Claude has large context window for customer data
- **Instruction Following**: Excellent at following structured prompts
- **Safety**: Strong safety features for customer data handling
- **API Simplicity**: Straightforward REST API, easy to integrate

**Alternative Considered**: OpenAI GPT-4
- **Also Valid**: Would work equally well, chose Claude for variety

#### 8. Specification-Driven Development

**Decision**: Create formal requirements, design, and task documents before coding.

**Why:**
- **Clarity**: Forces clear thinking about what to build
- **Correctness**: Defines properties that must hold true
- **Communication**: Provides artifacts for stakeholder review
- **Testing**: Requirements map directly to test cases

**Trade-offs:**
- More upfront time investment
- Can feel like "over-engineering" for small POC
- **Value**: Demonstrates professional approach to client engagements

### Assumptions About Breezy's Platform

1. **Single Thermostat Per Contact**: Assumed each contact owns one thermostat initially. In reality, customers might own multiple devices.
   - **Production**: Would need Device object or array of serial numbers

2. **Immediate Sync**: Assumed contact/deal creation happens immediately when customer purchases/subscribes.
   - **Production**: Might have batch sync, webhooks, or scheduled jobs

3. **No Authentication**: POC has no user authentication or role-based access.
   - **Production**: Would need OAuth, user roles (admin, sales, support), and permissions

4. **US Market Only**: Assumed US-based customers (phone format, address format).
   - **Production**: Would need internationalization for global markets

5. **Simple Subscription Model**: Assumed only two tiers (monthly $9.99, annual $99).
   - **Production**: Might have multiple tiers, add-ons, enterprise pricing

6. **No Existing CRM Data**: Assumed clean slate integration.
   - **Production**: Would need data migration strategy for existing customers

7. **HubSpot as Single Source of Truth**: Assumed HubSpot is the primary CRM.
   - **Production**: Might need bi-directional sync with other systems

8. **Trial Auto-Starts**: Assumed trial starts immediately upon thermostat purchase.
   - **Production**: Customer might activate trial later

### What I'd Improve With More Time

#### Functionality Enhancements

1. **Bulk Operations**
   - Import contacts from CSV
   - Batch deal creation
   - Bulk update capabilities

2. **Advanced Filtering & Search**
   - Search contacts by name, email, or serial number
   - Filter deals by stage, amount, or date range
   - Sort tables by any column

3. **Real-time Sync**
   - WebSocket connection for live updates
   - Show when other admins make changes
   - Auto-refresh data periodically

4. **Enhanced AI Features**
   - Churn prediction scoring
   - Automated email generation
   - Sentiment analysis from support tickets
   - Batch insights for all customers

5. **Data Visualization**
   - Dashboard with charts (conversion funnel, MRR trend)
   - Customer segmentation pie charts
   - Deal pipeline visualization

6. **Audit Trail**
   - Log all API calls and changes
   - Show who created/modified each record
   - Undo functionality

#### Technical Improvements

1. **Framework Migration**
   - Migrate to React or Vue for better state management
   - Component-based architecture for reusability
   - TypeScript for type safety

2. **Automated Testing**
   - Unit tests for all functions (Jest/Vitest)
   - Integration tests for API endpoints (Supertest)
   - E2E tests for user flows (Cypress/Playwright)
   - Property-based tests for correctness properties

3. **Error Handling**
   - Retry logic with exponential backoff
   - Circuit breaker for API failures
   - Better error messages with recovery suggestions
   - Sentry integration for error tracking

4. **Performance Optimization**
   - Caching layer (Redis) for frequently accessed data
   - Pagination for large datasets
   - Lazy loading for images/components
   - Service worker for offline support

5. **Security Hardening**
   - Rate limiting per user/IP
   - Input sanitization and validation
   - CSRF protection
   - Content Security Policy headers
   - API key rotation mechanism

6. **DevOps**
   - Docker containerization
   - CI/CD pipeline (GitHub Actions)
   - Automated deployment
   - Environment-specific configs (dev/staging/prod)
   - Health checks and monitoring

#### UX/UI Improvements

1. **Better Visual Design**
   - Professional UI framework (Tailwind, Material-UI)
   - Consistent color scheme and branding
   - Loading skeletons instead of spinners
   - Smooth animations and transitions

2. **Accessibility**
   - ARIA labels for screen readers
   - Keyboard shortcuts
   - High contrast mode
   - Focus management

3. **Mobile Optimization**
   - Touch-friendly buttons and forms
   - Responsive tables (card view on mobile)
   - Mobile-specific navigation

4. **User Guidance**
   - Onboarding tour for new users
   - Tooltips explaining features
   - Inline help documentation
   - Video tutorials

### Questions for Client Before Production

#### Business Requirements

1. **Volume & Scale**
   - How many contacts do you expect in Year 1? Year 3?
   - How many deals per month?
   - What's your growth projection?
   - Do you need to support multiple regions/languages?

2. **User Roles & Permissions**
   - Who needs access to this admin panel? (Sales, Support, Marketing, Executives?)
   - What permissions should each role have?
   - Do you need approval workflows for certain actions?

3. **Data Model**
   - Can customers own multiple thermostats? How should we model that?
   - Do you track device firmware versions, installation dates, warranty info?
   - What custom properties are most important for your sales/marketing team?
   - Do you need to track B2B customers differently from B2C?

4. **Subscription Complexity**
   - Are there multiple subscription tiers beyond basic Premium?
   - Do you offer add-ons or bundles?
   - How do you handle upgrades/downgrades mid-cycle?
   - What about refunds or cancellations?

5. **Integration Points**
   - What other systems need to sync with HubSpot? (Stripe, Salesforce, Support desk?)
   - Do you need bi-directional sync or one-way?
   - What's your source of truth for customer data?

#### Technical Requirements

6. **Performance & Reliability**
   - What's your uptime requirement? (99.9%? 99.99%?)
   - What's acceptable latency for sync operations?
   - Do you need real-time sync or is batch (hourly/daily) acceptable?

7. **Security & Compliance**
   - What data privacy regulations apply? (GDPR, CCPA, HIPAA?)
   - Do you need data encryption at rest and in transit?
   - What's your data retention policy?
   - Do you need audit logs for compliance?

8. **Error Handling**
   - How should the system handle HubSpot API failures?
   - Should failed syncs retry automatically or alert someone?
   - What's your process for resolving data conflicts?

9. **Monitoring & Alerts**
   - Who should be notified of system errors?
   - What metrics do you want to track? (API usage, sync success rate, latency?)
   - Do you have existing monitoring tools (Datadog, New Relic)?

#### AI Feature Specifics

10. **AI Usage & Budget**
    - What's your budget for AI API calls?
    - How many insights do you expect to generate per month?
    - Should AI run automatically or only on-demand?
    - What level of AI accuracy is acceptable?

11. **AI Governance**
    - Who reviews AI recommendations before acting on them?
    - Do you need to log all AI-generated insights for audit?
    - What happens if AI gives bad advice?
    - How do you want to handle AI errors or unavailability?

#### Future Roadmap

12. **Phase 2 Features**
    - What features are most important after MVP launch?
    - Are there specific pain points in your current workflow?
    - What reports or dashboards would be most valuable?
    - Do you envision mobile app access?

13. **Success Metrics**
    - How will you measure success of this integration?
    - What KPIs matter most? (Time saved, conversion rate, customer satisfaction?)
    - When do you need this in production?
    - What's your rollout strategy? (Pilot team first? Full launch?)

These questions would help ensure the production system meets Breezy's actual needs and avoids costly rework later.

---

## License

MIT License - This is a technical assessment project for HubSpot Solutions Architect role.

---

## Acknowledgments

- **HubSpot**: For providing the CRM API and technical assessment
- **Breezy**: Fictional smart home company used as the business context
- **EARS**: Easy Approach to Requirements Syntax for clear requirements
- **Specification-Driven Development**: Formal approach to software correctness

---

**Built with ❤️ for the HubSpot Solutions Architect Technical Assessment**
