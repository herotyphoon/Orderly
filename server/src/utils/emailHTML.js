const verificationEmailHTML = (verificationLink) => `
<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
    <title>Verify Your Email – Orderly</title>
  </head>
  
  <body style="margin:0;padding:0;background-color:#f0fbef;">
  
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f0fbef;">
    <tr>
      <td align="center" style="padding:40px 0;">
  
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"
               style="background-color:#ffffff;border-radius:16px;overflow:hidden;">
  
          <tr>
            <td align="center" style="padding:40px;background-color:#52c73d;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:12px 24px;background-color:rgba(10,28,8,0.1);border-radius:8px;">
                    <span style="font-family:Segoe UI,Arial,sans-serif;
                                 font-size:32px;
                                 font-weight:800;
                                 color:#0a1c08;">
                      Orderly
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
  
          <tr>
            <td align="center" style="padding:40px 40px 20px 40px;">
  
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center">
                <tr>
                  <td align="center">
  
                    <table role="presentation" width="100" height="100" cellpadding="0" cellspacing="0" border="0"
                           style="background-color:#52c73d;border-radius:50%;">
                      <tr>
                        <td align="center" valign="middle">
                          <img src="https://yourcdn.com/mail.png"
                               width="56" height="56"
                               alt="Email"
                               style="display:block;">
                        </td>
                      </tr>
                    </table>
  
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr><td height="8"></td></tr>
                    </table>
  
                    <table role="presentation" width="36" height="36" cellpadding="0" cellspacing="0" border="0"
                           style="background-color:#52c73d;border-radius:50%;border:4px solid #ffffff;">
                      <tr>
                        <td align="center" valign="middle">
                          <img src="https://yourcdn.com/check.png"
                               width="20" height="20"
                               alt="Verified"
                               style="display:block;">
                        </td>
                      </tr>
                    </table>
  
                  </td>
                </tr>
              </table>
  
            </td>
          </tr>
  
          <tr>
            <td style="padding:20px 40px 40px 40px;">
  
              <h2 style="margin:0 0 16px 0;
                         font-family:Segoe UI,Arial,sans-serif;
                         font-size:32px;
                         font-weight:700;
                         color:#0a1c08;
                         text-align:center;">
                Verify &amp; Setup Your Profile
              </h2>
  
              <p style="margin:0 0 32px 0;
                        font-family:Segoe UI,Arial,sans-serif;
                        font-size:16px;
                        line-height:1.6;
                        color:#555;
                        text-align:center;">
                Welcome to Orderly! Complete your profile setup to unlock the full power of organized productivity.
              </p>
  
              <table role="presentation" align="center" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" bgcolor="#52c73d" style="border-radius:8px;">
                    <a href="${verificationLink}"
                       style="display:inline-block;
                              padding:16px 40px;
                              font-family:Segoe UI,Arial,sans-serif;
                              font-size:16px;
                              font-weight:700;
                              color:#0a1c08;
                              text-decoration:none;">
                      Verify Email &amp; Setup Profile
                    </a>
                  </td>
                </tr>
              </table>
  
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:32px 0;">
                <tr><td height="1" style="background-color:#6fb4be;"></td></tr>
              </table>
  
              <p style="margin:0 0 16px 0;
                        font-family:Segoe UI,Arial,sans-serif;
                        font-size:14px;
                        color:#555;
                        text-align:center;">
                Button not working? Copy and paste this link:
              </p>
  
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:16px;background-color:#eef9f2;border-radius:8px;">
                    <p style="margin:0;
                              font-family:Courier New,monospace;
                              font-size:13px;
                              color:#52c73d;
                              word-break:break-all;">
                      ${verificationLink}
                    </p>
                  </td>
                </tr>
              </table>
  
            </td>
          </tr>
  
          <tr>
            <td align="center" style="padding:32px;background-color:#f0fbef;border-top:1px solid #6fb4be;">
  
              <p style="margin:0 0 8px 0;
                        font-family:Segoe UI,Arial,sans-serif;
                        font-size:13px;
                        color:#555;">
                <strong style="color:#0a1c08;">Orderly</strong> — Chaos, organized.
              </p>
  
              <p style="margin:0;
                        font-family:Segoe UI,Arial,sans-serif;
                        font-size:12px;
                        color:#888;">
                <a href="{{PRIVACY_URL}}" style="color:#888;text-decoration:underline;">Privacy Policy</a> •
                <a href="{{TERMS_URL}}" style="color:#888;text-decoration:underline;">Terms</a>
              </p>
  
            </td>
          </tr>
  
        </table>
      </td>
    </tr>
  </table>
  
  </body>
  </html>
`;

