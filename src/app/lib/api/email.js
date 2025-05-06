import emailjs from '@emailjs/nodejs';

export const sendClientRegistrationEmail = async (newClient, clinicName, tempPassword) => {
    const templateParams = {
        name: newClient.name,
        login_url: `${process.env.NEXT_PUBLIC_APP_URL}/login`,
        user_email: newClient.email,
        email: newClient.email,
        user_pwd: tempPassword,
        clinic_name: clinicName,
        phone_number: newClient.phone,
    };

    await emailjs.send(
        process.env.EMAIL_SERVICE_ID,
        process.env.EMAIL_CLIENT_TEMPLATE_ID,
        templateParams,
        process.env.EMAIL_USER_ID
    );
}

export const sendCoachRegistrationEmail = async (newCoach, tempPassword) => {
    const templateParams = {
        name: newCoach.name,
        login_url: `${process.env.NEXT_PUBLIC_APP_URL}/login`,
        user_email: newCoach.email,
        user_pwd: tempPassword,
        support_email: 'support@clienthealthtracker.com',
        website_url: 'www.clienthealthtracker.com',
        email: newCoach.email,
    }

    await emailjs.send(
        process.env.EMAIL_SERVICE_ID,
        process.env.EMAIL_COACH_TEMPLATE_ID,
        templateParams,
        process.env.EMAIL_USER_ID
    );
}
