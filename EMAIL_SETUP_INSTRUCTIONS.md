# EmailJS Setup Instructions

To make the contact form work with EmailJS (client-side email sending):

## 1. Create an EmailJS Account

1. Go to [EmailJS.com](https://www.emailjs.com/) and sign up for a free account
2. The free plan allows 200 emails per month

## 2. Add an Email Service

1. In your EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose a service (Gmail, Outlook, or another provider)
4. Follow the instructions to connect your email account

## 3. Create an Email Template

1. Go to "Email Templates" in your dashboard
2. Click "Create New Template"
3. Design your template with the following variables:
   - `{{name}}` - Sender's name
   - `{{email}}` - Sender's email
   - `{{subject}}` - Email subject
   - `{{message}}` - Message content
   - `{{to_email}}` - Hidden field that will contain the recipient email
4. Save your template

## 4. Update the Contact Form

1. Open `app/help/page.tsx`
2. Find these lines:

   ```js
   const serviceId = 'YOUR_SERVICE_ID'; // Create on EmailJS.com
   const templateId = 'YOUR_TEMPLATE_ID'; // Create on EmailJS.com
   const publicKey = 'YOUR_PUBLIC_KEY'; // Get from EmailJS account settings
   ```

3. Replace with your actual IDs:
   - `serviceId` - From the Email Services page (e.g., "service_abc123")
   - `templateId` - From the Email Templates page (e.g., "template_xyz789")
   - `publicKey` - From Account > API Keys (e.g., "user_def456")

## 5. Test the Form

1. Run your application
2. Fill out the contact form and submit
3. Check that the email is sent to <jasonbluebarrientos@gmail.com>

## Advantages of EmailJS

- Works entirely on the client-side
- No need for server-side API routes
- No need for SMTP credentials
- Simple to set up and use
