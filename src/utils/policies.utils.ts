export const emailPolicy = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // john-doe@domain.com
export const passwordPolicy = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/; // At least one uppercase, one lowercase, one special character and 8 characters
export const usernamePolicy = /^[a-zA-Z]([a-zA-Z0-9_]{2,24})$/; // 3 to 24 characters, only letters, numbers and underscores
