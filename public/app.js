/**
 * Breezy HubSpot Integration Admin Panel - JavaScript
 * 
 * @author Raj Pasupathy
 * @title Principal Architect
 * @description Frontend application for managing HubSpot contacts and deals integration
 * @date December 2025
 */

// ============================================
// Utility Helper Functions
// ============================================

/**
 * Show loading indicator for a specific element
 * @param {string} elementId - The ID of the loading element to show
 */
function showLoading(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.classList.remove('hidden');
  }
}

/**
 * Hide loading indicator for a specific element
 * @param {string} elementId - The ID of the loading element to hide
 */
function hideLoading(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.classList.add('hidden');
  }
}

/**
 * Show success message
 * @param {string} message - The success message to display
 * @param {string} elementId - The ID of the success message element
 */
function showSuccess(message, elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = message;
    element.classList.remove('hidden');
    
    // Auto-hide message after 5 seconds
    setTimeout(() => {
      element.classList.add('hidden');
    }, 5000);
  }
}

/**
 * Show error message
 * @param {string} message - The error message to display
 * @param {string} elementId - The ID of the error message element
 */
function showError(message, elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = message;
    element.classList.remove('hidden');
    
    // Auto-hide message after 5 seconds
    setTimeout(() => {
      element.classList.add('hidden');
    }, 5000);
  }
}

// ============================================
// Contacts Panel Functions
// ============================================

/**
 * Load contacts from the backend API
 * @param {boolean} silent - If true, load silently without showing loading indicator
 */
async function loadContacts(silent = false) {
  const loadingElement = document.getElementById('contacts-loading');
  const errorElement = document.getElementById('contacts-error');
  const tableElement = document.getElementById('contacts-table');

  // Show loading indicator only if not silent
  if (!silent) {
    loadingElement.classList.remove('hidden');
    tableElement.classList.add('hidden');
  }
  errorElement.classList.add('hidden');

  try {
    const response = await fetch('/api/contacts');
    
    if (!response.ok) {
      throw new Error(`Failed to load contacts: ${response.statusText}`);
    }

    const data = await response.json();
    const contacts = data.results || [];

    // Hide loading indicator (only if it was shown)
    if (!silent) {
      loadingElement.classList.add('hidden');
    }

    // Render contacts table
    renderContactsTable(contacts);

    // After successfully rendering contacts table, call populateContactDropdown()
    // Pass contacts array to function (Requirement 3.2)
    populateContactDropdown(contacts);
    
    // Also populate AI contact dropdown
    populateAIContactDropdown(contacts);

  } catch (error) {
    // Hide loading indicator (only if it was shown)
    if (!silent) {
      loadingElement.classList.add('hidden');
    }

    // Display error message (always show errors, even in silent mode)
    errorElement.textContent = error.message || 'An error occurred while loading contacts';
    errorElement.classList.remove('hidden');

    console.error('Error loading contacts:', error);
  }
}

/**
 * Render contacts in the table
 */
function renderContactsTable(contacts) {
  const tbody = document.getElementById('contacts-tbody');
  const tableElement = document.getElementById('contacts-table');

  // Clear existing table rows
  tbody.innerHTML = '';

  // If no contacts, show empty message
  if (contacts.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty-message">No contacts found</td></tr>';
    tableElement.classList.remove('hidden');
    return;
  }

  // Iterate through contacts array and create table rows
  contacts.forEach(contact => {
    const row = document.createElement('tr');
    
    // Store contactId as data attribute
    row.dataset.contactId = contact.id;

    // Extract properties
    const props = contact.properties || {};
    const firstname = props.firstname || '';
    const lastname = props.lastname || '';
    const email = props.email || '';
    const jobtitle = props.jobtitle || '';
    const company = props.company || '';

    // Create table cells with all required columns
    row.innerHTML = `
      <td>${escapeHtml(firstname)}</td>
      <td>${escapeHtml(lastname)}</td>
      <td>${escapeHtml(email)}</td>
      <td>${escapeHtml(jobtitle)}</td>
      <td>${escapeHtml(company)}</td>
      <td>
        <button class="action-btn view-deals-btn" data-contact-id="${contact.id}" data-contact-name="${escapeHtml(firstname + ' ' + lastname)}">
          View Deals
        </button>
      </td>
    `;

    tbody.appendChild(row);
  });

  // Wire up "View Deals" button clicks (Requirement 4.2)
  // Add click event listener to each "View Deals" button
  const viewDealsButtons = tbody.querySelectorAll('.view-deals-btn');
  viewDealsButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Extract contactId and contact name from button data attributes
      const contactId = this.dataset.contactId;
      const contactName = this.dataset.contactName;
      
      // Call viewContactDeals() with contactId and name
      viewContactDeals(contactId, contactName);
    });
  });

  // Show the table
  tableElement.classList.remove('hidden');
}

