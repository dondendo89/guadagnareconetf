# Security Guidelines

## Admin Panel Security

### Credential Management

1. **Default Behavior**: The admin panel now generates secure random passwords automatically on first setup
2. **No Hardcoded Credentials**: Credentials are no longer hardcoded in the source code
3. **Secure Storage**: Credentials are stored locally and can be changed through the admin interface

### Initial Setup

When you first access the admin panel:
1. A secure random password will be generated automatically
2. You'll see an alert with the credentials - **save them immediately**
3. The password will only be shown once for security

### Changing Credentials

1. Log into the admin panel
2. Go to "Impostazioni" (Settings)
3. Change username if needed
4. Use "Genera Password Sicura" to generate a new secure password
5. Or enter your own strong password
6. Save settings

### Security Best Practices

1. **Use Strong Passwords**: Minimum 12 characters with mixed case, numbers, and symbols
2. **Regular Updates**: Change passwords regularly
3. **Secure Storage**: Use a password manager to store credentials
4. **HTTPS Only**: Always use HTTPS in production
5. **Backup Security**: Secure your backup files as they contain sensitive data

### Production Deployment

1. Never commit `.env` files to version control
2. Use environment variables for sensitive configuration
3. Implement proper session management
4. Consider implementing 2FA for additional security
5. Regular security audits

### Emergency Access

If you lose admin credentials:
1. Clear browser localStorage for the site
2. Refresh the admin page
3. New credentials will be generated automatically
4. **Note**: This will reset all admin data

## Reporting Security Issues

If you discover a security vulnerability, please report it responsibly.