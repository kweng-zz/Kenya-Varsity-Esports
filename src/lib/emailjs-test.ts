import emailjs from '@emailjs/browser';

/**
 * Test utility for EmailJS configuration
 * Run this in browser console to test your EmailJS setup
 */
export const testEmailJS = async () => {
  console.log('🧪 Testing EmailJS Configuration...');
  
  // Get configuration from environment
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
  
  console.log('📋 Configuration Check:');
  console.log('Service ID:', serviceId ? '✅ Set' : '❌ Missing');
  console.log('Template ID:', templateId ? `✅ Set (${templateId})` : '❌ Missing');
  console.log('Public Key:', publicKey ? '✅ Set' : '❌ Missing');
  
  if (!serviceId || !templateId || !publicKey) {
    console.error('❌ EmailJS configuration missing. Please check your .env file.');
    return false;
  }
  
  try {
    // Initialize EmailJS
    emailjs.init(publicKey);
    console.log('✅ EmailJS initialized successfully');
    
    // Test data
    const testData = {
      from_name: 'Test User',
      from_email: 'test@example.com',
      message: 'This is a test message to verify EmailJS is working correctly.',
      to_email: 'events@tunzaesports.com',
      reply_to: 'test@example.com',
      type: 'partnership'
    };
    
    console.log('📤 Sending test email...');
    const result = await emailjs.send(serviceId, templateId, testData);
    
    console.log('✅ Test email sent successfully!');
    console.log('Response:', result);
    
    if (result.status === 200) {
      console.log('🎉 EmailJS is working correctly!');
      return true;
    } else {
      console.error('❌ EmailJS returned unexpected status:', result.status);
      return false;
    }
    
  } catch (error) {
    console.error('❌ EmailJS test failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error details:', errorMessage);
    return false;
  }
};

/**
 * Browser console helper function
 * Add this to your console for testing: testEmailJSConsole()
 */
export const testEmailJSConsole = () => {
  // This function can be called directly from browser console
  (window as any).testEmailJS = testEmailJS;
  console.log('🔧 Test function ready! Run testEmailJS() in console to test.');
};