/**
 * Escape HTML to prevent XSS attacks
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ============================================
// Create Contact Form Functions
// ============================================

/**
 * Handle create contact form submission
 */
async function handleCreateContact(event) {
  // Prevent default form submission
  event.preventDefault();

  const form = event.target;
  const submitBtn = document.getElementById('create-contact-btn');
  const loadingElement = document.getElementById('create-contact-loading');
  const successElement = document.getElementById('create-contact-success');
  const errorElement = document.getElementById('create-contact-error');

  // Validate form data (HTML5 validation already handles required fields)
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  // Collect form data into properties object
  const formData = new FormData(form);
  const properties = {
    firstname: formData.get('firstname'),
    lastname: formData.get('lastname'),
    email: formData.get('email'),
    phone: formData.get('phone') || undefined,
    address: formData.get('address') || undefined
  };

  // Remove undefined values
  Object.keys(properties).forEach(key => {
    if (properties[key] === undefined || properties[key] === '') {
      delete properties[key];
    }
  });

  // Show loading indicator on submit button
  submitBtn.disabled = true;
  loadingElement.classList.remove('hidden');
  successElement.classList.add('hidden');
  errorElement.classList.add('hidden');

  try {
    // Call createContact with form data
    await createContact(properties, form);
  } finally {
    // Re-enable submit button
    submitBtn.disabled = false;
    loadingElement.classList.add('hidden');
  }
}

/**
 * Create a new contact via the backend API
 */
async function createContact(properties, form) {
  const successElement = document.getElementById('create-contact-success');
  const errorElement = document.getElementById('create-contact-error');

  try {
    // Send POST request to /api/contacts with properties
    const response = await fetch('/api/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ properties })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to create contact: ${response.statusText}`);
    }

    await response.json();

    // Handle successful response by showing success message
    successElement.textContent = `Contact created successfully! ${properties.firstname} ${properties.lastname} has been added to HubSpot.`;
    successElement.classList.remove('hidden');

    // Auto-hide success message after 5 seconds
    setTimeout(() => {
      successElement.classList.add('hidden');
    }, 5000);

    // Clear form fields after success
    form.reset();

    // Automatically call loadContacts() to refresh table (silent mode for seamless UX)
    await loadContacts(true);

  } catch (error) {
    // Handle errors by displaying error message
    errorElement.textContent = error.message || 'An error occurred while creating the contact';
    errorElement.classList.remove('hidden');

    // Auto-hide error message after 5 seconds
    setTimeout(() => {
      errorElement.classList.add('hidden');
    }, 5000);

    console.error('Error creating contact:', error);
  }
}

// ============================================
// Create Deal Form Functions
// ============================================

/**
 * Populate the contact dropdown in the deal creation form
 */
function populateContactDropdown(contacts) {
  const dropdown = document.getElementById('deal-contact-id');
  
  // Clear existing dropdown options (except placeholder)
  // Keep the first option (placeholder)
  while (dropdown.options.length > 1) {
    dropdown.remove(1);
  }

  // Iterate through contacts array
  contacts.forEach(contact => {
    // Create option element for each contact
    const option = document.createElement('option');
    
    // Set option value to contactId
    option.value = contact.id;
    
    // Set option text to "firstname lastname (email)"
    const props = contact.properties || {};
    const firstname = props.firstname || '';
    const lastname = props.lastname || '';
    const email = props.email || '';
    option.textContent = `${firstname} ${lastname} (${email})`;
    
    dropdown.appendChild(option);
  });
}

