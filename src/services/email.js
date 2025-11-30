import emailjs from '@emailjs/browser';
import logger from '../utils/logger';

// Initialize EmailJS with public key
export const initEmailService = () => {
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    if (publicKey) {
        emailjs.init(publicKey);
        logger.info('Email Service', 'EmailJS initialized');
    } else {
        logger.warning('Email Service', 'EmailJS Public Key not found');
    }
};

// Generic send function
export const sendEmail = async (templateId, templateParams) => {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !publicKey) {
        logger.error('Email Service', 'Missing EmailJS configuration');
        return { success: false, error: 'Configuration missing' };
    }

    try {
        const response = await emailjs.send(serviceId, templateId, templateParams, publicKey);
        logger.success('Email Service', 'Email sent successfully', response);
        return { success: true, response };
    } catch (error) {
        logger.error('Email Service', 'Failed to send email', error);
        return { success: false, error };
    }
};

// Send Welcome Email
export const sendWelcomeEmail = async (user) => {
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    if (!templateId) return;

    const params = {
        to_name: user.displayName || 'Student',
        to_email: user.email,
        message: 'Welcome to Shikshak! We are excited to have you on board.',
    };

    return await sendEmail(templateId, params);
};

// Send Test Email
export const sendTestEmail = async (user) => {
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    if (!templateId) {
        logger.error('Email Service', 'Template ID missing');
        return { success: false, error: 'Template ID missing' };
    }

    const params = {
        to_name: user.displayName || 'Student',
        to_email: user.email,
        message: 'This is a test email from Shikshak to verify your notification settings.',
    };

    return await sendEmail(templateId, params);
};
