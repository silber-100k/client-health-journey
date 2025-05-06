import emailjs from '@emailjs/nodejs';

const emailUserId = {
    publicKey: process.env.EMAIL_PUBLIC_KEY,
    privateKey: process.env.EMAIL_PRIVATE_KEY,
};

export const sendClientRegistrationEmail = async (newClient, clinicName, tempPassword) => {
    const templateParams = {
        name: newClient.name,
        login_url: `${process.env.NEXTAUTH_URL}/login`,
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
        emailUserId
    );
}

export const sendCoachRegistrationEmail = async (newCoach, tempPassword) => {
    const templateParams = {
        name: newCoach.name,
        login_url: `${process.env.NEXTAUTH_URL}/login`,
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
        emailUserId
    );
}