/**
 * Handle create deal form submission
 */
async function handleCreateDeal(event) {
  // Prevent default form submission
  event.preventDefault();

  const form = event.target;
  const submitBtn = document.getElementById('create-deal-btn');
  const loadingElement = document.getElementById('create-deal-loading');
  const successElement = document.getElementById('create-deal-success');
  const errorElement = document.getElementById('create-deal-error');

  // Validate form data (HTML5 validation already handles required fields)
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  // Collect form data into dealProperties object
  const formData = new FormData(form);
  const dealProperties = {
    dealname: formData.get('dealname'),
    amount: formData.get('amount'),
    // Automatically set dealstage to "closedwon"
    dealstage: 'closedwon'
  };

  // Get selected contactId from dropdown
  const contactId = formData.get('deal-contact-id');

  // Show loading indicator on submit button
  submitBtn.disabled = true;
  loadingElement.classList.remove('hidden');
  successElement.classList.add('hidden');
  errorElement.classList.add('hidden');

  try {
    // Call createDeal() with dealProperties and contactId
    await createDeal(dealProperties, contactId, form);
  } finally {
    // Re-enable submit button
    submitBtn.disabled = false;
    loadingElement.classList.add('hidden');
  }
}

/**
 * Create a new deal via the backend API
 */
async function createDeal(dealProperties, contactId, form) {
  const successElement = document.getElementById('create-deal-success');
  const errorElement = document.getElementById('create-deal-error');

  try {
    // Send POST request to /api/deals with dealProperties and contactId
    const response = await fetch('/api/deals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        dealProperties,
        contactId 
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to create deal: ${response.statusText}`);
    }

    await response.json();

    // Handle successful response by showing success message
    successElement.textContent = `Deal created successfully! ${dealProperties.dealname} has been added to HubSpot.`;
    successElement.classList.remove('hidden');

    // Auto-hide success message after 5 seconds
    setTimeout(() => {
      successElement.classList.add('hidden');
    }, 5000);

    // Clear form fields after success
    form.reset();

  } catch (error) {
    // Handle errors by displaying error message
    errorElement.textContent = error.message || 'An error occurred while creating the deal';
    errorElement.classList.remove('hidden');

    // Auto-hide error message after 5 seconds
    setTimeout(() => {
      errorElement.classList.add('hidden');
    }, 5000);

    console.error('Error creating deal:', error);
  }
}

// ============================================
// View Deals Functions
// ============================================

/**
 * View deals for a specific contact
 */
async function viewContactDeals(contactId, contactName) {
  const modal = document.getElementById('deals-modal');
  const contactNameElement = document.getElementById('deals-contact-name');
  const loadingElement = document.getElementById('deals-loading');
  const errorElement = document.getElementById('deals-error');
  const dealsListElement = document.getElementById('deals-list');

  // Show modal
  modal.classList.add('show');

  // Display contact name in modal heading
  contactNameElement.textContent = contactName;

  // Clear previous content
  dealsListElement.innerHTML = '';
  errorElement.classList.add('hidden');

  // Show loading indicator
  loadingElement.classList.remove('hidden');

  try {
    // Fetch deals from GET /api/contacts/:contactId/deals
    const response = await fetch(`/api/contacts/${contactId}/deals`);

    if (!response.ok) {
      throw new Error(`Failed to load deals: ${response.statusText}`);
    }

    const data = await response.json();
    const deals = data.results || [];

    // Hide loading indicator
    loadingElement.classList.add('hidden');

    // Handle empty results by displaying "No subscriptions found" message
    if (deals.length === 0) {
      dealsListElement.innerHTML = '<div class="empty-message">No subscriptions found</div>';
      return;
    }

    // Handle successful response by calling renderDealsList()
    renderDealsList(deals);

  } catch (error) {
    // Hide loading indicator
    loadingElement.classList.add('hidden');

    // Handle errors by displaying error message
    errorElement.textContent = error.message || 'An error occurred while loading deals';
    errorElement.classList.remove('hidden');

    console.error('Error loading deals:', error);
  }
}

/**
 * Render deals list in the modal
 */
function renderDealsList(deals) {
  const dealsListElement = document.getElementById('deals-list');

  // Clear existing deals list
  dealsListElement.innerHTML = '';

  // Iterate through deals array
  deals.forEach(deal => {
    // Create div for each deal showing: deal name, amount, stage
    const dealDiv = document.createElement('div');
    dealDiv.className = 'deal-item';

    const props = deal.properties || {};
    const dealname = props.dealname || 'Unnamed Deal';
    const amount = props.amount || '0';
    const stage = props.dealstage || 'Unknown';

    dealDiv.innerHTML = `
      <div><strong>Deal Name:</strong> ${escapeHtml(dealname)}</div>
      <div><strong>Amount:</strong> $${escapeHtml(amount)}</div>
      <div><strong>Stage:</strong> ${escapeHtml(stage)}</div>
    `;

    // Append to deals list container
    dealsListElement.appendChild(dealDiv);
  });
}

/**
 * Close the deals modal
 */
function closeDealsModal() {
  const modal = document.getElementById('deals-modal');
  modal.classList.remove('show');
}

// ============================================
// AI Insights Functions
// ============================================

/**
 * Handle AI insights form submission
 */
async function handleGenerateInsights(event) {
  event.preventDefault();

  const contactSelect = document.getElementById('ai-contact-id');
  const selectedContactId = contactSelect.value;

  if (!selectedContactId) {
    showError('ai-insights-error', 'Please select a contact');
    return;
  }

  // Get the selected contact data
  const selectedOption = contactSelect.options[contactSelect.selectedIndex];
  const contactData = {
    id: selectedContactId,
    firstname: selectedOption.dataset.firstname,
    lastname: selectedOption.dataset.lastname,
    email: selectedOption.dataset.email,
    phone: selectedOption.dataset.phone || '',
    address: selectedOption.dataset.address || ''
  };

  await generateAIInsights(contactData);
}

/**
 * Format AI insight text for better display
 * Converts markdown-style formatting to HTML
 */
function formatAIInsight(text) {
  // Replace markdown headers (## Header) with HTML
  text = text.replace(/##\s*(.+?)(?:\*\*)?$/gm, '<h4 style="color: #007bff; margin-top: 15px; margin-bottom: 8px; font-size: 1rem;">$1</h4>');
  
  // Replace bold text (**text**) with HTML
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong style="color: #333;">$1</strong>');
  
  // Split into paragraphs and wrap each in <p> tags
  const paragraphs = text.split('\n\n').filter(p => p.trim());
  const formattedParagraphs = paragraphs.map(p => {
    // If it's already a heading, don't wrap in <p>
    if (p.trim().startsWith('<h4')) {
      return p;
    }
    return `<p style="margin-bottom: 12px; line-height: 1.6;">${p.trim()}</p>`;
  }).join('');
  
  return formattedParagraphs;
}

/**
 * Generate AI insights for a contact
 */
async function generateAIInsights(contactData) {
  const loadingElement = document.getElementById('ai-insights-loading');
  const errorElement = document.getElementById('ai-insights-error');
  const resultElement = document.getElementById('ai-insights-result');
  const contentElement = document.getElementById('ai-insights-content');

  try {
    // Show loading state (Property 1)
    loadingElement.classList.remove('hidden');
    errorElement.classList.add('hidden');
    resultElement.classList.add('hidden');

    // Fetch deals for this contact to include in analysis
    let dealData = null;
    try {
      const dealsResponse = await fetch(`http://localhost:3001/api/contacts/${contactData.id}/deals`);
      if (dealsResponse.ok) {
        const dealsData = await dealsResponse.json();
        if (dealsData.results && dealsData.results.length > 0) {
          // Use the most recent deal
          dealData = {
            dealname: dealsData.results[0].properties.dealname,
            amount: dealsData.results[0].properties.amount,
            dealstage: dealsData.results[0].properties.dealstage
          };
        }
      }
    } catch (dealError) {
      console.log('No deals found for contact, proceeding with contact data only');
    }

    // Call AI insights API
    const response = await fetch('http://localhost:3001/api/ai/insights', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contactData: contactData,
        dealData: dealData
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      // Use the user-friendly error message from backend
      throw new Error(errorData.error || errorData.details || 'Failed to generate insights');
    }

    const data = await response.json();

    // Display insights (Property 12)
    // Format the AI response for better readability
    contentElement.innerHTML = formatAIInsight(data.insight);
    resultElement.classList.remove('hidden');

    // Hide loading
    loadingElement.classList.add('hidden');

  } catch (error) {
    console.error('Error generating AI insights:', error);
    
    // Show error message (Property 2)
    loadingElement.classList.add('hidden');
    errorElement.textContent = error.message || 'Failed to generate AI insights. Please check that your ANTHROPIC_API_KEY is configured.';
    errorElement.classList.remove('hidden');
    
    // Auto-hide error after 10 seconds (longer for overload messages)
    setTimeout(() => {
      errorElement.classList.add('hidden');
    }, 10000);
  }
}

