export function createWelcomeEmailTemplate(name, clientURL) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to SapiensChat</title>
  </head>
  <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
    <div style="background: linear-gradient(to right, #f59e0b, #ea580c); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
      <div style="width: 80px; height: 80px; margin: 0 auto 20px; background: linear-gradient(to right, #f59e0b, #ea580c); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7V12C2 16.5 4.23 20.68 12 22C19.77 20.68 22 16.5 22 12V7L12 2Z" fill="white"/>
          <path d="M8 12L10.5 14.5L16 9" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">Welcome to SapiensChat!</h1>
      <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Your journey into smart conversations begins here</p>
    </div>
    <div style="background-color: #ffffff; padding: 35px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
      <p style="font-size: 18px; color: #ea580c;"><strong>Hello ${name},</strong></p>
      <p>We're thrilled to have you join SapiensChat! Your account has been successfully created and you're ready to start connecting with friends, family, and colleagues.</p>
      
      <div style="background-color: #fef3c7; padding: 25px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #f59e0b;">
        <p style="font-size: 16px; margin: 0 0 15px 0; color: #92400e;"><strong>Get started in just a few steps:</strong></p>
        <ul style="padding-left: 20px; margin: 0; color: #78350f;">
          <li style="margin-bottom: 10px;">Set up your profile picture</li>
          <li style="margin-bottom: 10px;">Find and add your contacts</li>
          <li style="margin-bottom: 10px;">Start your first conversation</li>
          <li style="margin-bottom: 0;">Enjoy smart features and enhanced privacy</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${clientURL}" style="background: linear-gradient(to right, #f59e0b, #ea580c); color: white; text-decoration: none; padding: 14px 32px; border-radius: 50px; font-weight: 600; display: inline-block; font-size: 16px; transition: transform 0.2s;">Open SapiensChat</a>
      </div>
      
      <p style="margin-bottom: 5px; color: #6b7280;">If you need any help or have questions, we're always here to assist you.</p>
      <p style="margin-top: 0; color: #6b7280;">Happy chatting!</p>
      
      <p style="margin-top: 25px; margin-bottom: 0; color: #374151;">Best regards,<br>The SapiensChat Team</p>
    </div>
    
    <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
      <p>© 2025 SapiensChat. All rights reserved.</p>
      <p>
        <a href="#" style="color: #ea580c; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
        <a href="#" style="color: #ea580c; text-decoration: none; margin: 0 10px;">Terms of Service</a>
        <a href="#" style="color: #ea580c; text-decoration: none; margin: 0 10px;">Contact Us</a>
      </p>
    </div>
  </body>
  </html>
  `;
}