const forgotPasswordEmailHTML = (resetCode) =>
  `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="x-apple-disable-message-reformatting">
    <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
    <meta name="color-scheme" content="light dark">
    <meta name="supported-color-schemes" content="light dark">
    <title>Your Password Reset Code - Orderly</title>
    
    <!--[if mso]>
    <style>
        * { font-family: 'Segoe UI', sans-serif !important; }
    </style>
    <![endif]-->
    
    <style>
        /* Reset styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        
        table {
            border-collapse: collapse;
            border-spacing: 0;
        }
        
        img {
            border: 0;
            line-height: 100%;
            outline: none;
            text-decoration: none;
            -ms-interpolation-mode: bicubic;
        }
        
        /* Code display */
        .code-digit {
            font-family: 'Courier New', Consolas, monospace;
            font-size: 32px;
            font-weight: 700;
            letter-spacing: 8px;
            color: #0a1c08;
        }
        
        /* Responsive */
        @media only screen and (max-width: 600px) {
            .email-container {
                width: 100% !important;
                margin: auto !important;
            }
            
            .content-box {
                padding: 30px 20px !important;
            }
            
            .code-digit {
                font-size: 28px !important;
                letter-spacing: 4px !important;
            }
            
            .hero-text {
                font-size: 28px !important;
                line-height: 1.2 !important;
            }
            
            .code-container {
                padding: 20px !important;
            }
        }
    </style>
</head>

<body style="margin: 0; padding: 0; background-color: #f0fbef;">
    <!-- Preview Text -->
    <div style="display: none; max-height: 0; overflow: hidden;">
        Your password reset code is ready. Use it to securely reset your Orderly password.
    </div>

    <!-- Email Container -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f0fbef; padding: 40px 0;">
        <tr>
            <td align="center">
                <!--[if mso]>
                <table role="presentation" border="0" cellspacing="0" cellpadding="0" width="600">
                <tr>
                <td>
                <![endif]-->
                
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="email-container" style="background-color: #ffffff; margin: 0 auto; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(10, 28, 8, 0.08);">
                    
                    <!-- Header with Logo -->
                    <tr>
                        <td style="padding: 40px 40px 30px 40px; text-align: center; background: linear-gradient(135deg, #52c73d 0%, #89dcb3 100%);">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td align="center">
                                        <!-- Logo -->
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
                                            <tr>
                                                <td style="padding: 12px 24px; background-color: rgba(10, 28, 8, 0.1); border-radius: 8px;">
                                                    <h1 style="margin: 0; color: #0a1c08; font-size: 32px; font-weight: 800; letter-spacing: -0.02em;">Orderly</h1>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Hero Icon -->
                    <tr>
                        <td align="center" style="padding: 50px 40px 30px 40px;">
                            <!-- Lock Icon -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="width: 100px; height: 100px; background: linear-gradient(135deg, #52c73d 0%, #89dcb3 100%); border-radius: 50%; box-shadow: 0 8px 32px rgba(82, 199, 61, 0.3); margin: 0 auto;">
                                <tr>
                                    <td align="center" valign="middle" style="height: 100px;">
                                        <!-- Lock SVG -->
                                        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 24 24' fill='none' stroke='%230a1c08' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='11' width='18' height='11' rx='2' ry='2'%3E%3C/rect%3E%3Cpath d='M7 11V7a5 5 0 0 1 10 0v4'%3E%3C/path%3E%3C/svg%3E" alt="Lock" width="56" height="56" style="display: block; margin: 0 auto;" />
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td class="content-box" style="padding: 40px 40px 20px 40px;">
                            <!-- Heading -->
                            <h2 class="hero-text" style="margin: 0 0 16px 0; color: rgb(10, 28, 8); font-size: 32px; font-weight: 700; line-height: 1.3; text-align: center; letter-spacing: -0.02em;">
                                Password Reset Code
                            </h2>
                            
                            <!-- Subheading -->
                            <p style="margin: 0 0 32px 0; color: rgba(10, 28, 8, 0.6); font-size: 16px; line-height: 1.6; text-align: center;">
                                Use the code below to reset your password. This code will expire in 15 minutes.
                            </p>
                            
                            <!-- Verification Code -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td align="center" style="padding: 0 0 32px 0;">
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" class="code-container" style="background: linear-gradient(135deg, rgba(82, 199, 61, 0.08) 0%, rgba(137, 220, 179, 0.05) 100%); border: 2px solid #52c73d; border-radius: 12px; padding: 30px 40px;">
                                            <tr>
                                                <td align="center">
                                                    <p style="margin: 0 0 12px 0; color: rgba(10, 28, 8, 0.6); font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                                                        Your Reset Code
                                                    </p>
                                                    <p class="code-digit" style="margin: 0; font-family: 'Courier New', Consolas, monospace; font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #0a1c08;">
                                                        {{RESET_CODE}}
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Instructions -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 32px;">
                                <tr>
                                    <td style="padding: 20px; background-color: rgba(137, 220, 179, 0.1); border-left: 4px solid #89dcb3; border-radius: 4px;">
                                        <p style="margin: 0 0 12px 0; color: rgb(10, 28, 8); font-size: 15px; font-weight: 600; line-height: 1.5;">
                                            How to use this code:
                                        </p>
                                        <ol style="margin: 0; padding-left: 20px; color: rgba(10, 28, 8, 0.7); font-size: 14px; line-height: 1.7;">
                                            <li style="margin-bottom: 8px;">Return to the password reset page</li>
                                            <li style="margin-bottom: 8px;">Enter the 6-digit code above</li>
                                            <li style="margin-bottom: 0;">Create your new password</li>
                                        </ol>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Divider -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 32px 0;">
                                <tr>
                                    <td>
                                        <div style="height: 1px; background-color: #6fb4be;"></div>
                                    </td>
                                </tr>
                            </table>               
                            
                            <!-- Security Notice -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 32px;">
                                <tr>
                                    <td style="padding: 20px; background-color: rgba(255, 193, 7, 0.1); border-left: 4px solid #ffc107; border-radius: 4px;">
                                        <p style="margin: 0; color: rgba(10, 28, 8, 0.8); font-size: 14px; line-height: 1.6;">
                                            <strong style="color: rgb(10, 28, 8);">⚠️ Security Notice:</strong>
                                        </p>
                                        <ul style="margin: 8px 0 0 0; padding-left: 20px; color: rgba(10, 28, 8, 0.7); font-size: 13px; line-height: 1.6;">
                                            <li style="margin-bottom: 6px;">This code expires in <strong>15 minutes</strong></li>
                                            <li style="margin-bottom: 6px;">Never share this code with anyone</li>
                                            <li style="margin-bottom: 0;">If you didn't request this, please ignore this email and your password will remain unchanged</li>
                                        </ul>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 32px 40px; background-color: #f0fbef; border-top: 1px solid #6fb4be;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td align="center">
                                        <!-- Social Links -->
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 20px;">
                                            <tr>
                                                <td style="padding: 0 8px;">
                                                    <a href="{{TWITTER_URL}}" style="color: #52c73d; text-decoration: none; font-size: 14px; font-weight: 500;">Twitter</a>
                                                </td>
                                                <td style="padding: 0 8px; color: rgba(10, 28, 8, 0.3);">•</td>
                                                <td style="padding: 0 8px;">
                                                    <a href="{{LINKEDIN_URL}}" style="color: #52c73d; text-decoration: none; font-size: 14px; font-weight: 500;">LinkedIn</a>
                                                </td>
                                                <td style="padding: 0 8px; color: rgba(10, 28, 8, 0.3);">•</td>
                                                <td style="padding: 0 8px;">
                                                    <a href="{{HELP_URL}}" style="color: #52c73d; text-decoration: none; font-size: 14px; font-weight: 500;">Help Center</a>
                                                </td>
                                            </tr>
                                        </table>
                                        
                                        <!-- Company Info -->
                                        <p style="margin: 0 0 8px 0; color: rgba(10, 28, 8, 0.6); font-size: 13px; line-height: 1.6;">
                                            <strong style="color: rgb(10, 28, 8);">Orderly</strong> - Chaos, organized.
                                        </p>

                                        <!-- Legal Links -->
                                        <p style="margin: 0; color: rgba(10, 28, 8, 0.38); font-size: 12px; line-height: 1.6;">
                                            <a href="{{PRIVACY_URL}}" style="color: rgba(10, 28, 8, 0.38); text-decoration: underline;">Privacy Policy</a> • 
                                            <a href="{{TERMS_URL}}" style="color: rgba(10, 28, 8, 0.38); text-decoration: underline;">Terms of Service</a>
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                </table>
                
                <!--[if mso]>
                </td>
                </tr>
                </table>
                <![endif]-->
            </td>
        </tr>
    </table>
</body>
</html>
`.replace("{{RESET_CODE}}", resetCode);

module.exports = { verificationEmailHTML, forgotPasswordEmailHTML };