/**
 * Populate AI contact dropdown with contacts
 * Called after contacts are loaded
 */
function populateAIContactDropdown(contacts) {
  const dropdown = document.getElementById('ai-contact-id');
  
  // Clear existing options except the placeholder
  dropdown.innerHTML = '<option value="">Select a contact...</option>';
  
  // Add each contact as an option with data attributes
  contacts.forEach(contact => {
    const option = document.createElement('option');
    option.value = contact.id;
    option.textContent = `${contact.properties.firstname} ${contact.properties.lastname} (${contact.properties.email})`;
    
    // Store contact data in data attributes for later use
    option.dataset.firstname = contact.properties.firstname;
    option.dataset.lastname = contact.properties.lastname;
    option.dataset.email = contact.properties.email;
    option.dataset.phone = contact.properties.phone || '';
    option.dataset.address = contact.properties.address || '';
    
    dropdown.appendChild(option);
  });
}

// ============================================
// Event Listeners and Initialization
// ============================================

/**
 * Initialize the application
 * Set up all event listeners and initialize default state
 */
function init() {
  // Wire up "Load Contacts" button click event (Requirement 1.2)
  const loadContactsBtn = document.getElementById('load-contacts-btn');
  if (loadContactsBtn) {
    loadContactsBtn.addEventListener('click', loadContacts);
  }

  // Wire up form submit event (Requirement 2.2)
  const createContactForm = document.getElementById('create-contact-form');
  if (createContactForm) {
    createContactForm.addEventListener('submit', handleCreateContact);
  }

  // Wire up deal form submit event (Requirement 3.3)
  const createDealForm = document.getElementById('create-deal-form');
  if (createDealForm) {
    createDealForm.addEventListener('submit', handleCreateDeal);
  }

  // Wire up AI insights form submit event (Requirement 6.1)
  const aiInsightsForm = document.getElementById('ai-insights-form');
  if (aiInsightsForm) {
    aiInsightsForm.addEventListener('submit', handleGenerateInsights);
  }

  // Wire up modal close functionality (Requirement 4.2)
  // Add click event listener to close button
  const closeButton = document.querySelector('#deals-modal .close');
  if (closeButton) {
    closeButton.addEventListener('click', closeDealsModal);
  }

  // Add click event listener to modal overlay (click outside to close)
  const modal = document.getElementById('deals-modal');
  if (modal) {
    modal.addEventListener('click', function(event) {
      // Only close if clicking the overlay itself, not the modal content
      if (event.target === modal) {
        closeDealsModal();
      }
    });
  }

  // Initialize any default state
  // Explicitly hide all loading indicators on page load
  const loadingIndicators = [
    'create-contact-loading',
    'create-deal-loading',
    'ai-insights-loading',
    'deals-loading'
  ];
  
  loadingIndicators.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.classList.add('hidden');
    }
  });
  
  // Auto-load contacts on page load for better UX (silent mode)
  // This populates the contacts table and both dropdowns immediately
  // Silent mode prevents showing loading spinner on initial page load
  loadContacts(true);
}

/**
 * Run initialization when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', init);
